import React, { useState } from 'react';
import { UserPlus, Search, Filter, CheckCircle2, RefreshCw } from 'lucide-react';
import { Player, UserRole } from '../types';
import { PlayerCard } from './PlayerCard';

interface PlayerRosterProps {
  players: Player[];
  onToggleStatus: (playerId: string) => void;
  onEditPlayer: (player: Player) => void;
  onAddPlayer: () => void;
  onToggleFundStatus: (playerId: string) => void;
  onMarkAllPresent: () => void;
  userRole?: UserRole;
}

export const PlayerRoster: React.FC<PlayerRosterProps> = ({
  players,
  onToggleStatus,
  onEditPlayer,
  onAddPlayer,
  onToggleFundStatus,
  onMarkAllPresent,
  userRole = 'admin',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');

  const handleAddPlayerClick = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền thêm thành viên mới vào danh sách!');
      return;
    }
    onAddPlayer();
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nickname && p.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'present') return matchesSearch && p.status === 'present';
    if (statusFilter === 'absent') return matchesSearch && p.status === 'absent';
    return matchesSearch;
  });

  const presentCount = players.filter((p) => p.status === 'present').length;
  const paidCount = players.filter((p) => p.fundStatus === 'paid').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
              <h2 className="text-lg font-extrabold text-white">Danh Sách 12 Thành Viên Nhóm</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Điểm danh tham gia buổi tập, điểm DUPR, vị trí ưa thích & đóng quỹ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllPresent}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Đánh dấu tất cả 12 người có mặt"
            >
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Tất Cả Có Mặt</span>
            </button>

            <button
              onClick={handleAddPlayerClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm Thành Viên</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Inputs */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc biệt danh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-auto justify-center">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({players.length})
              </button>
              <button
                onClick={() => setStatusFilter('present')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'present'
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Có mặt ({presentCount})
              </button>
              <button
                onClick={() => setStatusFilter('absent')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'absent'
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vắng ({players.length - presentCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Players Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onToggleStatus={onToggleStatus}
            onEditPlayer={onEditPlayer}
            onToggleFundStatus={onToggleFundStatus}
            userRole={userRole}
          />
        ))}
      </div>
    </div>
  );
};
