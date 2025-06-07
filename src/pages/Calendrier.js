import React, { useEffect, useState } from "react";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const CalendrierMultiMois = () => {
  const [selected, setSelected] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [jourSelectionne, setJourSelectionne] = useState(null);
  const [prelevements, setPrelevements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Nouvel état pour stocker les jours avec prélèvements (ex : [1, 5, 12])
  const [joursAvecPrelevements, setJoursAvecPrelevements] = useState([]);

  useEffect(() => {
    const htmlElement = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDarkMode(htmlElement.classList.contains("dark"));
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    setIsDarkMode(htmlElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  // Charger les jours des prélèvements au chargement et quand selectedYear change
  useEffect(() => {
    const fetchPrelevements = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://192.168.1.22:8080/prelevement/liredate",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        // Filtrer et ne garder que les jours du mois pour l'année sélectionnée
        // Ici on récupère la liste de DTO { nom, prix, jour }
        const jours = response.data
          .filter(p => {
            // Il faut filtrer uniquement les prélèvements de l'année sélectionnée
            // Or ton endpoint ne renvoie que le jour (pas mois/année),
            // donc on considère tous les jours (sinon à améliorer côté backend)
            return true;
          })
          .map(p => p.jour);

        // Supprimer les doublons avec un Set
        const joursUniques = [...new Set(jours)];
        setJoursAvecPrelevements(joursUniques);
      } catch (err) {
        console.error("Erreur lors du chargement des jours de prélèvements", err);
        setJoursAvecPrelevements([]);
      }
    };

    fetchPrelevements();
  }, [selectedYear]);

  const handleDayClick = async (day) => {
    setSelected(day);
    setJourSelectionne(day);
    setShowModal(true);
    setLoading(true);
    setError("");
    setPrelevements([]);
    const token = localStorage.getItem("token");
const formatDateLocal = (date) => {
  const day = (`0${date.getDate()}`).slice(-2);
  return `${day}`;
};

    try {
      const response = await axios.get(
        "http://192.168.1.22:8080/prelevement/liredetail",
        {
          params: { jour: formatDateLocal(day) },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setPrelevements(response.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des prélèvements.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPrelevements([]);
    setError("");
  };

  const nombreMois = 12;
  const moisArray = Array.from({ length: nombreMois }, (_, i) => new Date(selectedYear, i, 1));

  // Fonction pour dire quels jours mettre en vert
  // On met en vert uniquement les jours du mois qui sont dans joursAvecPrelevements
  const modifiers = {
    prelevement: (date) => {
      return joursAvecPrelevements.includes(date.getDate());
    }
  };

  const modifiersClassNames = {
    prelevement: "bg-green-400 text-black rounded-full"
  };

  const years = [];
  for (let y = 2020; y <= 2030; y++) years.push(y);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start gap-6 p-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-[#cdf7cd] text-black"
      }`}
    >
      {/* Sélecteur d'année */}
      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2 font-semibold">
          Année :
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className={`p-1 rounded border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-black text-black"
          }`}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Calendriers */}
      <div className="flex flex-col gap-6">
        {moisArray.map((mois, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              isDarkMode ? "bg-gray-700 border-gray-700" : "bg-white border-black"
            }`}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleDayClick}
              month={mois}
              pagedNavigation={false}
              showNavigation={false}
              className="[&_.rdp-nav]:hidden"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
          </div>
        ))}
      </div>

    {/* Modale */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div
      className={`p-6 rounded-lg shadow-md w-[90%] max-w-md ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-lg font-bold mb-4">
        Prélèvements du {jourSelectionne?.toLocaleDateString("fr-FR")}
      </h2>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && prelevements.length === 0 && !error && (
        <p>Aucun prélèvement trouvé.</p>
      )}

      {!loading && prelevements.length > 0 && (
        <ul className="list-disc list-inside space-y-2">
          {prelevements.map((p, index) => (
            <li key={index}>
              <strong>{p.nom}</strong> — {p.prix}€ — Jour : {p.jour}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={closeModal}
        className="mt-6 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Fermer
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CalendrierMultiMois;
