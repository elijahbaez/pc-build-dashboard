import { useEffect, useState } from 'react';

// Define the shape of our data so TypeScript can catch errors
interface Component {
  id: number;
  name: string;
  category: string;
  price: string; 
  stock_quantity: number;
}

export default function Inventory() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the page loads to fetch the data
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventory Management</h1>
      
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading inventory...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Component Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {components.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}