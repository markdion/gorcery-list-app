import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import { setUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import GroceryLists from './features/groceryList/GroceryLists';
import NewGroceryList from './features/groceryList/NewGroceryList';
import GroceryListDetail from './features/groceryList/GroceryListDetail';
import Recipes from './features/recipes/Recipes';
import NewRecipe from './features/recipes/NewRecipe';
import RecipeDetail from './features/recipes/RecipeDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/grocery-lists" replace />} />
          <Route
            path="grocery-lists"
            element={
              <PrivateRoute>
                <GroceryLists />
              </PrivateRoute>
            }
          />
          <Route
            path="grocery-lists/new"
            element={
              <PrivateRoute>
                <NewGroceryList />
              </PrivateRoute>
            }
          />
          <Route
            path="grocery-lists/:id"
            element={
              <PrivateRoute>
                <GroceryListDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="recipes"
            element={
              <PrivateRoute>
                <Recipes />
              </PrivateRoute>
            }
          />
          <Route
            path="recipes/new"
            element={
              <PrivateRoute>
                <NewRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="recipes/:id"
            element={
              <PrivateRoute>
                <RecipeDetail />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
