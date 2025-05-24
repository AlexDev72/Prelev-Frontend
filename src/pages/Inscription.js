import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant Inscription – Gère l'inscription d'un nouvel utilisateur.
 * Utilise un formulaire contrôlé avec vérification de la saisie côté client.
 */
const Inscription = () => {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Permet la redirection après inscription

  /**
   * handleSubmit – Gère l'envoi du formulaire.
   * Effectue des validations locales avant de faire un appel au backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Vérifie que tous les champs sont remplis
    if (!email || !mdp || !confirmation) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifie la correspondance des mots de passe
    if (mdp !== confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Envoie les données au backend pour création de compte
      const response = await fetch('http://localhost:8080/utilisateur/cree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mdp })
      });

      // Si erreur côté serveur
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erreur lors de l'inscription");
      }

      // Redirige vers la page de connexion si tout s'est bien passé
      navigate('/connexion');
    } catch (err) {
      // Affiche un message d'erreur utilisateur
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Inscription</h2>

      {/* Affiche un message d'erreur si nécessaire */}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium" htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium" htmlFor="confirmation">Confirmer le mot de passe</label>
        <input
          id="confirmation"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          value={confirmation}
          onChange={e => setConfirmation(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-900 transition"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;
