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
  Dining: "#f59e0b",
  Equipment: "#8b5cf6",
  Infrastructure: "#3b82f6",
  Marketing: "#ef4444",
  Subscription: "#10b981",
};

const COLOR_PALETTE = [
  "#f59e0b",
  "#8b5cf6",
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#ec4899",
  "#06b6d4",
  "#f43f5e",
];

const SpendingBreakdown = () => {
  const { transactions } = useDashboard();
  const [activeCategory, setActiveCategory] = useState(null);

  const data = useMemo(() => {
    // For this update, let's filter specifically for expenses
    const filtered = transactions.filter((t) => t.type === "Expense");

    const categories = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(categories)
      .map(([name, value], index) => ({
        name,
        value,
        color:
          CATEGORY_COLORS[name] || COLOR_PALETTE[index % COLOR_PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="bg-[#0f172a] rounded-2xl p-8 min-h-[500px] h-full flex flex-col transition-colors shadow-2xl">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Spending Breakdown
        </h3>
        <p className="text-lg text-slate-400 font-medium">
          Expenses by category
        </p>
      </div>
      <div className="flex-1 w-full relative">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-lg font-medium">
            No spending data recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={1500}
                onMouseEnter={(_, index) =>
                  setActiveCategory(data[index]?.name)
                }
                onMouseLeave={() => setActiveCategory(null)}
                activeIndex={
                  activeCategory
                    ? data.findIndex((item) => item.name === activeCategory)
                    : -1
                }
                activeShape={(props) => {
                  const { fill } = props;
                  return (
                    <g>
                      <path d={props.path} fill={fill} opacity={0.8} />
                    </g>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                itemStyle={{ color: "#f8fafc" }}
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <Legend
                verticalAlign="bottom"
                iconType="square"
                iconSize={14}
                formatter={(value, entry) => (
                  <span
                    className="text-base font-bold px-2"
                    style={{ color: entry.color }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SpendingBreakdown;
