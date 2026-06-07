import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Trash2, ShoppingBag, Sparkles, CheckCircle, Package } from 'lucide-react';
import './SkincareJournal.css';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  status: 'using' | 'finished' | 'wishlist';
  notes: string;
}

const SkincareJournal: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('life-labs-skincare-all', []);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'using' | 'finished' | 'wishlist'>('all');

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: 'Cleanser',
    status: 'using' as const,
    notes: ''
  });

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const product: Product = {
      id: crypto.randomUUID(),
      ...newProduct
    };

    setProducts([product, ...products]);
    setNewProduct({ name: '', brand: '', category: 'Cleanser', status: 'using', notes: '' });
    setIsAdding(false);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateStatus = (id: string, status: Product['status']) => {
    setProducts(products.map(p => p.id === id ? { ...p, status } : p));
  };

  const filteredProducts = products.filter(p => filter === 'all' || p.status === filter);

  const categories = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Other'];

  return (
    <div className="skincare-page">
      <div className="skincare-header">
        <div className="skincare-tabs">
          <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`tab ${filter === 'using' ? 'active' : ''}`} onClick={() => setFilter('using')}>Currently Using</button>
          <button className={`tab ${filter === 'finished' ? 'active' : ''}`} onClick={() => setFilter('finished')}>Finished</button>
          <button className={`tab ${filter === 'wishlist' ? 'active' : ''}`} onClick={() => setFilter('wishlist')}>Wishlist</button>
        </div>
        <button className="add-product-btn" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {isAdding && (
        <Card title="New Product" accentColor="var(--pastel-blush)">
          <form className="product-form" onSubmit={addProduct}>
            <div className="form-row">
              <input 
                placeholder="Product Name" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
              <input 
                placeholder="Brand" 
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
              />
            </div>
            <div className="form-row">
              <select 
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <select 
                value={newProduct.status}
                onChange={(e) => setNewProduct({...newProduct, status: e.target.value as any})}
              >
                <option value="using">Currently Using</option>
                <option value="finished">Finished</option>
                <option value="wishlist">Wishlist / To Buy</option>
              </select>
            </div>
            <textarea 
              placeholder="Notes (performance, texture, etc.)" 
              value={newProduct.notes}
              onChange={(e) => setNewProduct({...newProduct, notes: e.target.value})}
            />
            <button type="submit" className="save-btn">Add to Collection</button>
          </form>
        </Card>
      )}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>No products found in this category.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="product-item-card" accentColor="var(--pastel-blush)">
              <div className="product-item-header">
                <span className="product-cat-tag">{product.category}</span>
                <div className="product-item-actions">
                  {product.status === 'using' && (
                    <button title="Mark as finished" onClick={() => updateStatus(product.id, 'finished')}><CheckCircle size={18} /></button>
                  )}
                  {product.status === 'wishlist' && (
                    <button title="Start using" onClick={() => updateStatus(product.id, 'using')}><Sparkles size={18} /></button>
                  )}
                  <button onClick={() => deleteProduct(product.id)} className="del-btn"><Trash2 size={18} /></button>
                </div>
              </div>
              <h4 className="product-item-name">{product.name}</h4>
              <p className="product-item-brand">{product.brand}</p>
              {product.notes && <p className="product-item-notes">{product.notes}</p>}
              <div className="product-item-status-badge" data-status={product.status}>
                {product.status.toUpperCase()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SkincareJournal;
