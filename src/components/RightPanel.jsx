import {
  Plus,
  ChevronRight,
  Target,
  Plane,
  Car,
  Shield,
  Wifi,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../utils/cn";

const RightPanel = () => {
  return (
    <div className="space-y-6">
      {/* Credit Card Section */}
      <div className="relative aspect-[1.58/1] w-full group overflow-hidden rounded-[24px] shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-[#5d58f0] via-[#7b61ff] to-[#4c35de] p-8 font-sans border border-white/20">
        {/* Glow effect */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 h-full flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-4 border-white/90" />
              <span className="text-xl font-bold tracking-tight uppercase">
                Visa
              </span>
            </div>
            <span className="text-xs font-medium tracking-widest opacity-80 uppercase">
              Credit Card
            </span>
          </div>

          <div className="flex items-center gap-4 -mt-4">
            {/* Card Chip */}
            <div className="w-12 h-9 bg-gradient-to-br from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af] rounded-md relative overflow-hidden shadow-inner border border-white/20">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800" />
                <div className="absolute top-0 left-1/3 w-px h-full bg-slate-800" />
                <div className="absolute top-0 left-2/3 w-px h-full bg-slate-800" />
              </div>
            </div>
            <Wifi className="w-6 h-6 rotate-90 opacity-80" />
          </div>

          <div className="space-y-4">
            <div className="text-2xl font-medium tracking-[0.15em]">
              7609 41** **** 2976
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-medium tracking-widest opacity-80">
                  Cardholder Name
                </span>
                <span className="text-lg font-medium uppercase tracking-wider">
                  Elon Musk
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">
                  Valid Thru
                </span>
                <span className="text-sm font-medium">10/28</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Summary Card */}
      <div className="glass-card rounded-[24px] p-8 group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full"></div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Your Balance
          </p>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            +1.10%
          </span>
        </div>
        
        <div className="flex items-baseline mb-8 relative z-10">
          <h3 className="text-[42px] font-bold text-slate-900 dark:text-white tracking-tight">
            $615,842
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/5 relative z-10">
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-2">
              Currency
            </p>
            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              USD
            </p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-2">
              Status
            </p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
              Active
            </p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-2">
              Exp
            </p>
            <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              12/14
            </p>
          </div>
        </div>

        <button className="w-full mt-8 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 border-dashed text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center space-x-2 relative z-10">
          <Plus className="w-3 h-3" />
          <span>Link new account</span>
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
