import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!response.ok) throw new Error('Nepavyko gauti recepto detalių');
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) return <div>Kraunama recepto detales...</div>;
  if (error) return <div>Klaida: {error}</div>;
  if (!recipe) return <div>Receptas nerastas.</div>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <img src={recipe.image} alt={recipe.name} style={{ maxWidth: '400px' }} />
      <p><strong>Virtuvė:</strong> {recipe.cuisine}</p>
      <p><strong>Sudėtingumas:</strong> {recipe.difficulty}</p>
      <p><strong>Žymos:</strong> {recipe.tags?.join(', ')}</p>
      <p><strong>Įvertinimas:</strong> {recipe.rating} ({recipe.reviewCount} reviews)</p>
      <h3>Ingredientai:</h3>
      <ul>
        {recipe.ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instrukcijos:</h3>
      <ol>
        {recipe.instructions?.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </div>
  );
}

export default RecipeDetail;
