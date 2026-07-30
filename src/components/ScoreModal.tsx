import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, CheckCircle2 } from 'lucide-react';
import { CourtMatch, Player } from '../types';

interface ScoreModalProps {
  match: CourtMatch;
  players: Player[];
  pointsToWin: number;
  onSaveScore: (matchId: string, score1: number, score2: number, status: 'completed' | 'playing') => void;
  onClose: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  match,
  players,
  pointsToWin,
  onSaveScore,
  onClose,
}) => {
  const [score1, setScore1] = useState<number>(match.score1 || 0);
  const [score2, setScore2] = useState<number>(match.score2 || 0);

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  const team1Names = match.team1.map((id) => getPlayer(id)?.name || 'N/A').join(' & ');
  const team2Names = match.team2.map((id) => getPlayer(id)?.name || 'N/A').join(' & ');

  const handleSave = (isCompleted: boolean) => {
    if (isCompleted && (score1 > 0 || score2 > 0)) {
      // Fire confetti for victory celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }

    onSaveScore(match.id, score1, score2, isCompleted ? 'completed' : 'playing');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Cập Nhật Điểm Số - {match.courtName}</h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Nhập tỷ số kết quả trận đấu. Mốc điểm tiêu chuẩn thắng: <strong className="text-lime-300">{pointsToWin} điểm</strong>.
        </p>

        {/* Teams & Score Input Controls */}
        <div className="space-y-6">
          {/* Đội A */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">Đội A (Trái)</span>
              <span className="text-xs text-slate-400 font-medium">{team1Names}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScore1(Math.max(0, score1 - 1))}
                  className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={score1}
                  onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                  className="w-20 text-center text-3xl font-black bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-lime-300 focus:outline-none focus:border-lime-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setScore1(score1 + 1)}
                  className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Quick score buttons */}
              <div className="flex gap-1">
                {[11, 15].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setScore1(pts)}
                    className="px-2 py-1 text-[11px] font-bold rounded bg-slate-700/60 hover:bg-lime-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer"
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center font-bold text-slate-500 text-sm">VS</div>

          {/* Đội B */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Đội B (Phải)</span>
              <span className="text-xs text-slate-400 font-medium">{team2Names}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScore2(Math.max(0, score2 - 1))}
                  className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={score2}
                  onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                  className="w-20 text-center text-3xl font-black bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-sky-300 focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setScore2(score2 + 1)}
                  className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Quick score buttons */}
              <div className="flex gap-1">
                {[11, 15].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setScore2(pts)}
                    className="px-2 py-1 text-[11px] font-bold rounded bg-slate-700/60 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer"
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSave(false)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
          >
            Lưu Tỷ Số Tạm Thời
          </button>
          <button
            onClick={() => handleSave(true)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-lime-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Kết Thúc Trận Đấu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
