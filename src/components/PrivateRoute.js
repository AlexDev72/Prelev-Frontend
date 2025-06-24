import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ConnexionContext } from '../context/ConnexionContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, restoreSession } = useContext(ConnexionContext);
  const location = useLocation();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      await restoreSession();
      setIsSessionChecked(true);
    };

    checkSession();
  }, []);

  if (isLoading || !isSessionChecked) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
