import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";

const CATEGORY_COLORS = {
  Groceries: "#f59e0b",
  Housing: "#ef4444",
  Infrastructure: "#3b82f6",
  Marketing: "#ec4899",
  Equipment: "#8b5cf6",
  Subscription: "#10b981",
  Dining: "#f43f5e",
  Travel: "#06b6d4",
};

const SpendingBreakdown = () => {
  const { transactions } = useDashboard();
  const [activeCategory, setActiveCategory] = useState(null);

  const data = useMemo(() => {
    const filtered = transactions.filter((t) => t.type === "Expense");
    const categories = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const chartData = Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);

    if (chartData.length === 0) {
      return Object.entries(CATEGORY_COLORS).map(([name, color]) => ({
        name,
        value: Math.floor(Math.random() * 5000) + 1000,
        color
      }));
    }
    return chartData;
  }, [transactions]);

  return (
    <div className="glass-card rounded-[24px] p-8 min-h-[500px] h-full flex flex-col group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Spending Breakdown
        </h3>
        <p className="text-[10px] text-slate-600 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
          Expenses by category
        </p>
      </div>
      <div className="flex-1 w-full relative flex flex-col items-center">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
                animationDuration={1500}
                onMouseEnter={(_, index) => setActiveCategory(data[index]?.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                    style={{ filter: `drop-shadow(0 0 8px ${entry.color}44)` }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 dark:bg-[#0B0D17]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">{payload[0].name}</p>
                        <p className="text-xs font-bold" style={{ color: payload[0].payload.color }}>
                          ${payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {activeCategory && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest">
                {activeCategory}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ${data.find(d => d.name === activeCategory)?.value.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full px-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }}></div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
