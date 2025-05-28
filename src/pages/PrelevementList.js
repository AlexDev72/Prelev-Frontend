import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addHours,
  endOfWeek,
  isSameWeek,
} from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getPrelevements } from "../services/prelevementService";
import { createPrelevement } from "../services/prelevementService";

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
 */
const CustomToolbar = ({ label, onNavigate, onView, view, date }) => {
  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    if (isSameWeek(start, end, { weekStartsOn: 1 })) {
      return format(start, "d MMMM yyyy", { locale: fr });
    }
    return `${format(start, "d", { locale: fr })}-${format(end, "d MMMM yyyy", {
      locale: fr,
    })}`;
  };

  const getTitle = () => {
    switch (view) {
      case Views.MONTH:
        return format(date, "MMMM yyyy", { locale: fr });
      case Views.WEEK:
        return `Semaine du ${getWeekRange(date)}`;
      case Views.DAY:
        return format(date, "EEEE d MMMM yyyy", { locale: fr });
      default:
        return label;
    }
  };

  return (
    <div className="p-4 bg-green-800 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 space-y-2 md:space-y-0 w-full">
        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            {"<"}
          </button>
          <button
            onClick={() => onNavigate("TODAY")}
            className="px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            {messages.today}
          </button>
          <button
            onClick={() => onNavigate("NEXT")}
            className="px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            {">"}
          </button>
        </div>

        <div className="text-xl font-semibold">{getTitle()}</div>

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
 */
const EventComponent = ({ event }) => {
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
        title={`${event.title} - ${format(event.start, "HH:mm", {
          locale: fr,
        })}`}
      />
    </div>
  );
};

/**
 * Modal pour l'ajout d'un nouveau prélèvement
 */
const AddPrelevementModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [formData, setFormData] = useState({
    datePrelevement: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    montant: "",
    service: "netflix",
    autreservice: "",
  });

  const services = [
    { value: "netflix", label: "Netflix" },
    { value: "spotify", label: "Spotify" },
    { value: "amazon", label: "Amazon" },
    { value: "apple", label: "Apple" },
    { value: "loyer", label: "Loyer" },
    { value: "électricité", label: "électricité" },
    { value: "internet", label: "Internet" },
    { value: "telephone", label: "Forfait Téléphonique" },
    { value: "assurance auto", label: "Assurance Véhicule" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ajouter un prélèvement
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="datePrelevement"
              >
                Date de prélèvement
              </label>
              <input
                type="date"
                id="datePrelevement"
                name="datePrelevement"
                value={formData.datePrelevement}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="montant">
                Montant
              </label>
              <input
                type="number"
                id="montant"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="service">
                Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nom">
                Autre service
              </label>
              <input
                type="text"
                id="autreservice"
                name="autreservice"
                value={formData.autreservice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Récupération des prélèvements
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Pas de token d'authentification");
      return;
    }

    getPrelevements(token)
      .then((response) => {
        const totalMonths = 60; // Génération sur 5 ans (60 mois)

        const formattedEvents = response.data.flatMap((prelevement) => {
          if (!prelevement.datePrelevement) {
            console.warn("Prélèvement sans date:", prelevement);
            return [];
          }

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

          const dayOfMonth = originalDate.getDate();
          const startYear = originalDate.getFullYear();
          const startMonth = originalDate.getMonth();

          return Array.from({ length: totalMonths }, (_, i) => {
            const eventDate = new Date(startYear, startMonth + i, dayOfMonth);
            return {
              id: `${prelevement.id}-${i}`,
              title: prelevement.nom,
              start: eventDate,
              end: addHours(eventDate, 2),
              allDay: false,
            };
          });
        });

        setEvents(formattedEvents);
      })
      .catch(console.error);
  }, []);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };



const handleSavePrelevement = async (formData) => {
  try {
    // Récupération correcte de l'id utilisateur dans localStorage
    const storedUser = localStorage.getItem("user");
    const utilisateur_id = storedUser ? JSON.parse(storedUser).utilisateurId : null;
    console.log("utilisateur_id récupéré :", utilisateur_id);

    const payload = {
      datePrelevement: formData.datePrelevement,
      nom: formData.autreservice ? formData.autreservice : formData.service,
      prix: parseFloat(formData.montant),
      utilisateur_id: utilisateur_id ? parseInt(utilisateur_id, 10) : null,
    };

const token = localStorage.getItem('token'); // récupère le token stocké au login
console.log("token :", token);
const response = await createPrelevement(payload, token);
    const savedPrelevement = response.data;

  const parsedDate = parse(
  savedPrelevement.datePrelevement,
  "yyyy-MM-dd",
  new Date()
);


    const newEvent = {
      id: `prelevement-${savedPrelevement.id}`,
      title: savedPrelevement.nom,
      start: parsedDate,
      end: addHours(parsedDate, 2),
      allDay: false,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
setCurrentDate(new Date());
  } catch (error) {
    console.error("Erreur lors de l'ajout du prélèvement :", error);
  }
};


 return (
  <div id="calendrier" className="pt-3 min-h-screen text-center px-4">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">
      Calendrier des Prélèvements
    </h2>

    <div className="flex justify-center mb-4">
      <button
        onClick={() => {
          setSelectedSlot(new Date());
          setModalOpen(true);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Ajouter un prélèvement
      </button>
    </div>

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
        selectable={false} // plus de sélection via clic sur calendrier
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

    <AddPrelevementModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      selectedDate={selectedSlot}
      onSave={handleSavePrelevement}
    />
  </div>
);

};

export default PrelevementList;
