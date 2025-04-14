import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h1>Sveiki atvykę!</h1>
      {isAuthenticated ? (
         <p>Prisijungta kaip: {user?.email}</p>
      ) : (
         <p>Prašome <Link to="/login">prisijungti</Link> arba <Link to="/register">registruotis</Link>.</p>
      )}
    </div>
  );
}
export default Home;