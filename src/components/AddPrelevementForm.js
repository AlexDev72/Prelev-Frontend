import { useState } from "react";
import { addPrelevement } from "../services/prelevementService";

/**
 * Composant React représentant un formulaire d'ajout de prélèvement.
 * 
 * @param {Function} onAdd - Fonction callback appelée après l'ajout réussi d'un prélèvement,
 *                           généralement utilisée pour rafraîchir la liste affichée.
 */
function AddPrelevementForm({ onAdd }) {
  // État local pour gérer les valeurs du formulaire
  const [form, setForm] = useState({ nom: "", montant: "" });

  /**
   * Gère les modifications dans les champs du formulaire.
   * Met à jour dynamiquement l'état en fonction du nom du champ modifié.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - L'événement de changement.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Gère la soumission du formulaire.
   * Empêche le comportement par défaut du navigateur, envoie les données à l’API
   * et appelle le callback onAdd si la requête est un succès.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - L'événement de soumission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPrelevement(form);
      onAdd(); // Notifie le parent pour mettre à jour la liste des prélèvements
      setForm({ nom: "", montant: "" }); // Réinitialise le formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout du prélèvement", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un Prélèvement</h3>
      <input
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Nom"
        required
      />
      <input
        name="montant"
        type="number"
        value={form.montant}
        onChange={handleChange}
        placeholder="Montant"
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AddPrelevementForm;
