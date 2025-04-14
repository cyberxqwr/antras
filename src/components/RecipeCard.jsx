import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RecipeCard({ recipe }) {
    const { user, isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null); // Store the ID of the favorite entry itself
    const [isLoadingFav, setIsLoadingFav] = useState(true); // Loading state for fav check/toggle

    const checkFavoriteStatus = async () => {
        if (!isAuthenticated || !user || !recipe) return;

        setIsLoadingFav(true);
        try {
            // Fetch favorites specifically for this user and this recipe
            const response = await fetch(`http://localhost:3001/favorites?userId=${user.id}&recipeId=${recipe.id}`);
            const favorites = await response.json();
            if (favorites.length > 0) {
                setIsFavorite(true);
                setFavoriteId(favorites[0].id); // Store the ID of the favorite entry
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        } catch (error) {
            console.error("Failed to check favorite status", error);
            // Optionally set an error state
        } finally {
             setIsLoadingFav(false);
        }
    };

    // Check if the recipe is a favorite for the current user when component mounts or user/recipe changes
    useEffect(() => {

        checkFavoriteStatus();
    }, [isAuthenticated, user, recipe]); // Re-check if auth state or recipe changes


    const handleToggleFavorite = async () => {
        if (!isAuthenticated || !user || isLoadingFav) return; // Prevent action if not logged in or already processing

        setIsLoadingFav(true);
        const url = 'http://localhost:3001/favorites';

        try {
            if (isFavorite && favoriteId) {
                // Remove from favorites
                const response = await fetch(`${url}/${favoriteId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to remove favorite');
                console.log("Removed favorite, server response ok");
                // Re-fetch status AFTER successful delete
                await checkFavoriteStatus();
            } else {
                // Add to favorites
                const favoriteData = {
                    userId: user.id,
                    recipeId: recipe.id,
                    // Include other recipe data you want quick access to in favorites view
                    name: recipe.name,
                    image: recipe.image,
                    cuisine: recipe.cuisine,
                };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(favoriteData),
                });
            
                 if (!response.ok) throw new Error('Failed to add favorite');
                const newFavorite = await response.json();
                console.log("Added favorite, server response:", newFavorite);
                await checkFavoriteStatus();
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            // Optionally show an error message to the user
        } finally {
            setIsLoadingFav(false);
        }
    };


    return (
        <div className="recipe-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
            <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{recipe.name}</h3>
            <p>Cuisine: {recipe.cuisine}</p>
            <Link to={`/recipe/${recipe.id}`}>View Details</Link>
            {isAuthenticated && ( // Show button only if logged in
                <button onClick={handleToggleFavorite} disabled={isLoadingFav} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' }}>
                    {isLoadingFav ? '...' : (isFavorite ? '❤️' : '🤍')} {/* Red heart if favorite, white if not */}
                </button>
            )}
        </div>
    );
}

export default RecipeCard;