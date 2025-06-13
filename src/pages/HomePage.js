import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
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

  const [totalMontant, setTotalMontant] = useState(0);
  const [totalPrelevements, setTotalPrelevements] = useState(0);
  const [prelevementsAvenir, setPrelevementsAvenir] = useState([]);
  const [prelevementsParMois, setPrelevementsParMois] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      };

      // Récupération du montant total
      const totalMontantRes = await axios.get("http://192.168.1.22:8080/prelevement/total", { headers });
      setTotalMontant(totalMontantRes.data);

      // Récupération des prélèvements à venir
      const avenirRes = await axios.get("http://192.168.1.22:8080/prelevement/avenir", { headers });
      setPrelevementsAvenir(avenirRes.data);

      // Récupération des prélèvements par mois
      const parMoisRes = await axios.get("http://192.168.1.22:8080/prelevement/par-mois", { headers });
      setPrelevementsParMois(parMoisRes.data);

    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord :", error);
      setError("Impossible de charger les données.");
    }
  };

  fetchDashboardData();
}, []);


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
  {prelevementsAvenir
    .slice()
    .sort((a, b) => {
      const dayA = new Date(a.datePrelevement).getDate();
      const dayB = new Date(b.datePrelevement).getDate();
      return dayA - dayB;
    })
    .map((item, index) => {
      const date = new Date(item.datePrelevement);
      const currentMonthName = new Date().toLocaleDateString('fr-FR', {
        month: 'long',
      });
      const day = date.getDate().toString().padStart(2, '0');

      const logoName = item.nom.toLowerCase().replace(/\s+/g, '') + ".png";
      const logoPath = `/logos/${logoName}`; // stocké dans public/logos/

      return (
        <li key={index} className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logoPath} alt={item.nom}  style={{
                          maxWidth: "40px",
                          maxHeight: "40px",
                          objectFit: "contain",
                        }} />
            <span className="text-gray-700 dark:text-gray-300">
              {day} {currentMonthName}
            </span>
          </div>
          <span className="font-medium text-gray-800 dark:text-white">
            {item.prix.toFixed(2)} €
          </span>
        </li>
      );
    })}
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
