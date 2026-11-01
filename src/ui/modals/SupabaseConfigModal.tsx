import { useState } from 'react';
import { getSupabaseCredentials, saveSupabaseCredentials } from '../../services/supabaseClient';
import { useGameStore } from '../../store/useGameStore';

const IS_DEV = import.meta.env.DEV;

/** MODAL 8: TRẠNG THÁI SUPABASE CLOUD & REALTIME — tách từ App.tsx (S2). */
export function SupabaseConfigModal() {
  const onlineFarmersCount = useGameStore((s) => s.onlineFarmersCount);
  const dbTablesStatus = useGameStore((s) => s.dbTablesStatus);
  const syncCatalogToSupabaseCloud = useGameStore((s) => s.syncCatalogToSupabaseCloud);
  const setToast = useGameStore((s) => s.setToast);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const initialCreds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState(initialCreds.url);
  const [sbKey, setSbKey] = useState(initialCreds.anonKey);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-lg w-full p-4 space-y-3 text-xs shadow-2xl">
        <div className="bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-sm">
          <span>🟢 TRẠNG THÁI SUPABASE CLOUD &amp; ĐỒNG BỘ 155 THỰC THỂ</span>
          <button
            onClick={() => setActiveModal(null)}
            className="touch-btn bg-[#b83224] text-white px-2.5 py-1 rounded-lg text-xs cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="bg-[#e8f5e9] border-2 border-[#4e8222] rounded-xl p-2.5 space-y-1">
          <div className="font-extrabold text-[#1b5e20]">
            📡 Nông dân đang trực tuyến (Realtime Presence): {onlineFarmersCount} người
          </div>
          <div className="text-[11px] text-[#2a180c]">
            🗄️ <b>Trạng thái Database &amp; Dữ liệu:</b> {dbTablesStatus}
          </div>
        </div>

        {IS_DEV && (
          <>
          <button
            onClick={syncCatalogToSupabaseCloud}
            className="touch-btn w-full bg-[#2e8b8d] border-2 border-[#80deea] text-white font-extrabold py-2 rounded-xl cursor-pointer"
          >
            ☁️ Đồng Bộ Trọn Bộ 155 Thực Thể &amp; 8 Sạp Chợ Lên Supabase Cloud
          </button>
  
          <div className="space-y-1.5">
            <label className="font-bold block">Supabase Project URL:</label>
            <input
              type="text"
              value={sbUrl}
              onChange={(e) => setSbUrl(e.target.value)}
              placeholder="https://znabynzbcimpesrxxxsz.supabase.co"
              className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 bg-white font-mono text-[11px]"
            />
            <label className="font-bold block mt-2">Supabase Publishable / Anon Key:</label>
            <input
              type="text"
              value={sbKey}
              onChange={(e) => setSbKey(e.target.value)}
              placeholder="sb_publishable_..."
              className="w-full border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 bg-white font-mono text-[11px]"
            />
          </div>
  
          <button
            onClick={() => {
              saveSupabaseCredentials(sbUrl, sbKey);
              setToast('✅ Đã lưu cấu hình Supabase! Đang tải lại để đồng bộ Realtime...');
              setTimeout(() => window.location.reload(), 800);
            }}
            className="touch-btn w-full bg-[#4e8222] text-white font-extrabold py-2 rounded-xl cursor-pointer"
          >
            💾 Lưu Cấu Hình &amp; Kết Nối Lại
          </button>
          </>
        )}
      </div>
    </div>
  );
}
