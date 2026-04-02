import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import MainChart from "./components/MainChart";
import Transactions from "./components/Transactions";
import RightPanel from "./components/RightPanel";
import SpendingBreakdown from "./components/SpendingBreakdown";
import Insights from "./components/Insights";
import { useDashboard } from "./context/DashboardContext";
import { cn } from "./utils/cn";

function App() {
  const { darkMode } = useDashboard();
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 flex",
        darkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900",
      )}
    >
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <Header />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {activeTab === "dashboard" && (
              <>
                <SummaryCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <MainChart />
                      <SpendingBreakdown />
                    </div>
                    <Transactions />
                  </div>

                  <div className="lg:col-span-1 space-y-8">
                    <RightPanel />
                    <Insights />
                  </div>
                </div>
              </>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <Transactions />
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Insights</h1>
                <Insights />
              </div>
            )}

            {activeTab !== "dashboard" &&
              activeTab !== "transactions" &&
              activeTab !== "insights" && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
                  <h1 className="text-2xl font-bold mb-2">{activeTab}</h1>
                  <p className="text-slate-400">
                    This section will be implemented soon.
                  </p>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
