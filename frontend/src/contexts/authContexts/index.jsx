/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
const AuthContext = React.createContext();
import { auth } from "../../firebase/firebase";

export function useAuth() {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }
  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
