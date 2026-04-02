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
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-500/5 duration-500">
    <div className="flex items-start justify-between">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-400 group-hover:text-slate-300 transition-colors">
          <div
            className={cn(
              "p-2 rounded-lg bg-slate-800 border border-slate-700",
              color,
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
            {title}
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center space-x-1.5">
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center bg-opacity-10",
                trend === "up"
                  ? "text-emerald-500 bg-emerald-500"
                  : "text-rose-500 bg-rose-500",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {change}%
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              from last month
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full",
        color.replace("text-", "bg-"),
      )}
    ></div>
  </div>
);

const SummaryCards = () => {
  const { transactions } = useDashboard();

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "Income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;
    const savings = income > expenses ? income - expenses : 0;

    return [
      {
        title: "Total Balance",
        amount: balance,
        change: "2.5",
        icon: Wallet,
        color: "text-blue-500",
        trend: "up",
      },
      {
        title: "Total Income",
        amount: income,
        change: "1.2",
        icon: TrendingUp,
        color: "text-emerald-500",
        trend: "up",
      },
      {
        title: "Total Expenses",
        amount: expenses,
        change: "0.8",
        icon: Receipt,
        color: "text-rose-500",
        trend: "down",
      },
      {
        title: "Monthly Savings",
        amount: savings,
        change: "5.4",
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
