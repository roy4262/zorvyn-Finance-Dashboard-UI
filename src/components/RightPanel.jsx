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
  const { budgets } = useDashboard();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Car":
        return <Car className="w-4 h-4" />;
      case "Plane":
        return <Plane className="w-4 h-4" />;
      case "Shield":
        return <Shield className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Credit Card Section */}
      <div className="relative aspect-[1.58/1] w-full group overflow-hidden rounded-[1.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-[#222f3e] text-white p-6 pt-4 sm:p-8 sm:pt-6 font-sans">
        {/* Mesh/Dot Pattern with circular mask */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.8px, transparent 0.8px)",
            backgroundSize: "8px 8px",
            maskImage:
              "radial-gradient(circle at 75% 50%, black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 75% 50%, black, transparent 70%)",
          }}
        />

        {/* Curved Design Line */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          viewBox="0 0 400 240"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M160 0 C 160 100, 240 140, 400 140"
            stroke="white"
            strokeWidth="1.2"
          />
        </svg>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-2xl sm:text-3xl font-medium tracking-tight">
              Mastercard
            </span>
            <div className="opacity-90">
              <Wifi className="w-6 h-6 sm:w-8 sm:h-8 rotate-90" />
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-4">
            {/* Chip */}
            <div className="w-10 h-8 sm:w-14 sm:h-11 bg-gradient-to-br from-[#dcdde1] to-[#7f8c8d] rounded-md sm:rounded-lg relative overflow-hidden flex flex-col justify-center px-1.5 sm:px-2">
              <div className="h-[1px] bg-black w-full mb-1"></div>
              <div className="h-[1px] bg-black w-full mb-1"></div>
              <div className="h-[1px] bg-black w-full"></div>
              <div className="absolute inset-0 border-[1px] border-black/10 rounded-md sm:rounded-lg"></div>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.1em] text-white whitespace-nowrap overflow-hidden text-ellipsis">
                8 9 4 5 * * * 8 2 7 4
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col space-y-0.5 sm:space-y-1">
                  <div className="flex flex-col">
                    <span className="text-[5px] sm:text-[6px] uppercase font-bold text-white/60 tracking-widest leading-none">
                      VALID THRU
                    </span>
                    <span className="text-sm sm:text-lg font-normal tracking-wide">
                      12/29
                    </span>
                  </div>
                  <div className="text-sm sm:text-lg font-normal tracking-wide truncate max-w-[150px] sm:max-w-none">
                    Elon Musk
                  </div>
                </div>

                {/* Mastercard Logo */}
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#eb001b]"></div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#f79e1b] -ml-4 sm:-ml-6 opacity-90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-colors overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Your Balance
          </p>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 transition-all group-hover:bg-emerald-500/20">
            +1.10%
          </span>
        </div>
        <div className="flex items-baseline space-x-2 relative z-10">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            $615,842
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">
            / Total / Week
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/50 relative z-10">
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">
              Currency
            </p>
            <p className="text-[10px] font-bold text-white tracking-tight uppercase">
              USD / U3 Dollar
            </p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">
              Status
            </p>
            <p className="text-[10px] font-bold text-emerald-500 tracking-tight uppercase">
              Active
            </p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">
              Exp
            </p>
            <p className="text-[10px] font-bold text-white tracking-tight uppercase">
              12/14
            </p>
          </div>
        </div>

        <button className="w-full mt-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center space-x-2 border-dashed relative z-10">
          <Plus className="w-4 h-4" />
          <span>Link new account</span>
        </button>
      </div>

      {/* Budgeting Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-colors shadow-2xl shadow-blue-500/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Budgeting
          </h3>
          <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors flex items-center">
            View All <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = Math.round(
              (budget.current / budget.total) * 100,
            );
            return (
              <div key={budget.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                        percentage > 90
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : percentage > 70
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                      )}
                    >
                      {getIcon(budget.icon)}
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {budget.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-tight">
                    ${budget.current.toLocaleString()} / $
                    {budget.total.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      percentage > 90
                        ? "bg-rose-500"
                        : percentage > 70
                          ? "bg-amber-500"
                          : "bg-blue-500",
                    )}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {percentage}% complete
                  </p>
                  {percentage > 95 && (
                    <span className="text-[9px] text-rose-400 font-bold animate-pulse">
                      ALMOST FULL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
