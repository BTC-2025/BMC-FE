import { useFinance } from "../../context/FinanceContext";
import { formatNumber } from "../../utils/formatters";

export default function AssetCategories() {
  const { assets } = useFinance();
  
  // Define category icons
  const categoryIcons = {
    "IT Hardware": "💻",
    "Networking": "🌐",
    "Furniture": "🪑",
    "Vehicles": "🚛",
    "Machinery": "⚙️",
    "Equipment": "🔧",
    "Default": "📦"
  };

  // Group assets by category and calculate totals
  const categoryStats = assets.reduce((acc, asset) => {
    const category = asset.category || "Other";
    if (!acc[category]) {
      acc[category] = {
        name: category,
        count: 0,
        value: 0,
        icon: categoryIcons[category] || categoryIcons["Default"]
      };
    }
    acc[category].count += 1;
    acc[category].value += parseFloat(asset.value || 0);
    return acc;
  }, {});

  const categories = Object.values(categoryStats);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black text-[#111827] tracking-tighter">Asset Categories</h2>
           <p className="text-gray-400 font-bold mt-2">Distribution of physical assets by type</p>
        </div>
        {/* Placeholder for future functionality or navigation to Inventory > Categories */}
        <button className="bg-[#195bac] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Manage Categories
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat.name} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h4 className="text-lg font-black text-gray-900">{cat.name}</h4>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
                  <p className="text-sm font-black text-gray-900">${formatNumber(cat.value)}</p>
                </div>
                <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{cat.count} Items</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📂</div>
            <h3 className="text-xl font-black text-gray-900">No Categories Found</h3>
            <p className="text-gray-400 font-bold mt-2 max-w-md mx-auto">Asset categories are automatically generated when you add assets with specific types. Go to the Asset Registry to add your first asset.</p>
          </div>
        )}
      </div>
    </div>
  );
}
