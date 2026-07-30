export type PlayerStatus = 'present' | 'resting' | 'absent';
export type PositionPreference = 'Left' | 'Right' | 'Any';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export type UserRole = 'admin' | 'member';
export type AuthMethod = 'google' | 'phone';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarBg?: string;
  avatarColor?: string;
  role: UserRole;
  method: AuthMethod;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  avatarColor: string;
  avatarBg: string;
  level: number; // e.g. 2.5, 3.0, 3.5, 4.0, 4.5
  phone: string;
  status: PlayerStatus;
  position: PositionPreference;
  fundStatus: PaymentStatus;
  
  // Accumulated Stats
  matchesPlayed: number;
  wins: number;
  losses: number;
  pointsScored: number;
  pointsConceded: number;
  
  joinDate: string;
  notes?: string;
}

export interface CourtMatch {
  id: string;
  courtNumber: number;
  courtName: string; // e.g. "Sân 1", "Sân 2"
  team1: [string, string]; // Player IDs
  team2: [string, string]; // Player IDs
  score1: number;
  score2: number;
  status: 'scheduled' | 'playing' | 'completed';
  roundIndex: number;
  startTime?: string;
  endTime?: string;
  winnerTeam?: 1 | 2;
}

export interface MatchRound {
  id: string;
  roundNumber: number;
  createdAt: string;
  matches: CourtMatch[];
  waitingPlayerIds: string[];
}

export type FundCategory = 'court_fee' | 'ball' | 'water_drink' | 'member_fee' | 'party' | 'other';

export interface FundTransaction {
  id: string;
  date: string;
  title: string;
  amount: number; // positive for income, negative or positive handled by type
  type: 'income' | 'expense';
  category: FundCategory;
  payerOrPayee?: string;
  note?: string;
}

export interface GroupSettings {
  groupName: string;
  courtFeePerSession: number;
  memberMonthlyFee: number;
  defaultCourtCount: number; // 1, 2, or 3
  pointsToWin: number; // 11, 15, or 21
  winByTwo: boolean;
}
