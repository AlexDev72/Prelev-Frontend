// src/pages/Connexion.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', { // adapte l'URL à ton backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      const data = await response.json();

      // Exemple: stocker un token JWT dans localStorage
      localStorage.setItem('token', data.token);

      // Rediriger vers la page d'accueil ou autre
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Connexion</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
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

        <label className="block mb-2 font-medium" htmlFor="motDePasse">Mot de passe</label>
        <input
          id="motDePasse"
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          value={motDePasse}
          onChange={e => setMotDePasse(e.target.value)}
          required
        />

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
