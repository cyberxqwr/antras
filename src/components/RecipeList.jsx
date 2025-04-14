import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard'; // We'll create this next
// import axios from 'axios'; // Or use fetch

const ITEMS_PER_PAGE = 5;

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch ALL recipes first for pagination calculation
        const response = await fetch('https://dummyjson.com/recipes?limit=0'); // Use limit=0 or a high number to get all for total count
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();

        setRecipes(data.recipes);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE)); // Use total from API if available

      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []); // Fetch only once on mount

  // Calculate recipes for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) return <div>Kraunama receptus...</div>;
  if (error) return <div>Klaida: {error}</div>;

  return (
    <div>
      <h2>Receptai</h2>
      <div className="recipe-grid"> {/* Add some styling for grid layout */}
        {currentRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Atgal
        </button>
        <span> Puslapis {currentPage} iš {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Kitas
        </button>
      </div>
    </div>
  );
}

export default RecipeList;