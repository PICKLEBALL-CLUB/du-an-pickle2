import React, { useState } from 'react';
import { X, Dices, RotateCcw, Download, Upload, Settings, Sparkles, Coffee, Lock } from 'lucide-react';
import { Player, GroupSettings, UserRole } from '../types';

interface ToolsModalProps {
  players: Player[];
  settings: GroupSettings;
  onUpdateSettings: (settings: GroupSettings) => void;
  onResetData: () => void;
  onClose: () => void;
  userRole?: UserRole;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  players,
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
  userRole = 'admin',
}) => {
  const [activeTab, setActiveTab] = useState<'picker' | 'settings' | 'data' | 'vercel'>('picker');

  // Lucky Draw State
  const [luckyResult, setLuckyResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Form State
  const [groupName, setGroupName] = useState<string>(settings.groupName);
  const [monthlyFee, setMonthlyFee] = useState<number>(settings.memberMonthlyFee);
  const [pointsToWin, setPointsToWin] = useState<number>(settings.pointsToWin);
  const [defaultCourtCount, setDefaultCourtCount] = useState<number>(settings.defaultCourtCount);

  const presentPlayers = players.filter((p) => p.status === 'present');

  const handlePickLuckyPerson = () => {
    if (presentPlayers.length === 0) {
      alert('Không có thành viên nào đang có mặt!');
      return;
    }

    setIsSpinning(true);
    setLuckyResult(null);

    let count = 0;
    const interval = setInterval(() => {
      const randomP = presentPlayers[Math.floor(Math.random() * presentPlayers.length)];
      setLuckyResult(randomP.name);
      count++;

      if (count >= 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      groupName: groupName.trim() || 'Nhóm Pickleball 12 Người',
      memberMonthlyFee: monthlyFee,
      pointsToWin,
      defaultCourtCount,
    });
    alert('Đã lưu cài đặt nhóm thành công!');
  };

  const handleExportData = () => {
    const data = {
      players: localStorage.getItem('pickle_group_players_v1'),
      rounds: localStorage.getItem('pickle_group_rounds_v1'),
      funds: localStorage.getItem('pickle_group_funds_v1'),
      settings: localStorage.getItem('pickle_group_settings_v1'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickleball_12_group_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Tab Switcher */}
        <div className="flex border-b border-slate-800 pb-3 mb-4 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('picker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'picker' ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎲 Bốc Thăm
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings' ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Cài Đặt
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'data' ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💾 Dữ Liệu
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'vercel' ? 'bg-sky-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Deploy Vercel
          </button>
        </div>

        {/* Tab 1: Lucky Draw */}
        {activeTab === 'picker' && (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 min-h-[120px] flex flex-col items-center justify-center">
              <div className="text-xs text-slate-400 mb-2">
                Bốc thăm 1 thành viên ngẫu nhiên (Ví dụ: Bao nước / Nhặt bóng / Mở màn):
              </div>
              {luckyResult ? (
                <div
                  className={`text-2xl font-black ${
                    isSpinning ? 'text-amber-400 animate-pulse' : 'text-lime-300 scale-105'
                  }`}
                >
                  🎉 {luckyResult}
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-500">Bấm nút bên dưới để quay!</div>
              )}
            </div>

            <button
              onClick={handlePickLuckyPerson}
              disabled={isSpinning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Dices className="w-5 h-5" />
              <span>Quay Ngẫu Nhiên Thành Viên</span>
            </button>
          </div>
        )}

        {/* Tab 2: Group Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tên nhóm Pickleball</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tiền quỹ thành viên (đ/tháng)</label>
              <input
                type="number"
                step="50000"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mốc điểm thắng</label>
                <select
                  value={pointsToWin}
                  onChange={(e) => setPointsToWin(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={11}>11 Điểm (Tiêu chuẩn)</option>
                  <option value={15}>15 Điểm (Nhanh)</option>
                  <option value={21}>21 Điểm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số sân mặc định</label>
                <select
                  value={defaultCourtCount}
                  onChange={(e) => setDefaultCourtCount(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={1}>1 Sân</option>
                  <option value={2}>2 Sân (Khuyên dùng)</option>
                  <option value={3}>3 Sân</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 cursor-pointer"
              >
                Lưu Cài Đặt
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Data Management */}
        {activeTab === 'data' && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2">
              <div>Sao lưu hoặc khôi phục dữ liệu 12 thành viên & lịch sử trận đấu:</div>
              <button
                onClick={handleExportData}
                className="w-full py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-lime-400" />
                <span>Tải File Backup Dữ Liệu (.JSON)</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2">
              <div className="font-bold text-rose-400">Khôi phục Dữ Liệu Mẫu Ban Đầu:</div>
              <p className="text-[11px] text-slate-400">
                Đặt lại 12 thành viên mặc định, số liệu điểm và lịch sử quỹ nhóm ban đầu.
              </p>
              <button
                onClick={() => {
                  if (confirm('Xác nhận đặt lại toàn bộ ứng dụng về dữ liệu ban đầu?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Về Dữ Liệu Mẫu</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Vercel Deploy Guide */}
        {activeTab === 'vercel' && (
          <div className="space-y-3.5 py-1 text-xs">
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2 font-bold text-sky-400 mb-1.5 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L24 22H0L12 1Z" />
                </svg>
                <span>Sẵn Sàng Hỗ Trợ Deploy Vercel</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Ứng dụng <b>Đấu trường Pickleball</b> đã được tối ưu sẵn file cấu hình <code className="bg-slate-800 px-1 py-0.5 rounded text-lime-300">vercel.json</code> tiêu chuẩn Single Page App (SPA).
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-extrabold text-slate-200 text-xs">Các bước đưa lên Vercel trong 1 phút:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
                <li>Xuất/Tải mã nguồn dự án (hoặc Push lên GitHub repository).</li>
                <li>Mở <span className="text-sky-300 font-bold">Vercel.com</span> → Bấm <b>Add New Project</b>.</li>
                <li>Chọn repository → Vercel sẽ tự phát hiện Vite & Build Command <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">npm run build</code>.</li>
                <li>Nhấn <b>Deploy</b> → Bạn có ngay 1 link <code className="text-lime-300">dautruongpickleball.vercel.app</code> để gửi trực tiếp cho 12 thành viên nhóm!</li>
              </ol>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 font-semibold">
              ✨ <b>Không cần cài ứng dụng:</b> Mọi thành viên chỉ cần bấm link Vercel trên iPhone/Android/Máy tính là dùng mượt mà tức thì!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
