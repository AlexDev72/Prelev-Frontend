// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  
import PrelevementList from './pages/PrelevementList';
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
