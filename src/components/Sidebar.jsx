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

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg",
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white",
    )}
  >
    <Icon className="w-5 h-5 mr-3" />
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col p-4 z-20">
      <div className="flex items-center px-4 mb-10">
        <div className="relative w-10 h-10 flex items-center justify-center mr-3">
          <img
            src="/zorvynlogolight.png"
            alt="Zorvyn Logo"
            className="w-10 h-10 rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-tighter leading-none">
            Zorvyn
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            Finance Hub
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
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

      <div className="sidebar-footer mt-auto pt-4 border-t border-slate-800">
        <div className="role-switcher px-3">
          <span className="text-xs uppercase tracking-wider text-slate-500">
            Current Role
          </span>
          <div className="role-toggle mt-2 flex gap-2">
            <button
              className={cn(
                "role-btn flex-1 rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors",
                role === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700",
              )}
              onClick={() => setRole("admin")}
              id="role-admin-btn"
            >
              <Shield size={12} className="inline align-middle" />
              Admin
            </button>
            <button
              className={cn(
                "role-btn flex-1 rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1 transition-colors",
                role === "viewer"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700",
              )}
              onClick={() => setRole("viewer")}
              id="role-viewer-btn"
            >
              <Eye size={12} className="inline align-middle" />
              Viewer
            </button>
          </div>
        </div>

        <button
          className="theme-toggle-btn mt-4 mx-3 w-[calc(100%-1rem)] rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2"
          onClick={() => setDarkMode(!darkMode)}
          id="theme-toggle-btn"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
