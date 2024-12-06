import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SelectedRecipe {
  id: string;
  name: string;
  ingredients: any[];
}

const NewGroceryList = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [step, setStep] = useState(1);
  const [listName, setListName] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);

  const handleRecipeSelect = (recipe: any) => {
    const isSelected = selectedRecipes.some((r) => r.id === recipe.id);
    if (isSelected) {
      setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipe.id));
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const combineIngredients = () => {
    const combined: { [key: string]: any } = {};

    selectedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        if (combined[key]) {
          combined[key].amount += ingredient.amount;
        } else {
          combined[key] = { ...ingredient };
        }
      });
    });

    return Object.values(combined);
  };

  const handleNext = () => {
    if (step === 1 && !listName.trim()) {
      return;
    }
    if (step === 2 && selectedRecipes.length === 0) {
      return;
    }
    if (step === 2) {
      setSelectedIngredients(combineIngredients());
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = async () => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/groceryLists`), {
        name: listName,
        items: selectedIngredients.map((ingredient) => ({
          ...ingredient,
          checked: false,
        })),
        createdAt: Date.now(),
      });

      navigate(`/grocery-lists/${docRef.id}`);
    } catch (error) {
      console.error('Error creating grocery list:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Grocery List</h1>
        <div className="mt-4">
          <nav className="flex items-center justify-center" aria-label="Progress">
            <ol className="flex items-center space-x-5">
              {[1, 2, 3].map((stepNumber) => (
                <li key={stepNumber}>
                  <div
                    className={`flex items-center ${
                      stepNumber < step
                        ? 'text-indigo-600'
                        : stepNumber === step
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                        stepNumber < step
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : stepNumber === step
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Name Your Grocery List
              </h2>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="input-primary"
                placeholder="Enter list name..."
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Select Recipes to Include
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleRecipeSelect(recipe)}
                    className={`card cursor-pointer transition-colors duration-200 ${
                      selectedRecipes.some((r) => r.id === recipe.id)
                        ? 'bg-indigo-50 border-indigo-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="card-body">
                      <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                      <p className="text-sm text-gray-500">
                        {recipe.ingredients.length} ingredients
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Review Ingredients
              </h2>
              <div className="space-y-2">
                {selectedIngredients.map((ingredient, index) => (
                  <div key={index} className="card">
                    <div className="card-body flex items-center justify-between">
                      <span>
                        {ingredient.name} - {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-footer bg-gray-50 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="btn-secondary inline-flex items-center"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="btn-primary inline-flex items-center ml-auto"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button onClick={handleCreate} className="btn-primary ml-auto">
              Create List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewGroceryList; 