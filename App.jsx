import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingDown, 
  PiggyBank, 
  PlusCircle, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  Search, 
  PieChart, 
  Settings, 
  RotateCcw,
  AlertCircle,
  X
} from 'lucide-react';

const INITIAL_BUDGET = 5000;

const INITIAL_EXPENSES = [
  { id: '1', description: 'Hackathon Refreshments & Pizza', amount: 840, category: 'Food & Catering', date: '2026-10-14' },
  { id: '2', description: 'Tech Symposium Posters & Badges', amount: 320, category: 'Marketing', date: '2026-10-22' },
  { id: '3', description: 'Robotics Workshop Sensor Kits (15x)', amount: 1250, category: 'Equipment & Supplies', date: '2026-11-01' },
  { id: '4', description: 'Club Website Domain & Cloud Hosting', amount: 160, category: 'Operations & Software', date: '2026-11-05' },
  { id: '5', description: 'Guest Speaker Travel Honorarium', amount: 450, category: 'Travel & Honorarium', date: '2026-11-08' },
];

const CATEGORIES = [
  { name: 'Food & Catering', color: '#f59e0b', bg: '#fef3c7' },
  { name: 'Marketing', color: '#ec4899', bg: '#fce7f3' },
  { name: 'Equipment & Supplies', color: '#3b82f6', bg: '#dbeafe' },
  { name: 'Operations & Software', color: '#8b5cf6', bg: '#ede9fe' },
  { name: 'Travel & Honorarium', color: '#10b981', bg: '#d1fae5' },
  { name: 'Miscellaneous', color: '#64748b', bg: '#f1f5f9' },
];

export default function App() {
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('clubfund_budget');
    return saved ? Number(saved) : INITIAL_BUDGET;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('clubfund_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  // New expense form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Catering',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    localStorage.setItem('clubfund_budget', budget.toString());
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('clubfund_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const spentPercent = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const newExpense = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      description: '',
      amount: '',
      category: 'Food & Catering',
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all expenses and budget to sample defaults?')) {
      setBudget(INITIAL_BUDGET);
      setExpenses(INITIAL_EXPENSES);
      localStorage.removeItem('clubfund_budget');
      localStorage.removeItem('clubfund_expenses');
    }
  };

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    if (tempBudget > 0) {
      setBudget(Number(tempBudget));
      setIsBudgetModalOpen(false);
    }
  };

  // Filtered expenses
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = selectedCategoryFilter === 'All' || exp.category === selectedCategoryFilter;
    const matchesSearch = exp.description.toLowerCase().includes(search.toLowerCase()) || 
                          exp.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate category totals
  const categoryTotals = CATEGORIES.map(cat => {
    const total = expenses
      .filter(exp => exp.category === cat.name)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const percentage = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
    return { ...cat, total, percentage };
  }).filter(c => c.total > 0);

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <Wallet size={22} />
            </div>
            <span>ClubFund</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setTempBudget(budget); setIsBudgetModalOpen(true); }}
              title="Edit Club Budget"
            >
              <Settings size={16} />
              <span>Budget Settings</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleResetData}
              title="Reset Sample Data"
            >
              <RotateCcw size={16} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        <div className="header-section">
          <div>
            <h1 className="title">Campus Club Treasury</h1>
            <p className="subtitle">Track semester event expenses, monitor budget allocations, and balance your club funds.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Record New Expense</span>
          </button>
        </div>

        {/* Financial Stat Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Allocated Budget</span>
              <span className="stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <PiggyBank size={22} />
              </span>
            </div>
            <div>
              <div className="stat-value">${budget.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                Fiscal Year 2026 Semester Pool
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Spent to Date</span>
              <span className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <TrendingDown size={22} />
              </span>
            </div>
            <div>
              <div className="stat-value" style={{ color: totalSpent > budget ? '#ef4444' : '#0f172a' }}>
                ${totalSpent.toLocaleString()}
              </div>
              <div className="stat-progress-bar">
                <div 
                  className="stat-progress-fill" 
                  style={{ 
                    width: `${spentPercent}%`, 
                    backgroundColor: spentPercent > 90 ? '#ef4444' : spentPercent > 70 ? '#f59e0b' : '#10b981' 
                  }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                <span>{spentPercent}% of budget consumed</span>
                <span>{expenses.length} transactions</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Remaining Balance</span>
              <span 
                className="stat-icon" 
                style={{ 
                  background: remaining < 0 ? '#fef2f2' : '#ecfdf5', 
                  color: remaining < 0 ? '#ef4444' : '#10b981' 
                }}
              >
                <DollarSign size={22} />
              </span>
            </div>
            <div>
              <div className="stat-value" style={{ color: remaining < 0 ? '#ef4444' : '#10b981' }}>
                ${remaining.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                {remaining >= 0 ? 'Funds available for future activities' : '⚠️ Over-budget warning'}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section: Transactions + Breakdown */}
        <div className="content-grid">
          {/* Left: Transaction History */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FileText size={18} />
                Recent Club Expenses
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2rem', height: '36px', fontSize: '0.8rem', width: '160px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ height: '36px', fontSize: '0.8rem', width: 'auto' }}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              {filteredExpenses.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <AlertCircle size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <p>No matching expenses found.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Expense Item</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((exp) => {
                      const catInfo = CATEGORIES.find(c => c.name === exp.category) || CATEGORIES[5];
                      return (
                        <tr key={exp.id}>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{exp.description}</strong>
                          </td>
                          <td>
                            <span 
                              className="badge" 
                              style={{ 
                                backgroundColor: catInfo.bg, 
                                color: catInfo.color 
                              }}
                            >
                              {exp.category}
                            </span>
                          </td>
                          <td style={{ color: '#64748b' }}>
                            {exp.date}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                            ${Number(exp.amount).toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-danger-ghost"
                              onClick={() => handleDeleteExpense(exp.id)}
                              title="Delete record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: Category Spending Breakdown */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <PieChart size={18} />
                Category Breakdown
              </h2>
            </div>
            <div className="card-body">
              {categoryTotals.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No spending data recorded yet.</p>
              ) : (
                <div className="category-bars">
                  {categoryTotals.map(cat => (
                    <div key={cat.name} className="category-row">
                      <div className="category-info">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span>
                          ${cat.total.toLocaleString()} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="category-bar-bg">
                        <div 
                          className="category-bar-fill"
                          style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Auditing Tip for Treasurers
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                  Keep physical receipts or digital invoices for every item recorded here. Club funding reviews require proof of purchase matching these records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">
                <PlusCircle size={20} color="#4f46e5" />
                Record Club Expense
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="card-body">
              <div className="form-group">
                <label className="form-label">Description / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pizza for Club Orientation"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Spending Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Purchase</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Setting Modal */}
      {isBudgetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="card-title">
                <Settings size={20} color="#4f46e5" />
                Adjust Semester Budget
              </h3>
              <button 
                onClick={() => setIsBudgetModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateBudget} className="card-body">
              <div className="form-group">
                <label className="form-label">Total Allocated Budget ($)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  className="form-input"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                />
                <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Set the total funds sanctioned by the Student Union or university board.
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsBudgetModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>ClubFund &copy; 2026 — Student Society Budget & Expense Management</p>
      </footer>
    </div>
  );
}

