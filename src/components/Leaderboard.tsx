import React, { useState } from 'react';
import { Trophy, Medal, Flame, TrendingUp, Award, Zap } from 'lucide-react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const [sortBy, setSortBy] = useState<'wins' | 'winRate' | 'diff'>('wins');

  // Compute stats and sort
  const sortedPlayers = [...players].map((p) => {
    const winRate = p.matchesPlayed > 0 ? (p.wins / p.matchesPlayed) * 100 : 0;
    const diff = p.pointsScored - p.pointsConceded;
    return { ...p, computedWinRate: winRate, diff };
  }).sort((a, b) => {
    if (sortBy === 'wins') {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.computedWinRate - a.computedWinRate;
    }
    if (sortBy === 'winRate') {
      if (b.computedWinRate !== a.computedWinRate) return b.computedWinRate - a.computedWinRate;
      return b.wins - a.wins;
    }
    return b.diff - a.diff;
  });

  const top1 = sortedPlayers[0];
  const top2 = sortedPlayers[1];
  const top3 = sortedPlayers[2];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold text-white">Bảng Xếp Hạng & Thống Kê Nhóm</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Thành tích cá nhân, số trận thắng, tỷ lệ thắng và hiệu số điểm thi đấu
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setSortBy('wins')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'wins' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theo Trận Thắng
            </button>
            <button
              onClick={() => setSortBy('winRate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'winRate' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tỷ Lệ Thắng %
            </button>
            <button
              onClick={() => setSortBy('diff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sortBy === 'diff' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hiệu Số Điểm
            </button>
          </div>
        </div>

        {/* Podium Top 3 */}
        {top1 && top2 && top3 && (
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
            {/* 2nd Place */}
            <div className="flex flex-col items-center bg-slate-800/80 rounded-2xl p-3 sm:p-4 border border-slate-700/80 relative">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                2
              </div>
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-base sm:text-xl text-slate-950 mt-2 mb-1 shadow-md"
                style={{ backgroundColor: top2.avatarBg, color: top2.avatarColor }}
              >
                {top2.name.split(' ').slice(-1)[0][0]}
              </div>
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-full text-center">
                {top2.name.split(' ').slice(-1)[0]}
              </span>
              <span className="text-[10px] text-slate-400">{top2.wins} Thắng ({Math.round(top2.computedWinRate)}%)</span>
            </div>

            {/* 1st Place (Winner) */}
            <div className="flex flex-col items-center bg-gradient-to-b from-amber-500/20 to-slate-800 rounded-2xl p-4 sm:p-5 border-2 border-amber-400/60 relative -translate-y-2 shadow-xl shadow-amber-500/10">
              <div className="absolute -top-4 bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                👑 TOP 1
              </div>
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl text-slate-950 mt-2 mb-1 shadow-lg border-2 border-amber-300"
                style={{ backgroundColor: top1.avatarBg, color: top1.avatarColor }}
              >
                {top1.name.split(' ').slice(-1)[0][0]}
              </div>
              <span className="font-extrabold text-amber-300 text-sm sm:text-base truncate max-w-full text-center">
                {top1.name}
              </span>
              <span className="text-xs font-bold text-white mt-0.5">
                {top1.wins} Thắng • {Math.round(top1.computedWinRate)}% Win
              </span>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center bg-slate-800/80 rounded-2xl p-3 sm:p-4 border border-slate-700/80 relative">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-md">
                3
              </div>
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-base sm:text-xl text-slate-950 mt-2 mb-1 shadow-md"
                style={{ backgroundColor: top3.avatarBg, color: top3.avatarColor }}
              >
                {top3.name.split(' ').slice(-1)[0][0]}
              </div>
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-full text-center">
                {top3.name.split(' ').slice(-1)[0]}
              </span>
              <span className="text-[10px] text-slate-400">{top3.wins} Thắng ({Math.round(top3.computedWinRate)}%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/90 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center">Thứ Hạng</th>
                <th className="py-3 px-4">Thành Viên</th>
                <th className="py-3 px-4 text-center">DUPR</th>
                <th className="py-3 px-4 text-center">Số Trận</th>
                <th className="py-3 px-4 text-center">Thắng - Thua</th>
                <th className="py-3 px-4 text-center">Tỷ Lệ Thắng</th>
                <th className="py-3 px-4 text-center">Ghi / Mất Điểm</th>
                <th className="py-3 px-4 text-center">Hiệu Số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedPlayers.map((player, idx) => {
                const rank = idx + 1;
                return (
                  <tr key={player.id} className="hover:bg-slate-800/50 transition-all">
                    <td className="py-3 px-4 text-center font-black">
                      {rank === 1 ? (
                        <span className="text-amber-400 text-base">🥇 1</span>
                      ) : rank === 2 ? (
                        <span className="text-slate-300 text-base">🥈 2</span>
                      ) : rank === 3 ? (
                        <span className="text-amber-600 text-base">🥉 3</span>
                      ) : (
                        <span className="text-slate-400">{rank}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-slate-950 shrink-0"
                          style={{ backgroundColor: player.avatarBg, color: player.avatarColor }}
                        >
                          {player.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{player.name}</span>
                            {rank === 1 && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                MVP
                              </span>
                            )}
                          </div>
                          {player.nickname && (
                            <div className="text-[10px] text-slate-400">"{player.nickname}"</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-300">
                      {player.level.toFixed(1)}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-slate-200">
                      {player.matchesPlayed}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-lime-400">
                      {player.wins} - {player.losses}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
                        {Math.round(player.computedWinRate)}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-slate-300 font-mono text-xs">
                      {player.pointsScored} / {player.pointsConceded}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-black text-xs ${
                          player.diff > 0
                            ? 'text-lime-400'
                            : player.diff < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {player.diff > 0 ? `+${player.diff}` : player.diff}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
