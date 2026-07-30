import { Player, FundTransaction, GroupSettings } from '../types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Nguyễn Văn Minh',
    nickname: 'Minh Tốc Độ',
    avatarColor: '#10B981', // Emerald
    avatarBg: '#D1FAE5',
    level: 3.5,
    phone: '0903123456',
    status: 'present',
    position: 'Right',
    fundStatus: 'paid',
    matchesPlayed: 8,
    wins: 6,
    losses: 2,
    pointsScored: 88,
    pointsConceded: 64,
    joinDate: '2024-01-15',
    notes: 'Trưởng nhóm, giao bóng xoáy'
  },
  {
    id: 'p2',
    name: 'Trần Hoàng Nam',
    nickname: 'Nam DUPR 4.0',
    avatarColor: '#0284C7', // Sky
    avatarBg: '#E0F2FE',
    level: 4.0,
    phone: '0918234567',
    status: 'present',
    position: 'Left',
    fundStatus: 'paid',
    matchesPlayed: 10,
    wins: 8,
    losses: 2,
    pointsScored: 108,
    pointsConceded: 72,
    joinDate: '2024-01-15',
    notes: 'Kỹ thuật dink tốt, phản tạt nhanh'
  },
  {
    id: 'p3',
    name: 'Lê Thu Phương',
    nickname: 'Phương Pickle',
    avatarColor: '#EC4899', // Pink
    avatarBg: '#FCE7F3',
    level: 3.0,
    phone: '0987345678',
    status: 'present',
    position: 'Right',
    fundStatus: 'paid',
    matchesPlayed: 7,
    wins: 4,
    losses: 3,
    pointsScored: 71,
    pointsConceded: 68,
    joinDate: '2024-02-01',
    notes: 'Thủ kiên trì, kiểm soát nhịp đấu'
  },
  {
    id: 'p4',
    name: 'Phạm Đức Anh',
    nickname: 'Anh Smash',
    avatarColor: '#8B5CF6', // Purple
    avatarBg: '#EDE9FE',
    level: 3.5,
    phone: '0934456789',
    status: 'present',
    position: 'Left',
    fundStatus: 'paid',
    matchesPlayed: 9,
    wins: 5,
    losses: 4,
    pointsScored: 92,
    pointsConceded: 85,
    joinDate: '2024-01-20',
    notes: 'Cú đập bóng rất mạnh ở Kitchen'
  },
  {
    id: 'p5',
    name: 'Vũ Quốc Hùng',
    nickname: 'Hùng Lão Tướng',
    avatarColor: '#F59E0B', // Amber
    avatarBg: '#FEF3C7',
    level: 3.5,
    phone: '0978567890',
    status: 'present',
    position: 'Any',
    fundStatus: 'paid',
    matchesPlayed: 8,
    wins: 5,
    losses: 3,
    pointsScored: 81,
    pointsConceded: 70,
    joinDate: '2024-01-15',
    notes: 'Kinh nghiệm dày dặn, điều bóng dink khó'
  },
  {
    id: 'p6',
    name: 'Đặng Mai Linh',
    nickname: 'Linh Khéo Léo',
    avatarColor: '#14B8A6', // Teal
    avatarBg: '#CCFBF1',
    level: 3.0,
    phone: '0912678901',
    status: 'present',
    position: 'Right',
    fundStatus: 'paid',
    matchesPlayed: 6,
    wins: 3,
    losses: 3,
    pointsScored: 58,
    pointsConceded: 60,
    joinDate: '2024-02-10',
    notes: 'Cắt bóng xoáy chìm khó chịu'
  },
  {
    id: 'p7',
    name: 'Hoàng Văn Tuấn',
    nickname: 'Tuấn Bách Phát',
    avatarColor: '#EF4444', // Red
    avatarBg: '#FEE2E2',
    level: 3.5,
    phone: '0989789012',
    status: 'present',
    position: 'Left',
    fundStatus: 'unpaid',
    matchesPlayed: 8,
    wins: 4,
    losses: 4,
    pointsScored: 79,
    pointsConceded: 80,
    joinDate: '2024-02-15',
    notes: 'Di chuyển linh hoạt, cứu bóng xuất thần'
  },
  {
    id: 'p8',
    name: 'Bùi Thị Trang',
    nickname: 'Trang Bền Bỉ',
    avatarColor: '#F97316', // Orange
    avatarBg: '#FFEDD5',
    level: 3.0,
    phone: '0901890123',
    status: 'present',
    position: 'Right',
    fundStatus: 'paid',
    matchesPlayed: 7,
    wins: 3,
    losses: 4,
    pointsScored: 65,
    pointsConceded: 72,
    joinDate: '2024-03-01',
    notes: 'Lên lưới cực nhanh, bắt volley chuẫn'
  },
  {
    id: 'p9',
    name: 'Đỗ Ngọc Huy',
    nickname: 'Huy Pháo Thủ',
    avatarColor: '#6366F1', // Indigo
    avatarBg: '#E0E7FF',
    level: 4.0,
    phone: '0932901234',
    status: 'present',
    position: 'Left',
    fundStatus: 'paid',
    matchesPlayed: 9,
    wins: 7,
    losses: 2,
    pointsScored: 97,
    pointsConceded: 68,
    joinDate: '2024-01-20',
    notes: 'Drive mạnh từ sân sau, giao bóng hiểm'
  },
  {
    id: 'p10',
    name: 'Ngô Hải Sơn',
    nickname: 'Sơn Bức Tường',
    avatarColor: '#84CC16', // Lime
    avatarBg: '#ECFCCB',
    level: 3.0,
    phone: '0971012345',
    status: 'present',
    position: 'Any',
    fundStatus: 'paid',
    matchesPlayed: 6,
    wins: 2,
    losses: 4,
    pointsScored: 52,
    pointsConceded: 64,
    joinDate: '2024-03-05',
    notes: 'Khả năng đỡ đập bóng số 1 nhóm'
  },
  {
    id: 'p11',
    name: 'Dương Khánh Bảo',
    nickname: 'Bảo Tân Binh',
    avatarColor: '#06B6D4', // Cyan
    avatarBg: '#CFFAFE',
    level: 2.5,
    phone: '0913123456',
    status: 'present',
    position: 'Right',
    fundStatus: 'unpaid',
    matchesPlayed: 5,
    wins: 2,
    losses: 3,
    pointsScored: 42,
    pointsConceded: 51,
    joinDate: '2024-03-15',
    notes: 'Đang nâng cấp kỹ năng dink & drop shot'
  },
  {
    id: 'p12',
    name: 'Cao Thanh Hà',
    nickname: 'Hà Nhẹ Nhàng',
    avatarColor: '#D946EF', // Fuchsia
    avatarBg: '#FAE8FF',
    level: 3.0,
    phone: '0984234567',
    status: 'present',
    position: 'Any',
    fundStatus: 'paid',
    matchesPlayed: 6,
    wins: 3,
    losses: 3,
    pointsScored: 59,
    pointsConceded: 61,
    joinDate: '2024-02-20',
    notes: 'Đọc tình huống tốt, đỡ lob cực chuẩn'
  }
];

