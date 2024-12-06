import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types';

interface RecipesState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
        if (state.currentRecipe?.id === action.payload.id) {
          state.currentRecipe = action.payload;
        }
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
      if (state.currentRecipe?.id === action.payload) {
        state.currentRecipe = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setRecipes,
  setCurrentRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  setLoading,
  setError,
} = recipesSlice.actions;

export default recipesSlice.reducer; 