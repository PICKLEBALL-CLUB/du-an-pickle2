/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { CourtManager } from './components/CourtManager';
import { PlayerRoster } from './components/PlayerRoster';
import { PlayerModal } from './components/PlayerModal';
import { Leaderboard } from './components/Leaderboard';
import { FundManager } from './components/FundManager';
import { PickleballRules } from './components/PickleballRules';
import { ToolsModal } from './components/ToolsModal';
import { AuthModal } from './components/AuthModal';

import { Player, MatchRound, FundTransaction, GroupSettings, AuthUser } from './types';
import {
  loadPlayers,
  savePlayers,
  loadRounds,
  saveRounds,
  loadFunds,
  saveFunds,
  loadSettings,
  saveSettings,
  loadAuthUser,
  saveAuthUser,
  resetAllData,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('courts');
  const [players, setPlayers] = useState<Player[]>(loadPlayers);
  const [rounds, setRounds] = useState<MatchRound[]>(loadRounds);
  const [funds, setFunds] = useState<FundTransaction[]>(loadFunds);
  const [settings, setSettings] = useState<GroupSettings>(loadSettings);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(loadAuthUser);

  // Modals
  const [editingPlayer, setEditingPlayer] = useState<Player | null | 'new'>(null);
  const [showTools, setShowTools] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  useEffect(() => {
    saveRounds(rounds);
  }, [rounds]);

  useEffect(() => {
    saveFunds(funds);
  }, [funds]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveAuthUser(currentUser);
  }, [currentUser]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    saveAuthUser(user);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveAuthUser(null);
    setShowAuthModal(true);
  };

  // Total fund balance
  const totalIncome = funds.filter((f) => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const totalExpense = funds.filter((f) => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const fundBalance = totalIncome - totalExpense;

  // Toggle Player Attendance Status
  const handleTogglePlayerStatus = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const nextStatus =
            p.status === 'present' ? 'resting' : p.status === 'resting' ? 'absent' : 'present';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Toggle Member Monthly Fund Status
  const handleToggleFundStatus = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const nextFundStatus = p.fundStatus === 'paid' ? 'unpaid' : 'paid';
          return { ...p, fundStatus: nextFundStatus };
        }
        return p;
      })
    );
  };

  // Mark All Players Present
  const handleMarkAllPresent = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, status: 'present' })));
  };

  // Save / Update Round
  const handleSaveRound = (newRound: MatchRound) => {
    setRounds((prev) => [...prev, newRound]);
  };

  // Update Score and auto-calculate Player Stats
  const handleUpdateMatchScore = (
    roundId: string,
    matchId: string,
    score1: number,
    score2: number,
    status: 'completed' | 'playing'
  ) => {
    let wasAlreadyCompleted = false;

    // Find if match was already marked completed before
    const targetRound = rounds.find((r) => r.id === roundId);
    const targetMatch = targetRound?.matches.find((m) => m.id === matchId);
    if (targetMatch && targetMatch.status === 'completed') {
      wasAlreadyCompleted = true;
    }

    setRounds((prevRounds) =>
      prevRounds.map((r) => {
        if (r.id !== roundId) return r;
        return {
          ...r,
          matches: r.matches.map((m) => {
            if (m.id !== matchId) return m;
            return {
              ...m,
              score1,
              score2,
              status,
              winnerTeam: status === 'completed' ? (score1 > score2 ? 1 : 2) : undefined,
            };
          }),
        };
      })
    );

    // If match is just now completed (and wasn't before), update accumulated player stats
    if (status === 'completed' && !wasAlreadyCompleted && targetMatch) {
      const { team1, team2 } = targetMatch;
      const t1Wins = score1 > score2;

      setPlayers((prevPlayers) =>
        prevPlayers.map((p) => {
          if (team1.includes(p.id)) {
            return {
              ...p,
              matchesPlayed: p.matchesPlayed + 1,
              wins: t1Wins ? p.wins + 1 : p.wins,
              losses: !t1Wins ? p.losses + 1 : p.losses,
              pointsScored: p.pointsScored + score1,
              pointsConceded: p.pointsConceded + score2,
            };
          }
          if (team2.includes(p.id)) {
            return {
              ...p,
              matchesPlayed: p.matchesPlayed + 1,
              wins: !t1Wins ? p.wins + 1 : p.wins,
              losses: t1Wins ? p.losses + 1 : p.losses,
              pointsScored: p.pointsScored + score2,
              pointsConceded: p.pointsConceded + score1,
            };
          }
          return p;
        })
      );
    }
  };

  // Add / Edit Player Handler
  const handleSavePlayer = (playerData: Partial<Player>) => {
    if (playerData.id) {
      // Edit existing
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerData.id ? ({ ...p, ...playerData } as Player) : p))
      );
    } else {
      // Add new
      const newPlayer: Player = {
        id: `p_${Date.now()}`,
        name: playerData.name || 'Thành Viên Mới',
        nickname: playerData.nickname || '',
        avatarBg: playerData.avatarBg || '#D1FAE5',
        avatarColor: playerData.avatarColor || '#10B981',
        level: playerData.level || 3.0,
        phone: playerData.phone || '',
        status: 'present',
        position: playerData.position || 'Any',
        fundStatus: 'paid',
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        pointsScored: 0,
        pointsConceded: 0,
        joinDate: new Date().toISOString().split('T')[0],
        notes: playerData.notes || '',
      };
      setPlayers((prev) => [...prev, newPlayer]);
    }
  };

  // Delete Player
  const handleDeletePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  };

  // Add Fund Transaction
  const handleAddTransaction = (tx: Omit<FundTransaction, 'id'>) => {
    const newTx: FundTransaction = {
      ...tx,
      id: `ft_${Date.now()}`,
    };
    setFunds((prev) => [newTx, ...prev]);
  };

  // Edit Fund Transaction
  const handleEditTransaction = (updatedTx: FundTransaction) => {
    setFunds((prev) => prev.map((f) => (f.id === updatedTx.id ? updatedTx : f)));
  };

  // Delete Fund Transaction
  const handleDeleteTransaction = (id: string) => {
    setFunds((prev) => prev.filter((f) => f.id !== id));
  };

  // Reset App
  const handleResetApp = () => {
    resetAllData();
    window.location.reload();
  };

  const userRole = currentUser ? currentUser.role : 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        players={players}
        fundBalance={fundBalance}
        openTools={() => setShowTools(true)}
        currentUser={currentUser}
        openAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main App Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'courts' && (
          <CourtManager
            players={players}
            rounds={rounds}
            settings={settings}
            onSaveRound={handleSaveRound}
            onUpdateMatchScore={handleUpdateMatchScore}
            userRole={userRole}
          />
        )}

        {activeTab === 'roster' && (
          <PlayerRoster
            players={players}
            onToggleStatus={handleTogglePlayerStatus}
            onEditPlayer={(p) => setEditingPlayer(p)}
            onAddPlayer={() => setEditingPlayer('new')}
            onToggleFundStatus={handleToggleFundStatus}
            onMarkAllPresent={handleMarkAllPresent}
            userRole={userRole}
          />
        )}

        {activeTab === 'leaderboard' && <Leaderboard players={players} />}

        {activeTab === 'funds' && (
          <FundManager
            transactions={funds}
            players={players}
            monthlyFee={settings.memberMonthlyFee}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onToggleFundStatus={handleToggleFundStatus}
            userRole={userRole}
          />
        )}

        {activeTab === 'rules' && <PickleballRules />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🏓 {settings.groupName} — 12 Thành Viên Pickleball</span>
          <span>PickleManager • Tự động xoay vòng & Bảng xếp hạng DUPR</span>
        </div>
      </footer>

      {/* Modals */}
      {editingPlayer && (
        <PlayerModal
          player={editingPlayer === 'new' ? null : editingPlayer}
          onSave={handleSavePlayer}
          onDelete={editingPlayer !== 'new' ? handleDeletePlayer : undefined}
          onClose={() => setEditingPlayer(null)}
        />
      )}

      {showTools && (
        <ToolsModal
          players={players}
          settings={settings}
          onUpdateSettings={setSettings}
          onResetData={handleResetApp}
          onClose={() => setShowTools(false)}
          userRole={userRole}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
