import { createContext, useContext, useEffect, useState } from "react";
import { financeApi } from "../services/financeApi";
import { useToast } from "./ToastContext";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [pnl, setPnl] = useState({ income: 0, expense: 0, net_profit: 0 });
  const [trialBalance, setTrialBalance] = useState({
    accounts: [],
    total_debit: 0,
    total_credit: 0,
  });
  const [assets, setAssets] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAccounts(),
        fetchInvoices(),
        fetchBills(),
        fetchReports(),
        fetchBankTransactions(),
        fetchPayments(),
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch finance data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    const res = await financeApi.getAccounts();
    setAccounts(res.data);
  };

  const fetchInvoices = async () => {
    const res = await financeApi.getInvoices();
    setInvoices(res.data);
  };

  const fetchBills = async () => {
    const res = await financeApi.getBills();
    setBills(res.data);
  };

  const fetchReports = async () => {
    try {
      const [pnlRes, tbRes] = await Promise.all([
        financeApi.getProfitLoss(),
        financeApi.getTrialBalance(),
      ]);
      setPnl(pnlRes.data);
      setTrialBalance(tbRes.data);
    } catch (err) {
      console.warn("Failed to fetch financial reports:", err);
    }
  };

  const fetchBankTransactions = async () => {
    try {
      const res = await financeApi.getBankStatements();
      const mapped = res.data.map((t) => ({
        id: t.id,
        date: t.transaction_date,
        desc: t.description,
        amount: Math.abs(t.amount),
        type: t.amount >= 0 ? "Credit" : "Debit",
        balance: 0, // Backend doesn't give running balance yet, mock or calculate if needed
        status: t.reconciled ? "Reconciled" : "Pending",
      }));
      setBankTransactions(mapped);
    } catch (err) {
      console.warn("Failed to fetch bank statements:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await financeApi.getPayments();
      setPayments(res.data);
    } catch (err) {
      console.warn("Failed to fetch payments:", err);
    }
  };

  const syncBank = async () => {
    setLoading(true);
    try {
      await financeApi.syncBank();
      await fetchBankTransactions();
    } catch (err) {
      setError("Bank sync failed");
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (data) => {
    setLoading(true);
    try {
      const res = await financeApi.createInvoice(data);
      setInvoices((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to create invoice";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const postInvoice = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await financeApi.postInvoice(id);
      await Promise.all([fetchInvoices(), fetchReports()]);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to post invoice";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const payInvoice = async (id, payment) => {
    setLoading(true);
    setError(null);
    try {
      await financeApi.payInvoice(id, payment);
      await Promise.all([fetchInvoices(), fetchReports(), fetchPayments()]);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Payment failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (p) => {
    // Support both multi-line and legacy single-line payloads
    const data = p.lines
      ? {
          vendor_name: p.vendor_name || p.supplier || p.target,
          reference: p.reference || `BILL-${Date.now()}`,
          lines: p.lines,
        }
      : {
          vendor_name: p.supplier || p.vendor_name || p.target,
          reference: p.reference || `BILL-${Date.now()}`,
          lines: [
            {
              description: p.note || "Standard Purchase",
              quantity: 1,
              unit_price: p.amount,
            },
          ],
        };
    setLoading(true);
    try {
      await financeApi.createBill(data);
      await fetchBills();
      showToast("Purchase Bill recorded", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to create bill";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const recordExpense = addBill; // Bridge

  const updateBill = async (id, data) => {
    setLoading(true);
    try {
      const payload = {
        vendor_name: data.supplier || data.vendor_name,
        amount: data.amount,
        reference: data.reference,
        due_date: data.due_date,
      };
      await financeApi.updateBill(id, payload);
      await fetchBills();
      showToast("Purchase Bill updated", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update bill";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeBill = async (id) => {
    setLoading(true);
    try {
      await financeApi.deleteBill(id);
      await fetchBills();
      showToast("Purchase Bill deleted", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to delete bill";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const postBill = async (id) => {
    setLoading(true);
    try {
      await financeApi.postBill(id);
      await fetchBills();
      showToast("Bill posted to General Ledger", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to post bill";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        code: data.code || data.id,
        type: data.type.toUpperCase(),
      };
      await financeApi.createAccount(payload);
      await fetchAccounts();
      showToast("New ledger account established", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to create account";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoicePDF = async (id) => {
    try {
      const response = await financeApi.downloadInvoicePDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showToast("Failed to download invoice PDF", "error");
    }
  };

  const downloadBillPDF = async (id) => {
    try {
      const response = await financeApi.downloadBillPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Bill_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showToast("Failed to download bill PDF", "error");
    }
  };

  // --- COMPATIBILITY BRIDGE ---

  // Bridge for stats used in FinanceOverview.jsx
  const stats = {
    totalRevenue: pnl.income || 0,
    netProfit: pnl.net_profit || 0,
    cashOnHand:
      trialBalance.accounts
        ?.filter(
          (a) =>
            a.type === "ASSET" &&
            (a.account.toLowerCase().includes("bank") ||
              a.account.toLowerCase().includes("cash")),
        )
        .reduce((acc, a) => acc + (a.debit - a.credit), 0) || 0,
    unpaidReceivables: invoices
      .filter((i) => i.status !== "PAID")
      .reduce(
        (acc, i) => acc + (i.total_amount_base || i.total_amount || 0),
        0,
      ),
    unpaidPayables: bills
      .filter((b) => b.status !== "PAID")
      .reduce((acc, b) => acc + (b.total_amount || 0), 0),
    taxLiability:
      trialBalance.accounts
        ?.filter((a) => a.account.toLowerCase().includes("tax"))
        .reduce((acc, a) => acc + (a.credit - a.debit), 0) || 0,
  };

  // Bridge invoices to match 'target' and 'amount' expected by UI
  const bridgedInvoices = invoices.map((i) => {
    // Map backend statuses to frontend-expected display statuses
    let displayStatus = "Unpaid";
    if (i.status === "DRAFT") displayStatus = "Draft";
    if (i.status === "PAID") displayStatus = "Paid";
    if (i.status === "POSTED") displayStatus = "Unpaid";
    if (i.status === "PARTIALLY_PAID") displayStatus = "Partial";

    return {
      ...i,
      target: i.customer_name || i.target || "Unknown Client",
      amount: i.total_amount || 0,
      tax: (i.total_amount || 0) * 0.1, // Mock tax if not in backend metadata
      date: i.invoice_date || i.created_at?.split("T")[0] || "2026-02-08",
      status: displayStatus,
      rawStatus: i.status, // Keep for logic
    };
  });

  // Map bills to 'expenses' for compatibility
  const expenses = bills.map((b) => {
    let displayStatus = "Pending";
    if (b.status === "DRAFT") displayStatus = "Draft";
    if (b.status === "POSTED") displayStatus = "Posted";
    if (b.status === "PAID") displayStatus = "Reimbursed";

    return {
      ...b,
      id: b.id,
      note: b.reference || `BILL-${b.id}`,
      vendor: b.vendor_name || "Unknown Vendor",
      category: "Operational", // Default — backend doesn't store category
      amount: b.total_amount || 0,
      date: b.bill_date || b.created_at?.split("T")[0] || "—",
      status: displayStatus,
      rawStatus: b.status,
    };
  });

  const bridgedPayments = payments.map((p) => {
    const invoice = invoices.find((i) => i.id === p.invoice_id);
    return {
      id: `PAY-${p.id}`,
      invoice: invoice?.reference || `INV-${p.invoice_id}`,
      invoiceId: p.invoice_id,
      customer: invoice?.customer_name || "Unknown Client",
      method: p.payment_method || "Bank Transfer",
      amount: p.amount,
      date: p.payment_date,
      type: "Incoming", // Default for payments received
    };
  });

  const addInvoice = async (p) => {
    // Support both multi-line and legacy single-line payloads
    const data = p.lines
      ? {
          customer_name: p.customer_name || p.target,
          reference: p.reference || `INV-${Date.now()}`,
          lines: p.lines,
        }
      : {
          customer_name: p.target,
          reference: p.reference || `INV-${Date.now()}`,
          lines: [
            {
              description: p.note || "Standard Service",
              quantity: 1,
              unit_price: p.amount,
            },
          ],
        };
    return await createInvoice(data);
  };

  const recordPayment = async (p) => {
    // p: { invoiceId, amount, method, date, reference }
    const paymentData = {
      amount: p.amount,
      method: p.method || "Bank Transfer",
      date: p.date || new Date().toISOString().split("T")[0],
      reference: p.reference || `PAY-${p.invoiceId}`,
    };
    return await payInvoice(p.invoiceId, paymentData);
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        invoices: bridgedInvoices,
        bills,
        expenses, // Bridge
        pnl,
        trialBalance,
        loading,
        isLoading: loading, // Bridge
        error,
        createInvoice,
        addInvoice, // Bridge
        postInvoice,
        payInvoice,
        recordPayment, // Bridge
        addBill,
        recordExpense, // Bridge
        updateBill,
        removeBill,
        postBill,
        fetchBills,
        stats,
        assets, // Local bridge
        addAsset: (asset) =>
          setAssets((prev) => [{ ...asset, id: `AST-${Date.now()}` }, ...prev]),
        fetchAccounts,
        addAccount,
        fetchInvoices,
        fetchReports,
        bankTransactions,
        payments: bridgedPayments,
        syncBank,
        fetchBankTransactions,
        fetchPayments,
        downloadInvoicePDF,
        downloadBillPDF,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
