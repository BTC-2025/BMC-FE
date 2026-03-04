import { useInventory } from "../../context/InventoryContext";
import { useState } from "react";
import BaseModal from "../../components/ui/BaseModal";
import { formatNumber } from "../../utils/formatters";

export default function ItemMaster() {
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    categories,
    getBarcodeUrl,
  } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Electronics",
    unit: "pcs",
    cost: 0,
    price: 0,
    reorder: 10,
    status: "Active",
  });

  const openBarcode = (p) => {
    setSelectedBarcode(p);
    setShowBarcodeModal(true);
  };

  const openAdd = () => {
    setEditMode(false);
    const firstCat = categories.length > 0 ? categories[0].name : "General";
    setFormData({
      sku: "",
      name: "",
      category: firstCat,
      unit: "pcs",
      cost: 0,
      price: 0,
      reorder: 10,
      status: "Active",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditMode(true);
    setFormData(p);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) updateProduct(formData.sku, formData);
    else addProduct(formData);
    setShowModal(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#111827] tracking-tighter">
            Product Catalog
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#195bac]"></span>
            Asset Management & Inventory Definition
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group min-w-[320px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#195bac] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeWidth="3"
              />
            </svg>
            <input
              type="text"
              placeholder="Filter by SKU or Product Name..."
              className="w-full bg-white border border-gray-200 rounded-[20px] py-4 pl-12 pr-6 text-[13px] font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/50 focus:border-[#195bac] transition-all outline-none placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openAdd}
            className="bg-[#195bac] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] shadow-[0_15px_30px_-10px_rgba(0,97,255,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Asset
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Ref / SKU
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Asset Identity
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Category
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Stock Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Valuation
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr
                    key={p.sku}
                    className="hover:bg-blue-50/20 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-mono text-[11px] font-black text-[#1E293B] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 group-hover:bg-white transition-colors">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[14px] font-black text-[#1E293B]">
                        {p.name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">
                        Serialized Equipment
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <p
                          className={`text-sm font-black ${(p.current_stock || 0) <= (p.reorder_level || 0) ? "text-rose-500" : "text-[#1E293B]"}`}
                        >
                          {p.current_stock || 0}{" "}
                          <span className="text-[10px] font-bold text-gray-400">
                            {p.unit}
                          </span>
                        </p>
                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${(p.current_stock || 0) <= (p.reorder_level || 0) ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{
                              width: `${Math.min(100, ((p.current_stock || 0) / 50) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-sm font-black text-[#1E293B]">
                      ${formatNumber(p.valuation_rate || 0)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button
                          onClick={() => openBarcode(p)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#111827] hover:text-white transition-all shadow-sm"
                          title="View Barcode"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 5v14M8 5v14M11 5v14M14 5v14M17 5v14M20 5v14M3 9h18M3 15h18" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="w-10 h-10 rounded-xl bg-[#195bac]/10 text-[#195bac] flex items-center justify-center hover:bg-[#195bac] hover:text-white transition-all shadow-sm"
                          title="Edit Item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeProduct(p.sku)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete Item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                      No matching assets found in local catalog
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Enterprise Styled */}
      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="max-w-xl"
      >
        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#111827] tracking-tighter">
              {editMode ? "Edit Asset Instance" : "Define New Asset"}
            </h2>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Catalog Configuration Terminal
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm font-black"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-10 grid grid-cols-2 gap-8 bg-white"
        >
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Global Product Identity
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Unique SKU Code
            </label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-[13px] font-mono font-black text-[#1E293B] disabled:opacity-50"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              disabled={editMode}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Asset Category
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none disabled:opacity-50"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={categories.length === 0}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="">No categories defined</option>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Procurement Cost ($)
            </label>
            <input
              type="number"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">
              Commercial Price ($)
            </label>
            <input
              type="number"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-black text-[#1E293B] focus:ring-4 focus:ring-blue-50/30 focus:border-[#195bac] outline-none"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div className="pt-6 col-span-2">
            <button
              type="submit"
              className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 hover:bg-[#000000] active:scale-95"
            >
              {editMode ? "Synchronize Asset Data" : "Initialize Asset Entry"}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Barcode Modal */}
      <BaseModal
        isOpen={showBarcodeModal}
        onClose={() => setShowBarcodeModal(false)}
        className="max-w-md"
      >
        <div className="p-8 border-b border-gray-100 text-left">
          <h2 className="text-xl font-black text-[#111827] tracking-tighter">
            Generated Asset Tag
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Scanning protocol ready
          </p>
        </div>
        <div className="p-10 flex flex-col items-center justify-center bg-white space-y-6">
          {selectedBarcode && (
            <>
              <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner">
                <img
                  src={getBarcodeUrl(selectedBarcode.sku)}
                  alt={`Barcode for ${selectedBarcode.sku}`}
                  className="max-w-full h-auto mix-blend-multiply"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-[1000] text-[#111827] tracking-tighter">
                  {selectedBarcode.name}
                </p>
                <p className="font-mono text-sm font-black text-gray-400 uppercase tracking-widest">
                  {selectedBarcode.sku}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="w-full bg-[#111827] text-white py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all"
              >
                Print Asset Identifier
              </button>
            </>
          )}
        </div>
      </BaseModal>
    </div>
  );
}
