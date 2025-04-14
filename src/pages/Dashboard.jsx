import React from 'react';
import RecipeList from '../components/RecipeList';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Sveiki, {user?.email}! Čia jūsų receptų skydelis.</h2>
      <RecipeList />
    </div>
  );
}

export default Dashboard;