import { Search, Globe, Bell, ChevronDown } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const Header = () => {
  const { role, setRole } = useDashboard();
  return (
    <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search everywhere..."
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6 ml-8">
        <div className="flex items-center space-x-2 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            English
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="relative p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer group">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 border-2 border-slate-900 rounded-full"></span>
        </div>

        <div className="h-8 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700 pl-4 pr-1 py-1 rounded-xl group hover:border-slate-600 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -mr-12 -mt-12 rounded-full"></div>
          <div className="text-right flex flex-col justify-center relative z-10 mr-2">
            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
              Elon Musk
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Businessman
            </span>
          </div>
          <div className="relative w-9 h-9 ring-2 ring-slate-800 group-hover:ring-blue-500/50 rounded-lg overflow-hidden transition-all shadow-xl">
            <img
              src="https://image.cnbcfm.com/api/v1/image/107293744-1693398435735-elon.jpg?v=1738327797"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative group/role">
          <button
            className={cn(
              "text-[10px] font-bold px-4 py-2 rounded-lg border transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/10",
              role === "admin"
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-400",
            )}
          >
            <span>{role === "admin" ? "ADMIN" : "VIEWER"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl invisible group-hover/role:visible opacity-0 group-hover/role:opacity-100 transition-all z-50 p-1 overflow-hidden">
            {["admin", "viewer"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "w-full text-left px-3 py-2 text-[10px] font-bold rounded-lg transition-colors uppercase tracking-widest",
                  role === r
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
