import React from 'react';
import { Player } from '../types';

interface CourtLayoutGraphicProps {
  courtName: string;
  team1Players: Player[];
  team2Players: Player[];
  score1: number;
  score2: number;
  status: 'scheduled' | 'playing' | 'completed';
  onScoreClick?: () => void;
}

export const CourtLayoutGraphic: React.FC<CourtLayoutGraphicProps> = ({
  courtName,
  team1Players,
  team2Players,
  score1,
  score2,
  status,
  onScoreClick,
}) => {
  return (
    <div className="relative bg-emerald-900/90 rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/40 shadow-xl overflow-hidden text-white">
      {/* Pickleball Court SVG / Canvas styling background */}
      <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Header bar of Court */}
      <div className="flex items-center justify-between mb-3 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-lime-400 animate-pulse" />
          <h3 className="font-bold text-lg text-lime-300 tracking-wide uppercase">{courtName}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 font-medium">
            Sân Pickleball Standard
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === 'completed' ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ✓ Đã Hoàn Thành
            </span>
          ) : status === 'playing' ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/30 text-lime-300 border border-lime-400/50 animate-pulse">
              ● Đang Thi Đấu
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/60 text-slate-300">
              Chờ Thi Đấu
            </span>
          )}
        </div>
      </div>

      {/* Visual Court Graphic Representation */}
      <div className="relative w-full rounded-xl border-2 border-white/80 bg-emerald-700/80 p-3 shadow-inner my-2">
        {/* Net line across middle */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-amber-300 z-20 shadow-[0_0_8px_rgba(253,224,71,0.8)]">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] bg-amber-400 text-emerald-950 px-1 font-bold rounded">
            LƯỚI
          </div>
        </div>

        {/* Non-Volley Zone (Kitchen) Lines */}
        <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-white/50 border-r border-dashed border-white/70" />
        <div className="absolute top-0 bottom-0 right-[35%] w-0.5 bg-white/50 border-r border-dashed border-white/70" />

        {/* Center Line for Service Courts */}
        <div className="absolute top-1/2 left-0 right-[35%] h-0.5 bg-white/50" />
        <div className="absolute top-1/2 right-0 left-[35%] h-0.5 bg-white/50" />

        {/* Non-Volley Zone Labels */}
        <div className="absolute top-2 left-[40%] -translate-x-1/2 text-[10px] text-lime-200/60 font-semibold tracking-wider pointer-events-none">
          KITCHEN
        </div>
        <div className="absolute top-2 right-[40%] translate-x-1/2 text-[10px] text-lime-200/60 font-semibold tracking-wider pointer-events-none">
          KITCHEN
        </div>

        {/* Court Content Grid (Team 1 Left vs Team 2 Right) */}
        <div className="grid grid-cols-2 gap-8 relative z-10 min-h-[150px] sm:min-h-[170px] items-center">
          {/* Team 1 (Left Court Side) */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-900/60 border border-white/10 backdrop-blur-sm">
            <div className="text-xs text-lime-300/80 font-medium mb-1 uppercase tracking-wider">Đội A (Trái)</div>
            <div className="flex flex-wrap justify-center items-center gap-2 my-1">
              {team1Players.map((p) => (
                <div key={p.id} className="flex flex-col items-center group">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm text-slate-900 shadow-md border-2 border-white transform group-hover:scale-105 transition-all"
                    style={{ backgroundColor: p.avatarBg, color: p.avatarColor }}
                  >
                    {p.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <span className="text-[11px] font-semibold text-white mt-1 max-w-[75px] truncate text-center">
                    {p.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-800/80 text-lime-300">
                    {p.level.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            {/* Score Display */}
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-wider">
              {score1}
            </div>
          </div>

          {/* Team 2 (Right Court Side) */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-900/60 border border-white/10 backdrop-blur-sm">
            <div className="text-xs text-lime-300/80 font-medium mb-1 uppercase tracking-wider">Đội B (Phải)</div>
            <div className="flex flex-wrap justify-center items-center gap-2 my-1">
              {team2Players.map((p) => (
                <div key={p.id} className="flex flex-col items-center group">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm text-slate-900 shadow-md border-2 border-white transform group-hover:scale-105 transition-all"
                    style={{ backgroundColor: p.avatarBg, color: p.avatarColor }}
                  >
                    {p.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <span className="text-[11px] font-semibold text-white mt-1 max-w-[75px] truncate text-center">
                    {p.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-800/80 text-lime-300">
                    {p.level.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            {/* Score Display */}
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-wider">
              {score2}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-emerald-700/50">
        <div className="text-xs text-emerald-200/80">
          Tổng Level: {(team1Players.reduce((s, p) => s + p.level, 0)).toFixed(1)} vs{' '}
          {(team2Players.reduce((s, p) => s + p.level, 0)).toFixed(1)}
        </div>

        {onScoreClick && (
          <button
            onClick={onScoreClick}
            className="px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {status === 'completed' ? 'Sửa Tỷ Số' : 'Cập Nhật Điểm'}
          </button>
        )}
      </div>
    </div>
  );
};
