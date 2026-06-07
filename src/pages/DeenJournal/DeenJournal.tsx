import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Heart, Check, History, Layout, Plus, Trash2 } from 'lucide-react';
import './DeenJournal.css';

interface DeenTodo {
  id: string;
  text: string;
  completed: boolean;
}

interface DeenDay {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  todos: DeenTodo[];
  reflection: string;
}

const DeenJournal: React.FC = () => {
  const [deenData, setDeenData] = useLocalStorage<Record<string, DeenDay>>('life-labs-deen', {});
  const [view, setView] = useState<'daily' | 'history'>('daily');
  const today = new Date().toISOString().split('T')[0];
  
  const dayData = deenData[today] || {};
  const currentDay: DeenDay = {
    date: today,
    fajr: dayData.fajr || false,
    dhuhr: dayData.dhuhr || false,
    asr: dayData.asr || false,
    maghrib: dayData.maghrib || false,
    isha: dayData.isha || false,
    todos: dayData.todos || [],
    reflection: dayData.reflection || ''
  };

  const [newTodo, setNewTodo] = useState('');

  const updateDay = (updates: Partial<DeenDay>) => {
    setDeenData({
      ...deenData,
      [today]: { ...currentDay, ...updates }
    });
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: DeenTodo = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false
    };
    updateDay({ todos: [...currentDay.todos, todo] });
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = currentDay.todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateDay({ todos: updatedTodos });
  };

  const prayers = [
    { id: 'fajr', label: 'Fajr' },
    { id: 'dhuhr', label: 'Dhuhr' },
    { id: 'asr', label: 'Asr' },
    { id: 'maghrib', label: 'Maghrib' },
    { id: 'isha', label: 'Isha' }
  ];

  return (
    <div className="deen-page">
      <div className="deen-tabs">
        <button className={`tab ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>
          <Layout size={18} /> Daily Tracker
        </button>
        <button className={`tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <History size={18} /> Spiritual History
        </button>
      </div>

      {view === 'daily' ? (
        <>
          <Card title="Spiritual Checklist" subtitle="Track your daily acts of worship" accentColor="var(--pastel-sage)">
            <div className="deen-content">
              <div className="prayer-tracker">
                <h4>Prayers</h4>
                <div className="prayer-grid">
                  {prayers.map(prayer => (
                    <button 
                      key={prayer.id}
                      className={`prayer-btn ${currentDay[prayer.id as keyof DeenDay] ? 'active' : ''}`}
                      onClick={() => updateDay({ [prayer.id]: !currentDay[prayer.id as keyof DeenDay] })}
                    >
                      <div className="check-box">
                        {currentDay[prayer.id as keyof DeenDay] && <Check size={16} />}
                      </div>
                      <span>{prayer.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="deen-todo-section">
                <h4>Daily Spiritual To-Do</h4>
                <div className="deen-todo-input">
                  <input placeholder="Add daily sunnah, dhikr, etc..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} />
                  <button onClick={addTodo}><Plus size={20} /></button>
                </div>
                <div className="deen-todo-list">
                  {currentDay.todos.map(todo => (
                    <div key={todo.id} className={`deen-todo-item ${todo.completed ? 'completed' : ''}`} onClick={() => toggleTodo(todo.id)}>
                      <div className="check-box">
                        {todo.completed && <Check size={16} />}
                      </div>
                      <span>{todo.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="spiritual-inputs">
                <div className="input-group">
                  <h4>Spiritual Reflection</h4>
                  <textarea 
                    placeholder="Today's reflections..."
                    value={currentDay.reflection}
                    onChange={(e) => updateDay({ reflection: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="deen-stats">
            <Card className="mini-stat" accentColor="var(--pastel-sky)">
              <Heart className="heart-icon" />
              <div className="stat-info">
                <span className="stat-val">{Object.values(deenData).filter(d => d.fajr && d.dhuhr && d.asr && d.maghrib && d.isha).length}</span>
                <span className="stat-lbl">Full Prayer Days</span>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card title="Spiritual History" subtitle="Review your journey" accentColor="var(--pastel-peach)">
          <div className="deen-history">
            {Object.values(deenData).sort((a,b) => b.date.localeCompare(a.date)).map(day => (
              <div key={day.date} className="history-day-card">
                <header>{day.date}</header>
                <div className="history-prayers">
                  {prayers.map(p => (
                    <span key={p.id} className={day[p.id as keyof DeenDay] ? 'active' : ''}>{p.label}</span>
                  ))}
                </div>
                {day.todos?.length > 0 && (
                  <div className="history-todos">
                    {day.todos.map((t: any) => (
                      <div key={t.id} className="history-todo-mini">
                        {t.completed ? <Check size={12} /> : null} {t.text}
                      </div>
                    ))}
                  </div>
                )}
                {day.reflection && <p className="history-reflection">"{day.reflection}"</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeenJournal;
