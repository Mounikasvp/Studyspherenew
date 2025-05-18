// Script to create a guest user in Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getDatabase, ref, set, serverTimestamp } = require('firebase/database');

// Firebase configuration
const config = {
  apiKey: "AIzaSyDfyMPdcT4v6fgGbX8YVBHjSqsTvZyn9z0",
  authDomain: "studysphere-5b220.firebaseapp.com",
  projectId: "studysphere-5b220",
  storageBucket: "studysphere-5b220.appspot.com",
  messagingSenderId: "1069045292091",
  appId: "1:1069045292091:web:361d42e03ee5bf1382501e",
  measurementId: "G-8593EP44EP",
  databaseURL: "https://studysphere-5b220-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(config);
const auth = getAuth(app);
const database = getDatabase(app);

// Guest user credentials
const guestCredentials = {
  email: "guest@studysphere.com",
  password: "guest123"
};

// Function to create guest user
async function createGuestUser() {
  try {
    // Try to sign in with guest credentials first to check if account exists
    try {
      await signInWithEmailAndPassword(auth, guestCredentials.email, guestCredentials.password);
      console.log('Guest account already exists. No need to create a new one.');
      return;
    } catch (error) {
      // If sign-in fails with user-not-found, create the account
      if (error.code === 'auth/user-not-found') {
        console.log('Guest account does not exist. Creating new guest account...');
        
        // Create guest user with email/password
        const credential = await createUserWithEmailAndPassword(
          auth,
          guestCredentials.email,
          guestCredentials.password
        );

        // Create user profile in database
        await set(ref(database, "users/" + credential.user.uid), {
          name: "Guest User",
          createdAt: serverTimestamp(),
          avatar: null,
        });

        console.log('Guest account created successfully!');
      } else {
        // If error is not user-not-found, throw it
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating guest account:', error);
  }
}

// Execute the function
createGuestUser();
