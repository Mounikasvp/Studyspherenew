import { onAuthStateChanged } from "firebase/auth";
import {
  off,
  onValue,
  ref,
  serverTimestamp,
  onDisconnect,
  set,
} from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, database } from "../misc/firebase.config";

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
  state: "online",
  last_changed: serverTimestamp(),
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let userRef;
    let userStatusRef;

    const authUnsub = onAuthStateChanged(auth, async (authObj) => {
      if (authObj) {
        userStatusRef = ref(database, `/status/${authObj.uid}`);
        userRef = ref(database, `/users/${authObj.uid}`);

        onValue(userRef, (snap) => {
          try {
            const userData = snap.val();

            // Check if userData exists
            if (userData) {
              const { name, createdAt, avatar } = userData;

              const data = {
                name,
                createdAt,
                avatar,
                uid: authObj.uid,
                email: authObj.email || null,
                isGuest: userData.isGuest || false,
              };

              setProfile(data);
            } else {
              // If user data doesn't exist in the database yet, create a basic profile
              const newUserData = {
                name: authObj.isAnonymous ? "Guest User" : (authObj.email ? authObj.email.split('@')[0] : "User"),
                createdAt: serverTimestamp(),
                avatar: null,
                isGuest: authObj.isAnonymous
              };

              // Set the user data in the database
              set(userRef, newUserData)
                .then(() => {
                  const data = {
                    ...newUserData,
                    uid: authObj.uid,
                    email: authObj.email || null,
                    isGuest: authObj.isAnonymous || false,
                  };
                  setProfile(data);
                })
                .catch(error => {
                  console.error("Error creating user data:", error);
                  setProfile(null);
                });
            }
          } catch (error) {
            console.error("Error processing user data:", error);
            setProfile(null);
          } finally {
            setIsLoading(false);
          }
        });

        onValue(ref(database, ".info/connected"), (snapshot) => {
          if (!!snapshot.val() === false) {
            return;
          }

          onDisconnect(userStatusRef)
            .set(isOfflineForDatabase)
            .then(() => {
              set(userStatusRef, isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) {
          off(userRef);
        }

        if (userStatusRef) {
          off(userStatusRef);
        }

        off(ref(database, ".info/connected"));

        setProfile(null);
        setIsLoading(false);

        // If the user was on a protected route, redirect to landing page
        if (window.location.pathname.includes('/chat')) {
          history.push('/');
        }
      }
    });

    return () => {
      authUnsub();

      off(ref(database, ".info/connected"));

      if (userRef) {
        off(userRef);
      }

      if (userStatusRef) {
        off(userStatusRef);
      }
    };
  }, [history]);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
