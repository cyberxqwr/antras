import React from 'react';
import { Routes, Route, Link, /*useNavigate*/ } from 'react-router-dom';
import Home from './pages/Home'; // Create these page components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Will contain RecipeList
import Favorites from './pages/Favorites'; // Will contain Favorite Recipes
import RecipeDetail from './pages/RecipeDetail'; // For Task 2
import { useAuth } from './context/AuthContext'; // Import useAuth
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  //const navigate = useNavigate();

  const handleLogout = () => {
      logout(); // Call logout from context
      // Navigation is handled within the logout function in context
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

        {/* Protected Routes */}
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