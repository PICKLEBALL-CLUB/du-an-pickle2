import React from 'react';
import { Phone, Edit3, Check, X, ShieldAlert, Trophy, Lock } from 'lucide-react';
import { Player, UserRole } from '../types';

interface PlayerCardProps {
  player: Player;
  onToggleStatus: (playerId: string) => void;
  onEditPlayer: (player: Player) => void;
  onToggleFundStatus: (playerId: string) => void;
  userRole?: UserRole;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleStatus,
  onEditPlayer,
  onToggleFundStatus,
  userRole = 'admin',
}) => {
  const winRate =
    player.matchesPlayed > 0
      ? Math.round((player.wins / player.matchesPlayed) * 100)
      : 0;

  const handleEditClick = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền chỉnh sửa thông tin thành viên!');
      return;
    }
    onEditPlayer(player);
  };

  const handleFundStatusClick = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang đăng nhập với quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền cập nhật trạng thái đóng quỹ!');
      return;
    }
    onToggleFundStatus(player.id);
  };

  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all duration-200 shadow-lg flex flex-col justify-between ${
        player.status === 'present'
          ? 'bg-slate-900/90 border-slate-700/80 shadow-lime-500/5'
          : player.status === 'resting'
          ? 'bg-slate-900/50 border-amber-500/30 opacity-80'
          : 'bg-slate-950/60 border-slate-800 opacity-60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-slate-950 shadow-md border-2 border-white/80 shrink-0"
              style={{ backgroundColor: player.avatarBg, color: player.avatarColor }}
            >
              {player.name.split(' ').slice(-1)[0][0]}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                  {player.name}
                </h3>
                {player.nickname && (
                  <span className="text-[10px] text-lime-300 font-semibold px-1.5 py-0.2 rounded bg-lime-400/10 border border-lime-400/20">
                    "{player.nickname}"
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  DUPR {player.level.toFixed(1)}
                </span>

                <span className="text-[10px] font-semibold text-slate-400">
                  Vị trí: {player.position === 'Left' ? 'Trái' : player.position === 'Right' ? 'Phải' : 'Linh hoạt'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit Button */}
          <button
            onClick={handleEditClick}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            title={userRole === 'admin' ? "Chỉnh sửa thông tin" : "Chỉ Admin mới có quyền sửa"}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Pill Grid */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Số trận</div>
            <div className="font-bold text-white text-xs sm:text-sm">{player.matchesPlayed}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Thắng - Thua</div>
            <div className="font-bold text-lime-400 text-xs sm:text-sm">
              {player.wins} - {player.losses}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Tỷ lệ thắng</div>
            <div className="font-bold text-amber-300 text-xs sm:text-sm">{winRate}%</div>
          </div>
        </div>

        {/* Player Note if exists */}
        {player.notes && (
          <p className="text-[11px] text-slate-400 italic mb-3 line-clamp-1">
            "{player.notes}"
          </p>
        )}
      </div>

      {/* Footer Controls: Attendance & Fund Status */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
        {/* Attendance Toggle Button */}
        <button
          onClick={() => onToggleStatus(player.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            player.status === 'present'
              ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40 hover:bg-lime-400/30'
              : player.status === 'resting'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          {player.status === 'present' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>Có mặt</span>
            </>
          ) : player.status === 'resting' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Đang nghỉ</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Vắng mặt</span>
            </>
          )}
        </button>

        {/* Fund Status Button */}
        <button
          onClick={handleFundStatusClick}
          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
            player.fundStatus === 'paid'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
          }`}
          title={userRole === 'admin' ? "Bấm để đổi trạng thái đóng quỹ" : "Chỉ Admin mới có quyền cập nhật quỹ"}
        >
          {player.fundStatus === 'paid' ? '✓ Đã đóng quỹ' : '✗ Chưa đóng quỹ'}
        </button>

        {/* Call Link */}
        {player.phone && (
          <a
            href={`tel:${player.phone}`}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title={`Gọi: ${player.phone}`}
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
