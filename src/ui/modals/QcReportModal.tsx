import { QCTestResult, runFullQCTestSuite } from '../../services/qcTestRunner';
import { useGameStore } from '../../store/useGameStore';

export interface QcReportModalProps {
  qcResults: QCTestResult[];
  setQcResults: (v: QCTestResult[]) => void;
}

/** QC_REPORT — tách từ App.tsx (S2). */
export function QcReportModal({ qcResults, setQcResults }: QcReportModalProps) {
  const setActiveModal = useGameStore((s) => s.setActiveModal);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-[#fff8eb] border-4 border-[#0f766e] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col p-4 space-y-3 text-xs shadow-2xl">
        <div className="bg-[#0f766e] text-white px-3 py-2 rounded-xl font-extrabold flex justify-between items-center text-sm">
          <span>🧪 BÁO CÁO AUTOMATED QC TEST SUITE (10 EPICS / 25 TEST CASES)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQcResults(runFullQCTestSuite())}
              className="touch-btn bg-[#f5b82e] text-[#2a180c] px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
            >
              🔄 Chạy Lại 25 Test Cases
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="touch-btn bg-[#b83224] text-white px-2.5 py-1 rounded-lg text-xs cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#e8f5e9] border-2 border-[#2e7d32] rounded-xl p-2">
            <div className="text-[11px] font-bold text-[#1b5e20]">TỔNG SỐ TEST CASES</div>
            <div className="text-lg font-extrabold text-[#1b5e20]">{qcResults.length} TC</div>
          </div>
          <div className="bg-[#e0f2f1] border-2 border-[#0f766e] rounded-xl p-2">
            <div className="text-[11px] font-bold text-[#0f766e]">ĐẠT CHUẨN (PASSED)</div>
            <div className="text-lg font-extrabold text-[#0f766e]">
              {qcResults.filter((r) => r.passed).length} / {qcResults.length}
            </div>
          </div>
          <div className="bg-[#fff3e0] border-2 border-[#e65100] rounded-xl p-2">
            <div className="text-[11px] font-bold text-[#e65100]">TỔNG THỜI GIAN CHẠY</div>
            <div className="text-lg font-extrabold text-[#e65100]">
              {qcResults.reduce((acc, r) => acc + r.durationMs, 0).toFixed(2)} ms
            </div>
          </div>
        </div>

        <div className="text-[11px] bg-[#f3e5ab] border border-[#c88a4b] rounded-lg px-3 py-1.5 text-[#3b210e]">
          🛡️ <b>Cơ chế Snapshot An Toàn:</b> Bộ kiểm thử tự động chụp trạng thái nông trại trước khi chạy và khôi phục nguyên trạng 100% sau khi hoàn tất 15 bài kiểm thử biên (Boundary &amp; Anti-Cheat).
        </div>

        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {qcResults.map((tc) => (
            <div
              key={tc.id}
              className={`border-2 rounded-xl p-2.5 flex flex-col gap-1 ${
                tc.passed
                  ? 'bg-white border-[#4e8222]'
                  : 'bg-[#ffebee] border-[#c62828]'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-extrabold text-[#2a180c] flex items-center gap-1.5">
                  <span>{tc.passed ? '✅ PASS' : '❌ FAIL'}</span>
                  <span className="bg-[#6e4121] text-[#f5b82e] px-2 py-0.5 rounded text-[10px]">
                    {tc.epic}
                  </span>
                  <span className="text-[#0f766e]">[{tc.id}]</span>
                  <span>{tc.title}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-600">
                  ⏱️ {tc.durationMs} ms
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] mt-0.5">
                <div className="bg-[#f5f5f5] px-2 py-1 rounded border border-gray-300">
                  <b>Kỳ vọng (Expected):</b> {tc.expected}
                </div>
                <div className="bg-[#e8f5e9] px-2 py-1 rounded border border-[#81c784]">
                  <b>Thực tế (Actual):</b> {tc.actual}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
