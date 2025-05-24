import React, { createContext, useState, useEffect } from 'react';

/**
 * Contexte global de connexion utilisé pour suivre l'état de l'utilisateur connecté
 * à travers l'application.
 */
export const ConnexionContext = createContext();

/**
 * AuthProvider – Fournisseur de contexte qui encapsule toute l'application
 * pour fournir les fonctions de login, logout et l'état utilisateur.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * useEffect – Lors du premier chargement de l'application,
   * on tente de récupérer les données utilisateur sauvegardées
   * dans le localStorage (si l'utilisateur était déjà connecté).
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * login – Met à jour l'état utilisateur en mémoire et
   * persiste les données utilisateur dans le localStorage.
   * @param {Object} userData - Données renvoyées après une authentification réussie
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * logout – Déconnecte l'utilisateur en supprimant ses données
   * du state et du localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ConnexionContext.Provider value={{ user, login, logout }}>
      {children}
    </ConnexionContext.Provider>
  );
};
