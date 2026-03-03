import { useEffect, useState } from 'react';
import { Package, Monitor, DollarSign, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Build {
  id: number;
  client_name: string;
  build_date: string;
  total_cost: string;
  notes: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ inventoryTypes: 0, buildCount: 0, totalValue: 0 });
  const [recentBuilds, setRecentBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded display arrays for the UI
  const buildImages = ['/build1.webp', '/build2.webp', '/build3.webp'];
  const displayPrices = [2999, 3400, 3700];

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/inventory').then(res => res.json()),
      fetch('http://localhost:5000/api/builds').then(res => res.json())
    ]).then(([inventory, builds]) => {
      
      const value = inventory.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * item.stock_quantity), 0);
      
      setStats({
        inventoryTypes: inventory.length,
        buildCount: builds.length,
        totalValue: value
      });
      
      setRecentBuilds(builds.slice(0, 3));
      setLoading(false);
      
    }).catch(err => {
      console.error("Error fetching dashboard stats:", err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Overview</h1>
      <p className="text-gray-500 mb-8">Welcome back. Here is the current status of your operations.</p>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Calculating metrics...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Package size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Unique Components</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.inventoryTypes}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Monitor size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Client Builds</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.buildCount}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Inventory Value</p>
                <h3 className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</h3>
              </div>
            </div>
            <Link to="/benchmarks" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Activity size={24} /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">System Health</p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors">View Thermals &rarr;</h3>
              </div>
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Builds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBuilds.map((build, index) => (
              <div key={build.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                
                {/* Changed to aspect-[4/3] so the images are fully visible! */}
                <div className="aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                  <img 
                    src={buildImages[index]} 
                    alt={build.client_name} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{build.client_name}</h3>
                  <p className="text-gray-500 text-sm mb-4 truncate">{build.notes}</p>
                  <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                    <span className="flex items-center text-gray-400">
                      <Calendar size={14} className="mr-2"/> 
                      {new Date(build.build_date).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-green-600">
                      {/* Using the custom prices array here */}
                      ${displayPrices[index].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}