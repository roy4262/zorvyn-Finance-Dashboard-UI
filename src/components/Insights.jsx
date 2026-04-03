import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  AlertCircle,
  Zap,
  BrainCircuit,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{payload[0].payload.label}</p>
        <div className="space-y-1">
          <p className="text-xs font-medium text-blue-400 flex justify-between gap-4">
            <span>Income:</span>
            <span>₹{Number(payload[0].payload.income).toLocaleString("en-IN")}</span>
          </p>
          <p className="text-xs font-medium text-rose-400 flex justify-between gap-4">
            <span>Expenses:</span>
            <span>₹{Number(payload[0].payload.expenses).toLocaleString("en-IN")}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Insights = () => {
  const { transactions, budgets } = useDashboard();

  const metrics = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === "Expense");
    const incomeTx = transactions.filter((t) => t.type === "Income");

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpTx = expenseTx.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const currentMonthIncTx = incomeTx.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const currentMonthExp = currentMonthExpTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const currentMonthInc = currentMonthIncTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const categoryMap = currentMonthExpTx.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    const topCat = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

    const dateKeys = Array.from(
      new Set(
        transactions
          .map((t) => {
            const d = new Date(t.date);
            if (isNaN(d.getTime())) return null;
            return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
          })
          .filter(Boolean)
      )
    ).sort();

    const lastMonths = dateKeys.slice(-6);
    const monthly = lastMonths.map((key) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month), 1).toLocaleString("default", { month: "short" });
      const mInc = incomeTx
        .filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const mExp = expenseTx
        .filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      return { label, income: mInc, expenses: mExp };
    });

    const avgExp = expenseTx.length > 0 ? 
      monthly.reduce((sum, m) => sum + m.expenses, 0) / monthly.length : 0;
    
    const overspending = Math.max(0, currentMonthExp - avgExp);
    const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
    const budgetStatus = (currentMonthExp / (totalBudget || 1)) * 100;
    const savingsRate = currentMonthInc > 0 ? ((currentMonthInc - currentMonthExp) / currentMonthInc) * 100 : 0;

    const obs = [];
    if (budgetStatus > 90) obs.push({ title: "Critical Budget Limit", desc: "You have exhausted over 90% of your monthly budget allocation.", type: "warning", icon: AlertCircle });
    if (overspending > 0) obs.push({ title: "Spending Spike Detected", desc: `Current expenses are ₹${overspending.toLocaleString()} above your 6-month average.`, type: "warning", icon: TrendingUp });
    if (savingsRate > 20) obs.push({ title: "Healthy Savings Trend", desc: `You are currently saving ${savingsRate.toFixed(1)}% of your monthly income.`, type: "positive", icon: ShieldCheck });
    if (topCat[1] > (currentMonthExp * 0.4)) obs.push({ title: "High Category Focus", desc: `${topCat[0]} accounts for over 40% of this month's spending.`, type: "info", icon: PieIcon });

    return {
      topCategory: topCat[0],
      topCategoryAmount: topCat[1],
      overspending,
      budgetStatus: Number(budgetStatus.toFixed(1)),
      savingsRate: Number(savingsRate.toFixed(1)),
      monthly,
      observations: obs,
    };
  }, [transactions, budgets]);

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
          <span className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
            <BrainCircuit className="w-6 h-6" />
          </span>
          <span>Insights Dashboard</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium ml-12">Comprehensive analysis & financial oversight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: "Highest Spend",
            value: metrics.topCategory,
            sub: `₹${metrics.topCategoryAmount.toLocaleString()}`,
            icon: BarChart3,
            color: "blue",
          },
          {
            label: "Overspending",
            value: `₹${metrics.overspending.toLocaleString()}`,
            sub: metrics.overspending > 0 ? "Above monthly avg" : "Within normal range",
            icon: metrics.overspending > 0 ? TrendingUp : TrendingDown,
            color: metrics.overspending > 0 ? "rose" : "emerald",
          },
          {
            label: "Budget Status",
            value: `${metrics.budgetStatus}%`,
            sub: "Total budget utilized",
            icon: Wallet,
            color: metrics.budgetStatus > 80 ? "amber" : "blue",
          },
          {
            label: "Savings Rate",
            value: `${metrics.savingsRate}%`,
            sub: "Current month net",
            icon: Target,
            color: "emerald",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-${card.color}-500/10 transition-all`}></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className={`p-3 bg-${card.color}-500/10 rounded-2xl text-${card.color}-400`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{card.value}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{card.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Comparison Chart</h4>
            <p className="text-xs text-slate-500 mt-1">Cash flow analysis: Income vs Expenses</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Income</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Expenses</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-3xl p-8">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Smart Observations</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.observations.map((obs, i) => (
            <div key={i} className={cn(
              "p-5 rounded-2xl border transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50",
              obs.type === "positive" ? "bg-emerald-500/5 border-emerald-500/10" : "bg-blue-500/5 border-blue-500/10"
            )}>
              <div className="flex items-start space-x-4">
                <div className={cn("p-2 rounded-xl mt-1", obs.type === "positive" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400")}>
                  <obs.icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{obs.title}</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{obs.desc}</p>
                </div>
              </div>
            </div>
          ))}
          {metrics.observations.length === 0 && (
            <div className="col-span-full py-8 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
              <p className="text-sm text-slate-500 font-medium italic">No critical anomalies detected for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
