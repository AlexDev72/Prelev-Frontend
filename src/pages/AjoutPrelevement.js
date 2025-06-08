import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AjoutPrelevement = () => {
  const { userId } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    dateFin: '',
    userId: userId
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const changeWeek = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + index);
      return day;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  fetch('http://192.168.1.22:8080/prelevement/cree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify({
      ...formData,
     datePrelevement: currentDate.toISOString().split('T')[0],
      dateFin: formData.dateFin ? new Date(formData.dateFin).toISOString() : null
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  })
  .then(data => {
    alert('Prélèvement enregistré avec succès !');
    setFormData({ nom: '', prix: '', dateFin: '', userId });
  })
  .catch(error => {
    console.error(error);
    alert('Une erreur est survenue.');
  });
};


  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const bgColor = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';
  const buttonBg = isDarkMode ? 'bg-green-700 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700';
  const dateHoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const navButtonBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const selectedDateBg = isDarkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white';

  return (
    <div className={`min-h-screen p-4 ${bgColor} ${textColor}`}>
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => changeWeek(-7)} className={`p-2 rounded-full ${navButtonBg} shadow-sm`}>
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => changeWeek(7)} className={`p-2 rounded-full ${navButtonBg} shadow-sm`}>
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Calendrier */}
      <div className={`mb-6 rounded-xl shadow-sm p-4 ${cardBg}`}>
        <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-center text-gray-500">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
            <div key={i}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getWeekDays().map((day, i) => (
            <button
              key={i}
              onClick={() => setCurrentDate(day)}
              className={`p-2 rounded-full text-sm ${day.getDate() === currentDate.getDate() ? `${selectedDateBg} font-bold` : `${textColor} ${dateHoverBg}`}`}
            >
              {day.getDate()}
            </button>
          ))}
        </div>
      </div>

      {/* Date sélectionnée */}
      <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date sélectionnée</p>
        <p className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{formatDate(currentDate)}</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className={`rounded-xl shadow-sm p-4 ${cardBg}`}>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nom du prélèvement
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
            placeholder="Ex: Analyse sanguine"
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Montant (€)
          </label>
          <input
            type="number"
            name="prix"
            value={formData.prix}
            onChange={handleInputChange}
            required
            step="0.01"
            min="0"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
            placeholder="0,00"
          />
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Date de fin (optionnelle)
          </label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
          />
        </div>

        <button
          type="submit"
          className={`w-full ${buttonBg} text-white py-3 px-4 rounded-lg font-medium shadow-md transition duration-150`}
        >
          Enregistrer le prélèvement
        </button>
      </form>
    </div>
  );
};

export default AjoutPrelevement;
