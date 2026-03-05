// RRentals Web Application - Main App Component
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AIChatBot from './components/AIChatBot';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import VehicleDetail from './pages/VehicleDetail';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="relative">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* AI Chat Bot */}
      <AIChatBot />
    </div>
  );
}

export default App;
