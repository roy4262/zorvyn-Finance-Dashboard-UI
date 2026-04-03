import { useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const SummaryCard = ({ title, amount, change, icon: Icon, color, trend }) => (
  <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl rounded-[24px] p-6 relative overflow-hidden group border border-slate-200/50 dark:border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
    {/* 1px Inner Refraction Border */}
    <div className="absolute inset-0 rounded-[24px] pointer-events-none border-t border-l border-white/10 dark:border-white/5 z-20" />
    
    {/* Subtle Texture Pattern */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }} />

    <div className="flex flex-col space-y-4 relative z-10">
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg",
            color === "text-blue-500" ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 shadow-blue-500/10" :
            color === "text-emerald-500" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10" :
            color === "text-rose-500" ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-rose-500/10" :
            "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
          )}
        >
          <Icon size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">
          {title}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm font-mono">
          <span className="text-slate-400 dark:text-slate-500 mr-1 text-xl font-sans">$</span>
          {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm transition-all duration-500",
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
              change === "N/A" && "text-slate-400 dark:text-slate-500 bg-slate-400/5 border-slate-400/10 shadow-none"
            )}
          >
            {change !== "N/A" && (trend === "up" ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            ))}
            {change}
            {change !== "N/A" && "%"}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
            vs last month
          </span>
        </div>
      </div>
    </div>

    {/* Dynamic Reflection Glow */}
    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 dark:bg-white/[0.02] blur-[60px] rounded-full group-hover:bg-white/10 transition-all duration-700 pointer-events-none"></div>
  </div>
);

const SummaryCards = () => {
  const { transactions } = useDashboard();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(now.getMonth() - 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const filterByMonth = (txs, month, year) =>
      txs.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

    const currentTxs = filterByMonth(transactions, currentMonth, currentYear);
    const lastTxs = filterByMonth(transactions, lastMonth, lastMonthYear);

    const getStats = (txs) => {
      const income = txs
        .filter((t) => t.type === "Income")
        .reduce((acc, t) => acc + t.amount, 0);
      const expenses = txs
        .filter((t) => t.type === "Expense")
        .reduce((acc, t) => acc + t.amount, 0);
      return { income, expenses, balance: income - expenses };
    };

    const current = getStats(currentTxs);
    const last = getStats(lastTxs);

    const calculateChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "100" : "0";
      return (((curr - prev) / Math.abs(prev)) * 100).toFixed(1);
    };

    const incomeChange = calculateChange(current.income, last.income);
    const expenseChange = calculateChange(current.expenses, last.expenses);
    const balanceChange = calculateChange(current.balance, last.balance);

    // For Total Balance, we still show all-time balance but the trend is for this month
    const totalIncome = transactions
      .filter((t) => t.type === "Income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    return [
      {
        title: "Total Balance",
        amount: totalBalance,
        change: Math.abs(parseFloat(balanceChange)),
        icon: Wallet,
        color: "text-blue-500",
        trend: parseFloat(balanceChange) >= 0 ? "up" : "down",
      },
      {
        title: "Total Income",
        amount: totalIncome,
        change: Math.abs(parseFloat(incomeChange)),
        icon: TrendingUp,
        color: "text-emerald-500",
        trend: parseFloat(incomeChange) >= 0 ? "up" : "down",
      },
      {
        title: "Total Expenses",
        amount: totalExpenses,
        change: Math.abs(parseFloat(expenseChange)),
        icon: Receipt,
        color: "text-rose-500",
        trend: parseFloat(expenseChange) >= 0 ? "up" : "down",
      },
      {
        title: "Monthly Savings",
        amount:
          current.income - current.expenses > 0
            ? current.income - current.expenses
            : 0,
        change: "N/A",
        icon: PiggyBank,
        color: "text-amber-500",
        trend: "up",
      },
    ];
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card, idx) => (
        <SummaryCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default SummaryCards;
