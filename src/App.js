import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import HomePage from './pages/HomePage';  
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Calendrier from './pages/Calendrier';
import Profil from './pages/Profil';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/ConnexionContext';
import '@fontsource/inter';
import Ajout from './pages/Ajout';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/connexion' || location.pathname === '/inscription';

  return (
    <div className="App">
      {!hideNavbar && <Navigation />}
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
        <Route path="/calendrier" element={<PrivateRoute><Calendrier /></PrivateRoute>} />
        <Route path="/ajout" element={<PrivateRoute><Ajout /></PrivateRoute>} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;