import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RecipeCard({ recipe }) {
    const { user, isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isLoadingFav, setIsLoadingFav] = useState(true);

    const checkFavoriteStatus = async () => {
        if (!isAuthenticated || !user || !recipe) return;

        setIsLoadingFav(true);
        try {
            const response = await fetch(`http://localhost:3001/favorites?userId=${user.id}&recipeId=${recipe.id}`);
            const favorites = await response.json();
            if (favorites.length > 0) {
                setIsFavorite(true);
                setFavoriteId(favorites[0].id);
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        } catch (error) {
            console.error("Failed to check favorite status", error);
        } finally {
             setIsLoadingFav(false);
        }
    };

    useEffect(() => {

        checkFavoriteStatus();
    }, [isAuthenticated, user, recipe]);


    const handleToggleFavorite = async () => {
        if (!isAuthenticated || !user || isLoadingFav) return;

        setIsLoadingFav(true);
        const url = 'http://localhost:3001/favorites';

        try {
            if (isFavorite && favoriteId) {
                const response = await fetch(`${url}/${favoriteId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Nepavyko ištrinti favorito');
                await checkFavoriteStatus();
            } else {
                const favoriteData = {
                    userId: user.id,
                    recipeId: recipe.id,
                    
                    name: recipe.name,
                    image: recipe.image,
                    cuisine: recipe.cuisine,
                };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(favoriteData),
                });
            
                 if (!response.ok) throw new Error('Nepavyko pridėti favorito');
                await checkFavoriteStatus();
            }
        } catch (error) {
            console.error("Nepavyko perjungimas:", error);

        } finally {
            setIsLoadingFav(false);
        }
    };


    return (
        <div className="recipe-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '200px' }}>
            <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{recipe.name}</h3>
            <p>Virtuvė: {recipe.cuisine}</p>
            <Link to={`/recipe/${recipe.id}`}>Peržiūrėti detales</Link>
            {isAuthenticated && (
                <button onClick={handleToggleFavorite} disabled={isLoadingFav} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5em' }}>
                    {isLoadingFav ? '...' : (isFavorite ? '❤️' : '🤍')}
                </button>
            )}
        </div>
    );
}

export default RecipeCard;