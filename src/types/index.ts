export interface User {
  uid: string;
  email: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  sourceType: 'url' | 'image' | 'manual';
  source: string | null;
  ingredients: Ingredient[];
  steps: string[];
  createdAt: number;
}

export interface GroceryItem extends Ingredient {
  checked: boolean;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface GroceryListState {
  lists: GroceryList[];
  currentList: GroceryList | null;
  loading: boolean;
  error: string | null;
}

export interface RecipesState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
} 