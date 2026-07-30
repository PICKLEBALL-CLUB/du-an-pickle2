import React from 'react';
import { BookOpen, ShieldAlert, Zap, CheckCircle2, Award } from 'lucide-react';

export const PickleballRules: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Sổ Tay Cẩm Nang & Luật Pickleball Thi Đấu</h2>
            <p className="text-xs text-slate-400 mt-1">
              Quy tắc thi đấu chuẩn quốc tế (USA Pickleball / DUPR) dành cho nhóm 12 người
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rule 1: Two-Bounce Rule */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-extrabold text-white text-sm">Luật 2 Nhịp Nảy (Two-Bounce Rule)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Bóng sau khi giao phải nảy <strong className="text-lime-300">1 nhịp bên sân đối phương</strong>, sau đó cú trả bóng cũng phải nảy <strong className="text-lime-300">1 nhịp bên sân giao bóng</strong>. Sau 2 nhịp nảy này, hai bên mới được phép Volley (đánh bóng sống trên không).
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            💡 <em>Lưu ý:</em> Không được bắt volley ngay cú giao bóng đầu tiên hoặc cú trả giao bóng.
          </div>
        </div>

        {/* Rule 2: Non-Volley Zone (Kitchen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-extrabold text-white text-sm">Vùng Kitchen (Non-Volley Zone 2.13m)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Tuyệt đối <strong className="text-amber-300">không được đánh bóng Volley (đánh trực tiếp trên không)</strong> khi chân đang đứng trong vùng Kitchen hoặc chạm vào vạch Kitchen.
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            ✅ Bạn ĐƯỢC PHÉP bước vào Kitchen nếu bóng đã nảy 1 nhịp trong vùng Kitchen trước đó.
          </div>
        </div>

        {/* Rule 3: Serve Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-extrabold text-white text-sm">Quy Tắc Giao Bóng Dưới Thắt Lưng</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Cú giao bóng phải đánh theo hướng dưới thắt lưng (Underhand), điểm tiếp xúc vợt với bóng nằm dưới thắt lưng và đầu vợt hướng xuống dưới điểm cao nhất của cổ tay.
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            🎯 Giao bóng chéo sân và bóng phải rơi qua vạch Kitchen của đối phương.
          </div>
        </div>

        {/* Rule 4: Scoring System */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-extrabold text-white text-sm">Cách Tính Điểm (Mốc 11 Điểm)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Chỉ đỗi bóng có quyền giao mới ghi được điểm (Side-out scoring trong phong trào hoặc Rally scoring tùy quy ước nhóm). Trận đấu kết thúc khi có đội đạt <strong className="text-emerald-400">11 điểm</strong> và cách biệt ít nhất 2 điểm.
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            📣 Xướng điểm chuẩn doubles: <code>Điểm Đội Giao - Điểm Đội Nhận - Người Giao (1 hoặc 2)</code> (Ví dụ: "4-2-1").
          </div>
        </div>
      </div>
    </div>
  );
};
