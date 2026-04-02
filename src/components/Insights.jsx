import { useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const Insights = () => {
  const { transactions } = useDashboard();

  const {
    totalExpenses,
    totalIncome,
    categoryData,
    topCategory,
    topCategoryPercent,
    savingsRate,
    netPosition,
    expenseRatio,
    avgMonthlySpend,
    monthComparison,
    monthsCount,
    monthVsMonth,
  } = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === "Expense");
    const incomeTx = transactions.filter((t) => t.type === "Income");

    const totalExp = expenseTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0,
    );
    const totalInc = incomeTx.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0,
    );

    const categoryMap = expenseTx.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

    const categoryDataArr = Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const topCat = categoryDataArr[0] || { category: "N/A", amount: 0 };
    const topPct =
      totalExp > 0 ? Number(((topCat.amount / totalExp) * 100).toFixed(1)) : 0;

    const savings = totalInc - totalExp;
    const savingsPct =
      totalInc > 0 ? Number(((savings / totalInc) * 100).toFixed(1)) : 0;

    const ratio =
      totalInc > 0 ? Number(((totalExp / totalInc) * 100).toFixed(1)) : 0;

    const dateKeys = Array.from(
      new Set(
        transactions
          .map((t) => {
            const d = new Date(t.date);
            if (Number.isNaN(d.getTime())) return null;
            return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
          })
          .filter(Boolean),
      ),
    ).sort();

    const lastMonths = dateKeys.slice(-6);

    const monthly = lastMonths.map((key) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month), 1).toLocaleString(
        "default",
        {
          month: "short",
        },
      );
      const monthIncome = incomeTx
        .filter((t) => {
          const d = new Date(t.date);
          return (
            d.getFullYear() === Number(year) && d.getMonth() === Number(month)
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const monthExpense = expenseTx
        .filter((t) => {
          const d = new Date(t.date);
          return (
            d.getFullYear() === Number(year) && d.getMonth() === Number(month)
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      return {
        label,
        income: monthIncome,
        expenses: monthExpense,
        diff: monthExpense - monthIncome,
      };
    });

    const avgSpend = lastMonths.length > 0 ? totalExp / lastMonths.length : 0;

    const monthVSM =
      lastMonths.length >= 2
        ? lastMonths.slice(-2).map((key) => {
            const [year, month] = key.split("-");
            return {
              label: new Date(Number(year), Number(month), 1).toLocaleString(
                "default",
                {
                  month: "short",
                },
              ),
              expenses: expenseTx
                .filter((t) => {
                  const d = new Date(t.date);
                  return (
                    d.getFullYear() === Number(year) &&
                    d.getMonth() === Number(month)
                  );
                })
                .reduce((sum, t) => sum + Number(t.amount || 0), 0),
            };
          })
        : [];

    const monthVsMonth =
      monthVSM.length === 2
        ? Number(
            (
              ((monthVSM[1].expenses - monthVSM[0].expenses) /
                Math.max(monthVSM[0].expenses, 1)) *
              100
            ).toFixed(1),
          )
        : 0;

    return {
      totalExpenses: totalExp,
      totalIncome: totalInc,
      categoryData: categoryDataArr,
      topCategory: topCat,
      topCategoryPercent: topPct,
      savingsRate: savingsPct,
      netPosition: savings,
      expenseRatio: ratio,
      avgMonthlySpend: avgSpend,
      monthComparison: monthly,
      monthsCount: lastMonths.length,
      monthVsMonth,
    };
  }, [transactions]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-xs uppercase text-slate-500 font-bold tracking-wider">
            Top Spending Category
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
            {topCategory.category}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ₹
            {topCategory.amount.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
            • {topCategoryPercent}% of expenses
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
            Savings Rate
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-400 mt-2">
            {savingsRate}%
          </h3>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-1">
            Based on income ₹{totalIncome.toLocaleString("en-IN")} and expenses
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
            Month vs Month
          </p>
          <h3
            className={cn(
              "text-2xl font-bold mt-2",
              monthVsMonth >= 0 ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {monthVsMonth >= 0 ? `+${monthVsMonth}%` : `${monthVsMonth}%`}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Last {monthsCount} months comparison
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
            Avg. Monthly Spend
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
            ₹
            {avgMonthlySpend.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </h3>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-1">
            Based on last {monthsCount} months
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
            Net Position
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            ₹{netPosition.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-1">
            {netPosition >= 0 ? "You are in the green!" : "You are in the red."}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-bold tracking-wider">
            Expense Ratio
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-400 mt-2">
            {expenseRatio}%
          </h3>
          <p className="text-[11px] sm:text-sm text-slate-400 mt-1">
            {totalExpenses.toLocaleString("en-IN")} spent of ₹
            {totalIncome.toLocaleString("en-IN") || 1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white">
              Full Category Breakdown
            </h4>
            <span className="text-xs text-slate-500">
              All spending categories ranked
            </span>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-2 py-2 text-slate-400">#</th>
                  <th className="px-2 py-2 text-slate-400">Category</th>
                  <th className="px-2 py-2 text-slate-400">Total Spent</th>
                  <th className="px-2 py-2 text-slate-400">% of Expenses</th>
                  <th className="px-2 py-2 text-slate-400">Visual</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((item, index) => {
                  const pct =
                    totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
                  return (
                    <tr
                      key={item.category}
                      className="border-t border-slate-800"
                    >
                      <td className="px-2 py-2 text-slate-300">#{index + 1}</td>
                      <td className="px-2 py-2 text-slate-200">
                        {item.category}
                      </td>
                      <td className="px-2 py-2 font-bold text-white">
                        ₹
                        {item.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-2 text-slate-300">
                        {pct.toFixed(1)}%
                      </td>
                      <td className="px-2 py-2">
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white">Monthly Comparison</h4>
            <span className="text-xs text-slate-500">
              Income vs Expenses per month
            </span>
          </div>
          <div className="space-y-2">
            {monthComparison.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-2 gap-2 items-center text-[11px]"
              >
                <div className="text-slate-300">{item.label}</div>
                <div className="flex justify-end gap-2">
                  <span className="text-emerald-400 font-bold">
                    ₹
                    {item.income.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                  <span className="text-rose-400 font-bold">
                    ₹
                    {item.expenses.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
