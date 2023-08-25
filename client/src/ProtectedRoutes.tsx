import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const checkAuth = async () => {
    try {
      const response = await fetch('/check-auth', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          // User is authenticated, render protected content
          return <Outlet />;
        }
      }

      // User is not authenticated, navigate to login
      return <Navigate to="/login" />;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return <Navigate to="/login" />;
    }
  };

  return checkAuth();
};

export default ProtectedRoutes;