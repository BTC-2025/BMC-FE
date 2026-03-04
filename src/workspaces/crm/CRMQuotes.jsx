import { useState, useEffect } from "react";
import { useCRM } from "../../context/CRMContext";
import { inventoryApi } from "../../services/inventoryApi";

export default function CRMQuotes() {
  const { quotes, deals, customers, addQuote, updateQuoteStatus, isLoading } =
    useCRM();
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    deal_id: "",
    customer_id: "",
    valid_until: null,
    items: [],
  });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const res = await inventoryApi.getItems();
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory items", err);
    }
  };

  const addItemToQuote = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { item_id: "", quantity: 1, unit_price: 0, subtotal: 0 },
      ],
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === "item_id") {
      const selectedItem = items.find((i) => i.id === parseInt(value));
      if (selectedItem) {
        newItems[index].unit_price = selectedItem.valuation_rate || 0;
      }
    }

    newItems[index].subtotal =
      newItems[index].quantity * newItems[index].unit_price;

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        deal_id: formData.deal_id ? parseInt(formData.deal_id) : null,
        customer_id: formData.customer_id
          ? parseInt(formData.customer_id)
          : null,
        valid_until: formData.valid_until || null,
        items: formData.items.map((item) => ({
          ...item,
          item_id: parseInt(item.item_id),
        })),
      };
      await addQuote(payload);
      setShowModal(false);
      setFormData({
        deal_id: "",
        customer_id: "",
        valid_until: null,
        items: [],
      });
    } catch (err) {
      // Error handled by context
    }
  };

  const totalAmount = formData.items.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto scrollbar-hide">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-[1000] font-heading text-gray-900 tracking-tightest uppercase mb-2">
            Quotations
          </h1>
          <p className="text-xs font-black font-subheading text-gray-400 uppercase tracking-widest">
            Commercial Proposals & Estimates
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-[#195bac] text-white rounded-2xl font-black font-subheading text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Create New Quote
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                ID / Date
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                Entity
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                Amount
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="hover:bg-white/40 transition-colors group"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black font-heading text-gray-900 tracking-tight">
                      Q-{quote.id.toString().padStart(4, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight">
                      {quote.deal_id
                        ? `Deal: ${deals.find((d) => d.id === quote.deal_id)?.title}`
                        : quote.customer_id
                          ? `Customer: ${customers.find((c) => c.id === quote.customer_id)?.company_name}`
                          : "General"}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black font-heading text-[#195bac] tracking-tighter">
                    ${parseFloat(quote.total_amount).toLocaleString()}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black font-subheading uppercase tracking-widest
                    ${
                      quote.status === "ACCEPTED"
                        ? "bg-emerald-100 text-emerald-600"
                        : quote.status === "REJECTED"
                          ? "bg-rose-100 text-rose-600"
                          : quote.status === "SENT"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    {quote.status === "DRAFT" && (
                      <button
                        onClick={() => updateQuoteStatus(quote.id, "SENT")}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors font-bold text-[10px] uppercase tracking-tighter"
                      >
                        Send
                      </button>
                    )}
                    {quote.status === "SENT" && (
                      <>
                        <button
                          onClick={() =>
                            updateQuoteStatus(quote.id, "ACCEPTED")
                          }
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors font-bold text-[10px] uppercase tracking-tighter"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateQuoteStatus(quote.id, "REJECTED")
                          }
                          className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors font-bold text-[10px] uppercase tracking-tighter"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-xs font-black text-gray-400 uppercase tracking-[0.2em]"
                >
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-[1000] font-heading text-gray-900 tracking-tightest uppercase">
                  New Quotation
                </h2>
                <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mt-1">
                  Professional Sales Proposal
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide"
            >
              <div className="grid grid-cols-2 gap-8 font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Link to Deal (Optional)
                  </label>
                  <select
                    value={formData.deal_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deal_id: e.target.value,
                        customer_id: "",
                      })
                    }
                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#195bac] outline-none transition-all"
                  >
                    <option value="">Select a Deal</option>
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Or Select Customer
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_id: e.target.value,
                        deal_id: "",
                      })
                    }
                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#195bac] outline-none transition-all"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Quote Expiry (Valid Until)
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#195bac] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black font-subheading text-[#195bac] uppercase tracking-widest">
                    Line Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItemToQuote}
                    className="px-4 py-2 bg-blue-50 text-[#195bac] rounded-xl font-black font-subheading text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-2xl"
                    >
                      <div className="col-span-4">
                        <select
                          value={item.item_id}
                          onChange={(e) =>
                            updateItem(idx, "item_id", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white border-0 rounded-xl text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Product/Service</option>
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              "quantity",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 bg-white border-0 rounded-xl text-xs text-center font-bold outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              "unit_price",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 bg-white border-0 rounded-xl text-xs text-center font-bold outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-xs font-black text-gray-900 tracking-tight">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="col-span-1 text-rose-500 hover:text-rose-700 font-black text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.items.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      Click "Add Item" to start building your quote
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] font-black font-subheading text-gray-400 uppercase tracking-widest mb-1">
                    Total Quote Amount
                  </p>
                  <p className="text-4xl font-[1000] font-heading text-[#195bac] tracking-tightest">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formData.items.length === 0}
                    className="px-10 py-4 bg-[#195bac] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                    Save Quotation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
