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

const formatDate = (date) => {
  const options = { month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white/90 dark:bg-[#0B0D17]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-2xl">
      <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-[10px] uppercase tracking-widest">{payload[0].payload.label}</div>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">{p.name}</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
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
    <div className="glass-card rounded-[24px] p-6 min-h-[450px] h-full flex flex-col group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Balance Trend (Last 30 Days)
          </h3>
          <p className="text-[10px] text-slate-600 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
            Cumulative net balance trend (income vs expense)
          </p>
        </div>
        <div className="px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg backdrop-blur-md">
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Last 30 days
          </span>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">InCOME</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">EXPENSES</span>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={10}
              interval={5}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="cumulative"
              name="Balance"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#balanceGrad)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;
