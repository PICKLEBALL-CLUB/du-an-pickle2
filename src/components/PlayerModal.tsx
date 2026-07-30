import React, { useState } from 'react';
import { X, User, Phone, Award, AlignLeft } from 'lucide-react';
import { Player, PositionPreference } from '../types';

interface PlayerModalProps {
  player?: Player | null; // Null means adding new player
  onSave: (playerData: Partial<Player>) => void;
  onDelete?: (playerId: string) => void;
  onClose: () => void;
}

const AVATAR_COLORS = [
  { bg: '#D1FAE5', color: '#10B981' }, // Emerald
  { bg: '#E0F2FE', color: '#0284C7' }, // Sky
  { bg: '#FCE7F3', color: '#EC4899' }, // Pink
  { bg: '#EDE9FE', color: '#8B5CF6' }, // Purple
  { bg: '#FEF3C7', color: '#F59E0B' }, // Amber
  { bg: '#CCFBF1', color: '#14B8A6' }, // Teal
  { bg: '#FEE2E2', color: '#EF4444' }, // Red
  { bg: '#ECFCCB', color: '#84CC16' }, // Lime
];

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState<string>(player?.name || '');
  const [nickname, setNickname] = useState<string>(player?.nickname || '');
  const [level, setLevel] = useState<number>(player?.level || 3.0);
  const [phone, setPhone] = useState<string>(player?.phone || '');
  const [position, setPosition] = useState<PositionPreference>(player?.position || 'Any');
  const [notes, setNotes] = useState<string>(player?.notes || '');
  const [selectedColor, setSelectedColor] = useState(
    player ? { bg: player.avatarBg, color: player.avatarColor } : AVATAR_COLORS[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên thành viên!');
      return;
    }

    onSave({
      id: player?.id,
      name: name.trim(),
      nickname: nickname.trim(),
      level,
      phone: phone.trim(),
      position,
      notes: notes.trim(),
      avatarBg: selectedColor.bg,
      avatarColor: selectedColor.color,
      status: player?.status || 'present',
      fundStatus: player?.fundStatus || 'paid',
      matchesPlayed: player?.matchesPlayed || 0,
      wins: player?.wins || 0,
      losses: player?.losses || 0,
      pointsScored: player?.pointsScored || 0,
      pointsConceded: player?.pointsConceded || 0,
      joinDate: player?.joinDate || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-4">
          {player ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Màu Đại Diện Avatar</label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                    selectedColor.bg === c.bg ? 'scale-110 border-white' : 'border-transparent opacity-70'
                  }`}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>

          {/* Name & Nickname */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và Tên *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn Minh"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Biệt danh / Biệt hiệu</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="VD: Minh Tốc Độ"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Skill Level & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cấp độ DUPR</label>
              <select
                value={level}
                onChange={(e) => setLevel(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                <option value={2.5}>2.5 - Mới chơi</option>
                <option value={3.0}>3.0 - Trung bình</option>
                <option value={3.5}>3.5 - Khá</option>
                <option value={4.0}>4.0 - Tốt / Nâng cao</option>
                <option value={4.5}>4.5 - Chuyên nghiệp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sân ưa thích</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as PositionPreference)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                <option value="Left">Sân Trái (Bên trái)</option>
                <option value="Right">Sân Phải (Bên phải)</option>
                <option value="Any">Linh hoạt cả 2 bên</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Số Điện Thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0903123456"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú kỹ thuật / Sở trường</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Dink kiên trì, đập bóng Kitchen tốt..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex justify-between items-center">
            {player && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Xóa thành viên ${player.name}?`)) {
                    onDelete(player.id);
                    onClose();
                  }
                }}
                className="text-xs font-bold text-rose-400 hover:underline cursor-pointer"
              >
                Xóa thành viên
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-extrabold hover:bg-lime-300 cursor-pointer"
              >
                Lưu Thành Viên
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
