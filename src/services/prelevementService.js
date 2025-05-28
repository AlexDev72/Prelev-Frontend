import axios from 'axios';

// URL de base de l'API pour les opérations sur les prélèvements
const API_URL = "http://localhost:8080/prelevement";

/**
 * Récupère la liste de tous les prélèvements depuis l'API.
 * 
 * @returns {Promise} Promesse contenant la réponse de l'API (liste des prélèvements).
 */
export const getPrelevements = (token) => {
  return axios.get(`${API_URL}/lire`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/**
 * Crée un nouveau prélèvement via une requête POST.
 * 
 * @param {Object} data - Données du prélèvement à créer.
 * @returns {Promise} Promesse contenant la réponse de l'API.
 */
export const createPrelevement = (data, token) => {
  return axios.post(`${API_URL}/cree`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


/**
 * Met à jour un prélèvement existant via une requête PUT.
 * 
 * @param {number|string} id - Identifiant du prélèvement à modifier.
 * @param {Object} data - Données mises à jour du prélèvement.
 * @returns {Promise} Promesse contenant la réponse de l'API.
 */
export const updatePrelevement = (id, data) => {
  return axios.put(`${API_URL}/modifier/${id}`, data);
};

/**
 * Supprime un prélèvement via une requête DELETE.
 * 
 * @param {number|string} id - Identifiant du prélèvement à supprimer.
 * @returns {Promise} Promesse contenant la réponse de l'API.
 */
export const deletePrelevement = (id) => {
  return axios.delete(`${API_URL}/supprimer/${id}`);
};
