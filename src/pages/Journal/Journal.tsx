import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Save, ChevronLeft, Plus, Book } from 'lucide-react';
import './Journal.css';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('life-labs-journal', []);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const handleCreateNew = () => {
    const existingToday = entries.find(e => e.date === today);
    if (existingToday) {
      setCurrentContent(existingToday.content);
      setCurrentTitle(existingToday.title);
    } else {
      setCurrentContent('');
      setCurrentTitle('Journal Entry');
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    const existingIndex = entries.findIndex(e => e.date === today);
    const newEntry: JournalEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : crypto.randomUUID(),
      date: today,
      title: currentTitle || 'Untitled Entry',
      content: currentContent
    };

    if (existingIndex >= 0) {
      const updatedEntries = [...entries];
      updatedEntries[existingIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      setEntries([newEntry, ...entries]);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="journal-editor">
        <header className="editor-header">
          <button className="back-btn" onClick={() => setIsEditing(false)}>
            <ChevronLeft size={20} /> Back
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={20} /> Save Entry
          </button>
        </header>
        <Card accentColor="var(--pastel-sky)">
          <div className="editor-inputs">
            <input 
              className="journal-title-input"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Entry Title..."
            />
            <div className="journal-date-badge">{today} (Auto-saved)</div>
            <textarea 
              className="journal-textarea"
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Start writing..."
              autoFocus
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="journal-page">
      <div className="journal-actions">
        <button className="create-btn" onClick={handleCreateNew}>
          <Plus size={20} /> Write Today's Entry
        </button>
      </div>

      <div className="journal-list">
        {entries.length === 0 ? (
          <Card className="empty-journal">
            <Book size={48} />
            <p>Your journal is empty. Start your first entry today!</p>
          </Card>
        ) : (
          entries.map(entry => (
            <Card key={entry.id} title={entry.title} subtitle={entry.date} className="entry-card">
              <p className="entry-preview">{entry.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
