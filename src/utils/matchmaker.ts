import { Player, CourtMatch, MatchRound } from '../types';

interface MatchmakerOptions {
  courtCount: number; // 1, 2, or 3
  roundNumber: number;
  players: Player[];
  previousRounds: MatchRound[];
}

export function generateNextRound({
  courtCount,
  roundNumber,
  players,
  previousRounds,
}: MatchmakerOptions): MatchRound {
  // Only present players can play
  const presentPlayers = players.filter((p) => p.status === 'present');
  
  if (presentPlayers.length < 4) {
    throw new Error('Cần ít nhất 4 người chơi có mặt để xếp trận doubles!');
  }

  // Count how many games each player has played in current session/rounds
  const gamesCountMap = new Map<string, number>();
  const partnerHistoryMap = new Map<string, Set<string>>(); // playerId -> set of previous partner IDs

  presentPlayers.forEach((p) => {
    gamesCountMap.set(p.id, 0);
    partnerHistoryMap.set(p.id, new Set());
  });

  previousRounds.forEach((r) => {
    r.matches.forEach((m) => {
      // Team 1
      m.team1.forEach((pid) => {
        if (gamesCountMap.has(pid)) {
          gamesCountMap.set(pid, (gamesCountMap.get(pid) || 0) + 1);
        }
      });
      if (gamesCountMap.has(m.team1[0]) && gamesCountMap.has(m.team1[1])) {
        partnerHistoryMap.get(m.team1[0])?.add(m.team1[1]);
        partnerHistoryMap.get(m.team1[1])?.add(m.team1[0]);
      }

      // Team 2
      m.team2.forEach((pid) => {
        if (gamesCountMap.has(pid)) {
          gamesCountMap.set(pid, (gamesCountMap.get(pid) || 0) + 1);
        }
      });
      if (gamesCountMap.has(m.team2[0]) && gamesCountMap.has(m.team2[1])) {
        partnerHistoryMap.get(m.team2[0])?.add(m.team2[1]);
        partnerHistoryMap.get(m.team2[1])?.add(m.team2[0]);
      }
    });
  });

  // Determine how many matches we can host based on court count and present players
  // Each match needs 4 players
  const maxPossibleMatches = Math.floor(presentPlayers.length / 4);
  const actualMatchCount = Math.min(courtCount, maxPossibleMatches);
  const playersNeeded = actualMatchCount * 4;

  // Sort present players by:
  // 1. Least games played in current session
  // 2. Random tie-breaker (add a little randomness)
  const sortedPlayers = [...presentPlayers].sort((a, b) => {
    const gamesA = gamesCountMap.get(a.id) || 0;
    const gamesB = gamesCountMap.get(b.id) || 0;
    if (gamesA !== gamesB) {
      return gamesA - gamesB; // Ascending order: fewest games played first
    }
    return Math.random() - 0.5;
  });

  const selectedForPlay = sortedPlayers.slice(0, playersNeeded);
  const waitingPlayers = sortedPlayers.slice(playersNeeded);

  // Group selected players into matches of 4
  const matches: CourtMatch[] = [];
  const pool = [...selectedForPlay];

  for (let i = 0; i < actualMatchCount; i++) {
    const matchPlayers = pool.splice(0, 4);

    // Find best 2v2 pairing out of 4 players (3 possible combinations):
    // Comb 1: (0,1) vs (2,3)
    // Comb 2: (0,2) vs (1,3)
    // Comb 3: (0,3) vs (1,2)
    const combinations = [
      { t1: [matchPlayers[0], matchPlayers[1]], t2: [matchPlayers[2], matchPlayers[3]] },
      { t1: [matchPlayers[0], matchPlayers[2]], t2: [matchPlayers[1], matchPlayers[3]] },
      { t1: [matchPlayers[0], matchPlayers[3]], t2: [matchPlayers[1], matchPlayers[2]] },
    ];

    let bestCombination = combinations[0];
    let minScore = Infinity;

    combinations.forEach((comb) => {
      const lvlT1 = comb.t1[0].level + comb.t1[1].level;
      const lvlT2 = comb.t2[0].level + comb.t2[1].level;
      const levelDiff = Math.abs(lvlT1 - lvlT2);

      // Penalty if partners have played together before
      let partnerPenalty = 0;
      if (partnerHistoryMap.get(comb.t1[0].id)?.has(comb.t1[1].id)) partnerPenalty += 1.5;
      if (partnerHistoryMap.get(comb.t2[0].id)?.has(comb.t2[1].id)) partnerPenalty += 1.5;

      const totalScore = levelDiff + partnerPenalty;

      if (totalScore < minScore) {
        minScore = totalScore;
        bestCombination = comb;
      }
    });

    matches.push({
      id: `m_${Date.now()}_${i + 1}`,
      courtNumber: i + 1,
      courtName: `Sân ${i + 1}`,
      team1: [bestCombination.t1[0].id, bestCombination.t1[1].id],
      team2: [bestCombination.t2[0].id, bestCombination.t2[1].id],
      score1: 0,
      score2: 0,
      status: 'scheduled',
      roundIndex: roundNumber,
      startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    });
  }

  return {
    id: `round_${Date.now()}`,
    roundNumber,
    createdAt: new Date().toISOString(),
    matches,
    waitingPlayerIds: waitingPlayers.map((p) => p.id),
  };
}
