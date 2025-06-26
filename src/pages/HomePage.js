import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

const ITEMS_PER_PAGE = 5; // Nombre d'éléments affichés par page
const SWIPE_THRESHOLD = 50; // Seuil (en pixels) pour déclencher un "swipe"

const HomePage = () => {
  // États pour les données
  const [totalMontant, setTotalMontant] = useState(0); // Montant total des prélèvements
  const [totalPrelevements, setTotalPrelevements] = useState(0); // Nombre total de prélèvements
  const [prelevementsAvenir, setPrelevementsAvenir] = useState([]); // Liste des prélèvements à venir
  const [prelevementsParMois, setPrelevementsParMois] = useState([]); // Liste des prélèvements par mois
  const [error, setError] = useState(null); // Gestion des erreurs
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle (pagination)
  const [swipeStates, setSwipeStates] = useState({}); // État du "swipe" pour chaque élément

  // États pour les modales (popups)
  const [itemToDelete, setItemToDelete] = useState(null); // Élément à supprimer
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Afficher/cacher la modale de suppression
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Afficher/cacher la modale de succès
  const [isDeleting, setIsDeleting] = useState(false); // Chargement pendant la suppression

  // Références pour le "swipe" (glisser)
  const touchStartX = useRef(null); // Position de départ du toucher
  const touchCurrentX = useRef(null); // Position actuelle du toucher
  useEffect(() => {
    const token = localStorage.getItem("token"); // Récupère le token JWT

    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`, // Authentification
          withCredentials: true, // Sécurité (cookies)
        };

        // Charge toutes les données en même temps (optimisation)
        const [totalMontantRes, totalPrelevementsRes, avenirRes, parMoisRes] =
          await Promise.all([
            axios.get("http://192.168.1.22:8080/prelevement/total", {
              headers,
            }), // Montant total
            axios.get("http://192.168.1.22:8080/prelevement/totalprelev", {
              headers,
            }), // Nombre total
            axios.get("http://192.168.1.22:8080/prelevement/avenir", {
              headers,
            }), // Prélèvements à venir
            axios.get("http://192.168.1.22:8080/prelevement/par-mois", {
              headers,
            }), // Prélèvements par mois
          ]);

        // Met à jour les états avec les données reçues
        setTotalMontant(totalMontantRes.data);
        setTotalPrelevements(totalPrelevementsRes.data);
        setPrelevementsAvenir(avenirRes.data);
        setPrelevementsParMois(parMoisRes.data);
      } catch (error) {
        console.error("Erreur API :", error);
        setError("Impossible de charger les données.");
      }
    };

    fetchDashboardData(); // Lance le chargement au démarrage
  }, []); // Ne s'exécute qu'une fois (tableau vide)

  // Détecte le début du swipe
  const handleTouchStart = (e, index) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX; // Position X initiale
  };

  // Pendant le swipe
  const handleTouchMove = (e, index) => {
    if (!touchStartX.current) return;
    touchCurrentX.current = e.touches ? e.touches[0].clientX : e.clientX; // Position actuelle
    const deltaX = touchCurrentX.current - touchStartX.current; // Distance parcourue

    // Si on glisse vers la gauche (deltaX négatif)
    if (deltaX < 0) {
      setSwipeStates((prev) => ({
        ...prev,
        [index]: Math.max(deltaX, -120), // Limite à -120px
      }));
    }
  };

  // Quand on relâche le swipe
  const handleTouchEnd = (e, index) => {
    if (!touchStartX.current) return;
    const deltaX = touchCurrentX.current - touchStartX.current;

    // Si le swipe dépasse le seuil, on garde l'élément décalé
    if (deltaX < -SWIPE_THRESHOLD) {
      setSwipeStates((prev) => ({ ...prev, [index]: -120 }));
    } else {
      setSwipeStates((prev) => ({ ...prev, [index]: 0 })); // Sinon, on remet à zéro
    }

    // Réinitialise les positions
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  // Ouvre la modale de confirmation
  const confirmDelete = (item) => {
    setItemToDelete(item); // Stocke l'élément à supprimer
    setShowDeleteModal(true); // Affiche la modale
  };

  // Supprime effectivement l'élément
  const handleSupprimer = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true); // Active l'état de chargement
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      };

      // Requête DELETE vers l'API
      await axios.delete(
        `http://192.168.1.22:8080/prelevement/supprimer/${itemToDelete.id}`,
        { headers }
      );

      // Met à jour la liste (retire l'élément supprimé)
      setPrelevementsParMois((prev) =>
        prev.filter((p) => p.id !== itemToDelete.id)
      );
      setSwipeStates({}); // Réinitialise les swipes

      // Ferme la modale de confirmation et affiche celle de succès
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur de suppression :", error);
      setError("Échec de la suppression.");
    } finally {
      setIsDeleting(false); // Désactive le chargement
      setItemToDelete(null); // Nettoie l'élément à supprimer
    }
  };

  // Calcule le nombre total de pages
  const totalPages = Math.ceil(prelevementsParMois.length / ITEMS_PER_PAGE);

  // Récupère les éléments de la page actuelle
  const currentItems = prelevementsParMois
    .slice() // Copie le tableau (évite de modifier l'original)
    .sort((a, b) => a.datePrelevement - b.datePrelevement) // Trie par date
    .slice(
      (currentPage - 1) * ITEMS_PER_PAGE, // Index de départ
      currentPage * ITEMS_PER_PAGE // Index de fin
    );

  return (
    <div className="p-4 space-y-6 md:space-y-5 max-w-7xl mx-auto bg-gray-100 dark:bg-black min-h-screen pb-24">
      <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white">
        Bienvenue sur Prèlev' !
      </h1>

      {/* Affiche les erreurs */}
      {error && (
        <div className="text-red-600 dark:text-red-400 font-semibold mb-4">
          {error}
        </div>
      )}

      {/* Carte "Nombre de prélèvements" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nombre total de prélèvements ce mois-ci
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {totalPrelevements}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Montant total ce mois
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {totalMontant.toFixed(2)} €
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Prélèvements à venir
          </h2>
          {prelevementsAvenir.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Aucun prélèvement à venir
            </p>
          ) : (
            <ul className="space-y-3">
              {prelevementsAvenir
                .sort(
                  (a, b) =>
                    new Date(a.datePrelevement).getDate() -
                    new Date(b.datePrelevement).getDate()
                )
                .map((item, index) => {
                  const date = new Date(item.datePrelevement);
                  const day = date.getDate().toString().padStart(2, "0");
                  const monthName = date.toLocaleDateString("fr-FR", {
                    month: "long",
                  });
                  const logoPath = `/logos/${item.nom
                    .toLowerCase()
                    .replace(/\s+/g, "")}.png`;

                  return (
                    <li
                      key={`avenir-${index}`}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={logoPath}
                          alt={item.nom}
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {day} {monthName}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {item.prix.toFixed(2)} €
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Prélèvements par mois
          </h2>
          {prelevementsParMois.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Aucune donnée disponible
            </p>
          ) : (
            <>
              <ul className="space-y-3 mb-4">
                {currentItems.map((item, index) => {
                  const globalIndex =
                    (currentPage - 1) * ITEMS_PER_PAGE + index;
                  const day = item.datePrelevement.toString().padStart(2, "0");
                  const monthName = new Date().toLocaleDateString("fr-FR", {
                    month: "long",
                  });
                  const logoPath = `/logos/${item.nom
                    .toLowerCase()
                    .replace(/\s+/g, "")}.png`;
                  const translateX = swipeStates[globalIndex] || 0;

                  return (
                    <li
                      key={`mois-${globalIndex}`}
                      className="relative overflow-hidden rounded-md bg-white dark:bg-zinc-900 shadow"
                      onTouchStart={(e) => handleTouchStart(e, globalIndex)}
                      onTouchMove={(e) => handleTouchMove(e, globalIndex)}
                      onTouchEnd={(e) => handleTouchEnd(e, globalIndex)}
                      onMouseDown={(e) => handleTouchStart(e, globalIndex)}
                      onMouseMove={(e) => handleTouchMove(e, globalIndex)}
                      onMouseUp={(e) => handleTouchEnd(e, globalIndex)}
                      onMouseLeave={(e) => handleTouchEnd(e, globalIndex)}
                      style={{ userSelect: "none" }}
                    >
                      <div
                        className="absolute top-0 right-0 h-full flex items-center justify-end pr-4"
                        style={{
                          width: "120px",
                          backgroundColor: "#ef4444",
                          zIndex: 0,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(item);
                          }}
                          className="text-white font-medium"
                        >
                          Supprimer
                        </button>
                      </div>

                      <div
                        className="flex justify-between items-center px-4 py-3 cursor-pointer relative z-10 bg-white dark:bg-zinc-900"
                        style={{
                          transform: `translateX(${translateX}px)`,
                          transition:
                            swipeStates[globalIndex] === 0
                              ? "transform 0.3s ease"
                              : "none",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={logoPath}
                            alt={item.nom}
                            className="w-10 h-10 object-contain"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {day} {monthName}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {item.prix.toFixed(2)} €
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {/* Bouton "Précédent" */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full min-w-10 h-10 flex items-center justify-center ${
                    currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Numéros de page */}
                <div className="flex items-center gap-1 mx-2">
                  {/* Toujours afficher la première page */}
                  <button
                    key="page-1"
                    onClick={() => setCurrentPage(1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                      currentPage === 1
                        ? "bg-green-500 text-white font-medium"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    1
                  </button>

                  {/* Afficher "..." si on est loin du début */}
                  {currentPage > 3 && totalPages > 5 && (
                    <span key="start-ellipsis" className="px-2">
                      ...
                    </span>
                  )}

                  {/* Afficher les pages autour de la page actuelle */}
                  {(() => {
                    const pages = [];
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = startPage; i <= endPage; i++) {
                      if (i > 1 && i < totalPages) {
                        pages.push(
                          <button
                            key={`page-${i}`}
                            onClick={() => setCurrentPage(i)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                              currentPage === i
                                ? "bg-green-500 text-white font-medium"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                    }
                    return pages;
                  })()}

                  {/* Afficher "..." si on est loin de la fin */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <span key="end-ellipsis" className="px-2">
                      ...
                    </span>
                  )}

                  {/* Toujours afficher la dernière page */}
                  {totalPages > 1 && (
                    <button
                      key={`page-${totalPages}`}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                        currentPage === totalPages
                          ? "bg-green-500 text-white font-medium"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                {/* Bouton "Suivant" */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full min-w-10 h-10 flex items-center justify-center ${
                    currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Êtes-vous sûr de vouloir supprimer le prélèvement de{" "}
              {itemToDelete?.nom} ({itemToDelete?.prix.toFixed(2)} €) ? Cette
              action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSupprimer}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Suppression réussie
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Le prélèvement a été supprimé avec succès.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
