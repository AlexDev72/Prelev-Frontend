// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  
import PrelevementList from './pages/PrelevementList';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Navigation from './components/Navigation';
import '@fontsource/inter';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes> 
          <Route path="/" element={<HomePage />} />  
          <Route path="/prelevements" element={<PrelevementList />} /> 
          <Route path="/inscription" element={<Inscription />} /> 
          <Route path="/connexion" element={<Connexion />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
