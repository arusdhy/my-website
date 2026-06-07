import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import TodoList from './pages/TodoList/TodoList';
import Journal from './pages/Journal/Journal';
import ShoppingList from './pages/ShoppingList/ShoppingList';
import Notes from './pages/Notes/Notes';
import DeenJournal from './pages/DeenJournal/DeenJournal';
import Recipes from './pages/Recipes/Recipes';
import SkincareJournal from './pages/SkincareJournal/SkincareJournal';
import Resources from './pages/Resources/Resources';
import CalendarView from './pages/Calendar/CalendarView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/skincare" element={<SkincareJournal />} />
          <Route path="/deen" element={<DeenJournal />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
