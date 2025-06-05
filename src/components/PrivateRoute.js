import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ConnexionContext } from '../context/ConnexionContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, restoreSession } = useContext(ConnexionContext);
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await restoreSession(); // Implémentez cette fonction dans votre contexte
      setIsCheckingAuth(false);
    };
    
    if (!user?.token) {
      checkAuth();
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isLoading || isCheckingAuth) {
    return <div>Chargement...</div>;
  }

  if (!user?.token) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;