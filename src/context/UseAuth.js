import { useContext } from 'react';
import { ConnexionContext } from './ConnexionContext';

export const useAuth = () => useContext(ConnexionContext);
