// src/pages/HomePage.js
import Button from '@mui/material/Button';

const HomePage = () => (
    <div className="flex items-center justify-center h-screen bg-blue-100">
    <h1 className="text-4xl font-bold text-gray-700">Bienvenue sur ma page d'accueil !</h1>
    <Button variant="contained" color="primary">
        Cliquez ici
      </Button>
  </div>
);

export default HomePage;  
