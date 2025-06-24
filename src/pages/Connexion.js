import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConnexionContext } from "../context/ConnexionContext";

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(ConnexionContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !mdp) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.1.22:8080/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mdp }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erreur lors de la connexion");
      }

      const data = await response.json();

      // Sauvegarde du token dans localStorage
      localStorage.setItem("token", data.token);

      // Appel de la fonction login du contexte
      login(
        {
          email,
          nom: email.split("@")[0], // ou récupère le nom côté backend si possible
          utilisateurId: data.utilisateurId,
        },
        data.token
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
 <div className="min-h-screen bg-green-50 dark:bg-black flex flex-col justify-center p-4">
  <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Connexion</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">Accédez à votre compte</p>
    </div>

    {error && (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-800 text-red-700 dark:text-red-100 rounded-lg text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="votre@email.com"
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="mdp" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Mot de passe
        </label>
        <input
          id="mdp"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
          isLoading ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
        } transition flex justify-center items-center`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Pas encore de compte ?{" "}
        <a href="/inscription" className="text-green-700 dark:text-green-400 font-medium hover:underline">
          S'inscrire
        </a>
      </p>
    </div>
  </div>
</div>

  );
};

export default Connexion;
