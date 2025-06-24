import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ConnexionContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log("[restoreSession] token :", token);
    if (savedUser && token) {
      try {
        // Vérifie le token avec une requête protégée
        const response = await axios.get("http://192.168.1.22:8080/utilisateur/verifie", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(JSON.parse(savedUser));
        } else {
          logout();
        }
      } catch (error) {
        console.error("[restoreSession] Token invalide ou expiré :", error.message);
        logout();
      }
    } else {
      logout();
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <ConnexionContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </ConnexionContext.Provider>
  );
};
