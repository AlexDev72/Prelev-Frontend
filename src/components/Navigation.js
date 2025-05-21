// src/components/Navigation.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-800 to-green-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Prelèv'</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  to="/" 
                  className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                 
                >
                  Page d'Accueil
                </Link>
                <Link 
                  to="/prelevements" 
                  className="text-green-100 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
           
                >
                  Liste des Prélèvements
                </Link>
                {/* Ajoute d'autres liens si nécessaire */}
              </div>
            </div>
          </div>
          
          {/* Éléments à droite */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white">
                <span className="sr-only">Notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Avatar utilisateur */}
              <div className="ml-3 relative">
                <div className="bg-green-700 h-8 w-8 rounded-full flex items-center justify-center text-green-100 font-semibold">
                  JP
                </div>
              </div>
            </div>
          </div>
          
          {/* Bouton mobile */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              type="button" 
              className="bg-green-700 inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white"
            >
              <span className="sr-only">Menu principal</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Page d'Accueil
          </Link>
          <Link 
            to="/prelevements" 
            className="text-green-100 hover:bg-green-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Liste des Prélèvements
          </Link>
          {/* Ajoute d'autres liens si nécessaire */}
        </div>
        <div className="pt-4 pb-3 border-t border-green-700">
          <div className="flex items-center px-5">
            <div className="bg-green-600 h-10 w-10 rounded-full flex items-center justify-center text-green-100 font-semibold">
              JP
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">Jean Dupont</div>
              <div className="text-sm font-medium text-green-300">technicien@labo.com</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;