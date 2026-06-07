import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Calendar, BookOpen, ShoppingCart, StickyNote, Utensils, Sparkles, Heart, Bookmark } from 'lucide-react';
import Card from '../../components/shared/Card/Card';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const yesterdayDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  const summaryData = useMemo(() => {
    let todos = [];
    let journalEntries = [];
    
    try {
      const todosStr = localStorage.getItem('life-labs-todos');
      const journalStr = localStorage.getItem('life-labs-journal');
      todos = todosStr ? JSON.parse(todosStr) : [];
      journalEntries = journalStr ? JSON.parse(journalStr) : [];
    } catch (e) {
      console.error("Error parsing summary data", e);
    }
    
    const yesterdayTodos = Array.isArray(todos) ? todos.filter((t: any) => t.date === yesterdayDate) : [];
    const completedYesterday = yesterdayTodos.filter((t: any) => t.completed).length;
    
    const yesterdayJournal = Array.isArray(journalEntries) ? journalEntries.find((e: any) => e.date === yesterdayDate) : null;
    const journalSnippet = yesterdayJournal 
      ? yesterdayJournal.content.substring(0, 120) + (yesterdayJournal.content.length > 120 ? '...' : '')
      : "No journal entry for yesterday.";

    return {
      completedCount: completedYesterday,
      totalCount: yesterdayTodos.length,
      journalSnippet
    };
  }, [yesterdayDate]);

  const tiles = [
    { id: 'todo', title: 'Daily To-Do', icon: CheckSquare, color: 'var(--pastel-blush)', path: '/todo' },
    { id: 'calendar', title: 'Calendar', icon: Calendar, color: 'var(--pastel-sage)', path: '/calendar' },
    { id: 'journal', title: 'Daily Journal', icon: BookOpen, color: 'var(--pastel-sky)', path: '/journal' },
    { id: 'shopping', title: 'Shopping List', icon: ShoppingCart, color: 'var(--pastel-peach)', path: '/shopping' },
    { id: 'notes', title: 'Notes', icon: StickyNote, color: 'var(--pastel-mint)', path: '/notes' },
    { id: 'recipes', title: 'Recipes', icon: Utensils, color: 'var(--pastel-lavender)', path: '/recipes' },
    { id: 'skincare', title: 'Skincare Journal', icon: Sparkles, color: 'var(--pastel-blush)', path: '/skincare' },
    { id: 'deen', title: 'Deen Journal', icon: Heart, color: 'var(--pastel-sage)', path: '/deen' },
    { id: 'resources', title: 'Resources', icon: Bookmark, color: 'var(--pastel-sky)', path: '/resources' },
  ];

  return (
    <div className="dashboard">
      <section className="dashboard__summary">
        <Card 
          title="Today Summary" 
          subtitle="Reflections from yesterday & your current focus"
          span={2}
          accentColor="var(--text-primary)"
          className="summary-card"
        >
          <div className="summary-content">
            <div className="summary-section">
              <h4>Yesterday's Reflections</h4>
              <p className="summary-snippet">"{summaryData.journalSnippet}"</p>
            </div>
            <div className="summary-section">
              <h4>Activity Summary</h4>
              <div className="stats">
                <span className="stat-number">{summaryData.completedCount}</span>
                <span className="stat-label">Tasks completed yesterday (out of {summaryData.totalCount})</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="dashboard__grid">
        {tiles.map((tile) => (
          <Card 
            key={tile.id} 
            onClick={() => navigate(tile.path)}
            accentColor={tile.color}
            className="tile-card"
          >
            <div className="tile-content">
              <div className="tile-icon" style={{ backgroundColor: tile.color }}>
                <tile.icon size={24} />
              </div>
              <span className="tile-title">{tile.title}</span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
