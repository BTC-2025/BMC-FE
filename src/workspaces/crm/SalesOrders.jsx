import { useCRM } from "../../context/CRMContext";

export default function CRMSalesOrdersView() {
  const { salesOrders, loading } = useCRM();

  return (
    <div className="p-10 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-heading text-[#111827] tracking-tighter leading-none">
            Commercial Orders
          </h2>
          <p className="text-[11px] font-black font-subheading text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Bridged from Supply Chain Management (SCM)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Order Ref
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Customer Node
              </th>
              <th className="px-8 py-6 text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Valuation
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black font-subheading text-[#9CA3AF] uppercase tracking-[0.2em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salesOrders.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="4"
                  className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                >
                  No active sales orders detected in sync bridge
                </td>
              </tr>
            )}
            {salesOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-8 py-6">
                  <div className="font-mono text-[11px] font-black text-[#1E293B] px-3 py-1.5 bg-gray-50 rounded-xl inline-block border border-gray-100 uppercase tracking-tighter">
                    SO-{order.id.toString().padStart(4, "0")}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[14px] font-black font-heading text-[#111827]">
                    {order.customer_name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                    Handoff: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="text-[14px] font-[1000] font-heading text-[#195bac] tabular-nums">
                    ${order.total_amount?.toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span
                    className={`px-4 py-2 rounded-xl text-[10px] font-black font-subheading uppercase tracking-[0.2em] shadow-sm border
                                ${
                                  order.status === "FULFILLED"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                                    : order.status === "PENDING"
                                      ? "bg-amber-50 text-amber-600 border-amber-100/50"
                                      : "bg-blue-50 text-blue-600 border-blue-100/50"
                                }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
