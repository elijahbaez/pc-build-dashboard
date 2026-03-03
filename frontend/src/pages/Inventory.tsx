import { useEffect, useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface Component {
  id: number;
  name: string;
  category: string;
  price: string; 
  stock_quantity: number;
}

type SortKey = 'price' | 'stock_quantity' | null;
type SortDirection = 'asc' | 'desc' | null;

export default function Inventory() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New state for filtering and sorting
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection }>({ key: null, direction: null });

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        setComponents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setLoading(false);
      });
  }, []);

  // Dynamically get unique categories for the dropdown
  const categories = ['All', ...new Set(components.map(item => item.category))];

  // Handle the sorting logic
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // useMemo ensures we only recalculate this when the data, filter, or sort changes
  const processedComponents = useMemo(() => {
    let result = [...components];

    // 1. Apply Filter
    if (filterCategory !== 'All') {
      result = result.filter(item => item.category === filterCategory);
    }

    // 2. Apply Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Parse string to float for price, otherwise use stock as integer
        const valA = sortConfig.key === 'price' ? parseFloat(a.price) : a.stock_quantity;
        const valB = sortConfig.key === 'price' ? parseFloat(b.price) : b.stock_quantity;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [components, filterCategory, sortConfig]);

  // Helper to render the correct sort icon
  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-slate-500 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-blue-400" /> : <ChevronDown size={14} className="text-blue-400" />;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Management</h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading inventory...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-900 text-white select-none">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Component Name
                </th>
                
                {/* Category Header with Dropdown */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-3">
                    CATEGORY
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-xs outline-none cursor-pointer focus:border-blue-400 transition-colors"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </th>
                
                {/* Clickable Price Header */}
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors group"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    PRICE {renderSortIcon('price')}
                  </div>
                </th>
                
                {/* Clickable Stock Header */}
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors group"
                  onClick={() => handleSort('stock_quantity')}
                >
                  <div className="flex items-center gap-2">
                    STOCK {renderSortIcon('stock_quantity')}
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {processedComponents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                    No components found in this category.
                  </td>
                </tr>
              ) : (
                processedComponents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">${item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        item.stock_quantity > 0 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {item.stock_quantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}