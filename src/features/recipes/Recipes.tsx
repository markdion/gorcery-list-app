import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { setRecipes } from './recipesSlice';
import { Recipe } from '../../types';
import { BookOpenIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Recipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/recipes`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[];
      dispatch(setRecipes(recipesData));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  const createNewRecipe = () => {
    navigate('/recipes/new');
  };

  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
        <button
          onClick={createNewRecipe}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          New Recipe
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10"
            placeholder="Search recipes by name or ingredient..."
          />
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new recipe.</p>
          <div className="mt-6">
            <button
              onClick={createNewRecipe}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New Recipe
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe: Recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body">
                <h2 className="text-lg font-medium text-gray-900">{recipe.name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {recipe.ingredients.length} ingredients
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Source: {recipe.sourceType}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Created {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes; 