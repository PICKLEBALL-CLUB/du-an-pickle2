import { Player, MatchRound, FundTransaction, GroupSettings, AuthUser } from '../types';
import { INITIAL_PLAYERS, INITIAL_TRANSACTIONS, DEFAULT_SETTINGS } from '../data/defaultPlayers';

const KEYS = {
  PLAYERS: 'pickle_group_players_v1',
  ROUNDS: 'pickle_group_rounds_v1',
  FUNDS: 'pickle_group_funds_v1',
  SETTINGS: 'pickle_group_settings_v1',
  AUTH: 'pickle_group_auth_v1',
};

export const DEFAULT_AUTH_USER: AuthUser = {
  id: 'p1',
  name: 'Minh Tốc Độ',
  email: 'gccafe.dha@gmail.com',
  phone: '0901234567',
  avatarBg: '#FEF08A',
  avatarColor: '#854D0E',
  role: 'admin',
  method: 'google',
};

export const loadAuthUser = (): AuthUser => {
  try {
    const data = localStorage.getItem(KEYS.AUTH);
    if (!data) return DEFAULT_AUTH_USER;
    const parsed = JSON.parse(data);
    return parsed && parsed.role ? parsed : DEFAULT_AUTH_USER;
  } catch (e) {
    console.error('Failed to load auth user:', e);
    return DEFAULT_AUTH_USER;
  }
};

export const saveAuthUser = (user: AuthUser | null) => {
  try {
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
  } catch (e) {
    console.error('Failed to save auth user:', e);
  }
};

export const loadPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(KEYS.PLAYERS);
    if (!data) return INITIAL_PLAYERS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PLAYERS;
  } catch (e) {
    console.error('Failed to load players:', e);
    return INITIAL_PLAYERS;
  }
};

export const savePlayers = (players: Player[]) => {
  try {
    localStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players:', e);
  }
};

export const loadRounds = (): MatchRound[] => {
  try {
    const data = localStorage.getItem(KEYS.ROUNDS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load rounds:', e);
    return [];
  }
};

export const saveRounds = (rounds: MatchRound[]) => {
  try {
    localStorage.setItem(KEYS.ROUNDS, JSON.stringify(rounds));
  } catch (e) {
    console.error('Failed to save rounds:', e);
  }
};

export const loadFunds = (): FundTransaction[] => {
  try {
    const data = localStorage.getItem(KEYS.FUNDS);
    if (!data) return INITIAL_TRANSACTIONS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Failed to load funds:', e);
    return INITIAL_TRANSACTIONS;
  }
};

export const saveFunds = (funds: FundTransaction[]) => {
  try {
    localStorage.setItem(KEYS.FUNDS, JSON.stringify(funds));
  } catch (e) {
    console.error('Failed to save funds:', e);
  }
};

export const loadSettings = (): GroupSettings => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: GroupSettings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const resetAllData = () => {
  localStorage.removeItem(KEYS.PLAYERS);
  localStorage.removeItem(KEYS.ROUNDS);
  localStorage.removeItem(KEYS.FUNDS);
  localStorage.removeItem(KEYS.SETTINGS);
};
