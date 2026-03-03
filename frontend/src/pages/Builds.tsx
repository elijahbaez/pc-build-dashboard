import { useEffect, useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';

interface Build {
  id: number;
  client_name: string;
  build_date: string;
  total_cost: string;
  notes: string;
}

export default function Builds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/builds')
      .then((res) => res.json())
      .then((data) => {
        setBuilds(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Client Builds</h1>
      <p className="text-gray-500 mb-8">Recent custom configurations assembled and delivered.</p>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading builds...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {builds.map((build) => (
            <div key={build.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Build Image */}
              <div className="h-56 overflow-hidden relative bg-slate-900">
                <img 
                  src="/my-build.png" 
                  alt="Custom PC Build" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                  Shipped
                </div>
              </div>
              
              {/* Build Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{build.client_name}</h3>
                <p className="text-gray-600 text-sm mb-4 h-10">{build.notes}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={16} className="mr-2" />
                    {new Date(build.build_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-green-600 font-bold">
                    <DollarSign size={16} />
                    {parseFloat(build.total_cost).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}