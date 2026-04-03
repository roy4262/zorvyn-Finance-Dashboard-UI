import { useMemo, useState } from "react";
import { cn } from "../utils/cn";
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
  Groceries: "#f59e0b", // Topaz
  Housing: "#e11d48",   // Ruby
  Infrastructure: "#2563eb", // Sapphire
  Marketing: "#db2777", // Morganite
  Equipment: "#7c3aed", // Amethyst
  Subscription: "#059669", // Jade
  Dining: "#f43f5e",    // Rose Quartz
  Travel: "#0891b2",    // Aquamarine
};

const SpendingBreakdown = () => {
  const { transactions } = useDashboard();
  const [activeCategory, setActiveCategory] = useState(null);

  const data = useMemo(() => {
    // ... same data processing ...
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
    <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl rounded-[24px] p-8 min-h-[500px] h-full flex flex-col group border border-slate-200/50 dark:border-white/5 shadow-2xl transition-all duration-500 relative overflow-hidden">
      {/* 1px Inner Refraction Border */}
      <div className="absolute inset-0 rounded-[24px] pointer-events-none border-t border-l border-white/10 dark:border-white/5 z-20" />
      
      <div className="mb-10 relative z-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Spending Breakdown
        </h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
          Categorized fiscal allocation
        </p>
      </div>
      
      <div className="flex-1 w-full relative flex flex-col items-center z-10">
        <div className="w-full h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={95}
                paddingAngle={4}
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
                    className="hover:opacity-90 transition-all cursor-pointer focus:outline-none"
                    style={{ 
                      filter: activeCategory === entry.name 
                        ? `drop-shadow(0 0 12px ${entry.color}88)` 
                        : `drop-shadow(0 0 4px ${entry.color}22)`,
                      transform: activeCategory === entry.name ? 'scale(1.02)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 dark:bg-[#0B0D17]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{payload[0].name}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 mb-1",
              activeCategory ? "text-slate-400 opacity-100" : "text-slate-500 opacity-0"
            )}>
              {activeCategory || "Total"}
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm transition-all duration-500">
              ${activeCategory 
                ? data.find(d => d.name === activeCategory)?.value.toLocaleString()
                : data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()
              }
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-10 w-full px-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between group/item cursor-default">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover/item:scale-125" 
                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600">
                {((item.value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
