import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import './ShoppingList.css';

interface ShoppingItem {
  id: string;
  text: string;
  bought: boolean;
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>('life-labs-shopping', []);
  const [inputValue, setInputValue] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      text: inputValue,
      bought: false
    };
    
    setItems([...items, newItem]);
    setInputValue('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearBought = () => {
    setItems(items.filter(item => !item.bought));
  };

  return (
    <div className="shopping-page">
      <Card title="Shopping List" subtitle="Items to buy for your next trip" accentColor="var(--pastel-peach)">
        <form className="shopping-input-group" onSubmit={addItem}>
          <input 
            type="text" 
            placeholder="Add item..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="add-btn-peach">
            <Plus size={20} />
          </button>
        </form>

        <div className="shopping-list">
          {items.length === 0 ? (
            <div className="empty-shopping">
              <ShoppingBag size={48} />
              <p>Your shopping list is empty.</p>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className={`shopping-item ${item.bought ? 'bought' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={item.bought} 
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className="item-text">{item.text}</span>
                  <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button className="clear-btn" onClick={clearBought}>Clear Purchased Items</button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShoppingList;
