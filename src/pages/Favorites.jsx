import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

function Favorites() {
    const { user, isAuthenticated } = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
         if (!isAuthenticated || !user) {
              setLoading(false);
              setFavoriteRecipes([]);
              return;
          }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/favorites?userId=${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch favorites');
            const data = await response.json();
            setFavoriteRecipes(data);
        } catch (err) {
            setError(err.message);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFavorites();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) return <div>Prašome prisijungti, kad matytumėte mėgstamus receptus.</div>;
    if (loading) return <div>Kraunama mėgstamus receptus...</div>;
    if (error) return <div>Klaida: {error}</div>;

    return (
        <div>
            <h2>Mėgstamiausi Receptai</h2>
            {favoriteRecipes.length === 0 ? (
                <p>Kol kas neturite mėgstamų receptų.</p>
            ) : (
                <div className="recipe-grid">
                    {favoriteRecipes.map((fav) => (
                        <RecipeCard key={fav.recipeId} recipe={{
                            id: fav.recipeId,
                            name: fav.name,
                            image: fav.image,
                            cuisine: fav.cuisine
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
