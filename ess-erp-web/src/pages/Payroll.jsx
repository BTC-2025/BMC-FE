import { useState, useEffect } from "react";
import { payrollApi } from "../services/essApi";
import { useAuth } from "../context/AuthContext";
import MonthSelector from "../components/inputs/MonthSelector";
import SalaryBreakdown from "../components/cards/SalaryBreakdown";
import PayslipHistoryTable from "../components/tables/PayslipHistoryTable";
import PayrollStatCard from "../components/cards/PayrollStatCard";
import jsPDF from "jspdf";

export default function Payroll() {
  const { employee } = useAuth();
  const [payrollList, setPayrollList] = useState([]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee?.id) return;
    loadPayroll();
  }, [employee]);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const res = await payrollApi.getMyPayroll(employee.id);
      setPayrollList(res.data);
    } catch (err) {
      console.error("Failed to load payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedPayroll = payrollList.find((p) => p.period === month || p.month === month);

  // Build breakdown from backend data
  const breakdownData = selectedPayroll
    ? {
        basic: parseFloat(selectedPayroll.gross || 0) * 0.6,
        hra: parseFloat(selectedPayroll.gross || 0) * 0.25,
        transport: parseFloat(selectedPayroll.gross || 0) * 0.15,
        medical: 0,
        tax: parseFloat(selectedPayroll.gross || 0) - parseFloat(selectedPayroll.net || 0),
        pf: 0,
      }
    : null;

  const gross = selectedPayroll ? parseFloat(selectedPayroll.gross || 0) : 0;
  const net = selectedPayroll ? parseFloat(selectedPayroll.net || 0) : 0;
  const deductions = gross - net;

  const generatePDF = (payrollItem) => {
    if (!payrollItem) return;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("EXECUTIVE ERP", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text(`PAYSLIP - ${payrollItem.period || payrollItem.month}`, 105, 30, { align: "center" });
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Employee: ${employee?.name || "Employee"}`, 20, 45);
    doc.text(`Role: ${employee?.role || "-"}`, 20, 52);
    doc.text(`Period: ${payrollItem.period || payrollItem.month}`, 20, 59);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 70, 170, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("Description", 25, 77);
    doc.text("Amount", 160, 77);

    let y = 90;
    doc.text("Gross Salary", 25, y); doc.text(`$${parseFloat(payrollItem.gross || 0).toLocaleString()}`, 160, y); y += 10;
    doc.text("Deductions", 25, y); doc.text(`-$${(parseFloat(payrollItem.gross || 0) - parseFloat(payrollItem.net || 0)).toLocaleString()}`, 160, y); y += 10;

    doc.line(20, y, 190, y); y += 8;
    doc.setFontSize(13);
    doc.text("NET SALARY", 25, y);
    doc.text(`$${parseFloat(payrollItem.net || 0).toLocaleString()}`, 160, y);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated document.", 105, 280, { align: "center" });
    doc.save(`Payslip-${payrollItem.period || payrollItem.month}.pdf`);
  };

  const months = [...new Set(payrollList.map((p) => p.period || p.month))];

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Payroll & Payslips</h1>
          <p className="text-gray-500 mt-2 text-lg">Detailed salary insights and payment history.</p>
        </div>
        <button
          onClick={() => generatePDF(selectedPayroll)}
          disabled={!selectedPayroll}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading payroll data…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PayrollStatCard title="Net Salary" value={net} color="text-green-600" bg="bg-green-50/50" />
            <PayrollStatCard title="Gross Salary" value={gross} color="text-blue-600" bg="bg-blue-50/50" />
            <PayrollStatCard title="Total Deductions" value={deductions} color="text-red-600" bg="bg-red-50/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900">Statement Period</h3>
                <MonthSelector month={month} setMonth={setMonth} />
              </div>
              {breakdownData ? (
                <SalaryBreakdown data={breakdownData} />
              ) : (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-400 text-sm">
                  No payroll data for this period
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <PayslipHistoryTable
                months={months}
                onDownload={(m) => {
                  const found = payrollList.find((p) => (p.period || p.month) === m);
                  if (found) generatePDF(found);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
