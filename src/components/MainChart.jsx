import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const formatDate = (date) => {
  const options = { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[160px]">
      <div className="font-black text-white mb-3 text-[11px] uppercase tracking-[0.2em] opacity-90">
        {payload[0].payload.label}
      </div>
      <div className="space-y-2">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                style={{ backgroundColor: p.color }}
              ></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest capitalize">{p.name}</span>
            </div>
            <span className={cn(
              "text-xs font-black",
              p.dataKey === "cumulative" ? "text-white text-[13px]" : "text-white/80"
            )}>
              ${Number(p.value).toLocaleString("en-US")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainChart = () => {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    // ... same data processing ...
    const dataMap = {};
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 29);

    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dataMap[key] = {
        label: formatDate(d),
        income: 0,
        expenses: 0,
      };
    }

    transactions.forEach((tx) => {
      const parsed = new Date(tx.date);
      if (isNaN(parsed)) return;
      const key = parsed.toISOString().slice(0, 10);
      if (!dataMap[key]) return;

      if (tx.type === "Income" || tx.type === "Deposit") {
        dataMap[key].income += Number(tx.amount || 0);
      } else if (tx.type === "Expense" || tx.type === "Withdrawal") {
        dataMap[key].expenses += Number(tx.amount || 0);
      }
    });

    let cumulativeNet = 0;
    const result = Object.values(dataMap).map((item) => {
      cumulativeNet += item.income - item.expenses;
      return {
        ...item,
        net: Number((item.income - item.expenses).toFixed(2)),
        cumulative: Number(cumulativeNet.toFixed(2)),
      };
    });
    
    return result;
  }, [transactions]);

  return (
    <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl rounded-[24px] p-8 min-h-[480px] h-full flex flex-col group border border-slate-200/50 dark:border-white/5 shadow-2xl transition-all duration-500 relative overflow-hidden">
      {/* 1px Inner Refraction Border */}
      <div className="absolute inset-0 rounded-[24px] pointer-events-none border-t border-l border-white/10 dark:border-white/5 z-20" />
      
      <div className="flex items-start justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Balance Trend 
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            CUMULATIVE NET BALANCE TREND (INCOME VS EXPENSE)
          </p>
        </div>
        <div className="px-4 py-3 bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center min-w-[80px] backdrop-blur-md">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">
            30
          </span>
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 leading-tight">
            Days
          </span>
        </div>
      </div>
      
      <div className="flex gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-2 group/legend cursor-default">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover/legend:text-emerald-500 transition-colors">Income</span>
        </div>
        <div className="flex items-center gap-2 group/legend cursor-default">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover/legend:text-rose-500 transition-colors">Expenses</span>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              dy={15}
              interval={4}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59,130,246,0.1)', strokeWidth: 40 }} />
            <Area
              type="monotone"
              dataKey="cumulative"
              name="Balance"
              stroke="#60a5fa"
              strokeWidth={5}
              fill="url(#balanceGrad)"
              filter="url(#glow)"
              animationDuration={2500}
              activeDot={{ r: 8, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3, className: 'animate-pulse' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#incomeGrad)"
              animationDuration={2500}
              opacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#expenseGrad)"
              animationDuration={2500}
              opacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;
