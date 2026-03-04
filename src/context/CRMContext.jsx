import { createContext, useContext, useEffect, useState } from "react";
import { crmApi } from "../services/crmApi";

const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [crmStats, setCrmStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchLeads(),
        fetchDeals(),
        fetchCustomers(),
        fetchContacts(),
        fetchQuotes(),
        fetchSalesOrders(),
        fetchStats(),
        fetchActivities(),
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch CRM data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    const res = await crmApi.getLeads();
    setLeads(res.data);
  };

  const fetchDeals = async () => {
    const res = await crmApi.getDeals();
    setDeals(res.data);
  };

  const fetchCustomers = async () => {
    const res = await crmApi.getCustomers();
    setCustomers(res.data);
  };

  const fetchContacts = async () => {
    const res = await crmApi.getContacts();
    setContacts(res.data);
  };

  const fetchQuotes = async () => {
    const res = await crmApi.getQuotes();
    setQuotes(res.data);
  };

  const fetchSalesOrders = async () => {
    const res = await crmApi.getSalesOrders();
    setSalesOrders(res.data);
  };

  const fetchStats = async () => {
    const res = await crmApi.getStats();
    setCrmStats(res.data);
  };

  const fetchActivities = async () => {
    const res = await crmApi.getActivities();
    setActivities(res.data);
  };

  const addLead = async (data) => {
    setLoading(true);
    try {
      const res = await crmApi.createLead(data);
      setLeads((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add lead");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (data) => {
    setLoading(true);
    try {
      const res = await crmApi.createCustomer(data);
      setCustomers((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add customer");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (data) => {
    setLoading(true);
    try {
      const res = await crmApi.createContact(data);
      setContacts((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const qualifyLead = async (id) => {
    setLoading(true);
    try {
      await crmApi.updateLeadStatus(id, "QUALIFIED");
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to qualify lead");
    } finally {
      setLoading(false);
    }
  };

  const convertLead = async (id, dealData) => {
    setLoading(true);
    try {
      await crmApi.convertLead(id, dealData);
      await Promise.all([fetchLeads(), fetchStats()]);
    } catch (err) {
      setError(err.response?.data?.detail || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, updates) => {
    setLoading(true);
    try {
      const res = await crmApi.updateLead(id, updates);
      setLeads((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const addDeal = async (data) => {
    setLoading(true);
    try {
      const res = await crmApi.createDeal(data);
      setDeals((prev) => [res.data, ...prev]);
      await fetchStats();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add deal");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDeal = async (id, data) => {
    setLoading(true);
    try {
      const res = await crmApi.updateDeal(id, data);
      setDeals((prev) => prev.map((d) => (d.id === id ? res.data : d)));
      await fetchStats();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update deal");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDeal = async (id) => {
    setLoading(true);
    try {
      await crmApi.deleteDeal(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete deal");
    } finally {
      setLoading(false);
    }
  };

  const moveDeal = async (dealId, stage) => {
    setLoading(true);
    try {
      await crmApi.updateDealStage(dealId, stage);
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.detail || "Stage update failed");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalLeads: leads.length,
    activeDeals: crmStats?.active_deals || 0,
    wonDeals: crmStats?.won_deals || 0,
    pipelineValue: crmStats?.pipeline_value || 0,
    conversionRate: crmStats?.conversion_rate?.toFixed(1) || "0.0",
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        deals,
        activities,
        customers,
        contacts,
        quotes,
        salesOrders,
        stats,
        loading,
        isLoading: loading,
        error,
        fetchInitialData,
        addLead,
        updateLead,
        qualifyLead,
        convertLead,
        addDeal,
        updateDeal,
        removeDeal,
        moveDeal,
        addCustomer,
        addContact,
        clearError: () => setError(null),
        addQuote: async (q) => {
          setLoading(true);
          try {
            const res = await crmApi.createQuote(q);
            setQuotes((prev) => [res.data, ...prev]);
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to create quote");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        updateQuoteStatus: async (id, status) => {
          setLoading(true);
          try {
            const res = await crmApi.updateQuoteStatus(id, status);
            setQuotes((prev) => prev.map((q) => (q.id === id ? res.data : q)));
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to update quote");
            throw err;
          } finally {
            setLoading(false);
          }
        },
        addActivity: async (a) => {
          setLoading(true);
          try {
            const res = await crmApi.addActivity(a);
            setActivities((prev) => [res.data, ...prev]);
            return res.data;
          } catch (err) {
            setError(err.response?.data?.detail || "Failed to log activity");
            throw err;
          } finally {
            setLoading(false);
          }
        },
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => useContext(CRMContext);
