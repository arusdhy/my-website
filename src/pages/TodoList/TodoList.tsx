import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { Plus, Trash2, ArrowRight, CheckCircle, Circle, History, List } from 'lucide-react';
import './TodoList.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO date string
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('life-labs-todos', []);
  const [inputValue, setInputValue] = useState('');
  const [view, setView] = useState<'today' | 'history'>('today');
  
  const today = new Date().toISOString().split('T')[0];
  
  const currentTodos = todos.filter(todo => todo.date === today);
  const pastTodos = todos.filter(todo => todo.date !== today).sort((a, b) => b.date.localeCompare(a.date));

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      date: today
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const deferTodo = (id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, date: tomorrowStr } : todo
    ));
  };

  return (
    <div className="todo-page">
      <div className="todo-tabs">
        <button className={`tab ${view === 'today' ? 'active' : ''}`} onClick={() => setView('today')}>
          <List size={18} /> Today
        </button>
        <button className={`tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
          <History size={18} /> History
        </button>
      </div>

      {view === 'today' ? (
        <Card title="Today's Tasks" subtitle="What's on your mind for today?" accentColor="var(--pastel-blush)">
          <form className="todo-input-group" onSubmit={addTodo}>
            <input 
              type="text" 
              placeholder="Add a new task..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="add-btn">
              <Plus size={20} />
            </button>
          </form>

          <div className="todo-list">
            {currentTodos.length === 0 ? (
              <p className="empty-state">No tasks for today. Enjoy your day!</p>
            ) : (
              currentTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <button className="toggle-btn" onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <span className="todo-text">{todo.text}</span>
                  <div className="todo-actions">
                    <button className="action-btn defer-btn" title="Defer to tomorrow" onClick={() => deferTodo(todo.id)}>
                      <ArrowRight size={18} />
                    </button>
                    <button className="action-btn delete-btn" title="Delete" onClick={() => deleteTodo(todo.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      ) : (
        <Card title="Task History" subtitle="Review your past productivity" accentColor="var(--text-secondary)">
          <div className="todo-history">
            {pastTodos.length === 0 ? (
              <p className="empty-state">No past tasks found.</p>
            ) : (
              // Group by date
              Object.entries(pastTodos.reduce((acc, todo) => {
                if (!acc[todo.date]) acc[todo.date] = [];
                acc[todo.date].push(todo);
                return acc;
              }, {} as Record<string, Todo[]>)).map(([date, dateTodos]) => (
                <div key={date} className="history-group">
                  <h4 className="history-date-label">{date}</h4>
                  {dateTodos.map(todo => (
                    <div key={todo.id} className="history-item-row">
                      {todo.completed ? <CheckCircle size={16} className="done" /> : <Circle size={16} />}
                      <span>{todo.text}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TodoList;
