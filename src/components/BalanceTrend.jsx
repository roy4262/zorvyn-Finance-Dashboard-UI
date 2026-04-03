import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">{payload[0].payload.month}</p>
        <div className="space-y-1">
          {payload.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{p.name}</span>
              <span className="text-xs font-bold" style={{ color: p.color }}>
                ₹{Number(p.value).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const BalanceTrend = () => {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const monthKey = (date) => {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return null;
      return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    };

    const monthLabel = (yearMonth) => {
      const [year, month] = yearMonth.split("-");
      const d = new Date(Number(year), Number(month), 1);
      return d.toLocaleString("default", { month: "short" });
    };

    const monthlyNet = transactions.reduce((acc, tx) => {
      const key = monthKey(tx.date);
      if (!key) return acc;
      const amount =
        tx.type === "Income" ? Number(tx.amount) : -Number(tx.amount);
      acc[key] = (acc[key] || 0) + amount;
      return acc;
    }, {});

    const months = [];
    const now = new Date();
    for (let i = 9; i >= 0; i -= 1) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${m.getFullYear()}-${String(m.getMonth()).padStart(2, "0")}`;
      months.push(key);
    }

    let cumulative = 0;
    return months.map((key) => {
      const net = monthlyNet[key] || 0;
      cumulative += net;
      return {
        month: monthLabel(key),
        net: Number(net.toFixed(2)),
        balance: Number(cumulative.toFixed(2)),
      };
    });
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-[260px] flex flex-col shadow-2xl shadow-blue-500/5">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Balance Trend (Last 10 Months)
        </h3>
        <p className="text-xs text-slate-500">
          Monthly net flow + cumulative movement
        </p>
      </div>
      <div className="flex-1">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No data available for balance trend
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4' }}
                className="text-slate-200 dark:text-slate-700"
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 2, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="net"
                name="Net Flow"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 2, fill: "#f43f5e" }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BalanceTrend;
