import { Link } from "react-router-dom";

const Navigation = () => {
  // Récupération de l'état d'authentification

  /**
   * Gère la déconnexion de l'utilisateur
   * - Appelle la méthode logout du contexte
   * - Ferme le menu mobile si ouvert
   */

  /**
   * Génère les initiales de l'utilisateur pour l'avatar
   * @returns {string} Initiales ou "?" si non disponible
   */

  return (
    <div class="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 left-1/2 bottom-[0rem] dark:bg-zinc-900 dark:border-zinc-800">
      <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
        <div className="relative group">
          <Link
            to="/"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-800"
            style={{ display: "flex", height: "100%" }}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-full h-full"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="sr-only">Home</span>
            </button>
          </Link>

          {/* Tooltip */}
          <div
            id="tooltip-home"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Accueil
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        {/* Bouton "Calendrier" avec son tooltip */}

        {/* Tooltip associé au bouton Calendrier */}
        <div className="relative group">
          <Link
            to="/calendrier"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-800"
            style={{ display: "flex", height: "100%" }}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-full h-full"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-green-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2h1V2Zm11 6H3v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8ZM7 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
              </svg>
              <span className="sr-only">Calendrier</span>
            </button>
          </Link>

          {/* Tooltip associé au bouton Calendrier */}
          <div
            id="tooltip-calendar"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Calendrier
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>

       {/* Bouton "+" avec Link */}
        <div className="flex items-center justify-center">
          <Link to="/ajout">
            <button
              data-tooltip-target="tooltip-new"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 font-medium bg-green-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-green-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
              <span className="sr-only">New item</span>
            </button>
          </Link>
        </div>
        <button
          data-tooltip-target="tooltip-settings"
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-800 group"
        >
          <svg
            class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
            />
          </svg>
          <span class="sr-only">Settings</span>
        </button>
        <div
          id="tooltip-settings"
          role="tooltip"
          class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
        >
          Settings
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div className="relative group">
          {" "}
          {/* Ajoutez 'group' ici pour les hover states */}
          <Link
            to="/profil"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-zinc-800"
            style={{ display: "flex", height: "100%" }} // Conserve la hauteur
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-full h-full"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-green-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <span className="sr-only">Profile</span>
            </button>
          </Link>
          {/* Tooltip - reste inchangé */}
          <div
            id="tooltip-profile"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Profile
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
