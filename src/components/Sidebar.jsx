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
      "flex items-center w-full px-4 py-3 text-sm font-bold transition-all duration-500 rounded-2xl relative group overflow-hidden",
      active
        ? "text-blue-500 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20"
        : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/[0.03]",
    )}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"></div>
    )}
    
    {/* Hover Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.05] to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

    <Icon className={cn(
      "w-5 h-5 mr-3 transition-all duration-500 relative z-10", 
      active ? "text-blue-500 dark:text-blue-400 scale-110" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-300 group-hover:scale-110"
    )} />
    <span className="relative z-10 tracking-tight">{label}</span>
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/40 dark:bg-[#0B0D17]/40 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 hidden lg:flex flex-col p-6 z-20 transition-all duration-500 overflow-hidden">
      {/* Sidebar Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-500/[0.03] to-transparent pointer-events-none"></div>

      <div className="flex items-center mb-12 relative z-10">
        <div className="relative w-10 h-10 flex items-center justify-center mr-3 group/logo">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 blur-sm rounded-lg opacity-0 group-hover/logo:scale-110 transition-transform"></div>
          <img
            src={logo}
            alt="Zorvyn Logo"
            className="w-9 h-9 relative z-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-700 dark:text-white tracking-tighter leading-none">
            Zorvyn
          </span>
          <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.2em] mt-1.5 ml-0.5">
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

      <div className="mt-auto space-y-6 relative z-10">
        <div className="px-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">
            System Role
          </span>
          <div className="mt-3 p-1.5 bg-slate-100/50 dark:bg-white/[0.03] rounded-2xl flex gap-1 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <button
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 flex items-center justify-center gap-2",
                role === "admin"
                  ? "bg-white dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-slate-200/50 dark:border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
              onClick={() => setRole("admin")}
            >
              <Shield size={12} className={role === "admin" ? "animate-pulse" : ""} />
              Admin
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 flex items-center justify-center gap-2",
                role === "viewer"
                  ? "bg-white dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-slate-200/50 dark:border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
              onClick={() => setRole("viewer")}
            >
              <Eye size={12} className={role === "viewer" ? "animate-pulse" : ""} />
              Viewer
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-4 border-t border-slate-200 dark:border-white/5 group/theme">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-500 group-hover/theme:text-blue-500 transition-colors duration-500">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{darkMode ? "Dark Core" : "Light Core"}</span>
          </div>
          <button
            className={cn(
              "w-11 h-6 rounded-full relative transition-all duration-500 border border-white/10 shadow-inner",
              !darkMode ? "bg-blue-600" : "bg-slate-800"
            )}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className={cn(
              "absolute top-1 w-3.5 h-3.5 bg-white rounded-full transition-all duration-500 shadow-md",
              !darkMode ? "left-6" : "left-1"
            )}></div>
          </button>
        </div>
      </div>
    </aside>

  );
};

export default Sidebar;
