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
            mesh: "from-blue-500/20 via-indigo-500/10 to-purple-500/20",
          },
          {
            label: "Overspending",
            value: `₹${metrics.overspending.toLocaleString()}`,
            sub: metrics.overspending > 0 ? "Above monthly avg" : "Within normal range",
            icon: metrics.overspending > 0 ? TrendingUp : TrendingDown,
            color: metrics.overspending > 0 ? "rose" : "emerald",
            mesh: metrics.overspending > 0 ? "from-rose-500/20 via-orange-500/10 to-amber-500/20" : "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
          },
          {
            label: "Budget Status",
            value: `${metrics.budgetStatus}%`,
            sub: "Total budget utilized",
            icon: Wallet,
            color: metrics.budgetStatus > 80 ? "amber" : "blue",
            mesh: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
          },
          {
            label: "Savings Rate",
            value: `${metrics.savingsRate}%`,
            sub: "Current month net",
            icon: Target,
            color: "emerald",
            mesh: "from-emerald-500/20 via-green-500/10 to-lime-500/20",
          },
        ].map((card, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10",
            "bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white/20 dark:border-white/10"
          )}>
            {/* Holographic Mesh Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-60 transition-opacity duration-700",
              card.mesh
            )}></div>
            
            <div className="relative z-10 flex items-center space-x-5 w-full">
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  `bg-${card.color}-500/20 text-${card.color}-400 backdrop-blur-md border border-${card.color}-500/30`
                )}>
                  <card.icon className="w-7 h-7 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
                {/* 3D Glass Layer */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm -z-10 transform translate-x-1 translate-y-1"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{card.label}</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{card.value}</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center truncate">
                  <Sparkles className="w-3 h-3 mr-1 flex-shrink-0 text-amber-400" />
                  <span className="truncate">{card.sub}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Monthly Comparison</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Cash flow analytics</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Income</span>
            </div>
            <div className="flex items-center space-x-2 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Expenses</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthly} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }} 
                dy={15} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} 
                tickFormatter={(v) => `₹${v / 1000}k`} 
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorInc)" 
                animationDuration={2000}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, shadow: '0 0 10px rgba(59,130,246,0.8)' }}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#f43f5e" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorExp)" 
                animationDuration={2500}
                activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2, shadow: '0 0 10px rgba(244,63,94,0.8)' }}
              />
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
