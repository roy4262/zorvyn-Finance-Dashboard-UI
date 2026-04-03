import { Search, Globe, Bell, ChevronDown } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const Header = () => {
  const { role, setRole } = useDashboard();
  return (
    <header className="h-20 bg-white/40 dark:bg-transparent backdrop-blur-md dark:backdrop-blur-none flex items-center justify-between px-8 z-20 sticky top-0 transition-colors duration-300 border-b border-slate-200 dark:border-none">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search everywhere..."
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-200 placeholder-slate-500 pl-12 pr-20 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm backdrop-blur-md"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-white/5">
            Cmd×K
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 ml-8">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 backdrop-blur-md cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
          <span className="text-xs font-medium">English</span>
          <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        </div>

        <div className="relative p-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group backdrop-blur-md">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
        </div>

        <div className="flex items-center space-x-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 pl-4 pr-1 py-1 rounded-xl group hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer relative backdrop-blur-md">
          <div className="text-right flex flex-col justify-center mr-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Elon Musk
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Businessman
            </span>
          </div>
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
            <img
              src="https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <button
          className={cn(
            "text-[10px] font-bold px-4 py-2 rounded-lg border transition-all shadow-sm dark:shadow-lg",
            role === "admin"
              ? "bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
              : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400",
          )}
          onClick={() => setRole(role === "admin" ? "viewer" : "admin")}
        >
          {role === "admin" ? "ADMIN" : "VIEWER"}
        </button>
      </div>
    </header>
  );
};


export default Header;
