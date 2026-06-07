import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, BookOpen, ShoppingCart, StickyNote, Utensils, Sparkles, Heart, Bookmark, Sun, Moon } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('life-labs-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('life-labs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/todo', icon: CheckSquare, label: 'To-Do' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/shopping', icon: ShoppingCart, label: 'Shopping' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
    { path: '/recipes', icon: Utensils, label: 'Recipes' },
    { path: '/skincare', icon: Sparkles, label: 'Skincare' },
    { path: '/deen', icon: Heart, label: 'Deen' },
    { path: '/resources', icon: Bookmark, label: 'Resources' },
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar__logo">
          <h1>LifeLabs</h1>
        </div>
        <ul className="sidebar__nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`sidebar__link ${location.pathname === item.path ? 'sidebar__link--active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <header className="content__header">
          <div className="content__header-left">
            <h2>{navItems.find(i => i.path === location.pathname)?.label || 'Page'}</h2>
          </div>
          <div className="content__header-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        <div className="content__body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
