/**
 * Composant Navigation - Barre de navigation principale de l'application
 *
 * Gère :
 * - L'affichage responsive (mobile/desktop)
 * - L'état de connexion via ConnexionContext
 * - Les redirections via React Router
 * - Le menu mobile interactif
 */

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ConnexionContext } from "../context/ConnexionContext";

const Navigation = () => {
  // État pour la gestion du menu mobile
  const [isOpen, setIsOpen] = useState(false);

  // Récupération de l'état d'authentification
  const { user, logout } = useContext(ConnexionContext);

  /**
   * Gère la déconnexion de l'utilisateur
   * - Appelle la méthode logout du contexte
   * - Ferme le menu mobile si ouvert
   */
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  /**
   * Génère les initiales de l'utilisateur pour l'avatar
   * @returns {string} Initiales ou "?" si non disponible
   */
  const getInitials = () => {
    if (!user || !user.nom) return "?";
    return user.nom
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg">
      {/* Conteneur principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Partie gauche - Logo et liens desktop */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Prelèv'</span>
            </div>

            {/* Liens navigation (version desktop) */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Accueil
                </Link>

                {user && (
                  <Link
                    to="/prelevements"
                    className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  >
                    Liste des Prélèvements
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Partie droite - Éléments utilisateur (version desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Bouton Notifications */}
              <button className="p-1 rounded-full text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                <span className="sr-only">Notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Affichage conditionnel selon l'état de connexion */}
              {!user ? (
                // Non connecté - Affiche Connexion/Inscription
                <>
                  <Link
                    to="/connexion"
                    className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  >
                    Inscription
                  </Link>
                </>
              ) : (
                // Connecté - Affiche Bouton Déconnexion
                <button
                  onClick={handleLogout}
                  className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Déconnexion
                </button>
              )}

              {/* Avatar utilisateur si connecté */}
              {user && (
                <div className="ml-3 relative">
                  <div className="bg-green-700 h-8 w-8 rounded-full flex items-center justify-center text-green-100 font-semibold">
                    {getInitials()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bouton menu mobile (hamburger) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-green-700 inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Menu principal</span>
              {/* Icône hamburger qui se transforme en croix */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile (affiché seulement sur petits écrans) */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Liens principaux */}
          <Link
            to="/"
            className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Page d'Accueil
          </Link>
          <Link
            to="/prelevements"
            className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Liste des Prélèvements
          </Link>

          {/* Affichage conditionnel mobile */}
          {!user ? (
            // Non connecté - Affiche Connexion/Inscription
            <>
              <Link
                to="/connexion"
                className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Inscription
              </Link>
            </>
          ) : (
            // Connecté - Affiche Bouton Déconnexion
            <button
              onClick={handleLogout}
              className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Déconnexion
            </button>
          )}
        </div>

        {/* Section profil utilisateur si connecté */}
        {user && (
          <div className="pt-4 pb-3 border-t border-green-700">
            <div className="flex items-center px-5">
              <div className="bg-green-600 h-10 w-10 rounded-full flex items-center justify-center text-green-100 font-semibold">
                {getInitials()}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user.nom || "Utilisateur"}
                </div>
                <div className="text-sm font-medium text-green-300">
                  {user.email || ""}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
