import { createContext, useContext, useReducer, useEffect } from "react";

const DashboardContext = createContext();

const initialTransactions = [
  // April 2026
  {
    id: "tx-apr-02",
    name: "Server Infrastructure",
    type: "Expense",
    date: "APR 02, 2026",
    time: "At 10:00 AM",
    amount: 1200.0,
    status: "Completed",
    icon: "🌐",
    category: "Infrastructure",
  },
  {
    id: "tx-apr-02-inc",
    name: "Digital Product Sales",
    type: "Income",
    date: "APR 02, 2026",
    time: "At 03:00 PM",
    amount: 3200.0,
    status: "Completed",
    icon: "🛒",
    category: "Revenue",
  },
  {
    id: "tx-apr-01-inc",
    name: "Monthly Revenue",
    type: "Income",
    date: "APR 01, 2026",
    time: "At 09:00 AM",
    amount: 15000.0,
    status: "Completed",
    icon: "💰",
    category: "Revenue",
  },
  {
    id: "tx-apr-01-exp",
    name: "Marketing Campaign",
    type: "Expense",
    date: "APR 01, 2026",
    time: "At 02:00 PM",
    amount: 1800.0,
    status: "Completed",
    icon: "📢",
    category: "Marketing",
  },
  // March 2026
  {
    id: "tx-mar-28",
    name: "Freelance Payment",
    type: "Income",
    date: "MAR 28, 2026",
    time: "At 11:30 AM",
    amount: 3500.0,
    status: "Completed",
    icon: "💻",
    category: "Freelance",
  },
  {
    id: "tx-mar-28-exp",
    name: "Travel Expenses",
    type: "Expense",
    date: "MAR 28, 2026",
    time: "At 04:00 PM",
    amount: 450.0,
    status: "Completed",
    icon: "✈️",
    category: "Travel",
  },
  {
    id: "tx-mar-23",
    name: "Client Payment",
    type: "Income",
    date: "MAR 23, 2026",
    time: "At 10:00 AM",
    amount: 6200.0,
    status: "Completed",
    icon: "💼",
    category: "Revenue",
  },
  {
    id: "tx-mar-23-exp",
    name: "Software Tools",
    type: "Expense",
    date: "MAR 23, 2026",
    time: "At 02:00 PM",
    amount: 280.0,
    status: "Completed",
    icon: "🛠️",
    category: "Equipment",
  },
  {
    id: "tx-mar-18",
    name: "Consulting Project",
    type: "Income",
    date: "MAR 18, 2026",
    time: "At 09:30 AM",
    amount: 4800.0,
    status: "Completed",
    icon: "🤝",
    category: "Freelance",
  },
  {
    id: "tx-mar-18-exp",
    name: "Coffee Shop Meeting",
    type: "Expense",
    date: "MAR 18, 2026",
    time: "At 03:00 PM",
    amount: 85.0,
    status: "Completed",
    icon: "☕",
    category: "Dining",
  },
  {
    id: "tx-mar-13",
    name: "Domain Renewal",
    type: "Expense",
    date: "MAR 13, 2026",
    time: "At 11:00 AM",
    amount: 150.0,
    status: "Completed",
    icon: "🌐",
    category: "Subscription",
  },
  {
    id: "tx-mar-13-inc",
    name: "Affiliate Commission",
    type: "Income",
    date: "MAR 13, 2026",
    time: "At 05:00 PM",
    amount: 1200.0,
    status: "Completed",
    icon: "💰",
    category: "Revenue",
  },
  {
    id: "tx-mar-08",
    name: "Business Lunch",
    type: "Expense",
    date: "MAR 08, 2026",
    time: "At 01:00 PM",
    amount: 175.0,
    status: "Completed",
    icon: "🍽️",
    category: "Dining",
  },
  {
    id: "tx-mar-08-inc",
    name: "Project Milestone",
    type: "Income",
    date: "MAR 08, 2026",
    time: "At 10:00 AM",
    amount: 7500.0,
    status: "Completed",
    icon: "🎯",
    category: "Revenue",
  },
  {
    id: "tx-mar-25",
    name: "Office Supplies",
    type: "Expense",
    date: "MAR 25, 2026",
    time: "At 03:00 PM",
    amount: 250.0,
    status: "Completed",
    icon: "📦",
    category: "Equipment",
  },
  {
    id: "tx-mar-20",
    name: "Client Project B",
    type: "Income",
    date: "MAR 20, 2026",
    time: "At 10:00 AM",
    amount: 8000.0,
    status: "Completed",
    icon: "📈",
    category: "Revenue",
  },
  {
    id: "tx-mar-15",
    name: "Cloud Hosting",
    type: "Expense",
    date: "MAR 15, 2026",
    time: "At 09:00 AM",
    amount: 1100.0,
    status: "Completed",
    icon: "🌐",
    category: "Infrastructure",
  },
  {
    id: "tx-mar-10",
    name: "Team Dinner",
    type: "Expense",
    date: "MAR 10, 2026",
    time: "At 08:00 PM",
    amount: 320.0,
    status: "Completed",
    icon: "🍽️",
    category: "Dining",
  },
  {
    id: "tx-mar-01",
    name: "Monthly Revenue",
    type: "Income",
    date: "MAR 01, 2026",
    time: "At 09:00 AM",
    amount: 14500.0,
    status: "Completed",
    icon: "💰",
    category: "Revenue",
  },
  // February 2026
  {
    id: "tx-feb-25",
    name: "New Monitor",
    type: "Expense",
    date: "FEB 25, 2026",
    time: "At 11:00 AM",
    amount: 400.0,
    status: "Completed",
    icon: "💻",
    category: "Equipment",
  },
  {
    id: "tx-feb-20",
    name: "Consulting Fee",
    type: "Income",
    date: "FEB 20, 2026",
    time: "At 02:00 PM",
    amount: 4200.0,
    status: "Completed",
    icon: "🤝",
    category: "Freelance",
  },
  {
    id: "tx-feb-15",
    name: "Software License",
    type: "Expense",
    date: "FEB 15, 2026",
    time: "At 10:00 AM",
    amount: 600.0,
    status: "Completed",
    icon: "📝",
    category: "Subscription",
  },
  {
    id: "tx-feb-01",
    name: "Monthly Revenue",
    type: "Income",
    date: "FEB 01, 2026",
    time: "At 09:00 AM",
    amount: 13800.0,
    status: "Completed",
    icon: "💰",
    category: "Revenue",
  },
  // January 2026
  {
    id: "tx-jan-20",
    name: "Office Rent",
    type: "Expense",
    date: "JAN 20, 2026",
    time: "At 09:00 AM",
    amount: 2500.0,
    status: "Completed",
    icon: "🏠",
    category: "Housing",
  },
  {
    id: "tx-jan-15",
    name: "Project Bonus",
    type: "Income",
    date: "JAN 15, 2026",
    time: "At 04:00 PM",
    amount: 2000.0,
    status: "Completed",
    icon: "🎁",
    category: "Gift",
  },
  {
    id: "tx-jan-01",
    name: "Monthly Revenue",
    type: "Income",
    date: "JAN 01, 2026",
    time: "At 09:00 AM",
    amount: 14000.0,
    status: "Completed",
    icon: "💰",
    category: "Revenue",
  },
];

