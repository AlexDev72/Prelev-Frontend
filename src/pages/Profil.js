import {
  FiLogOut,
  FiSettings,
  FiMail,
  FiCalendar,
  FiUser,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import React, { useContext } from "react";
import { ConnexionContext } from "../context/ConnexionContext";

const Profil = () => {
  const { logout } = useContext(ConnexionContext);
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    age: null,
    email: "",
    loading: true,
    error: null,
  });

  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode !== null) {
        return savedMode === "true";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ nom: "", prenom: "", age: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setShowSettingsDropdown(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token d'authentification trouvé");

        const response = await fetch(
          "http://192.168.1.22:8080/utilisateur/profil",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login?sessionExpired=true";
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Erreur HTTP: ${response.status}`
          );
        }

        const data = await response.json();
        setUserData({
          id: data.id,
          nom: data.nom || "Aucun nom fourni",
          prenom: data.prenom || "",
          age: data.age || null,
          email: data.email || "Non spécifié",
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Erreur détaillée:", error);
        setUserData((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Erreur de chargement des données",
        }));
      }
    };
    fetchUserData();
  }, []);

  const openEditModal = () => {
    setEditForm({
      nom: userData.nom,
      prenom: userData.prenom,
      age: userData.age || "",
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.22:8080/utilisateur/modifier/${userData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: editForm.nom,
            prenom: editForm.prenom,
            age: Number(editForm.age),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const updatedData = await response.json();
      setUserData((prev) => ({
        ...prev,
        nom: updatedData.nom,
        prenom: updatedData.prenom,
        age: updatedData.age,
      }));
      setShowEditModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (userData.loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (userData.error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{userData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Profil
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-black/70"
            >
              <FiSettings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black/80 rounded-xl shadow-xl py-2 z-20 border border-zinc-200 dark:border-black/70">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-black/70 w-full text-left transition rounded-md"
                >
                  {darkMode ? (
                    <>
                      <FiSun className="text-lg" />
                      Mode clair
                    </>
                  ) : (
                    <>
                      <FiMoon className="text-lg" />
                      Mode sombre
                    </>
                  )}
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 w-full text-left transition rounded-md"
                >
                  <FiLogOut className="text-lg" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-800 to-green-500"></div>
          <div className="px-5 pb-6 relative">
            <div className="flex justify-center -mt-16 mb-3">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-black/80 bg-zinc-200 dark:bg-black/70 flex items-center justify-center">
                <span className="text-3xl text-gray-700 dark:text-gray-300">
                  {userData.prenom.charAt(0).toUpperCase()}
                  {userData.nom.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {userData.prenom} {userData.nom}
              </h2>
            </div>
            <button
              onClick={openEditModal}
              className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition duration-200 dark:bg-green-700 dark:hover:bg-green-700"
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-black/70">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Informations
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-black/70">
            <div className="px-5 py-3 flex items-center">
              <div className="bg-green-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <FiMail className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                <FiUser className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Nom complet</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userData.prenom} {userData.nom}
                </p>
              </div>
            </div>

            {userData.age && (
              <div className="px-5 py-3 flex items-center">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full mr-3">
                  <FiCalendar className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Âge</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userData.age} ans
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:hover:bg-zinc-900 dark:bg-zinc-800 rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
              Modifier le profil
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={editForm.prenom}
                onChange={handleFormChange}
                className="w-full p-2 rounded-md border dark:bg-black/70 dark:border-black/60 dark:text-white"
                required
              />
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={editForm.nom}
                onChange={handleFormChange}
                className="w-full p-2 rounded-md border dark:bg-black/70 dark:border-black/60 dark:text-white"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Âge"
                value={editForm.age}
                onChange={handleFormChange}
                className="w-full p-2 rounded-md border dark:bg-black/70 dark:border-black/60 dark:text-white"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm bg-zinc-300 hover:bg-zinc-400 rounded-md dark:bg-black/70 dark:hover:bg-black/60 text-gray-800 dark:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-800 text-white rounded-md"
                >
                  {isUpdating ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
