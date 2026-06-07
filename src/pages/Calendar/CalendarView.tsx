import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../../components/shared/Card/Card';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import './CalendarView.css';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color: string;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('life-labs-events', []);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvenTitle, setNewEventTitle] = useState('');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(d.toLocaleDateString('en-CA'));
    setShowAddEvent(true);
  };

  const addEvent = () => {
    if (!newEvenTitle.trim() || !selectedDate) return;
    
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newEvenTitle,
      date: selectedDate,
      color: 'var(--pastel-sky)'
    };
    
    setEvents([...events, event]);
    setNewEventTitle('');
    setShowAddEvent(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let d = 1; d <= numDays; d++) {
    const dateStr = new Date(year, month, d).toLocaleDateString('en-CA');
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    
    days.push(
      <div key={d} className={`calendar-day ${isToday ? 'today' : ''}`} onClick={() => handleDayClick(d)}>
        <span className="day-number">{d}</span>
        <div className="day-events">
          {dayEvents.map(e => (
            <div key={e.id} className="event-dot" style={{ backgroundColor: e.color }} title={e.title}></div>
          ))}
        </div>
      </div>
    );
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="calendar-page">
      <div className="calendar-main">
        <Card accentColor="var(--pastel-sage)">
          <div className="calendar-header">
            <h3>{monthName} {year}</h3>
            <div className="calendar-nav">
              <button onClick={prevMonth}><ChevronLeft size={20} /></button>
              <button onClick={nextMonth}><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="calendar-grid-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="weekday">{d}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {days}
          </div>
        </Card>
      </div>
      
      <div className="calendar-side">
        {showAddEvent && selectedDate && (
          <Card title="Add Event" subtitle={selectedDate} accentColor="var(--pastel-sky)">
            <div className="event-form">
              <input 
                placeholder="What's happening?" 
                value={newEvenTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              />
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowAddEvent(false)}>Cancel</button>
                <button className="save-btn" onClick={addEvent}>Add</button>
              </div>
            </div>
          </Card>
        )}

        <Card title="Upcoming Events" subtitle="What's on your schedule" accentColor="var(--pastel-sky)">
          <div className="events-list">
            {events.filter(e => new Date(e.date) >= new Date()).sort((a,b) => a.date.localeCompare(b.date)).map(event => (
              <div key={event.id} className="event-item">
                <div className="event-info">
                  <span className="event-date">{event.date}</span>
                  <span className="event-title">{event.title}</span>
                </div>
                <button className="del-btn" onClick={() => deleteEvent(event.id)}><Trash2 size={16} /></button>
              </div>
            ))}
            {events.length === 0 && <p className="empty-events">No events scheduled yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
