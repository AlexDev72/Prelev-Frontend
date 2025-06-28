import { useContext, useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ConnexionContext } from '../context/ConnexionContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, restoreSession } = useContext(ConnexionContext);
  const location = useLocation();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  const checkSession = useCallback(async () => {
    await restoreSession();
    setIsSessionChecked(true);
  }, [restoreSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading || !isSessionChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 dark:bg-zinc-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-white">Chargement en cours...</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-white text-center">
          Veuillez patienter pendant que nous vérifions votre session.
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;