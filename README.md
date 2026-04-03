<div align="center">

# 💎 Zorvyn Finance Dashboard UI
### *Master your finances with elegance and precision.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](https://github.com/lvirijala)

---

</div>

## 📖 About the Project

**Zorvyn Finance Dashboard** is a premium, interactive fintech interface designed for users who value clarity and control over their financial data. Built as a specialized **Frontend Developer Intern assignment**, this project demonstrates high-level component architecture, sophisticated state management, and a clean, modern aesthetic.

The objective was to create a seamless experience for tracking balances, visualizing spending trends, and managing transactions—all within a secure-feeling, role-based environment.

---

## 🚀 Live Demo & Preview

> [!IMPORTANT]
> **Live Demo:** [🔗 View Application](https://zorvyn-finance-dashboard.vercel.app) *(Placeholder)*

### 📸 Dashboard Screenshots
<div align="center">
  <table>
    <tr>
      <td><img src="https://via.placeholder.com/400x250.png?text=Main+Dashboard" alt="Dashboard" width="100%"/></td>
      <td><img src="https://via.placeholder.com/400x250.png?text=Transaction+Management" alt="Transactions" width="100%"/></td>
    </tr>
    <tr>
      <td align="center"><b>Strategic Overview</b></td>
      <td align="center"><b>Granular Control</b></td>
    </tr>
  </table>
</div>

---

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Summary Cards**: Real-time snapshots of Total Balance, Income, and Expenses.
- **Time-Based Trends**: High-fidelity line charts tracking financial health over time.
- **Categorical Breakdown**: Visual pie charts for instant spending pattern recognition.

### 💸 Transaction Management
- **Full CRUD**: Add, Edit, and Delete transactions with ease.
- **Smart Filtering**: Filter by category, type (Income/Expense), or date.
- **Search & Sort**: Instantly find transactions with optimized search logic.

### 🔐 Role-Based UI (RBAC Simulation)
| Feature | **Viewer** | **Admin** |
| :--- | :---: | :---: |
| View Dashboard | ✅ | ✅ |
| See Transactions | ✅ | ✅ |
| Add/Edit Data | ❌ | ✅ |
| Delete Entries | ❌ | ✅ |
*Toggle roles instantly via the header dropdown.*

### 🧠 Intelligent Insights
- **Highest Spending Category**: Auto-calculated based on current data.
- **Monthly Comparisons**: Behavioral analysis of spending habits.
- **Empty State Handling**: Graceful UI when no data is present.

---

## 🛠️ Tech Stack

- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [clsx](https://github.com/lukeed/clsx)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) + `useReducer`
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Local Storage API

---

## 📂 Project Structure

```bash
zorvyn/
├── src/
│   ├── components/       # Modular UI Components (Header, Sidebar, Charts)
│   ├── context/          # Centralized State Management (DashboardContext)
│   ├── utils/            # Helper Utilities (Tailwind-merge, cn)
│   ├── App.jsx           # Root Layout & Routing Logic
│   └── main.jsx          # Entry Point
├── public/               # Static Assets
└── tailwind.config.js    # Design Tokens & Theme Configuration
```

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/lvirijala/zorvyn-dashboard.git
   cd zorvyn-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🏆 Why This Project Stands Out

1. **Scalable State Architecture**: Used `useReducer` with Context API to handle complex global states like transactions, roles, and themes without external bloat.
2. **Design-First Thinking**: Implemented a "Glassmorphism" effect with background glows and subtle animations for a premium fintech feel.
3. **Data Integrity**: Built-in persistence ensures user data remains intact even after browser refreshes.
4. **Responsive Precision**: Mobile-first approach with a custom sidebar and responsive grid layouts.

---

## 🔮 Future Enhancements

- [ ] **AI-Powered Insights**: Suggesting budgets based on spending history.
- [ ] **Real-Time Sync**: Integration with Supabase or Firebase for multi-device sync.
- [ ] **Export Options**: Download financial reports in PDF/CSV format.
- [ ] **Notification Center**: Alerts for budget overruns or recurring payments.

---

## 👤 Author

**Lakshman Virijala**
- **GitHub**: [@lvirijala](https://github.com/lvirijala)
- **LinkedIn**: [Lakshman Virijala](https://linkedin.com/in/lvirijala)
- **Portfolio**: [lvirijala.com](https://lvirijala.com)

---

<div align="center">
  <em>Built with passion for crafting intuitive financial experiences.</em>
</div>