const initialState = {
  transactions: initialTransactions,
  role: "admin",
  darkMode: true,
  budgets: [
    {
      id: 1,
      name: "Tesla Fund",
      current: 4100,
      total: 55000,
      category: "Transport",
      icon: "Car",
    },
    {
      id: 2,
      name: "Italy Trip",
      current: 6900,
      total: 7000,
      category: "Travel",
      icon: "Plane",
    },
    {
      id: 3,
      name: "Emergency Fund",
      current: 15000,
      total: 25000,
      category: "Savings",
      icon: "Shield",
    },
  ],
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION": {
      const now = new Date();
      const payloadDate = action.payload.date
        ? new Date(action.payload.date)
        : now;
      const transaction = {
        ...action.payload,
        id: Date.now(),
        date: payloadDate
          .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          .toUpperCase(),
        time:
          action.payload.time ||
          `At ${now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
      };
      return {
        ...state,
        transactions: [transaction, ...state.transactions],
      };
    }
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                ...action.payload,
                date: new Date(action.payload.date)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  .toUpperCase(),
                time: action.payload.time || t.time,
              }
            : t,
        ),
      };
    case "SET_ROLE":
      return {
        ...state,
        role: action.payload,
      };
    case "TOGGLE_DARK_MODE":
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.id === action.payload.id
            ? { ...b, current: b.current + action.payload.amount }
            : b,
        ),
      };
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState, () => {
    const saved = localStorage.getItem("transactions");
    if (!saved) {
      return { ...initialState, transactions: initialTransactions };
    }

    let parsed = [];
    try {
      parsed = JSON.parse(saved);
    } catch (error) {
      parsed = [];
    }

    const existingIds = new Set(parsed.map((tx) => tx.id));
    const newItems = initialTransactions.filter(
      (tx) => !existingIds.has(tx.id),
    );
    const mergedTransactions = [...parsed, ...newItems];

    return {
      ...initialState,
      transactions: mergedTransactions,
    };
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  const addTransaction = (newTransaction) => {
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const setRole = (role) => {
    dispatch({ type: "SET_ROLE", payload: role });
  };

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  const updateBudget = (id, amount) => {
    dispatch({ type: "UPDATE_BUDGET", payload: { id, amount } });
  };

  return (
    <DashboardContext.Provider
      value={{
        transactions: state.transactions,
        role: state.role,
        setRole,
        darkMode: state.darkMode,
        setDarkMode: toggleDarkMode,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgets: state.budgets,
        updateBudget,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
