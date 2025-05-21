/**
 * Composant principal pour l'affichage du calendrier des prélèvements
 * Affiche les prélèvements récurrents sous forme de logos dans un calendrier interactif
 * avec trois vues possibles : mois, semaine et jour
 */
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours, endOfWeek, isSameWeek } from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getPrelevements } from "../services/prelevementService";

// Configuration de la localisation française
const locales = { fr };

// Initialisation du localizer avec date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Semaine commence lundi
  getDay,
  locales,
});

// Messages en français pour le calendrier
const messages = {
  today: "Aujourd'hui",
  previous: "<",
  next: ">",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
};

/**
 * Composant Toolbar personnalisé
 * Gère la navigation et l'affichage du titre selon la vue active
 */
const CustomToolbar = ({ label, onNavigate, onView, view, date }) => {
  /**
   * Formate la plage de dates pour la vue semaine
   * @param {Date} date - Date de référence
   * @returns {string} Plage de dates formatée
   */
  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    
    if (isSameWeek(start, end, { weekStartsOn: 1 })) {
      return format(start, "d MMMM yyyy", { locale: fr });
    }
    return `${format(start, "d", { locale: fr })}-${format(end, "d MMMM yyyy", { locale: fr })}`;
  };

  /**
   * Génère le titre approprié selon la vue active
   * @returns {string} Titre formaté
   */
  const getTitle = () => {
    switch(view) {
      case Views.MONTH:
        return format(date, "MMMM yyyy", { locale: fr }); // Format "Mois Année"
      case Views.WEEK:
        return `Semaine du ${getWeekRange(date)}`; // Format "Semaine du X-Y Mois"
      case Views.DAY:
        return format(date, "EEEE d MMMM yyyy", { locale: fr }); // Format "Lundi X Mois Année"
      default:
        return label;
    }
  };

  return (
    <div className="p-4 bg-blue-500 text-white">
      {/* Barre de navigation principale */}
      <div className="flex justify-between items-center mb-2">
        {/* Boutons de navigation */}
        <div className="flex space-x-2">
          <button onClick={() => onNavigate("PREV")} className="px-3 py-1 rounded hover:bg-blue-600 transition">
            {"<"}
          </button>
          <button onClick={() => onNavigate("TODAY")} className="px-3 py-1 rounded hover:bg-blue-600 transition">
            {messages.today}
          </button>
          <button onClick={() => onNavigate("NEXT")} className="px-3 py-1 rounded hover:bg-blue-600 transition">
            {">"}
          </button>
        </div>
        
        {/* Titre central */}
        <div className="text-xl font-semibold">
          {getTitle()}
        </div>
        
        {/* Boutons de changement de vue */}
        <div className="flex space-x-2">
          {[Views.MONTH, Views.WEEK, Views.DAY].map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`px-3 py-1 rounded transition ${
                view === v ? "bg-blue-700" : "hover:bg-blue-600"
              }`}
            >
              {messages[v.toLowerCase()]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Composant d'événement personnalisé
 * Affiche uniquement le logo correspondant au service
 */
const EventComponent = ({ event }) => {
  // Mapping des noms de services vers leurs logos
  const logos = {
    netflix: "/logos/netflix.png",
    spotify: "/logos/spotify.png",
    amazon: "/logos/amazon.png",
    apple: "/logos/apple.png",
  };

  const logoSrc = logos[event.title.toLowerCase()];
  if (!logoSrc) return null;

  return (
    <div className="flex justify-center items-center h-full p-1">
      <img
        src={logoSrc}
        alt={event.title}
        className="h-6 w-auto object-contain"
        title={`${event.title} - ${format(event.start, "HH:mm", { locale: fr })}`}
      />
    </div>
  );
};

/**
 * Composant principal du calendrier des prélèvements
 */
const PrelevementList = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Récupération des prélèvements et formatage des événements
  useEffect(() => {
    getPrelevements()
      .then((response) => {
        const totalMonths = 60; // Génération sur 5 ans (60 mois)

        const formattedEvents = response.data.flatMap((prelevement) => {
          // Validation des données
          if (!prelevement.datePrelevement) {
            console.warn("Prélèvement sans date:", prelevement);
            return [];
          }

          // Parsing de la date
          let originalDate;
          try {
            originalDate = parse(
              prelevement.datePrelevement,
              "yyyy-MM-dd",
              new Date()
            );
          } catch {
            console.warn("Date invalide pour prélèvement:", prelevement);
            return [];
          }

          // Génération des occurrences mensuelles
          const dayOfMonth = originalDate.getDate();
          const startYear = originalDate.getFullYear();
          const startMonth = originalDate.getMonth();

          return Array.from({ length: totalMonths }, (_, i) => {
            const eventDate = new Date(startYear, startMonth + i, dayOfMonth);
            return {
              id: `${prelevement.id}-${i}`,
              title: prelevement.nom,
              start: eventDate,
              end: addHours(eventDate, 2), // Durée de 2h pour visibilité
              allDay: false,
            };
          });
        });

        setEvents(formattedEvents);
      })
      .catch(console.error);
  }, []);

  // Gestion du changement de date
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Calendrier des Prélèvements
      </h2>

      {/* Conteneur du calendrier */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={handleNavigate}
          defaultDate={new Date()}
          style={{ height: 700 }}
          culture="fr"
          messages={messages}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          // Style personnalisé pour les événements
          eventPropGetter={() => ({
            style: {
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              margin: 0,
              boxShadow: "none",
            },
          })}
        />
      </div>
    </div>
  );
};

export default PrelevementList;