export const INITIAL_TRANSACTIONS: FundTransaction[] = [
  {
    id: 'ft1',
    date: '2026-07-01',
    title: 'Đóng quỹ tháng 7 (10/12 thành viên)',
    amount: 3000000,
    type: 'income',
    category: 'member_fee',
    payerOrPayee: 'Thu quỹ định kỳ',
    note: '300.000 đ/người x 10 người'
  },
  {
    id: 'ft2',
    date: '2026-07-05',
    title: 'Tiền thuê sân cố định Tháng 7 (8 buổi)',
    amount: 1600000,
    type: 'expense',
    category: 'court_fee',
    payerOrPayee: 'Chủ sân Pickleball Center',
    note: '2 sân x 2 tiếng x 8 buổi'
  },
  {
    id: 'ft3',
    date: '2026-07-10',
    title: 'Mua bóng Franklin X-40 (Hộp 12 quả)',
    amount: 450000,
    type: 'expense',
    category: 'ball',
    payerOrPayee: 'Pickleball Store HN',
    note: 'Bóng thi đấu chính thức nhóm'
  },
  {
    id: 'ft4',
    date: '2026-07-18',
    title: 'Nước uống giải khát & đá lạnh',
    amount: 150000,
    type: 'expense',
    category: 'water_drink',
    payerOrPayee: 'Căn tin sân',
    note: 'Buổi đánh giao lưu cuối tuần'
  }
];

export const DEFAULT_SETTINGS: GroupSettings = {
  groupName: 'Nhóm Pickleball Đống Đa - 12 Chiến Hữu',
  courtFeePerSession: 200000,
  memberMonthlyFee: 300000,
  defaultCourtCount: 2,
  pointsToWin: 11,
  winByTwo: true
};
