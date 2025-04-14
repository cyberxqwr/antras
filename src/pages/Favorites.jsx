import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard'; // Reuse RecipeCard for display

function Favorites() {
    const { user, isAuthenticated } = useAuth();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => { // Renamed for clarity
         if (!isAuthenticated || !user) {
              setLoading(false);
              setFavoriteRecipes([]); // Clear recipes if not logged in
              return;
          }

        setLoading(true);
        setError(null);
        try {
            // Fetch favorites ONLY for the logged-in user
            const response = await fetch(`http://localhost:3001/favorites?userId=${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch favorites');
            const data = await response.json();
             // The data fetched from /favorites might just contain IDs, or the full recipe data
             // If it contains full data (like we designed in RecipeCard), we can use it directly.
             // If it only contains recipeId, we might need another fetch/lookup, but our design stores basic data.
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
    }, [isAuthenticated, user]); // Re-fetch if auth state changes

    // Function to refetch favorites after a favorite is removed (passed down potentially or handled via state lift/context)
    // For simplicity now, the RecipeCard handles its own removal and UI update.
    // A full refresh could be triggered here if needed.

    if (!isAuthenticated) return <div>Prašome prisijungti, kad matytumėte mėgstamus receptus.</div>;
    if (loading) return <div>Kraunama mėgstamus receptus...</div>;
    if (error) return <div>Klaida: {error}</div>;

    return (
        <div>
            <h2>Mėgstamiausi Receptai</h2>
            {favoriteRecipes.length === 0 ? (
                <p>Kol kas neturite mėgstamų receptų.</p>
            ) : (
                <div className="recipe-grid"> {/* Use the same grid style */}
                    {favoriteRecipes.map((fav) => (
                        // We pass the recipe data stored within the favorite object to RecipeCard
                        // Note: RecipeCard expects an object with 'id' property matching the actual recipe ID
                        <RecipeCard key={fav.recipeId} recipe={{
                            id: fav.recipeId, // Crucial: use recipeId for linking/key
                            name: fav.name,
                            image: fav.image,
                            cuisine: fav.cuisine
                            // Add any other properties RecipeCard might need that you stored
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
