import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use auth context

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h1>Sveiki atvykę!</h1>
      {isAuthenticated ? (
         <p>Prisijungta kaip: {user?.email}</p> // Display user email if logged in
      ) : (
         <p>Prašome <Link to="/login">prisijungti</Link> arba <Link to="/register">registruotis</Link>.</p>
      )}
    </div>
  );
}
export default Home;