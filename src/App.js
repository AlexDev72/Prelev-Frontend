// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Calendrier from './pages/Calendrier';
import Profil from './pages/Profil';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/ConnexionContext';
import '@fontsource/inter';
import { useLocation } from 'react-router-dom';
import AjoutPrelevement from './pages/AjoutPrelevement';


const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/connexion' || location.pathname === '/inscription';

  return (
    <div className="App">
      {!hideNavbar && <Navigation />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
                <Route
          path="/profil"
          element={
            <PrivateRoute>
              <Profil />
            </PrivateRoute>
          }
        />
             <Route
          path="/calendrier"
          element={
            <PrivateRoute>
              <Calendrier />
            </PrivateRoute>
          }
        />
         <Route
          path="/ajout"
          element={
            <PrivateRoute>
              <AjoutPrelevement />
            </PrivateRoute>
          }
        />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;


