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
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#0B0D17] text-slate-900 dark:text-slate-200 flex overflow-hidden relative transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-400/5 blur-[100px] rounded-full"></div>

      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen relative z-10 lg:pl-64">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {activeTab === "dashboard" && (
              <>
                <SummaryCards />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MainChart />
                      <SpendingBreakdown />
                    </div>
                    <Transactions />
                  </div>

                  <div className="lg:col-span-4 space-y-6">
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
