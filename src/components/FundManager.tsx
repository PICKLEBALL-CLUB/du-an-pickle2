import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Check, X, Calculator, Receipt, Lock, Edit3, Trash2 } from 'lucide-react';
import { FundTransaction, Player, FundCategory, UserRole } from '../types';

interface FundManagerProps {
  transactions: FundTransaction[];
  players: Player[];
  monthlyFee: number;
  onAddTransaction: (tx: Omit<FundTransaction, 'id'>) => void;
  onEditTransaction?: (tx: FundTransaction) => void;
  onDeleteTransaction?: (id: string) => void;
  onToggleFundStatus: (playerId: string) => void;
  userRole?: UserRole;
}

export const FundManager: React.FC<FundManagerProps> = ({
  transactions,
  players,
  monthlyFee,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onToggleFundStatus,
  userRole = 'admin',
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<FundTransaction | null>(null);
  const [showSplitterModal, setShowSplitterModal] = useState<boolean>(false);

  const handleOpenAddModal = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền tạo khoản thu/chi quỹ!');
      return;
    }
    setShowAddModal(true);
  };

  // Edit & Delete handlers
  const handleStartEdit = (tx: FundTransaction) => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền chỉnh sửa khoản thu/chi!');
      return;
    }
    setEditingTransaction(tx);
  };

  const handleDelete = (id: string, title: string) => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền xóa khoản thu/chi!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa khoản thu/chi "${title}" không?`)) {
      if (onDeleteTransaction) {
        onDeleteTransaction(id);
      }
    }
  };

  const handleTogglePlayerFund = (playerId: string) => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền cập nhật trạng thái đóng quỹ!');
      return;
    }
    onToggleFundStatus(playerId);
  };

  // Form states
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<FundCategory>('court_fee');
  const [payerOrPayee, setPayerOrPayee] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // Splitter Calculator states
  const [splitAmount, setSplitAmount] = useState<number>(500000);
  const [splitPeopleCount, setSplitPeopleCount] = useState<number>(12);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const fundBalance = totalIncome - totalExpense;

  const paidPlayersCount = players.filter((p) => p.fundStatus === 'paid').length;

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Vui lòng nhập tên khoản thu/chi và số tiền hợp lệ!');
      return;
    }

    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      payerOrPayee: payerOrPayee.trim(),
      note: note.trim(),
    });

    setShowAddModal(false);
    setTitle('');
    setAmount('');
    setPayerOrPayee('');
    setNote('');
  };

  const categoryLabels: Record<FundCategory, { label: string; color: string }> = {
    court_fee: { label: 'Thuê sân', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    ball: { label: 'Bóng tập', color: 'bg-lime-500/20 text-lime-300 border-lime-500/30' },
    water_drink: { label: 'Nước uống', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    member_fee: { label: 'Thu quỹ', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    party: { label: 'Tiệc tùng', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    other: { label: 'Khác', color: 'bg-slate-700 text-slate-300 border-slate-600' },
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>SỐ DƯ QUỸ NHÓM TỔNG</span>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {fundBalance.toLocaleString('vi-VN')} đ
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Trạng thái: {fundBalance >= 0 ? 'Dư dả hoạt động' : 'Đang âm quỹ nhẹ'}
          </p>
        </div>

        {/* Income Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>TỔNG THU VÀO</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">
            +{totalIncome.toLocaleString('vi-VN')} đ
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Gồm tiền đóng quỹ & đóng góp giao lưu
          </p>
        </div>

        {/* Expense Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>TỔNG CHI RA</span>
            <ArrowDownRight className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">
            -{totalExpense.toLocaleString('vi-VN')} đ
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Thuê sân, bóng Franklin, nước uống
          </p>
        </div>
      </div>

      {/* Action Bar & Quick Splitter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-white text-base">Thu Chi & Quỹ Định Kỳ</h3>
          <p className="text-xs text-slate-400">
            Hạn đóng quỹ: Mức đóng <strong className="text-lime-300">{monthlyFee.toLocaleString('vi-VN')} đ/tháng</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowSplitterModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-lime-400" />
            <span>Chia Tiền Nhanh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khoản Thu/Chi</span>
          </button>
        </div>
      </div>

      {/* Member Fund Payment Checklist (12 Members) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-lime-400" />
            <span>Trạng Thái Đóng Quỹ Tháng Này ({paidPlayersCount}/12 Thành Viên Đã Đóng)</span>
          </h3>
          <span className="text-xs font-bold text-lime-400">
            Dự kiến thu: {(12 * monthlyFee).toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => handleTogglePlayerFund(p.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                p.fundStatus === 'paid'
                  ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              <div className="font-bold text-white text-xs truncate">{p.name}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-400">
                  {monthlyFee.toLocaleString('vi-VN')} đ
                </span>
                {p.fundStatus === 'paid' ? (
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/20">
                    ✓ Đã đóng
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.2 rounded bg-rose-500/20">
                    Chưa
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-800 font-bold text-white text-sm">
          Nhật Ký Thu Chi Chi Tiết
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/40 text-slate-400 uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Nội dung / Diễn giải</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4">Đối tác / Người nộp</th>
                <th className="py-3 px-4 text-right">Số tiền</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-4 font-mono text-slate-400 text-xs">{t.date}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{t.title}</div>
                    {t.note && <div className="text-[11px] text-slate-400">{t.note}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        categoryLabels[t.category]?.color || 'bg-slate-700 text-white'
                      }`}
                    >
                      {categoryLabels[t.category]?.label || t.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{t.payerOrPayee || '—'}</td>
                  <td
                    className={`py-3 px-4 text-right font-black ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {t.amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleStartEdit(t)}
                        className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                        title="Chỉnh sửa khoản này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                        title="Xóa khoản này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-4">Ghi Nhận Thu / Chi Quỹ Nhóm</h3>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'
                  }`}
                >
                  Khoản Chi Out (-)
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'
                  }`}
                >
                  Khoản Thu In (+)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên khoản *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tiền thuê sân tối thứ 6, Mua 12 quả bóng..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số tiền (VNĐ) *</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FundCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="court_fee">Thuê sân Pickleball</option>
                  <option value="ball">Mua bóng thi đấu</option>
                  <option value="water_drink">Nước uống / Đá</option>
                  <option value="member_fee">Thu tiền quỹ định kỳ</option>
                  <option value="party">Giao lưu / Tiệc tùng</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Người nhận / Nộp tiền</label>
                <input
                  type="text"
                  placeholder="VD: Chủ sân / Minh Pickleball..."
                  value={payerOrPayee}
                  onChange={(e) => setPayerOrPayee(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  placeholder="VD: Buổi tập 2 tiếng ngày 29/7"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-extrabold hover:bg-lime-300 cursor-pointer"
                >
                  Lưu Khoản Thu/Chi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Splitter Calculator Modal */}
      {showSplitterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowSplitterModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-4 text-lime-300">Công Cụ Chia Tiền Sân / Ăn Uống Nhanh</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tổng hoá đơn (VNĐ)</label>
                <input
                  type="number"
                  step="10000"
                  value={splitAmount}
                  onChange={(e) => setSplitAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-lime-300 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số người chia (Có mặt)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={splitPeopleCount}
                  onChange={(e) => setSplitPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
                <div className="text-xs text-slate-400">Mỗi người cần đóng:</div>
                <div className="text-2xl font-black text-amber-300 my-1">
                  {Math.ceil(splitAmount / (splitPeopleCount || 1)).toLocaleString('vi-VN')} đ
                </div>
                <p className="text-[11px] text-slate-400">
                  (Đã làm tròn lên số đẹp dễ chuyển khoản)
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSplitterModal(false)}
                  className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onSave={(updatedTx) => {
            if (onEditTransaction) {
              onEditTransaction(updatedTx);
            }
            setEditingTransaction(null);
          }}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
};

interface EditTransactionModalProps {
  transaction: FundTransaction;
  onSave: (tx: FundTransaction) => void;
  onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(transaction.title);
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [category, setCategory] = useState<FundCategory>(transaction.category);
  const [payerOrPayee, setPayerOrPayee] = useState<string>(transaction.payerOrPayee || '');
  const [note, setNote] = useState<string>(transaction.note || '');
  const [date, setDate] = useState<string>(transaction.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Vui lòng nhập tên khoản thu/chi và số tiền hợp lệ!');
      return;
    }

    onSave({
      ...transaction,
      date,
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      payerOrPayee: payerOrPayee.trim(),
      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4 text-amber-300">Chỉnh Sửa Khoản Thu / Chi Quỹ</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'
              }`}
            >
              Khoản Chi Out (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'
              }`}
            >
              Khoản Thu In (+)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ngày thực hiện</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tên khoản *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Số tiền (VNĐ) *</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FundCategory)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="court_fee">Thuê sân Pickleball</option>
              <option value="ball">Mua bóng thi đấu</option>
              <option value="water_drink">Nước uống / Đá</option>
              <option value="member_fee">Thu tiền quỹ định kỳ</option>
              <option value="party">Giao lưu / Tiệc tùng</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Người nhận / Nộp tiền</label>
            <input
              type="text"
              value={payerOrPayee}
              onChange={(e) => setPayerOrPayee(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú thêm</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 cursor-pointer"
            >
              Cập Nhật Khoản Thu/Chi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
