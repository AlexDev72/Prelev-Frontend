import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { formatDateForInput } from "../utils/dateUtils";

// Constantes pour la pagination et le swipe
const ITEMS_PER_PAGE = 5; // Nombre d'items par page
const SWIPE_THRESHOLD = 50; // Seuil de détection du swipe

const HomePage = () => {
  // ============ ÉTATS ============
  // Données du dashboard
  const [totalMontant, setTotalMontant] = useState(0);
  const [totalPrelevements, setTotalPrelevements] = useState(0);
  const [prelevementsAvenir, setPrelevementsAvenir] = useState([]);
  const [prelevementsParMois, setPrelevementsParMois] = useState([]);
  const [error, setError] = useState(null);
  
  // Pagination et swipe
  const [currentPage, setCurrentPage] = useState(1);
  const [swipeStates, setSwipeStates] = useState({});

  // Gestion des modales
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToModifie, setItemToModifie] = useState(null);
  const [showModifieModal, setShowModifieModal] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  // Réfs pour le swipe gesture
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  // ============ EFFECTS ============
  // Chargement des données au montage du composant
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        };

        // Récupération en parallèle des différentes données
        const [totalMontantRes, totalPrelevementsRes, avenirRes, parMoisRes] =
          await Promise.all([
            axios.get("http://192.168.1.22:8080/prelevement/total", { headers }),
            axios.get("http://192.168.1.22:8080/prelevement/totalprelev", { headers }),
            axios.get("http://192.168.1.22:8080/prelevement/avenir", { headers }),
            axios.get("http://192.168.1.22:8080/prelevement/par-mois", { headers }),
          ]);

        // Mise à jour des états
        setTotalMontant(totalMontantRes.data);
        setTotalPrelevements(totalPrelevementsRes.data);
        setPrelevementsAvenir(avenirRes.data);
        setPrelevementsParMois(parMoisRes.data);
      } catch (error) {
        console.error("Erreur API :", error);
        setError("Impossible de charger les données.");
      }
    };

    fetchDashboardData();
  }, []);

  // ============ GESTION DU SWIPE ============
  const handleTouchStart = (e, index) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchMove = (e, index) => {
    if (!touchStartX.current) return;
    touchCurrentX.current = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;

    // On ne gère que le swipe vers la gauche (deltaX négatif)
    if (deltaX < 0) {
      setSwipeStates((prev) => ({
        ...prev,
        [index]: Math.max(deltaX, -120), // Limite à -120px
      }));
    }
  };

  const handleTouchEnd = (e, index) => {
    if (!touchStartX.current) return;
    const deltaX = touchCurrentX.current - touchStartX.current;

    // Si le swipe dépasse le seuil, on garde l'état ouvert
    if (deltaX < -SWIPE_THRESHOLD) {
      setSwipeStates((prev) => ({ ...prev, [index]: -120 }));
    } else {
      // Sinon on remet à zéro
      setSwipeStates((prev) => ({ ...prev, [index]: 0 }));
    }

    // Reset des positions
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  // ============ GESTION DES ACTIONS ============
  /**
   * Modifie un prélèvement via l'API
   */
  const handleModifier = async () => {
    if (!itemToModifie) return;

    setIsModifying(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      };

      // Validation du format de date
      if (!itemToModifie.datePrelevement?.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Format de date invalide");
      }

      // Préparation des données pour l'API
      const data = {
        nom: itemToModifie.nom,
        prix: Number(itemToModifie.prix),
        datePrelevement: itemToModifie.datePrelevement,
      };

      // Appel API
      await axios.put(
        `http://192.168.1.22:8080/prelevement/modifier/${itemToModifie.id}`,
        data,
        { headers }
      );

      // Mise à jour de l'état local
      setPrelevementsParMois((prev) =>
        prev.map((p) =>
          p.id === itemToModifie.id
            ? {
                ...p,
                nom: data.nom,
                prix: data.prix,
                datePrelevement: new Date(data.datePrelevement).getDate().toString(),
              }
            : p
        )
      );

      // Fermeture des modales et reset
      setSwipeStates({});
      setShowModifieModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur de modification:", error);
      setError(`Échec de la modification: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsModifying(false);
      setItemToModifie(null);
    }
  };

  /**
   * Supprime un prélèvement via l'API
   */
  const handleSupprimer = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      };

      // Appel API
      await axios.delete(
        `http://192.168.1.22:8080/prelevement/supprimer/${itemToDelete.id}`,
        { headers }
      );

      // Mise à jour de l'état local
      setPrelevementsParMois((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      
      // Fermeture des modales et reset
      setSwipeStates({});
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur de suppression :", error);
      setError("Échec de la suppression.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Préparation des données pour la pagination
  const totalPages = Math.ceil(prelevementsParMois.length / ITEMS_PER_PAGE);
  const currentItems = prelevementsParMois
    .slice()
    .sort((a, b) => a.datePrelevement - b.datePrelevement)
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ============ RENDU ============
  return (
    <div className="p-4 space-y-6 md:space-y-5 mx-auto bg-gray-100 dark:bg-black min-h-screen pb-24">
      {/* En-tête */}
      <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white">
        Bienvenue sur Prèlev' !
      </h1>

      {/* Affichage des erreurs */}
      {error && (
        <div className="text-red-600 dark:text-red-400 font-semibold mb-4">
          {error}
        </div>
      )}

      {/* Cartes des totaux */}
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

      {/* Section Prélèvements à venir */}
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
                .sort((a, b) => new Date(a.datePrelevement).getDate() - new Date(b.datePrelevement).getDate())
                .map((item, index) => {
                  const date = new Date(item.datePrelevement);
                  const day = date.getDate().toString().padStart(2, "0");
                  const monthName = date.toLocaleDateString("fr-FR", { month: "long" });
                  const logoPath = `/logos/${item.nom.toLowerCase().replace(/\s+/g, "")}.png`;

                  return (
                    <li key={`avenir-${index}`} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <img src={logoPath} alt={item.nom} className="w-10 h-10 object-contain" />
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

      {/* Section Prélèvements par mois avec pagination */}
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
              {/* Liste des prélèvements avec fonctionnalité de swipe */}
              <ul className="space-y-3 mb-4">
                {currentItems.map((item, index) => {
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                  const day = typeof item.datePrelevement === "string" && item.datePrelevement.match(/^\d+$/)
                    ? item.datePrelevement.padStart(2, "0")
                    : new Date(item.datePrelevement).getDate().toString().padStart(2, "0");
                  
                  const monthName = new Date().toLocaleDateString("fr-FR", { month: "long" });
                  const logoPath = `/logos/${item.nom.toLowerCase().replace(/\s+/g, "")}.png`;
                  const translateX = swipeStates[globalIndex] || 0;

                  return (
                    <li
                      key={`mois-${globalIndex}`}
                      className="relative overflow-hidden rounded-md bg-white dark:bg-zinc-900 shadow"
                      // Gestion des événements de swipe (mobile et desktop)
                      onTouchStart={(e) => handleTouchStart(e, globalIndex)}
                      onTouchMove={(e) => handleTouchMove(e, globalIndex)}
                      onTouchEnd={(e) => handleTouchEnd(e, globalIndex)}
                      onMouseDown={(e) => handleTouchStart(e, globalIndex)}
                      onMouseMove={(e) => handleTouchMove(e, globalIndex)}
                      onMouseUp={(e) => handleTouchEnd(e, globalIndex)}
                      onMouseLeave={(e) => handleTouchEnd(e, globalIndex)}
                      style={{ userSelect: "none" }}
                    >
                      {/* Boutons d'actions (apparaissent avec le swipe) */}
                      <div className="absolute top-0 right-0 h-full flex items-center px-5" style={{ width: "125px", zIndex: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToModifie({
                              ...item,
                              datePrelevement: formatDateForInput(item.datePrelevement),
                            });
                            setShowModifieModal(true);
                          }}
                          className="text-white font-medium bg-blue-500 hover:bg-blue-600 px-4 py-6 rounded"
                        >
                          <Pencil className="w-5 h-5 text-white" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                          className="text-white font-medium bg-red-600 hover:bg-red-700 px-4 py-6 rounded"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Contenu de l'item (se déplace avec le swipe) */}
                      <div
                        className="flex justify-between items-center px-4 py-3 cursor-pointer relative z-10 bg-white dark:bg-zinc-900"
                        style={{
                          transform: `translateX(${translateX}px)`,
                          transition: swipeStates[globalIndex] === 0 ? "transform 0.3s ease" : "none",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={logoPath} alt={item.nom} className="w-10 h-10 object-contain" />
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
                {/* Bouton précédent */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full min-w-10 h-10 flex items-center justify-center ${
                    currentPage === 1
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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

                  {/* Ellipsis si nécessaire */}
                  {currentPage > 3 && totalPages > 5 && (
                    <span key="start-ellipsis" className="px-2">...</span>
                  )}

                  {/* Pages autour de la page courante */}
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

                  {/* Ellipsis si nécessaire */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <span key="end-ellipsis" className="px-2">...</span>
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

                {/* Bouton suivant */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full min-w-10 h-10 flex items-center justify-center ${
                    currentPage === totalPages
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ============ MODALES ============ */}
      
      {/* Modale de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Êtes-vous sûr de vouloir supprimer le prélèvement de {itemToDelete?.nom} ({itemToDelete?.prix.toFixed(2)} €) ? Cette action est irréversible.
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

      {/* Modale de modification */}
      {showModifieModal && itemToModifie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Modifier le prélèvement
            </h3>
            <div className="space-y-4">
              {/* Champ Nom */}
              <div>
                <label className="block text-gray-700 dark:text-zinc-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={itemToModifie.nom}
                  onChange={(e) => setItemToModifie({ ...itemToModifie, nom: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              
              {/* Champ Montant */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={itemToModifie.prix}
                  onChange={(e) => setItemToModifie({ ...itemToModifie, prix: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              
              {/* Champ Date avec activation du picker au clic */}
              <div>
                <label className="block text-gray-700 dark:text-zinc-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={itemToModifie?.datePrelevement || ""}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    if (!e.target.value.match(/^\d{4}-\d{2}-\d{2}$/)) return;
                    setItemToModifie({
                      ...itemToModifie,
                      datePrelevement: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                  onClick={(e) => e.target.showPicker()} // Force l'affichage du picker
                />
              </div>
            </div>
            
            {/* Boutons de la modale */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowModifieModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleModifier}
                disabled={isModifying}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isModifying ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de succès (commune pour suppression et modification) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {itemToDelete ? "Suppression réussie" : "Modification réussie"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {itemToDelete
                ? "Le prélèvement a été supprimé avec succès."
                : "Le prélèvement a été modifié avec succès."}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setItemToDelete(null);
                }}
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