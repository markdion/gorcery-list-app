import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NewIngredient {
  name: string;
  amount: string;
  unit: string;
}

const NewRecipe = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [step, setStep] = useState(1);
  const [recipeName, setRecipeName] = useState('');
  const [sourceType, setSourceType] = useState<'url' | 'image' | 'manual'>('manual');
  const [source, setSource] = useState('');
  const [ingredients, setIngredients] = useState<NewIngredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    name: '',
    amount: '',
    unit: '',
  });
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');

  const handleNext = () => {
    if (step === 1 && !recipeName.trim()) {
      return;
    }
    if (step === 2 && sourceType !== 'manual' && !source.trim()) {
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.amount) return;

    setIngredients([
      ...ingredients,
      {
        ...newIngredient,
        amount: newIngredient.amount,
      },
    ]);
    setNewIngredient({ name: '', amount: '', unit: '' });
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (!newStep.trim()) return;

    setSteps([...steps, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/recipes`), {
        name: recipeName,
        sourceType,
        source: source || null,
        ingredients: ingredients.map((ingredient) => ({
          id: Date.now().toString() + Math.random(),
          name: ingredient.name,
          amount: parseFloat(ingredient.amount),
          unit: ingredient.unit,
        })),
        steps,
        createdAt: Date.now(),
      });

      navigate(`/recipes/${docRef.id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Recipe</h1>
        <div className="mt-4">
          <nav className="flex items-center justify-center" aria-label="Progress">
            <ol className="flex items-center space-x-5">
              {[1, 2, 3, 4].map((stepNumber) => (
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
                Name Your Recipe
              </h2>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="input-primary"
                placeholder="Enter recipe name..."
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Recipe Source
              </h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  {(['url', 'image', 'manual'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSourceType(type)}
                      className={`px-4 py-2 rounded-md ${
                        sourceType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                {sourceType !== 'manual' && (
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="input-primary"
                    placeholder={
                      sourceType === 'url'
                        ? 'Enter recipe URL...'
                        : 'Enter image URL...'
                    }
                  />
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Add Ingredients
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <button
                  onClick={addIngredient}
                  className="btn-secondary"
                >
                  Add Ingredient
                </button>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="card hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="card-body flex items-center justify-between">
                        <span>
                          {ingredient.name} - {ingredient.amount} {ingredient.unit}
                        </span>
                        <button
                          onClick={() => removeIngredient(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Add Steps
              </h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    rows={3}
                    className="input-primary"
                    placeholder="Enter step instructions..."
                  />
                </div>
                <button
                  onClick={addStep}
                  className="btn-secondary"
                >
                  Add Step
                </button>
                <div className="space-y-2">
                  {steps.map((step, index) => (
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
                          onClick={() => removeStep(index)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary inline-flex items-center ml-auto"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={ingredients.length === 0 || steps.length === 0}
              className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Recipe
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRecipe; 