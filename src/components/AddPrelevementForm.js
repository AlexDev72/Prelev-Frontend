import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours, addMonths } from 'date-fns';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPrelevements } from '../services/prelevementService';

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const PrelevementList = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getPrelevements()
      .then((response) => {
        const now = new Date();
        const formattedEvents = response.data.flatMap((prelevement) => {
          const originalDate = new Date(prelevement.date);
          const endDate = addHours(originalDate, 2);
          
          // Vérifie si c'est un prélèvement mensuel (le 1er du mois)
          const isMonthly = originalDate.getDate() === 1;
          
          // Crée les événements pour les 6 mois avant et après la date actuelle
          const eventRange = isMonthly ? 12 : 1;
          
          return Array.from({ length: eventRange }, (_, i) => {
            const eventDate = isMonthly 
              ? new Date(now.getFullYear(), now.getMonth() - 6 + i, 1)
              : originalDate;
            
            return {
              id: `${prelevement.id}-${i}`,
              title: prelevement.nom,
              start: eventDate,
              end: addHours(new Date(eventDate), 2),
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Calendrier des Prélèvements</h2>
      
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
          messages={{
            today: "Aujourd'hui",
            previous: "<",
            next: ">",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
          }}
          components={{
            toolbar: (props) => (
              <div className="p-4 bg-blue-500 text-white flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => props.onNavigate('PREV')}
                    className="px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    {props.label}
                  </button>
                  <button 
                    onClick={() => props.onNavigate('TODAY')}
                    className="px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    {props.messages.today}
                  </button>
                  <button 
                    onClick={() => props.onNavigate('NEXT')}
                    className="px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    {">"}
                  </button>
                </div>
                
                <span className="text-xl font-semibold mx-4">
                  {format(props.date, 'MMMM yyyy', { locale: fr })}
                </span>
                
                <div className="flex space-x-2">
                  {[Views.MONTH, Views.WEEK, Views.DAY].map(view => (
                    <button
                      key={view}
                      onClick={() => props.onView(view)}
                      className={`px-3 py-1 rounded transition ${
                        props.view === view ? 'bg-blue-700' : 'hover:bg-blue-600'
                      }`}
                    >
                      {props.messages[view.toLowerCase()]}
                    </button>
                  ))}
                </div>
              </div>
            ),
            month: {
              event: ({ event }) => (
                <div className="p-1">
                  <div className="bg-blue-500 text-white p-2 rounded-lg shadow-sm">
                    <strong>{event.title}</strong>
                    <div className="text-xs">
                      {format(event.start, 'HH:mm', { locale: fr })}
                    </div>
                  </div>
                </div>
              ),
            },
          }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#3b82f6',
              border: 'none',
              color: 'white',
            },
          })}
        />
      </div>
    </div>
  );
};

export default PrelevementList;