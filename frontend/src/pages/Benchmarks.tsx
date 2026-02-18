import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Benchmark {
  id: number;
  client_name: string;
  cpu_temp_load: number;
  gpu_temp_load: number;
  benchmark_software: string;
}

export default function Benchmarks() {
  const [data, setData] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/benchmarks')
      .then((res) => res.json())
      .then((benchData) => {
        setData(benchData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching benchmarks:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Thermal Performance Analytics</h1>
      <p className="text-gray-500 mb-8">Comparing peak CPU and GPU load temperatures across client configurations.</p>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading thermal data...</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="client_name" stroke="#6b7280" fontSize={12} />
              <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle'} }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {/* Blue bar for CPU, Red bar for GPU */}
              <Bar dataKey="cpu_temp_load" name="CPU Peak Load (°C)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gpu_temp_load" name="GPU Peak Load (°C)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}