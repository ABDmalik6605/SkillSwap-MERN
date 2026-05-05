import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCredits, addTransaction } from './creditsSlice.js';
import { Icons, Icon } from '../../utils/icons.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const CreditsPage = () => {
  const dispatch = useDispatch();
  const { balance, transactions, status } = useSelector((state) => state.credits);
  const [form, setForm] = useState({ type: 'credit', amount: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCredits());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(form.amount, 10);
    if (!amount || amount < 1) return toast.error('Enter a valid amount');
    const result = await dispatch(addTransaction({ ...form, amount }));
    if (result.error) {
      toast.error(result.payload?.message || 'Transaction failed');
    } else {
      toast.success(`${form.type === 'credit' ? '✅ Credited' : '💸 Debited'} ${amount} skill credit(s)!`);
      setForm({ type: 'credit', amount: '', description: '' });
      setShowForm(false);
    }
  };

  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
            <Icon icon={Icons.trophy} size="lg" />
            Skill Credits
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Earn credits by teaching, spend them learning.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="btn-gradient flex items-center gap-2 shrink-0"
        >
          <Icon icon={showForm ? Icons.close : Icons.edit} size="md" />
          {showForm ? 'Cancel' : 'Add Transaction'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            label: 'Current Balance',
            value: balance,
            icon: Icons.sparklesSolid,
            gradient: 'from-blue-500 to-cyan-500',
            suffix: ' credits'
          },
          {
            label: 'Total Earned',
            value: totalCredits,
            icon: Icons.checkSolid,
            gradient: 'from-green-500 to-teal-500',
            suffix: ' credits'
          },
          {
            label: 'Total Spent',
            value: totalDebits,
            icon: Icons.bolt,
            gradient: 'from-purple-500 to-pink-500',
            suffix: ' credits'
          }
        ].map(({ label, value, icon, gradient, suffix }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 shadow-2xl bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">{label}</p>
                <Icon icon={icon} size="xl" className="text-white/90" />
              </div>
              <p className="text-3xl sm:text-4xl font-black">
                {status === 'loading' ? '…' : value}
                <span className="text-base font-semibold opacity-80">{suffix}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 shadow-xl space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-lg text-slate-900">New Transaction</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white"
              >
                <option value="credit">Credit (Earned)</option>
                <option value="debit">Debit (Spent)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (credits)</label>
              <input
                type="number"
                min={1}
                required
                placeholder="e.g. 5"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <input
              required
              placeholder="e.g. Taught React for 1 hour"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="btn-gradient">Record Transaction</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Transaction History / Cash Flow Statement */}
      <div className="glass rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-white/30">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Icon icon={Icons.inbox} size="lg" className="text-brand-500" />
            Cash Flow Statement
          </h3>
          <p className="text-sm text-slate-500">Full history of credits earned and debits spent</p>
        </div>

        {status === 'loading' ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Icon icon={Icons.inbox} size="3xl" className="mx-auto mb-3 text-slate-300" />
            <p>No transactions yet. Add your first entry above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Description</th>
                  <th className="px-5 py-3 text-right">Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx._id} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-slate-800 font-medium">{tx.description}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-800">{tx.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsPage;
