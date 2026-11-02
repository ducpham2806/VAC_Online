import { useState } from 'react';
import { GAME_CATALOG, REGION_INFO } from '../../data/masterData';
import { RegionType } from '../../data/types';
import { GAME_STAGE } from '../../config/features';
import { canCraftOrBuy } from '../../domain/progression';
import { useGameStore } from '../../store/useGameStore';

const IS_DEV = import.meta.env.DEV;

/** MODAL ĐẠI TỪ ĐIỂN BÁCH KHOA 155 THỰC THỂ & ĐỒNG BỘ SUPABASE CLOUD — tách từ App.tsx (S2). */
export function EncyclopediaModal() {
  const inventory = useGameStore((s) => s.inventory);
  const level = useGameStore((s) => s.level);
  const syncCatalogToSupabaseCloud = useGameStore((s) => s.syncCatalogToSupabaseCloud);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const craftOrBuyCatalogItem = useGameStore((s) => s.craftOrBuyCatalogItem);
  const [encycCategory, setEncycCategory] = useState<string>('ALL');
  const [encycRegion, setEncycRegion] = useState<'ALL' | RegionType>('ALL');
  const [encycSearch, setEncycSearch] = useState<string>('');
  const filteredEncyclopedia = GAME_CATALOG.filter((item) => {
  const matchCat =
      encycCategory === 'ALL'
        ? true
        : encycCategory === 'CROPS_TREES'
        ? item.category === 'CROP' || item.category === 'TREE' || item.category === 'MUTANT_CROP'
        : encycCategory === 'ANIMALS_PETS'
        ? item.category === 'ANIMAL' || item.category === 'PET'
        : encycCategory === 'AQUA'
        ? item.category === 'AQUA'
        : encycCategory === 'MACHINES'
        ? item.category === 'MACHINE'
        : encycCategory === 'RECIPES_CRAFT'
        ? item.category === 'RECIPE' || item.category === 'CRAFT_GEAR'
        : encycCategory === 'FASHION'
        ? item.category === 'FASHION'
        : item.category === 'WORKER' ||
          item.category === 'BENCHMARK_FEATURE' ||
          item.category === 'DEFENSE' ||
          item.category === 'IAP';

  const matchReg = encycRegion === 'ALL' ? true : item.region === encycRegion;
  const matchSearch =
      !encycSearch.trim() ||
      item.name.toLowerCase().includes(encycSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(encycSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(encycSearch.toLowerCase());

    return matchCat && matchReg && matchSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="vac-paper vac-pop-in bg-[#fff8eb] border-4 border-[#6e4121] rounded-2xl max-w-6xl w-full p-3 sm:p-4 max-h-[90dvh] overflow-y-auto shadow-2xl text-xs">
        <div className="vac-wood bg-[#6e4121] text-[#f5b82e] px-3 py-2 rounded-xl font-extrabold flex flex-wrap justify-between items-center gap-2 mb-3 text-xs sm:text-sm sticky top-0 z-10">
          <span>
            📖 ĐẠI TỪ ĐIỂN BÁCH KHOA TOÀN THƯ VAC ONLINE ({filteredEncyclopedia.length}/{GAME_CATALOG.length} THỰC THỂ ĐÃ NẠP)
          </span>
          <div className="flex items-center gap-2">
            {IS_DEV && (
              <button
                onClick={syncCatalogToSupabaseCloud}
                className="touch-btn bg-[#2e8b8d] border border-[#80deea] text-white px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer"
              >
                ☁️ Đẩy Catalog (DEV)
              </button>
            )}
            <button
              onClick={() => setActiveModal(null)}
              className="touch-btn bg-[#b83224] text-white px-3 py-1 rounded-lg text-xs cursor-pointer"
            >
              ✕ Đóng
            </button>
          </div>
        </div>

        {/* Bộ lọc Danh mục + Vùng miền + Tìm kiếm */}
        <div className="bg-white border-2 border-[#c88a4b] rounded-xl p-2.5 mb-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: `🌟 Tất cả (${GAME_CATALOG.length})` },
              { id: 'CROPS_TREES', label: '🌱 48 Cây Trồng, Lâu Năm & Đột Biến' },
              { id: 'ANIMALS_PETS', label: '🐄 19 Vật Nuôi Chuồng & Thú Cưng' },
              { id: 'AQUA', label: '🐟 19 Thủy Sản Ao & Đầm Nước' },
              { id: 'MACHINES', label: '🏭 8 Xưởng Máy Chế Biến Sâu' },
              { id: 'RECIPES_CRAFT', label: '🍲 31 Món Ăn 3 Miền & Đồ Bảo Hộ' },
              { id: 'FASHION', label: '🪞 12 Slots Thời Trang Truyền Thống' },
              { id: 'FEATURES', label: '🛖 6 Nhân Công, Đình Làng & Sự Kiện' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setEncycCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg font-extrabold cursor-pointer border ${
                  encycCategory === c.id
                    ? 'bg-[#4e8222] text-white border-[#2a180c]'
                    : 'bg-[#fffdf7] text-[#2a180c] border-[#c88a4b]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#6e4121]">Vùng miền:</span>
              {(['ALL', 'NORTH', 'CENTRAL', 'SOUTH'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setEncycRegion(r)}
                  className={`px-2.5 py-0.5 rounded-full font-bold cursor-pointer border ${
                    encycRegion === r
                      ? 'bg-[#f5b82e] text-[#2a180c] border-[#6e4121]'
                      : 'bg-[#fffdf7] text-[#664930] border-[#c88a4b]'
                  }`}
                >
                  {r === 'ALL'
                    ? 'Toàn Quốc'
                    : r === 'NORTH'
                    ? '🎋 Miền Bắc'
                    : r === 'CENTRAL'
                    ? '⛰️ Miền Trung'
                    : '🥥 Miền Nam'}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={encycSearch}
              onChange={(e) => setEncycSearch(e.target.value)}
              placeholder="🔍 Tìm tên cây, cá, món ăn, mã ID (VD: CROP_S05, Cá Kho)..."
              className="border-2 border-[#c88a4b] rounded-lg px-3 py-1 bg-[#fffdf7] w-full sm:w-80 font-bold"
            />
          </div>
        </div>

        {/* Lưới hiển thị chi tiết từng thực thể */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredEncyclopedia.map((item) => {
            const isPlantable =
              item.category === 'CROP' ||
              item.category === 'TREE' ||
              item.category === 'MUTANT_CROP' ||
              item.category === 'ANIMAL' ||
              item.category === 'AQUA';
            const craftLock = isPlantable ? null : canCraftOrBuy(item, level, GAME_STAGE);
            const lockedStage = craftLock && !craftLock.ok && craftLock.reason === 'STAGE_LOCKED' ? craftLock.stage : null;
            return (
              <div
                key={item.id}
                className="bg-white border-2 border-[#c88a4b] rounded-xl p-2.5 flex flex-col justify-between gap-1.5 shadow-xs"
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-extrabold text-[#2a180c] text-xs">
                      {item.emoji} {item.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fff3e0] border border-[#c88a4b] shrink-0">
                      {item.id} • Lv.{item.unlockLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 my-1 text-[10px] font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-[#e8f5e9] text-[#1b5e20]">
                      {item.region === 'ALL' ? '3 Miền Chung' : `Đặc sản ${REGION_INFO[item.region].shortName}`}
                    </span>
                    {item.growOrCraftMinutes > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#e3f2fd] text-[#0d47a1]">
                        ⏱️ {item.growOrCraftMinutes} phút
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 rounded bg-[#fff8e1] text-[#6e4121]">
                      🎒 Kho: {inventory[item.id] ?? 0}
                    </span>
                  </div>

                  {item.inputIngredients && (
                    <div className="text-[11px] text-[#b83224] font-semibold">
                      🔹 Nguyên liệu: {item.inputIngredients}
                    </div>
                  )}
                  <p className="text-[11px] text-[#664930] mt-0.5">{item.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-[#f0e6d2] pt-1.5 mt-1">
                  <div className="text-[11px] font-bold text-[#2a180c]">
                    Mua: <b>{item.buyCostGold.toLocaleString()}🪙</b> | Bán:{' '}
                    <b className="text-[#4e8222]">{item.baseSellGold.toLocaleString()}🪙</b>
                  </div>
                  {lockedStage !== null ? (
                    <span className="px-2.5 py-1 rounded-lg font-extrabold text-[11px] bg-[#e0d4c0] text-[#664930]">
                      🔒 Mở ở GĐ{lockedStage}
                    </span>
                  ) : (
                  <button
                    onClick={() => craftOrBuyCatalogItem(item.id)}
                    className={`touch-btn px-2.5 py-1 rounded-lg font-extrabold text-[11px] cursor-pointer ${
                      isPlantable
                        ? 'bg-[#4e8222] text-white'
                        : 'bg-[#f5b82e] text-[#2a180c]'
                    }`}
                  >
                    {isPlantable ? '🌱 Chọn Gieo/Nuôi' : '⚡ Chế Biến / Sở Hữu'}
                  </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
