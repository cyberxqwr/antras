import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get current location

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state property. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the child component if authenticated
}

export default ProtectedRoute;