import React, { useContext } from 'react';
import { ConnexionContext } from '../context/ConnexionContext';
const HomePage = () => {
  const { user, logout } = useContext(ConnexionContext);

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      {user && (
        <div>
          <p>Connecté en tant que : {user.nom}</p> {/* ou user.email selon tes données */}
          <button onClick={logout}>Se déconnecter</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
