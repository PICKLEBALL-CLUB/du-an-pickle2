import React, { useState } from 'react';
import { Play, RotateCw, Plus, Users, Sparkles, Trophy, Clock, CheckCircle, Lock } from 'lucide-react';
import { Player, MatchRound, CourtMatch, GroupSettings, UserRole } from '../types';
import { CourtLayoutGraphic } from './CourtLayoutGraphic';
import { ScoreModal } from './ScoreModal';
import { generateNextRound } from '../utils/matchmaker';

interface CourtManagerProps {
  players: Player[];
  rounds: MatchRound[];
  settings: GroupSettings;
  onSaveRound: (round: MatchRound) => void;
  onUpdateMatchScore: (
    roundId: string,
    matchId: string,
    score1: number,
    score2: number,
    status: 'completed' | 'playing'
  ) => void;
  userRole?: UserRole;
}

export const CourtManager: React.FC<CourtManagerProps> = ({
  players,
  rounds,
  settings,
  onSaveRound,
  onUpdateMatchScore,
  userRole = 'admin',
}) => {
  const [activeCourtCount, setActiveCourtCount] = useState<number>(settings.defaultCourtCount || 2);
  const [selectedMatch, setSelectedMatch] = useState<{ match: CourtMatch; roundId: string } | null>(null);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual Match State
  const [manualTeam1, setManualTeam1] = useState<[string, string]>(['', '']);
  const [manualTeam2, setManualTeam2] = useState<[string, string]>(['', '']);

  const presentPlayers = players.filter((p) => p.status === 'present');
  const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;

  const handleGenerateRound = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang ở quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền xếp lượt trận mới!');
      return;
    }
    setErrorMsg(null);
    try {
      const nextRoundNumber = rounds.length + 1;
      const newRound = generateNextRound({
        courtCount: activeCourtCount,
        roundNumber: nextRoundNumber,
        players,
        previousRounds: rounds,
      });
      onSaveRound(newRound);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tạo lượt đấu mới!');
    }
  };

  const handleOpenManualModal = () => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang ở quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền tạo trận đấu thủ công!');
      return;
    }
    setShowManualModal(true);
  };

  const handleSelectMatchForScore = (match: CourtMatch, roundId: string) => {
    if (userRole === 'member') {
      alert('🔒 Bạn đang ở quyền Member (Chỉ xem & Điểm danh).\nChỉ Admin mới có quyền cập nhật tỷ số trận đấu!');
      return;
    }
    setSelectedMatch({ match, roundId });
  };

  const handleCreateManualMatch = () => {
    if (!manualTeam1[0] || !manualTeam1[1] || !manualTeam2[0] || !manualTeam2[1]) {
      alert('Vui lòng chọn đủ 4 người chơi (2 người mỗi đội)!');
      return;
    }

    const uniqueIds = new Set([...manualTeam1, ...manualTeam2]);
    if (uniqueIds.size < 4) {
      alert('Một người chơi không thể chọn trùng lặp!');
      return;
    }

    const newMatch: CourtMatch = {
      id: `m_manual_${Date.now()}`,
      courtNumber: (currentRound?.matches.length || 0) + 1,
      courtName: `Sân Thủ Công ${(currentRound?.matches.length || 0) + 1}`,
      team1: manualTeam1,
      team2: manualTeam2,
      score1: 0,
      score2: 0,
      status: 'scheduled',
      roundIndex: rounds.length > 0 ? rounds.length : 1,
      startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    if (currentRound) {
      const updatedRound: MatchRound = {
        ...currentRound,
        matches: [...currentRound.matches, newMatch],
      };
      onSaveRound(updatedRound);
    } else {
      const newRound: MatchRound = {
        id: `round_${Date.now()}`,
        roundNumber: 1,
        createdAt: new Date().toISOString(),
        matches: [newMatch],
        waitingPlayerIds: presentPlayers
          .filter((p) => !uniqueIds.has(p.id))
          .map((p) => p.id),
      };
      onSaveRound(newRound);
    }

    setShowManualModal(false);
    setManualTeam1(['', '']);
    setManualTeam2(['', '']);
  };

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      {/* Action Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
              <h2 className="text-lg font-extrabold text-white">Quản Lý Sân & Xếp Trận Xoay Vòng</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Thuật toán tự động xếp 2v2 dựa trên số trận đã chơi & cân bằng level
            </p>
          </div>

          {/* Court Count Selector & Generate Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Court Selector */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 px-2 font-medium">Số sân:</span>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveCourtCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCourtCount === num
                      ? 'bg-lime-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {num} Sân
                </button>
              ))}
            </div>

            {/* Auto Generate Button */}
            <button
              onClick={handleGenerateRound}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-lime-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xếp Lượt Mới (Tự Động)</span>
            </button>

            {/* Manual Match Button */}
            <button
              onClick={handleOpenManualModal}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-lime-400" />
              <span>Tạo Trận Thủ Công</span>
            </button>
          </div>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold hover:underline ml-2">
              Đóng
            </button>
          </div>
        )}

        {/* Attendance Summary Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-lime-400" />
            <span>
              Thành viên có mặt: <strong className="text-white">{presentPlayers.length}/12</strong> người
            </span>
          </div>
          <div>
            Đã đấu tổng cộng: <strong className="text-lime-300">{rounds.length}</strong> lượt trận
          </div>
        </div>
      </div>

      {/* Active Current Round Display */}
      {currentRound && currentRound.matches.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-lime-400/20 text-lime-300 font-black text-xs border border-lime-400/30">
                LƯỢT {currentRound.roundNumber}
              </span>
              <span className="text-xs text-slate-400">
                Khởi tạo lúc: {new Date(currentRound.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Courts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentRound.matches.map((match) => {
              const team1Players = match.team1.map((id) => getPlayer(id)).filter(Boolean) as Player[];
              const team2Players = match.team2.map((id) => getPlayer(id)).filter(Boolean) as Player[];

              return (
                <CourtLayoutGraphic
                  key={match.id}
                  courtName={match.courtName}
                  team1Players={team1Players}
                  team2Players={team2Players}
                  score1={match.score1}
                  score2={match.score2}
                  status={match.status}
                  onScoreClick={() => handleSelectMatchForScore(match, currentRound.id)}
                />
              );
            })}
          </div>

          {/* Resting / Waiting Players Card */}
          {currentRound.waitingPlayerIds.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Nghỉ Xoay Vòng Lượt Này ({currentRound.waitingPlayerIds.length} người)
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRound.waitingPlayerIds.map((id) => {
                  const p = getPlayer(id);
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/70 text-xs"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-900"
                        style={{ backgroundColor: p.avatarBg, color: p.avatarColor }}
                      >
                        {p.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <span className="font-semibold text-slate-200">{p.name}</span>
                      <span className="text-[10px] text-slate-400">({p.level})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State / Prompt */
        <div className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center mx-auto mb-4 border border-lime-400/20">
            🏓
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Chưa Có Trận Đấu Nào Lượt Này</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Bấm "Xếp Lượt Mới (Tự Động)" để thuật toán tự động ghép cặp 2v2 cân bằng cho 12 anh em trong nhóm!
          </p>
          <button
            onClick={handleGenerateRound}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-lime-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xếp Trận Ngay Lập Tức</span>
          </button>
        </div>
      )}

      {/* Historic Rounds Accordion/List */}
      {rounds.length > 1 && (
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Lịch Sử Các Lượt Đấu Trước Đó ({rounds.length - 1} lượt)</span>
          </h3>

          <div className="space-y-3">
            {rounds
              .slice(0, rounds.length - 1)
              .reverse()
              .map((r) => (
                <div key={r.id} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-lime-300">Lượt {r.roundNumber}</span>
                    <span className="text-slate-400">
                      {new Date(r.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {r.matches.map((m) => {
                      const t1Names = m.team1.map((id) => getPlayer(id)?.name.split(' ').slice(-1)[0]).join(' & ');
                      const t2Names = m.team2.map((id) => getPlayer(id)?.name.split(' ').slice(-1)[0]).join(' & ');
                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-700/40"
                        >
                          <span className="font-semibold text-slate-300">{t1Names}</span>
                          <span className="font-black text-amber-400 mx-2">
                            {m.score1} - {m.score2}
                          </span>
                          <span className="font-semibold text-slate-300">{t2Names}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Score Modal */}
      {selectedMatch && (
        <ScoreModal
          match={selectedMatch.match}
          players={players}
          pointsToWin={settings.pointsToWin || 11}
          onSaveScore={(matchId, score1, score2, status) => {
            onUpdateMatchScore(selectedMatch.roundId, matchId, score1, score2, status);
          }}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Manual Match Builder Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold mb-4 text-lime-300">Tạo Trận Đấu Thủ Công</h3>

            {/* Team 1 Selectors */}
            <div className="space-y-4">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <label className="block text-xs font-bold text-lime-400 mb-2">ĐỘI A (2 Người)</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={manualTeam1[0]}
                    onChange={(e) => setManualTeam1([e.target.value, manualTeam1[1]])}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="">-- Chọn Cầu Thủ 1 --</option>
                    {presentPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>

                  <select
                    value={manualTeam1[1]}
                    onChange={(e) => setManualTeam1([manualTeam1[0], e.target.value])}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="">-- Chọn Cầu Thủ 2 --</option>
                    {presentPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center font-bold text-slate-500">VS</div>

              {/* Team 2 Selectors */}
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <label className="block text-xs font-bold text-sky-400 mb-2">ĐỘI B (2 Người)</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={manualTeam2[0]}
                    onChange={(e) => setManualTeam2([e.target.value, manualTeam2[1]])}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="">-- Chọn Cầu Thủ 1 --</option>
                    {presentPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>

                  <select
                    value={manualTeam2[1]}
                    onChange={(e) => setManualTeam2([manualTeam2[0], e.target.value])}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="">-- Chọn Cầu Thủ 2 --</option>
                    {presentPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateManualMatch}
                className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-bold hover:bg-lime-300 cursor-pointer"
              >
                Tạo Trận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
