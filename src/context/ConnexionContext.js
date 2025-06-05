import React, { createContext, useState, useEffect, useCallback } from "react";

export const ConnexionContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement

  /**
   * Restauration de la session au montage du composant
   */
  const restoreSession = useCallback(() => {
    setIsLoading(true);
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ici vous pourriez vérifier la validité du token côté serveur
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");

    // 2. Optionnel: Supprimer d'autres données utilisateur
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Optionnel : nettoyer d'autres données de session
  };

  return (
    <ConnexionContext.Provider
      value={{
        user,
        isLoading, // Exposé pour PrivateRoute
        login,
        logout,
        restoreSession, // Exposé pour permettre une restauration manuelle
      }}
    >
      {children}
    </ConnexionContext.Provider>
  );
};
