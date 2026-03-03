import { useEffect, useState, useMemo } from 'react';
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
import { Settings2, X } from 'lucide-react';

interface Benchmark {
  id: number;
  client_name: string;
  cpu_temp_load: number;
  gpu_temp_load: number;
}

// Custom component to break the text onto multiple horizontal lines
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const name = payload.value;
  
  let line1 = name;
  let line2 = "";
  
  // Logic to split the string. 
  // If it's a standard build, split it right before the parenthesis.
  if (name.includes(" (")) {
    const split = name.indexOf(" (");
    line1 = name.substring(0, split);
    line2 = name.substring(split);
  } else if (name.includes(" ")) {
    // For custom named builds like "Kappa Ultimate", split at the first space.
    const split = name.indexOf(" ");
    line1 = name.substring(0, split);
    line2 = name.substring(split + 1);
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Darker color (slate-700), horizontal textAnchor, slightly bolder */}
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#334155" fontSize={11} fontWeight={600}>
        <tspan x="0" dy="0">{line1}</tspan>
        {line2 && <tspan x="0" dy="16">{line2}</tspan>}
      </text>
    </g>
  );
};

export default function Benchmarks() {
  const [data, setData] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [preset, setPreset] = useState<string>('5'); // Defaulting to 5 so labels have plenty of room

  useEffect(() => {
    fetch('http://localhost:5000/api/benchmarks')
      .then((res) => res.json())
      .then((benchData) => {
        setData(benchData);
        // Default to showing the last 5 builds
        const last5 = benchData.slice(-5).map((b: Benchmark) => b.id);
        setVisibleIds(last5);
        setLoading(false);
      });
  }, []);

  const handlePresetChange = (val: string) => {
    setPreset(val);
    if (val === 'all') {
      setVisibleIds(data.map(b => b.id));
    } else if (val !== 'custom') {
      const num = parseInt(val, 10);
      setVisibleIds(data.slice(-num).map(b => b.id));
    }
  };

  const toggleBuild = (id: number) => {
    setPreset('custom');
    setVisibleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const removeBuild = (id: number) => {
    setPreset('custom');
    setVisibleIds(prev => prev.filter(v => v !== id));
  };

  const chartData = useMemo(() => {
    return data.filter(b => visibleIds.includes(b.id));
  }, [data, visibleIds]);

  return (
    <div className="h-full flex flex-col pb-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Thermal Performance Trends</h1>
      <p className="text-gray-500 mb-6">Interactive historical analysis of peak CPU and GPU load temperatures.</p>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading thermal data...</p>
      ) : (
        <>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Settings2 size={18} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Compare Count:</span>
              <select
                value={preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors cursor-pointer w-full md:w-auto"
              >
                <option value="5">Last 5 Builds</option>
                <option value="10">Last 10 Builds</option>
                <option value="20">Last 20 Builds</option>
                <option value="all">All 41 Builds</option>
                <option value="custom">Custom Selection</option>
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Add/Remove Build:</span>
              <select
                value=""
                onChange={(e) => toggleBuild(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors cursor-pointer w-full md:max-w-[250px]"
              >
                <option value="" disabled>+ Select a specific build...</option>
                {data.map(b => (
                  <option key={b.id} value={b.id}>
                    {visibleIds.includes(b.id) ? '✓ Remove: ' : 'Add: '} {b.client_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {preset === 'custom' && (
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100 min-h-[48px]">
              {chartData.length === 0 && <span className="text-sm text-slate-400 italic py-1 px-2">No builds selected. Select builds from the dropdown above.</span>}
              {chartData.map(b => (
                <span key={b.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200 transition-all hover:bg-blue-200 shadow-sm">
                  {b.client_name}
                  <button onClick={() => removeBuild(b.id)} className="hover:text-red-500 focus:outline-none transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-h-[550px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Reduced bottom margin since labels are horizontal and shorter now */}
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                
                {/* Replaced standard XAxis label with our new Custom component */}
                <XAxis 
                  dataKey="client_name" 
                  tick={<CustomXAxisTick />}
                  tickMargin={15}
                  interval={0}
                />
                
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  domain={[30, 90]}
                  label={{ value: 'Peak Temperature (°C)', angle: -90, position: 'insideLeft', style: {fill: '#64748b'} }} 
                />
                
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                
                <Legend wrapperStyle={{ top: -10 }} />
                
                <Bar 
                  dataKey="cpu_temp_load" 
                  name="CPU Load (°C)" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={45} 
                  animationDuration={800} 
                />
                <Bar 
                  dataKey="gpu_temp_load" 
                  name="GPU Load (°C)" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={45} 
                  animationDuration={800} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}