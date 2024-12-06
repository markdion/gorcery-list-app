import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { RootState } from '../../store';

const Layout = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">Grocery List App</span>
              </Link>
              {user && (
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to="/grocery-lists"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Grocery Lists
                  </Link>
                  <Link
                    to="/recipes"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Recipes
                  </Link>
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 