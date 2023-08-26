import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { config } from "./config/config";

const ProtectedRoutes = () => {
  const cookies = new Cookies();
  const token = cookies.get("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const URL = config.url;
  console.log("what url am i using",URL)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${URL}/check-auth`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("what is in the response?",response)
          const data = await response.json();

          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, URL]);

  if (isLoading) {
    // You can render a loading spinner or some placeholder
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoutes;
