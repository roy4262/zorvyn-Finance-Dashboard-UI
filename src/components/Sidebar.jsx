import {
  LayoutDashboard,
  Activity,
  CreditCard,
  PieChart,
  Wallet,
  BookOpen,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  Shield,
  Eye,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";
import logo from "../assets/logo.png";
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl relative group",
      active
        ? "text-blue-500 dark:text-blue-400"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5",
    )}
  >
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
    )}
    <Icon className={cn("w-5 h-5 mr-3 transition-colors", active ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
    {label}
  </button>
);

const Sidebar = ({ activeTab, onChangeTab }) => {
  const { darkMode, setDarkMode, role, setRole } = useDashboard();
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "transactions", icon: Activity, label: "Transactions" },
    { id: "insights", icon: PieChart, label: "Insights" },
    { id: "payments", icon: CreditCard, label: "Payments" },
    { id: "budgeting", icon: Wallet, label: "Budgeting" },
    { id: "assets", icon: BookOpen, label: "Assets" },
    { id: "ledger", icon: HelpCircle, label: "Ledger" },
    { id: "withdrawals", icon: LogOut, label: "Withdrawals" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-[#0B0D17]/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 hidden lg:flex flex-col p-6 z-20 transition-colors duration-300">
      <div className="flex items-center mb-10">
        <div className="relative w-8 h-8 flex items-center justify-center mr-3">
          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-pulse"></div>
          <img
            src={logo}
            alt="Zorvyn Logo"
            className="w-8 h-8 relative z-10"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1">
            Zorvyn
          </span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
            Finance Hub
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => onChangeTab(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="px-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Current Role
          </span>
          <div className="mt-3 p-1 bg-slate-100 dark:bg-white/5 rounded-xl flex gap-1 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <button
              className={cn(
                "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2",
                role === "admin"
                  ? "bg-white dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-blue-500/30 shadow-sm dark:shadow-none"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
              onClick={() => setRole("admin")}
            >
              <Shield size={12} />
              Admin
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2",
                role === "viewer"
                  ? "bg-white dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-blue-500/30 shadow-sm dark:shadow-none"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
              onClick={() => setRole("viewer")}
            >
              <Eye size={12} />
              Viewer
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Sun size={14} className={!darkMode ? "text-blue-600" : ""} />
            <span className="text-xs font-medium">Light Mode</span>
          </div>
          <button
            className={cn(
              "w-10 h-5 rounded-full relative transition-colors duration-300",
              !darkMode ? "bg-blue-600" : "bg-slate-700"
            )}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
              !darkMode ? "left-6" : "left-1"
            )}></div>
          </button>
        </div>
      </div>
    </aside>

  );
};

export default Sidebar;
