import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import './Resources.css';

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useLocalStorage<Resource[]>('life-labs-resources', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', category: 'Work' });

  const addResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.url.trim()) return;

    let formattedUrl = newResource.url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const resource: Resource = {
      id: crypto.randomUUID(),
      ...newResource,
      url: formattedUrl
    };

    setResources([resource, ...resources]);
    setNewResource({ title: '', url: '', category: 'Work' });
    setIsAdding(false);
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <button className="add-resource-btn" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {isAdding && (
        <Card title="New Bookmark" accentColor="var(--pastel-sky)">
          <form className="resource-form" onSubmit={addResource}>
            <input 
              placeholder="Title" 
              value={newResource.title}
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            />
            <input 
              placeholder="URL (e.g. google.com)" 
              value={newResource.url}
              onChange={(e) => setNewResource({...newResource, url: e.target.value})}
            />
            <select 
              value={newResource.category}
              onChange={(e) => setNewResource({...newResource, category: e.target.value})}
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Learning</option>
              <option>Entertainment</option>
              <option>Shopping</option>
            </select>
            <button type="submit" className="save-btn">Save Bookmark</button>
          </form>
        </Card>
      )}

      <div className="resources-grid">
        {resources.length === 0 ? (
          <div className="empty-resources">
            <Bookmark size={48} />
            <p>Your library is empty. Save links to useful resources here!</p>
          </div>
        ) : (
          resources.map(resource => (
            <Card key={resource.id} accentColor="var(--pastel-sky)" className="resource-card">
              <div className="resource-content">
                <span className="resource-cat">{resource.category}</span>
                <h4 className="resource-title">{resource.title}</h4>
                <div className="resource-actions">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="visit-btn">
                    <ExternalLink size={18} /> Visit
                  </a>
                  <button className="del-btn" onClick={() => deleteResource(resource.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;
