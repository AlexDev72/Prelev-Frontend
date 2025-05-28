/**
 * Composant Connexion - Gère l'authentification des utilisateurs
 *
 * Ce composant affiche un formulaire de connexion, valide les entrées utilisateur,
 * communique avec l'API d'authentification et gère l'état de connexion via le Contexte.
 */

// Importations des dépendances
import { useState, useContext } from "react"; // Hooks React
import { useNavigate } from "react-router-dom"; // Navigation programmatique
import { ConnexionContext } from "../context/ConnexionContext"; // Contexte d'authentification

/**
 * Composant fonctionnel Connexion
 * @returns {JSX.Element} Le formulaire de connexion
 */
export const Connexion = () => {
  // États locaux pour la gestion du formulaire
  const [email, setEmail] = useState(""); // Stocke l'email saisi
  const [mdp, setMdp] = useState(""); // Stocke le mot de passe saisi
  const [error, setError] = useState(null); // Gère les erreurs de connexion

  // Hooks pour la navigation et l'authentification
  const navigate = useNavigate(); // Hook de navigation React Router
  const { login } = useContext(ConnexionContext); // Méthode de connexion du contexte

  /**
   * Soumission du formulaire de connexion
   * @param {Event} e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(null); // Réinitialise les erreurs précédentes

    // Validation des champs requis
    if (!email || !mdp) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Requête API pour l'authentification
      const response = await fetch("http://localhost:8080/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mdp }), // Envoi des identifiants
      });

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || "Erreur lors de la connexion");
      }

      // Traitement de la réponse réussie
      const data = await response.json();

      // Persistance du token JWT
      localStorage.setItem("token", data.token);

      // Mise à jour du contexte d'authentification
      login({
        email,
        nom: email.split("@")[0],
        token: data.token,
        utilisateurId: data.utilisateurId, 
      });

      // Redirection vers la page d'accueil après connexion
      navigate("/");
    } catch (err) {
      // Gestion des erreurs (réseau, API, etc.)
      setError(err.message);
    }
  };

  // Rendu du composant
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      {/* Titre du formulaire */}
      <h2 className="text-2xl font-bold mb-6">Connexion</h2>

      {/* Affichage des erreurs */}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit}>
        {/* Champ Email */}
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" htmlFor="mdp">
            Mot de passe
          </label>
          <input
            id="mdp"
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-900 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Connexion;
