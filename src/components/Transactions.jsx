import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Plus, Download } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const Transactions = () => {
  const {
    transactions,
    role,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [newTx, setNewTx] = useState({
    name: "",
    amount: "",
    type: "Expense",
    category: "Groceries",
    date: new Date().toISOString().split("T")[0],
    icon: "🛒",
  });

  const categoryIcons = {
    Groceries: "🛒",
    Dining: "🍽️",
    Transport: "🚗",
    Housing: "🏠",
    Utilities: "💡",
    Health: "🏥",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Education: "📚",
    Travel: "✈️",
    Other: "📦",
    Salary: "💰",
    Freelance: "💻",
    Investment: "📈",
    Gift: "🎁",
    Refund: "🔄",
  };

  const exportToCSV = () => {
    const headers = ["Name", "Type", "Date", "Amount", "Category", "Status"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [t.name, t.type, t.date, t.amount, t.category, t.status].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const sortedAndFiltered = useMemo(() => {
    try {
      return transactions
        .filter((t) => {
          const name = (t.name || "").toString().toLowerCase();
          const category = (t.category || "").toString().toLowerCase();
          const query = searchTerm.toLowerCase();

          // Search filter
          const matchesSearch =
            name.includes(query) || category.includes(query);

          // Type filter
          const matchesType =
            typeFilter === "All Types" ? true : t.type === typeFilter;

          // Category filter
          const matchesCategory =
            categoryFilter === "All Categories"
              ? true
              : t.category === categoryFilter;

          // Month filter
          let matchesMonth = true;
          if (monthFilter !== "All Months") {
            const date = new Date(t.date);
            const monthYear = date.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            matchesMonth = monthYear === monthFilter;
          }

          return (
            matchesSearch && matchesType && matchesCategory && matchesMonth
          );
        })
        .sort((a, b) => {
          let comparison = 0;
          if (sortBy === "date") {
            const da = new Date(a.date || "");
            const db = new Date(b.date || "");
            comparison = da.getTime() - db.getTime();
          } else if (sortBy === "amount") {
            comparison = Number(a.amount || 0) - Number(b.amount || 0);
          }
          return sortOrder === "desc" ? -comparison : comparison;
        });
    } catch (err) {
      console.error("Transaction filtering/sorting error", err);
      return transactions;
    }
  }, [
    transactions,
    searchTerm,
    typeFilter,
    categoryFilter,
    monthFilter,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Get unique categories for filter
  const uniqueCategories = [
    "All Categories",
    ...new Set(transactions.map((t) => t.category).filter((c) => c)),
  ];

  // Get unique months for filter
  const uniqueMonths = [
    "All Months",
    ...new Set(
      transactions
        .map((t) => {
          const date = new Date(t.date);
          return date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
        })
        .filter((m) => m),
    ),
  ];

  // Get unique types
  const uniqueTypes = [
    "All Types",
    ...new Set(transactions.map((t) => t.type).filter((t) => t)),
  ];

  const handleAddTx = async (e) => {
    e.preventDefault();

    const amount = parseFloat(newTx.amount);
    if (!newTx.name.trim() || Number.isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transaction name and positive amount.");
      return;
    }

    setIsAdding(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingId) {
        updateTransaction({
          ...newTx,
          id: editingId,
          amount,
          status: "Completed",
        });
        setAlertMessage("Transaction updated successfully");
        setEditingId(null);
      } else {
        addTransaction({
          ...newTx,
          amount,
          status: "Completed",
        });
        setAlertMessage("Transaction created successfully");
      }

      setShowModal(false);

      setNewTx({
        name: "",
        amount: "",
        type: "Expense",
        category: "Groceries",
        date: new Date().toISOString().split("T")[0],
        icon: "🛒",
      });
    } catch (error) {
      console.error("Failed to add transaction", error);
      setAlertMessage("Could not add transaction. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditTx = (transaction) => {
    setNewTx({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      icon: transaction.icon,
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col group hover:border-slate-700 transition-colors shadow-2xl shadow-blue-500/5 overflow-hidden relative">
      <div className="p-6 border-b border-slate-800/50 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Transactions
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {role === "admin"
                ? "Manage and track your financial activities"
                : "View your financial activities"}
            </p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewTx({
                  name: "",
                  amount: "",
                  type: "Expense",
                  category: "Groceries",
                  date: new Date().toISOString().split("T")[0],
                  icon: "🛒",
                });
                setShowModal(true);
              }}
              className="bg-yellow-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all flex items-center whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Transaction
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Type Filter Dropdown */}
          <div className="relative group/type">
            <button className="w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center justify-between sm:justify-center gap-2">
              {typeFilter}
              <Filter className="w-3 h-3" />
            </button>
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-full sm:w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl invisible group-hover/type:visible opacity-0 group-hover/type:opacity-100 transition-all z-30 p-1">
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs rounded-lg transition-colors",
                    typeFilter === type
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative group/category">
            <button className="w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center justify-between sm:justify-center gap-2">
              {categoryFilter}
              <Filter className="w-3 h-3" />
            </button>
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl invisible group-hover/category:visible opacity-0 group-hover/category:opacity-100 transition-all z-30 p-1 max-h-48 overflow-y-auto custom-scrollbar">
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs rounded-lg transition-colors",
                    categoryFilter === cat
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter Dropdown */}
          <div className="relative group/month">
            <button className="w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center justify-between sm:justify-center gap-2">
              {monthFilter}
              <Filter className="w-3 h-3" />
            </button>
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl invisible group-hover/month:visible opacity-0 group-hover/month:opacity-100 transition-all z-30 p-1 max-h-48 overflow-y-auto custom-scrollbar">
              {uniqueMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => setMonthFilter(month)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs rounded-lg transition-colors",
                    monthFilter === month
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white",
                  )}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Export */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("date")}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-2"
              title="Sort by Date"
            >
              Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-2"
              title="Export CSV"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingId ? "Edit Transaction" : "New Transaction"}
            </h3>
            <form onSubmit={handleAddTx} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Description
                </label>
                <input
                  required
                  type="text"
                  value={newTx.name}
                  onChange={(e) => setNewTx({ ...newTx, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Apple Store"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">
                    Amount
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={newTx.amount}
                    onChange={(e) =>
                      setNewTx({ ...newTx, amount: e.target.value })
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">
                    Type
                  </label>
                  <select
                    value={newTx.type}
                    onChange={(e) =>
                      setNewTx({ ...newTx, type: e.target.value })
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Category
                </label>
                <select
                  value={newTx.category}
                  onChange={(e) =>
                    setNewTx({
                      ...newTx,
                      category: e.target.value,
                      icon: categoryIcons[e.target.value] || "📦",
                    })
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {Object.keys(categoryIcons).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase">
                  Date
                </label>
                <input
                  required
                  type="date"
                  value={newTx.date}
                  onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setNewTx({
                      name: "",
                      amount: "",
                      type: "Expense",
                      category: "Groceries",
                      date: new Date().toISOString().split("T")[0],
                      icon: "🛒",
                    });
                  }}
                  className="flex-1 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={isAdding}
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingId ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="p-3 mx-4 mt-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-sm">
          {alertMessage}
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-[10px] text-slate-500 uppercase tracking-[0.1em] font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sortedAndFiltered.map((t) => (
              <tr
                key={t.id}
                className="group/row hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-300">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-base border border-slate-700 group-hover/row:border-slate-600 transition-colors">
                      {t.icon}
                    </div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-400 bg-slate-800/30 px-2.5 py-1 rounded-md">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                      t.type === "Income"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20",
                    )}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "text-sm font-bold tracking-tight",
                      t.type === "Income" ? "text-emerald-400" : "text-red-400",
                    )}
                  >
                    {t.type === "Income" ? "+" : "-"}₹
                    {Number(t.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {role === "admin" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTx(t)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-600/50 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      View only
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedAndFiltered.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-400 text-sm font-medium">
            No transactions found matching your criteria
          </p>
        </div>
      )}

      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Showing {sortedAndFiltered.length} of {transactions.length} entries
        </span>
        <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
          View all →
        </button>
      </div>
    </div>
  );
};

export default Transactions;
