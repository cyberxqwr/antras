import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';

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
        const response = await fetch('https://dummyjson.com/recipes?limit=0');
        if (!response.ok) throw new Error('Nepavyko išgauti receptų');
        const data = await response.json();

        setRecipes(data.recipes);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));

      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

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
      <div className="recipe-grid">
        {currentRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

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
