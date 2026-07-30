import React, { useState } from 'react';
import { Shield, Smartphone, Mail, CheckCircle2, Lock, ArrowRight, UserCheck, Key, X, Sparkles } from 'lucide-react';
import { AuthUser, UserRole, AuthMethod, Player } from '../types';

interface AuthModalProps {
  currentUser: AuthUser | null;
  players: Player[];
  onLogin: (user: AuthUser) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  players,
  onLogin,
  onClose,
}) => {
  const [method, setMethod] = useState<AuthMethod>('google');
  const [role, setRole] = useState<UserRole>('admin');

  // Google state
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string>('gccafe.dha@gmail.com');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [isCustomGoogle, setIsCustomGoogle] = useState<boolean>(false);

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState<string>('0901234567');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Admin 6-digit code state
  const [adminCode, setAdminCode] = useState<string>('686868');
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null);

  // Send OTP handler
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9-10 chữ số)!');
      return;
    }
    setOtpSent(true);
    setOtpCode('123456'); // Pre-fill sample OTP for convenience
  };

  // Google Submit
  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCodeError(null);

    // Validate 6-digit passcode if role is Admin
    if (role === 'admin') {
      const cleanCode = adminCode.trim();
      if (cleanCode.length !== 6 || (!/^\d{6}$/.test(cleanCode) && cleanCode !== '686868' && cleanCode !== '123456')) {
        setAdminCodeError('Mã xác thực Admin phải đúng 6 ký tự số! (Thử: 686868)');
        return;
      }
    }

    const finalEmail = isCustomGoogle ? customEmail.trim() : selectedGoogleEmail;
    if (isCustomGoogle && !finalEmail.includes('@')) {
      alert('Vui lòng nhập địa chỉ Email Google hợp lệ!');
      return;
    }

    // Try finding matching player in roster
    const matchedPlayer = players.find(
      (p) => p.phone === phoneNumber || p.name.toLowerCase().includes('minh')
    );

    const nameFromEmail = finalEmail.split('@')[0];
    const formattedName =
      finalEmail === 'gccafe.dha@gmail.com'
        ? 'Minh Tốc Độ'
        : nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const newUser: AuthUser = {
      id: matchedPlayer ? matchedPlayer.id : `u_${Date.now()}`,
      name: formattedName,
      email: finalEmail,
      avatarBg: role === 'admin' ? '#FEF08A' : '#D1FAE5',
      avatarColor: role === 'admin' ? '#854D0E' : '#065F46',
      role,
      method: 'google',
    };

    onLogin(newUser);
  };

  // Phone Submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCodeError(null);

    // Validate 6-digit passcode if role is Admin
    if (role === 'admin') {
      const cleanCode = adminCode.trim();
      if (cleanCode.length !== 6 || (!/^\d{6}$/.test(cleanCode) && cleanCode !== '686868' && cleanCode !== '123456')) {
        setAdminCodeError('Mã xác thực Admin phải đúng 6 ký tự số! (Thử: 686868)');
        return;
      }
    }

    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (otpCode.trim() !== '123456' && otpCode.trim().length !== 6) {
      setOtpError('Mã OTP không chính xác! Vui lòng thử lại với 123456.');
      return;
    }

    // Find match by phone or fallback name
    const matchedPlayer = players.find((p) => p.phone === phoneNumber.trim());
    const displayName = matchedPlayer ? matchedPlayer.name : `Cầu Thủ (${phoneNumber.slice(-4)})`;

    const newUser: AuthUser = {
      id: matchedPlayer ? matchedPlayer.id : `u_${Date.now()}`,
      name: displayName,
      phone: phoneNumber.trim(),
      avatarBg: role === 'admin' ? '#FEF08A' : '#E0F2FE',
      avatarColor: role === 'admin' ? '#854D0E' : '#0369A1',
      role,
      method: 'phone',
    };

    onLogin(newUser);
  };

  // Quick Demo Accounts Login
  const handleQuickLogin = (preset: {
    id: string;
    name: string;
    role: UserRole;
    email?: string;
    phone?: string;
    method: AuthMethod;
    bg: string;
    color: string;
  }) => {
    const newUser: AuthUser = {
      id: preset.id,
      name: preset.name,
      email: preset.email,
      phone: preset.phone,
      avatarBg: preset.bg,
      avatarColor: preset.color,
      role: preset.role,
      method: preset.method,
    };
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 flex items-center justify-center text-slate-950 mx-auto mb-3 shadow-lg shadow-lime-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Đăng Nhập PickleManager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Chọn phương thức đăng nhập và phân quyền hệ thống
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setMethod('google')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'google'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Google Login</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'phone'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Số Điện Thoại</span>
          </button>
        </div>

        {/* Role Selection Block */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Chọn Quyền Hạn Đăng Nhập
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Admin Role Card */}
            <div
              onClick={() => setRole('admin')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                role === 'admin'
                  ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-amber-300 text-xs flex items-center gap-1">
                  👑 Admin
                </span>
                {role === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-300 font-semibold">Toàn quyền hệ thống</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                • Xoay vòng sân, sửa/xóa thành viên, nhập tỷ số, thu chi quỹ & cài đặt.
              </p>
            </div>

            {/* Member Role Card */}
            <div
              onClick={() => setRole('member')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                role === 'member'
                  ? 'bg-emerald-500/10 border-emerald-400/80 shadow-md ring-1 ring-emerald-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-emerald-300 text-xs flex items-center gap-1">
                  👤 Member
                </span>
                {role === 'member' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-300 font-semibold">Chỉ xem & Điểm danh</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                • Xem lịch đấu, xếp hạng, quỹ nhóm & ĐIỂM DANH tham gia buổi tập.
              </p>
            </div>
          </div>

          {/* Admin 6-Digit Code Input Box */}
          {role === 'admin' && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <label className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mã Xác Thực Admin (6 Ký Tự)</span>
                </label>
                <span className="text-[10px] text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
                  Mã mẫu: 686868
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="Nhập 6 chữ số Admin (VD: 686868)"
                value={adminCode}
                onChange={(e) => {
                  setAdminCode(e.target.value);
                  setAdminCodeError(null);
                }}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2 text-center text-sm font-mono tracking-widest text-amber-200 focus:outline-none focus:border-amber-400"
              />
              {adminCodeError && (
                <p className="text-[11px] text-rose-400 font-semibold mt-1">{adminCodeError}</p>
              )}
            </div>
          )}
        </div>

        {/* Method 1: GOOGLE FORM */}
        {method === 'google' && (
          <form onSubmit={handleGoogleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Tài khoản Google
              </label>

              {!isCustomGoogle ? (
                <div className="space-y-2">
                  <select
                    value={selectedGoogleEmail}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomGoogle(true);
                      } else {
                        setSelectedGoogleEmail(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="gccafe.dha@gmail.com">
                      Minh Tốc Độ (gccafe.dha@gmail.com)
                    </option>
                    <option value="nam.pickle@gmail.com">
                      Nam Cú Vọ (nam.pickle@gmail.com)
                    </option>
                    <option value="thao.pickle@gmail.com">
                      Thu Thảo (thao.pickle@gmail.com)
                    </option>
                    <option value="custom">✏️ Nhập Google Email khác...</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="nhap.email.google@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogle(false)}
                    className="text-xs text-slate-400 underline hover:text-white px-2"
                  >
                    Chọn mẫu
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                Đăng Nhập Google Với Quyền {role === 'admin' ? 'ADMIN' : 'MEMBER'}
              </span>
            </button>
          </form>
        )}

        {/* Method 2: PHONE FORM */}
        {method === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Số điện thoại đăng nhập
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-sky-400 hover:text-sky-300 whitespace-nowrap cursor-pointer"
                >
                  {otpSent ? 'Gửi lại OTP' : 'Gửi mã OTP'}
                </button>
              </div>
            </div>

            {/* OTP Input Block */}
            {otpSent && (
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Mã xác thực SMS (OTP)</span>
                  <span className="text-lime-400 text-[10px] font-mono">Mã thử nghiệm: 123456</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Nhập 6 chữ số OTP (123456)"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setOtpError(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-lime-400"
                />
                {otpError && <p className="text-[11px] text-rose-400">{otpError}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {otpSent
                  ? `Xác Nhận & Đăng Nhập (${role === 'admin' ? 'Admin' : 'Member'})`
                  : 'Nhận Mã OTP Qua SĐT'}
              </span>
            </button>
          </form>
        )}

        {/* Quick Demo Login Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 text-center mb-2.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Đăng Nhập Nhanh Mẫu Trực Tiếp:</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin({
                  id: 'p1',
                  name: 'Minh Tốc Độ',
                  email: 'gccafe.dha@gmail.com',
                  role: 'admin',
                  method: 'google',
                  bg: '#FEF08A',
                  color: '#854D0E',
                })
              }
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-center transition-all cursor-pointer"
            >
              <div className="text-[11px] font-extrabold">👑 Admin</div>
              <div className="text-[10px] text-slate-300 truncate">Minh Tốc Độ</div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin({
                  id: 'p2',
                  name: 'Nam Cú Vọ',
                  phone: '0901234567',
                  role: 'member',
                  method: 'phone',
                  bg: '#D1FAE5',
                  color: '#065F46',
                })
              }
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center transition-all cursor-pointer"
            >
              <div className="text-[11px] font-extrabold">👤 Member</div>
              <div className="text-[10px] text-slate-300 truncate">Nam Cú Vọ</div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin({
                  id: 'p3',
                  name: 'Thu Thảo',
                  email: 'thao.pickle@gmail.com',
                  role: 'member',
                  method: 'google',
                  bg: '#E0F2FE',
                  color: '#0369A1',
                })
              }
              className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-center transition-all cursor-pointer"
            >
              <div className="text-[11px] font-extrabold">👤 Member</div>
              <div className="text-[10px] text-slate-300 truncate">Thu Thảo</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
