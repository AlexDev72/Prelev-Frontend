import React, { useEffect, useState,  useContext} from "react";
import { Card, CardContent } from "../components/ui/card";
import { ConnexionContext } from "../context/ConnexionContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HomePage = () => {  
  const { logout } = useContext(ConnexionContext);
  const [totalPrelevements, setTotalPrelevements] = useState(0);
  const [totalMontant, setTotalMontant] = useState(0);
  const [prelevementsAvenir, setPrelevementsAvenir] = useState([]);
  const [prelevementsParMois, setPrelevementsParMois] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      setError("Token non trouvé, veuillez vous connecter.");
      return;
    }

    fetch("http://192.168.1.22:8080/prelevements/total", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Erreur ${res.status} : ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        // Supposons que la réponse a cette forme :
        // {
        //   totalPrelevements: number,
        //   totalMontant: number,
        //   prelevementsAvenir: [{ nom, date, montant }],
        //   prelevementsParMois: [{ mois, total }]
        // }

        setTotalPrelevements(data.totalPrelevements || 0);
        setTotalMontant(data.totalMontant || 0);
        setPrelevementsAvenir(data.prelevementsAvenir || []);
        setPrelevementsParMois(data.prelevementsParMois || []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []); // [] pour que ça ne se lance qu’une fois au montage

  return (
    <div className="p-4 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Tableau de bord
      </h1>
    <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 w-full text-left transition rounded-md"
                >
                 
                  Se déconnecter
                </button>
      {error && (
        <div className="text-red-600 dark:text-red-400 font-semibold mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nombre total de prélèvements
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {totalPrelevements}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Montant total ce mois
            </p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {totalMontant.toFixed(2)} €
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Prélèvements à venir
          </h2>
          {prelevementsAvenir.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucun prélèvement à venir</p>
          ) : (
            <ul className="space-y-3">
              {prelevementsAvenir.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.nom} - {item.date}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.montant.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Prélèvements par mois
          </h2>
          {prelevementsParMois.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prelevementsParMois}>
                  <XAxis dataKey="mois" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
