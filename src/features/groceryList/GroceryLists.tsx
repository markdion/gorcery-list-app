import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { setLists, addList } from './groceryListSlice';
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/react/24/outline';

const GroceryLists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const lists = useSelector((state: RootState) => state.groceryList.lists);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/groceryLists`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      dispatch(setLists(listsData));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  const createNewList = () => {
    navigate('/grocery-lists/new');
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Grocery Lists</h1>
        <button
          onClick={createNewList}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          New List
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No grocery lists</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new list.</p>
          <div className="mt-6">
            <button
              onClick={createNewList}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New List
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/grocery-lists/${list.id}`}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body">
                <h2 className="text-lg font-medium text-gray-900">{list.name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {list.items.length} items
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryLists; 