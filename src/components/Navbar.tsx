import React from 'react';
import { Users, Trophy, Wallet, Settings, Activity, BookOpen, LogIn, LogOut, Shield, User, Smartphone } from 'lucide-react';
import { Player, AuthUser } from '../types';

export type TabType = 'courts' | 'roster' | 'leaderboard' | 'funds' | 'rules';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  players: Player[];
  fundBalance: number;
  openTools: () => void;
  currentUser: AuthUser | null;
  openAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  players,
  fundBalance,
  openTools,
  currentUser,
  openAuthModal,
  onLogout,
}) => {
  const presentCount = players.filter((p) => p.status === 'present').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 via-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-lime-500/25 ring-2 ring-lime-400/30">
              🏓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-lime-300 via-emerald-200 to-white bg-clip-text text-transparent">
                  Đấu trường Pickleball
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-400/20 text-lime-300 border border-lime-400/30 tracking-wider uppercase">
                  Arena Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden xs:block">
                Xếp sân xoay vòng • Điểm số • Quỹ nhóm & Phân quyền
              </p>
            </div>
          </div>

          {/* Quick Stats Summary Bar */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            {/* Present count */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
              </span>
              <span className="text-slate-300">Có mặt:</span>
              <span className="font-bold text-lime-300">{presentCount}/12</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            {/* Fund Balance */}
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Quỹ nhóm:</span>
              <span
                className={`font-bold ${
                  fundBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {fundBalance.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Right Area: Auth User Badge & Actions */}
          <div className="flex items-center gap-2">
            {/* User Login Profile Pill */}
            {currentUser ? (
              <div
                onClick={openAuthModal}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
                title="Bấm để đổi quyền hoặc đăng nhập tài khoản khác"
              >
                {/* Method Icon */}
                {currentUser.method === 'google' ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                ) : (
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                )}

                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 leading-none group-hover:text-lime-300">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium leading-tight flex items-center gap-1">
                    {currentUser.role === 'admin' ? (
                      <span className="text-amber-400 font-bold">👑 Admin</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">👤 Member (Chỉ xem/Điểm danh)</span>
                    )}
                  </span>
                </div>

                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 group-hover:bg-lime-400 group-hover:text-slate-950 font-bold transition-all ml-1">
                  Đổi
                </span>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-lime-500/20 flex items-center gap-1.5 cursor-pointer hover:from-lime-300 hover:to-emerald-300 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Action Tools Button */}
            <button
              onClick={openTools}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-lime-300 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Cài đặt & Công cụ"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Công Cụ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2">
          <button
            onClick={() => setActiveTab('courts')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'courts'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 shadow-md shadow-lime-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Sân Đấu & Xếp Trận</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 shadow-md shadow-lime-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>12 Thành Viên ({presentCount}/12)</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 shadow-md shadow-lime-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Xếp Hạng</span>
          </button>

          <button
            onClick={() => setActiveTab('funds')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'funds'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 shadow-md shadow-lime-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Quỹ Nhóm & Thu Chi</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 shadow-md shadow-lime-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Luật Pickleball</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
