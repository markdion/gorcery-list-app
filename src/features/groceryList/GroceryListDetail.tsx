import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { RootState } from '../../store';
import { setCurrentList, updateList } from './groceryListSlice';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface NewItem {
  name: string;
  amount: string;
  unit: string;
}

const GroceryListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentList = useSelector((state: RootState) => state.groceryList.currentList);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<NewItem>({ name: '', amount: '', unit: '' });
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const unsubscribe = onSnapshot(
      doc(db, `users/${user.uid}/groceryLists/${id}`),
      (doc) => {
        if (doc.exists()) {
          const listData = { id: doc.id, ...doc.data() } as any;
          dispatch(setCurrentList(listData));
        } else {
          navigate('/grocery-lists');
        }
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      dispatch(setCurrentList(null));
    };
  }, [dispatch, id, navigate, user]);

  const toggleItemCheck = async (itemId: string) => {
    if (!currentList || !user) return;

    const updatedItems = currentList.items.map((item: any) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const docRef = doc(db, `users/${user.uid}/groceryLists/${currentList.id}`);
    await updateDoc(docRef, { items: updatedItems });
  };

  const addNewItem = async () => {
    if (!currentList || !user || !newItem.name || !newItem.amount) return;

    const newItemData = {
      id: Date.now().toString(),
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      unit: newItem.unit,
      checked: false,
    };

    const updatedItems = [...currentList.items, newItemData];
    const docRef = doc(db, `users/${user.uid}/groceryLists/${currentList.id}`);
    await updateDoc(docRef, { items: updatedItems });

    setNewItem({ name: '', amount: '', unit: '' });
    setShowAddItem(false);
  };

  const deleteItem = async (itemId: string) => {
    if (!currentList || !user) return;

    const updatedItems = currentList.items.filter((item: any) => item.id !== itemId);
    const docRef = doc(db, `users/${user.uid}/groceryLists/${currentList.id}`);
    await updateDoc(docRef, { items: updatedItems });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentList) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentList.name}</h1>
        <button
          onClick={() => setShowAddItem(true)}
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Item
        </button>
      </div>

      {showAddItem && (
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="input-primary mt-1"
                  placeholder="e.g., Milk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                  className="input-primary mt-1"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  className="input-primary mt-1"
                  placeholder="e.g., liter"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddItem(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={addNewItem}
                className="btn-primary"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {currentList.items.map((item: any) => (
          <div
            key={item.id}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleItemCheck(item.id)}
                  className={`h-5 w-5 rounded border ${
                    item.checked
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-gray-300'
                  } flex items-center justify-center`}
                >
                  {item.checked && (
                    <CheckIcon className="h-4 w-4 text-white" />
                  )}
                </button>
                <span className={item.checked ? 'line-through text-gray-500' : ''}>
                  {item.name} - {item.amount} {item.unit}
                </span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryListDetail; 