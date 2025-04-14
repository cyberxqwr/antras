import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Handle initial load
  const navigate = useNavigate();

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
         setUser(userData);
         setIsAuthenticated(true);
      } catch (error) {
         console.error("Failed to parse user from localStorage", error);
         localStorage.removeItem('user');
      }
    }
    setLoading(false); // Finished loading initial auth state
  }, []);

  const login = async (email, password) => {
    // --- IMPORTANT: REAL HASHING NEEDED IN PRODUCTION ---
    // This is a simplified check against the mock backend
    try {
      //const response = await fetch(`http://localhost:3001/users?email=<span class="math-inline">\{email\}&password\=</span>{password}`);
      const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const users = await response.json();

      if (users.length === 1) {
        const userData = users[0];
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return true; // Indicate success
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle specific errors or just indicate failure
      return false; // Indicate failure
    }
  };

  const register = async (email, password) => {
    // --- IMPORTANT: REAL HASHING NEEDED IN PRODUCTION ---
    // Check if user already exists
     try {
        const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`);
        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            throw new Error('Email already exists.');
        }

        // Create new user
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), // Store password plaintext (BAD PRACTICE!)
        });
        if (!response.ok) throw new Error('Registration failed on server.');

        const newUser = await response.json();
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
         return true; // Indicate success
     } catch (error) {
         console.error("Registration failed:", error);
         return false; // Indicate failure
     }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login after logout
  };

  // Don't render children until initial loading is done
  if (loading) {
      return <div>Loading authentication...</div>; // Or a spinner component
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
