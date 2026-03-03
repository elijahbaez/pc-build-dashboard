import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Server, Wrench, Thermometer } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Builds from './pages/Builds';
import Benchmarks from './pages/Benchmarks';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
        
        <nav className="w-64 bg-black text-white p-6">
          
          {/* Logo Section - Now much larger */}
          <div className="mb-12 flex items-center justify-center">
            <img 
              src="/logo.jpg" 
              alt="ESP Logo" 
              className="w-36 h-auto object-contain" 
            />
          </div>

          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/inventory" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                <Server size={20} /> Inventory
              </Link>
            </li>
            <li>
              <Link to="/builds" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                <Wrench size={20} /> Custom Builds
              </Link>
            </li>
            <li>
              <Link to="/benchmarks" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                <Thermometer size={20} /> Benchmarks
              </Link>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/builds" element={<Builds />} />
            <Route path="/benchmarks" element={<Benchmarks />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}