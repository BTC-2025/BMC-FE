import { createPortal } from "react-dom";
import { formatNumber } from "../../utils/formatters";
import logo from "../../assets/logo.png";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { useFinance } from "../../context/FinanceContext";

export default function InvoiceTemplate({ invoice, onClose }) {
  const { downloadInvoicePDF, downloadBillPDF } = useFinance();
  const contentRef = useRef(null);
  if (!invoice) return null;

  const handleCloudDownload = () => {
    if (invoice.type === "Purchasing") {
      downloadBillPDF(invoice.id);
    } else {
      downloadInvoicePDF(invoice.id);
    }
  };

  const handleExport = () => {
    const element = contentRef.current;
    if (!element) return;

    // Standard options for high-quality PDF
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${invoice.type === "Purchasing" ? "Bill" : "Invoice"}_${invoice.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // Use the standard html2pdf worker pattern
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .catch((err) => {
          console.error("PDF Promise failed:", err);
          window.print();
        });
    } catch (error) {
      console.error("PDF Export Exception:", error);
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-[10000] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div
        ref={contentRef}
        className="bg-white w-full max-w-[900px] h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 ring-1 ring-black/5 printable-content"
      >
        {/* Close Button - Hidden in print */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all z-[110] no-print"
        >
          ✕
        </button>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar (Light Blue) */}
          <div className="w-[280px] bg-[#e9f4ff] p-10 flex flex-col shrink-0 text-left">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-sm border border-white p-4">
              <img
                src={logo}
                alt="BTC Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-8">
              <section className="text-left">
                <h3 className="text-xl font-[1000] text-gray-900 tracking-tighter leading-none mb-4">
                  BTC Enterprise
                </h3>
                <div className="space-y-1.5 text-[11px] font-[700] text-gray-500 uppercase tracking-widest leading-relaxed">
                  <p>123 Corporate Way</p>
                  <p>Silicon Valley, CA 94025</p>
                  <p>+1 (800) BTC-CORP</p>
                  <p>www.btc-enterprise.com</p>
                  <p>billing@btc.com</p>
                </div>
              </section>

              <div className="pt-20">
                <p className="text-[10px] font-black text-[#195bac] uppercase tracking-[0.4em] mb-4">
                  Fiscal Node
                </p>
                <div className="w-12 h-1 bg-[#195bac] rounded-full opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 bg-white p-12 overflow-y-auto scrollbar-hide flex flex-col">
            {/* Top Header Section */}
            <div className="flex justify-between items-start mb-16 text-left">
              <div className="bg-[#195bac] px-10 py-4 rounded-xl">
                <h1 className="text-3xl font-[1000] text-white tracking-[0.2em] uppercase">
                  {invoice.type === "Purchasing" ? "Bill" : "Invoice"}
                </h1>
              </div>

              <div className="space-y-6 text-right pt-2 border-t border-gray-100 min-w-[200px]">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest translate-y-[-4px]">
                    Date
                  </span>
                  <span className="text-sm font-[1000] text-gray-900 tracking-tighter border-b border-gray-200 pb-1 flex-1 ml-6">
                    {invoice.date}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest translate-y-[-4px]">
                    Invoice No
                  </span>
                  <span className="text-sm font-[1000] text-gray-900 tracking-tighter border-b border-gray-200 pb-1 flex-1 ml-6">
                    {invoice.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill To / Ship To Section */}
            <div className="grid grid-cols-2 gap-12 mb-16">
              <div className="text-left">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 pb-2">
                  Bill To
                </h4>
                <div className="space-y-1 text-sm font-[900] text-gray-900 tracking-tight">
                  <p className="text-[#195bac] font-[1000]">{invoice.target}</p>
                  <p className="text-gray-500 font-bold text-xs">
                    Primary Commercial Entity
                  </p>
                  <p className="text-gray-400 text-xs font-medium mt-2">
                    External Settlement Lane
                  </p>
                </div>
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-100 pb-2">
                  Ship To
                </h4>
                <div className="space-y-1 text-sm font-[900] text-gray-900 tracking-tight">
                  <p className="text-gray-900">{invoice.target}</p>
                  <p className="text-gray-500 font-bold text-xs">
                    Resource Destination Node
                  </p>
                </div>
              </div>
            </div>

            {/* Item Table */}
            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#195bac] text-white">
                    <th className="px-6 py-4 text-[10px] font-black text-left uppercase tracking-[0.3em] rounded-l-lg lg:w-3/5">
                      Description
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-center uppercase tracking-[0.3em]">
                      Qty
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-center uppercase tracking-[0.3em]">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-right uppercase tracking-[0.3em] rounded-r-lg">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-6 text-left">
                      <p className="text-sm font-[1000] text-gray-900 tracking-tight">
                        {invoice.type || "Professional"} Services - Standard
                        Retainer
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                        Digital Asset Management & Settlement
                      </p>
                    </td>
                    <td className="px-4 py-6 text-center text-sm font-bold text-gray-900">
                      01
                    </td>
                    <td className="px-4 py-6 text-center text-sm font-bold text-gray-900">
                      ${formatNumber(invoice.amount)}
                    </td>
                    <td className="px-6 py-6 text-right text-sm font-[1000] text-gray-900">
                      ${formatNumber(invoice.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-between items-start mt-auto">
              <div className="max-w-[300px] text-left">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                  Remarks / Instructions
                </h4>
                <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                  Payment is due within 30 days. Please include the invoice
                  number in your bank transfer memo to ensure automated
                  reconciliation.
                </p>
              </div>

              <div className="w-[300px] space-y-3">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-gray-900 tracking-tighter">
                    ${formatNumber(invoice.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Tax Rate
                  </span>
                  <span className="text-sm font-bold text-gray-900 tracking-tighter">
                    10.00%
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 italic">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Tax Total
                  </span>
                  <span className="text-sm font-bold text-gray-900 tracking-tighter">
                    ${formatNumber((invoice.amount || 0) * 0.1)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#e9f4ff] p-6 rounded-2xl shadow-sm border border-[#195bac]/10 mt-6 group hover:translate-x-[-8px] transition-transform duration-500">
                  <span className="text-[11px] font-[1000] text-gray-900 uppercase tracking-[0.2em]">
                    Balance Due
                  </span>
                  <span className="text-2xl font-[1000] text-[#195bac] tracking-tighter">
                    $
                    {formatNumber(
                      (invoice.amount || 0) + (invoice.amount || 0) * 0.1,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-20 flex justify-between gap-20">
              <div className="flex-1 text-center">
                <div className="border-t border-gray-900 pt-3">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">
                    Company Signature
                  </p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="border-t border-gray-900 pt-3">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">
                    Client Signature
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar - Hidden in print */}
        <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-100 no-print action-bar">
          <button
            onClick={handleCloudDownload}
            className="px-8 py-4 bg-[#195bac] text-white rounded-[20px] text-[11px] font-[1000] uppercase tracking-[0.2em] hover:bg-[#111827] transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Download Cloud PDF
          </button>
          <button
            onClick={handleExport}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:text-[#195bac] hover:border-[#195bac] transition-all flex items-center gap-2"
          >
            Local Capture
          </button>
          <button
            onClick={handlePrint}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-500 transition-all flex items-center gap-2"
          >
            Physical Print
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
