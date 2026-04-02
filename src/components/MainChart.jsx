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
    <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-xs text-white">
      <div className="font-bold mb-1">{payload[0].payload.label}</div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-2"
        >
          <span className="capitalize">{p.name}</span>
          <span className="font-bold">
            {p.dataKey === "cumulative" ? "₹" : "$"}
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
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

      // Normalize transaction type support for both legacy and current terms
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
    const hasData = result.some((item) => item.income > 0 || item.expenses > 0);

    if (!hasData) {
      let inc = 5000;
      let exp = 2400;
      return result.map((item, idx) => {
        inc += Math.round((Math.sin(idx / 5) + 1) * 220);
        exp += Math.round((Math.cos(idx / 4) + 1) * 80);
        return { ...item, income: inc, expenses: exp };
      });
    }

    return result;
  }, [transactions]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[450px] h-full flex flex-col group hover:border-slate-700 transition-colors shadow-2xl shadow-blue-500/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Balance Trend (Last 30 Days)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Cumulative net balance trend (income vs expense)
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Last 30 days
          </span>
        </div>
      </div>
      <div className="chart-legend flex gap-3 mb-4 text-xs">
        <span className="legend-item flex items-center gap-1 text-slate-400">
          <span
            className="legend-dot w-2 h-2 rounded-full"
            style={{ background: "#10b981" }}
          ></span>
          Income
        </span>
        <span className="legend-item flex items-center gap-1 text-slate-400">
          <span
            className="legend-dot w-2 h-2 rounded-full"
            style={{ background: "#ef4444" }}
          ></span>
          Expenses
        </span>
      </div>

      <div className="flex-1 w-full mt-4 relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium">
            No transaction data available for this category
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 15, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, "dataMax"]}
                tickCount={6}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#incomeGrad)"
                dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#expenseGrad)"
                dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  fill: "#ef4444",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="rgba(59,130,246,0.2)"
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MainChart;
