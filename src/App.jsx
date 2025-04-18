import React from 'react';
import { Routes, Route, Link, /*useNavigate*/ } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  //const navigate = useNavigate();

  const handleLogout = () => {
      logout();
  };

  return (
      <nav>
          <Link to="/">Home</Link> |
          {!isAuthenticated ? (
              <>
                  <Link to="/login">Login</Link> |
                  <Link to="/register">Register</Link>
              </>
          ) : (
              <>
                  <Link to="/dashboard">Dashboard</Link> |
                  <Link to="/favorites">Favorites</Link> |
                  <span> Sveiki, {user?.email}! </span>
                  <button onClick={handleLogout}>Atsijungti</button>
              </>
          )}
      </nav>
  );
}


function App() {
  return (
    <div>
      <Navbar />
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </div>
  );
}

export default App;
