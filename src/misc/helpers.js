import { ref, get, query, orderByChild, equalTo } from "firebase/database";

export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
}

export function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((roomId) => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/users/${userId}/${keyToUpdate}`] = value;

  try {
    // Get all messages
    const getMsgs = get(
      query(ref(db, "/messages"), orderByChild("author/uid"), equalTo(userId))
    );

    // Get all rooms where the user is the author of the last message
    const getRooms = get(
      query(
        ref(db, "/rooms"),
        orderByChild("lastMessage/author/uid"),
        equalTo(userId)
      )
    );

    const [mSnap, rSnap] = await Promise.all([getMsgs, getRooms]);

    // Update author information in messages
    mSnap.forEach((msgSnap) => {
      updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
    });

    // Update author information in room's last message
    rSnap.forEach((roomSnap) => {
      updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
    });

    return updates;
  } catch (error) {
    console.error("Error updating user data:", error.message);

    // If there's an indexing error, try a different approach
    if (error.message.includes("Index not defined")) {
      // Just update the user profile for now
      console.log("Falling back to basic profile update due to indexing issue");
      return updates;
    }

    throw error;
  }
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);

    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }

    result[groupingKey].push(item);

    return result;
  }, {});
}

/**
 * Generates a random alphanumeric code of specified length
 * @param {number} length - The length of the code to generate
 * @returns {string} - The generated code
 */
export function generateUniqueCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
