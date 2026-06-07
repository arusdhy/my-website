import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Search, Utensils, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './Recipes.css';

interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients: string;
  instructions: string;
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('life-labs-recipes', []);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    category: 'Dinner',
    ingredients: '',
    instructions: ''
  });

  const addRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipe.title.trim()) return;

    const recipe: Recipe = {
      id: crypto.randomUUID(),
      ...newRecipe
    };

    setRecipes([recipe, ...recipes]);
    setNewRecipe({ title: '', category: 'Dinner', ingredients: '', instructions: '' });
    setIsAdding(false);
  };

  const deleteRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipes-page">
      <div className="recipes-controls">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-recipe-btn" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> {isAdding ? 'Cancel' : 'New Recipe'}
        </button>
      </div>

      {isAdding && (
        <Card className="recipe-form-card" accentColor="var(--pastel-lavender)" title="Add New Recipe">
          <form onSubmit={addRecipe}>
            <div className="form-row">
              <input 
                placeholder="Recipe Title" 
                className="recipe-input"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}
                required
              />
              <select 
                className="recipe-select"
                value={newRecipe.category}
                onChange={(e) => setNewRecipe({...newRecipe, category: e.target.value})}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
                <option>Dessert</option>
              </select>
            </div>
            <textarea 
              placeholder="Ingredients (one per line)..." 
              className="recipe-textarea"
              value={newRecipe.ingredients}
              onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
            />
            <textarea 
              placeholder="Instructions..." 
              className="recipe-textarea"
              value={newRecipe.instructions}
              onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
            />
            <button type="submit" className="save-recipe-btn">Save Recipe</button>
          </form>
        </Card>
      )}

      <div className="recipes-list">
        {filteredRecipes.length === 0 ? (
          <div className="empty-recipes">
            <Utensils size={48} />
            <p>No recipes found. Start adding your favorites!</p>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <Card 
              key={recipe.id} 
              className={`recipe-card ${expandedId === recipe.id ? 'expanded' : ''}`}
              accentColor="var(--pastel-lavender)"
              onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
            >
              <div className="recipe-card-header">
                <div>
                  <span className="recipe-tag">{recipe.category}</span>
                  <h3 className="recipe-title">{recipe.title}</h3>
                </div>
                <div className="recipe-card-actions">
                  <button className="delete-btn" onClick={(e) => deleteRecipe(recipe.id, e)}>
                    <Trash2 size={16} />
                  </button>
                  {expandedId === recipe.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedId === recipe.id && (
                <div className="recipe-details">
                  <div className="recipe-section">
                    <h4>Ingredients</h4>
                    <p>{recipe.ingredients}</p>
                  </div>
                  <div className="recipe-section">
                    <h4>Instructions</h4>
                    <p>{recipe.instructions}</p>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Recipes;
