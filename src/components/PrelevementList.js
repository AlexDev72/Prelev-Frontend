import React, { useEffect, useState } from 'react';
import { getPrelevements } from '../services/prelevementService';

/**
 * Composant React pour afficher la liste des prélèvements.
 * Il récupère les données à l'initialisation via un appel à l'API.
 */
const PrelevementList = () => {
  // État local pour stocker la liste des prélèvements
  const [prelevements, setPrelevements] = useState([]);

  // Hook useEffect exécuté une seule fois au montage du composant
  useEffect(() => {
    // Appel à l’API pour récupérer les prélèvements
    getPrelevements()
      .then(response => {
        // Mise à jour de l’état avec les données récupérées
        setPrelevements(response.data);
      })
      .catch(error => {
        // Gestion d'erreur basique (à améliorer en production si nécessaire)
        console.error("Erreur lors de la récupération des prélèvements", error);
      });
  }, []); // Tableau de dépendances vide : effet exécuté uniquement au premier rendu

  return (
    <div>
      <h2>Liste des Prélèvements</h2>
      <ul>
        {/* Affichage de chaque prélèvement dans une liste non ordonnée */}
        {prelevements.map(prelevement => (
          <li key={prelevement.id}>{prelevement.nom}</li>
        ))}
      </ul>
    </div>
  );
};

export default PrelevementList;
