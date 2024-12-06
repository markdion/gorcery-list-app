import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
}

interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: number;
}

interface GroceryListState {
  lists: GroceryList[];
  currentList: GroceryList | null;
  loading: boolean;
  error: string | null;
}

const initialState: GroceryListState = {
  lists: [],
  currentList: null,
  loading: false,
  error: null,
};

const groceryListSlice = createSlice({
  name: 'groceryList',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<GroceryList[]>) => {
      state.lists = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentList: (state, action: PayloadAction<GroceryList | null>) => {
      state.currentList = action.payload;
    },
    addList: (state, action: PayloadAction<GroceryList>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<GroceryList>) => {
      const index = state.lists.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
        if (state.currentList?.id === action.payload.id) {
          state.currentList = action.payload;
        }
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
      if (state.currentList?.id === action.payload) {
        state.currentList = null;
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
  setLists,
  setCurrentList,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} = groceryListSlice.actions;

export default groceryListSlice.reducer; 