import { useEffect, useState } from 'react';
import { Package, Monitor, DollarSign, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ inventoryTypes: 0, buildCount: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both endpoints simultaneously
    Promise.all([
      fetch('http://localhost:5000/api/inventory').then(res => res.json()),
      fetch('http://localhost:5000/api/builds').then(res => res.json())
    ]).then(([inventory, builds]) => {
      // Calculate total value of all stock
      const value = inventory.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * item.stock_quantity), 0);
      
      setStats({
        inventoryTypes: inventory.length,
        buildCount: builds.length,
        totalValue: value
      });
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching dashboard stats:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Overview</h1>
      <p className="text-gray-500 mb-8">Welcome back. Here is the current status of your operations.</p>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Calculating metrics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unique Components</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.inventoryTypes}</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Monitor size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Client Builds</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.buildCount}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Inventory Value</p>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 4 */}
          <Link to="/benchmarks" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors">View Thermals &rarr;</h3>
            </div>
          </Link>

        </div>
      )}
    </div>
  );
}