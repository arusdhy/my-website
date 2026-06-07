import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Trash2, StickyNote } from 'lucide-react';
import './Notes.css';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('life-labs-notes', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const addNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content,
      date: new Date().toLocaleDateString()
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <button className="add-note-btn" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} /> {isAdding ? 'Cancel' : 'New Note'}
        </button>
      </div>

      {isAdding && (
        <Card className="note-editor-card" accentColor="var(--pastel-mint)">
          <input 
            className="note-title-input"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea 
            className="note-content-input"
            placeholder="Start typing..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <button className="save-note-btn" onClick={addNote}>Save Note</button>
        </Card>
      )}

      <div className="notes-grid">
        {notes.length === 0 && !isAdding ? (
          <div className="empty-notes">
            <StickyNote size={48} />
            <p>No notes yet. Capture your thoughts!</p>
          </div>
        ) : (
          notes.map(note => (
            <Card key={note.id} title={note.title} subtitle={note.date} className="note-card">
              <p className="note-preview">{note.content}</p>
              <button className="delete-note-btn" onClick={() => deleteNote(note.id)}>
                <Trash2 size={16} />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
