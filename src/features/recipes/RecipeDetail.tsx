import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { setCurrentRecipe } from './recipesSlice';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface NewIngredient {
  name: string;
  amount: string;
  unit: string;
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentRecipe = useSelector((state: RootState) => state.recipes.currentRecipe);
  const [loading, setLoading] = useState(true);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    name: '',
    amount: '',
    unit: '',
  });
  const [newStep, setNewStep] = useState('');
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [showAddStep, setShowAddStep] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const unsubscribe = onSnapshot(
      doc(db, `users/${user.uid}/recipes/${id}`),
      (doc) => {
        if (doc.exists()) {
          const recipeData = { id: doc.id, ...doc.data() } as any;
          dispatch(setCurrentRecipe(recipeData));
        } else {
          navigate('/recipes');
        }
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      dispatch(setCurrentRecipe(null));
    };
  }, [dispatch, id, navigate, user]);

  const addIngredient = async () => {
    if (!currentRecipe || !user || !newIngredient.name || !newIngredient.amount) return;

    const newIngredientData = {
      id: Date.now().toString(),
      name: newIngredient.name,
      amount: parseFloat(newIngredient.amount),
      unit: newIngredient.unit,
    };

    const updatedIngredients = [...currentRecipe.ingredients, newIngredientData];
    const docRef = doc(db, `users/${user.uid}/recipes/${currentRecipe.id}`);
    await updateDoc(docRef, { ingredients: updatedIngredients });

    setNewIngredient({ name: '', amount: '', unit: '' });
    setShowAddIngredient(false);
  };

  const deleteIngredient = async (ingredientId: string) => {
    if (!currentRecipe || !user) return;

    const updatedIngredients = currentRecipe.ingredients.filter(
      (ingredient: any) => ingredient.id !== ingredientId
    );
    const docRef = doc(db, `users/${user.uid}/recipes/${currentRecipe.id}`);
    await updateDoc(docRef, { ingredients: updatedIngredients });
  };

  const addStep = async () => {
    if (!currentRecipe || !user || !newStep.trim()) return;

    const updatedSteps = [...currentRecipe.steps, newStep.trim()];
    const docRef = doc(db, `users/${user.uid}/recipes/${currentRecipe.id}`);
    await updateDoc(docRef, { steps: updatedSteps });

    setNewStep('');
    setShowAddStep(false);
  };

  const deleteStep = async (index: number) => {
    if (!currentRecipe || !user) return;

    const updatedSteps = currentRecipe.steps.filter((_, i) => i !== index);
    const docRef = doc(db, `users/${user.uid}/recipes/${currentRecipe.id}`);
    await updateDoc(docRef, { steps: updatedSteps });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentRecipe) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{currentRecipe.name}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Source: {currentRecipe.sourceType}
          {currentRecipe.source && ` - ${currentRecipe.source}`}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
            <button
              onClick={() => setShowAddIngredient(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Ingredient
            </button>
          </div>

          {showAddIngredient && (
            <div className="card mb-4">
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ingredient Name
                    </label>
                    <input
                      type="text"
                      value={newIngredient.name}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, name: e.target.value })
                      }
                      className="input-primary mt-1"
                      placeholder="e.g., Flour"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={newIngredient.amount}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, amount: e.target.value })
                      }
                      className="input-primary mt-1"
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={newIngredient.unit}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, unit: e.target.value })
                      }
                      className="input-primary mt-1"
                      placeholder="e.g., cups"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddIngredient(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={addIngredient} className="btn-primary">
                    Add Ingredient
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {currentRecipe.ingredients.map((ingredient: any) => (
              <div
                key={ingredient.id}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="card-body flex items-center justify-between">
                  <span>
                    {ingredient.name} - {ingredient.amount} {ingredient.unit}
                  </span>
                  <button
                    onClick={() => deleteIngredient(ingredient.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Steps</h2>
            <button
              onClick={() => setShowAddStep(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Step
            </button>
          </div>

          {showAddStep && (
            <div className="card mb-4">
              <div className="card-body">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Step Instructions
                  </label>
                  <textarea
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    rows={3}
                    className="input-primary mt-1"
                    placeholder="Enter step instructions..."
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddStep(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={addStep} className="btn-primary">
                    Add Step
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {currentRecipe.steps.map((step: string, index: number) => (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="card-body flex items-start justify-between">
                  <div className="flex">
                    <span className="font-medium text-gray-500 mr-4">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                  <button
                    onClick={() => deleteStep(index)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 