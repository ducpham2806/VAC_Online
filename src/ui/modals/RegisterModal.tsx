import { REGION_INFO } from '../../data/masterData';
import { GenderType, RegionType } from '../../data/types';
import { useGameStore } from '../../store/useGameStore';

export interface RegisterModalProps {
  tempName: string;
  setTempName: (v: string) => void;
  tempGender: GenderType;
  setTempGender: (v: GenderType) => void;
  tempRegion: RegionType;
  setTempRegion: (v: RegionType) => void;
}

/** MODAL 7: GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN NHÂN VẬT & 3 MIỀN) — tách từ App.tsx (S2). */
export function RegisterModal({ tempName, setTempName, tempGender, setTempGender, tempRegion, setTempRegion }: RegisterModalProps) {
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const setProfile = useGameStore((s) => s.setProfile);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-xl w-full p-3 sm:p-4 max-h-[88dvh] overflow-y-auto shadow-2xl text-xs space-y-3">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-xs sm:text-sm">
          <span>📜 GIẤY ĐĂNG KÝ VỀ QUÊ LẬP NGHIỆP (CHỌN NHÂN VẬT &amp; 3 MIỀN)</span>
          <button
            onClick={() => setActiveModal(null)}
            className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="space-y-2">
          <label className="font-extrabold block">1. Họ Tên Điền Chủ &amp; Giới Tính:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="flex-1 border-2 border-[#c88a4b] rounded-lg px-3 py-1.5 font-bold bg-white"
            />
            <button
              onClick={() => setTempGender('MALE')}
              className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                tempGender === 'MALE' ? 'bg-[#4e8222] text-white' : 'bg-white border border-[#c88a4b]'
              }`}
            >
              👦 Nam
            </button>
            <button
              onClick={() => setTempGender('FEMALE')}
              className={`touch-btn px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                tempGender === 'FEMALE' ? 'bg-[#4e8222] text-white' : 'bg-white border border-[#c88a4b]'
              }`}
            >
              👧 Nữ
            </button>
          </div>

          <label className="font-extrabold block mt-2">
            2. Chọn Vùng Quê Hương Khởi Nghiệp (10 Đặc Sản Độc Quyền Mỗi Miền):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['NORTH', 'CENTRAL', 'SOUTH'] as RegionType[]).map((r) => (
              <button
                key={r}
                onClick={() => setTempRegion(r)}
                className={`touch-btn p-2 rounded-xl font-extrabold border-2 cursor-pointer ${
                  tempRegion === r
                    ? 'bg-[#f5b82e] border-[#b83224] text-[#2a180c]'
                    : 'bg-white border-[#c88a4b]'
                }`}
              >
                {REGION_INFO[r].shortName}
              </button>
            ))}
          </div>
          <div className="bg-white border border-[#c88a4b] p-2.5 rounded-lg">
            <b>🎁 Nội tại {REGION_INFO[tempRegion].name}:</b> {REGION_INFO[tempRegion].buffName}
            <div className="text-[11px] text-[#664930] mt-1">
              • <b>10 Đặc sản Vùng:</b> {REGION_INFO[tempRegion].specialties.join(', ')}
            </div>
          </div>
        </div>

        <button
          onClick={() => setProfile(tempName, tempGender, tempRegion)}
          className="touch-btn w-full bg-[#b83224] text-white font-extrabold py-2.5 rounded-xl cursor-pointer"
        >
          💮 ĐÓNG DẤU ĐỎ &amp; CẬP NHẬT QUÊ HƯƠNG!
        </button>
      </div>
    </div>
  );
}
