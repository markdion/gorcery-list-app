import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import groceryListReducer from '../features/groceryList/groceryListSlice';
import recipesReducer from '../features/recipes/recipesSlice';
import { AuthState, GroceryListState, RecipesState } from '../types';

export interface RootState {
  auth: AuthState;
  groceryList: GroceryListState;
  recipes: RecipesState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groceryList: groceryListReducer,
    recipes: recipesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Firestore Timestamps
    }),
});

export type AppDispatch = typeof store.dispatch; 