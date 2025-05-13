// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';  
import PrelevementList from './components/PrelevementList';
import Navigation from './components/Navigation';

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
