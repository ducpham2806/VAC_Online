/**
 * 10 Chương Gia Phả — dữ liệu nhiệm vụ cốt truyện (nguồn chuẩn duy nhất).
 * Server: supabase/seed/quest_catalog_seed.sql sinh từ file này (npm run seed:catalog).
 */
import type { QuestObjective } from '../domain/quests';

export interface StoryQuest {
  id: string;
  /** Số chương Gia Phả (1..10). */
  chapterNo: number;
  /** Giai đoạn phát hành mở chương này (01_MASTER_GDD 4.2: GĐ1 = Ch.1–2, GĐ2 = Ch.3, 6, 7 …). */
  unlockStage: number;
  /** Cấp tối thiểu để nhận thưởng. */
  minLevel: number;
  chapter: string;
  title: string;
  npcSpeaker: string;
  npcQuote: string;
  desc: string;
  choiceEmpLabel: string;
  choicePragLabel: string;
  selectedChoice?: 'EMP' | 'PRAG';
  rewardGold: number;
  rewardGems: number;
  /**
   * Mục tiêu đo được (bộ đếm hành động, src/domain/quests.ts). Rỗng/không có = chỉ kiểm cấp.
   * Chương thuộc GĐ chưa mở để trống, thêm khi mở giai đoạn (VIEC_CAN_LAM.md).
   */
  objectives?: QuestObjective[];
  completed: boolean;
}

/** Thưởng thêm theo nhánh lựa chọn (giống rpc_claim_story_quest trong migration 0004). */
export const QUEST_BRANCH_REWARDS = {
  EMP: { gold: 0, fengShui: 30, neighbor: 3 },
  PRAG: { gold: 350, fengShui: 10, neighbor: 1 },
} as const;
export const QUEST_XP_REWARD = 100;

export const STORY_QUESTS: StoryQuest[] = [
    {
      id: 'Q_CH1',
      chapterNo: 1,
      unlockStage: 1,
      minLevel: 1,
      chapter: 'Chương 1 (Lv.1): Bức Thư Trong Chiếc Tráp Gỗ Lim',
      title: 'Giữ Đất Tổ Tiên & Gieo Vụ Lúa Đầu Mùa',
      npcSpeaker: '🎩 Thương Nhân Bá Kiến',
      npcQuote: '"Ký giấy nhượng lại mảnh vườn này lấy 2,000 Xu tiêu xài, đỡ phải chân lấm tay bùn trả khoản khế ước 50,000 Xu của ông nội cháu!"',
      desc: 'Từ chối bán đất tổ tiên, tưới nước Giếng Làng (-15% t/g) và thu hoạch mẻ Lúa Nước đầu tiên để mở Trang Gia Phả #1.',
      choiceEmpLabel: '🤝 Giữ đất tổ tiên (+30 Phong Thủy & +3 Nghĩa Xóm)',
      choicePragLabel: '🪙 Đòi Bá Kiến đặt cọc lúa sạch (+350 🪙)',
      rewardGold: 600,
      rewardGems: 15,
      objectives: [
        { counter: 'WATER', target: 1, label: '💧 Tưới nước Giếng Làng' },
        { counter: 'HARVEST:CROP_01', target: 1, label: '🌾 Thu hoạch Lúa Nước' },
      ],
      completed: false,
    },
    {
      id: 'Q_CH2',
      chapterNo: 2,
      unlockStage: 1,
      minLevel: 3,
      chapter: 'Chương 2 (Lv.3): Mùi Khói Bếp Của Mẹ & Bí Mật Đáy Ao',
      title: 'Vét Bùn Phù Sa & Đỏ Lửa Bếp Củi Quê Mẹ',
      npcSpeaker: '👴 Bác Trưởng Thôn Bảy',
      npcQuote: '"Mùi cá kho riềng sả bốc lên làm bác nhớ bà nội cháu xưa kia quá... Bát đầu tiên mới ra lò, cháu tính đem biếu ai trước?"',
      desc: 'Vét Bùn Đáy Ao lấy 3 Xô Phù Sa rồi bón Bùn Phù Sa cho 1 ô cây để tìm lại Trang Gia Phả #2.',
      choiceEmpLabel: '🤝 Biếu Bác Bảy & Lớp học làng (+30 Phong Thủy)',
      choicePragLabel: '🪙 Bán mở hàng Quán Nước đầu làng (+350 🪙)',
      rewardGold: 900,
      rewardGems: 20,
      objectives: [
        { counter: 'DREDGE', target: 1, label: '🪣 Vét bùn đáy ao' },
        { counter: 'APPLY_MUD', target: 1, label: '🟫 Bón bùn phù sa cho 1 ô' },
      ],
      completed: false,
    },
    {
      id: 'Q_CH3',
      chapterNo: 3,
      unlockStage: 2,
      minLevel: 6,
      chapter: 'Chương 3 (Lv.6): Chuyến Xe Hợp Tác Xã & Đêm Mưa Giông',
      title: 'Dựng Giàn Sau Bão & Giao Đơn Trường Làng',
      npcSpeaker: '👩‍🏫 Cô Giáo Hương',
      npcQuote: '"Cơn mưa đầu mùa làm tốc mái bếp ăn trường làng rồi... May mà có chuyến xe rau gạo Hợp Tác Xã của bạn kịp chở tới!"',
      desc: 'Phối 3 nguyên liệu trong Nồi Đất Bếp Quê, dựng lại giàn cây bị nghiêng sau mưa bão (+20% sản lượng) và giao 1 Đơn Hàng Hợp Tác Xã mở Trang Gia Phả #3.',
      choiceEmpLabel: '🤝 Góp tre gỗ sửa mái bếp trường (+30 Phong Thủy)',
      choicePragLabel: '🪙 Ký hợp đồng cung ứng giá sỉ (+350 🪙)',
      rewardGold: 1200,
      rewardGems: 25,
      completed: false,
    },
    {
      id: 'Q_CH4',
      chapterNo: 4,
      unlockStage: 3,
      minLevel: 9,
      chapter: 'Chương 4 (Lv.9): Bóng Đêm Rình Rập & Chó Phú Quốc',
      title: 'Huấn Luyện Chó Phú Quốc & Mở Sổ Lưu Bút Cổng Làng',
      npcSpeaker: '👴 Bác Trưởng Thôn Bảy',
      npcQuote: '"Đêm qua có kẻ rón rén vào vườn xoài đánh rơi chiếc Dép Tổ Ong! Cháu mau huấn luyện chú Chó Xoáy Phú Quốc canh sân nhé!"',
      desc: 'Ghé thăm trang trại hàng xóm qua Báo Chợ, ký Sổ Lưu Bút và mở khóa 4 Lớp Phòng Thủ (Trang Gia Phả #4).',
      choiceEmpLabel: '🤝 Đóng bảng Lưu Bút kết bạn (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đặt thêm Bẫy Vỏ Chuối phạt 50 Xu (+350 🪙)',
      rewardGold: 1500,
      rewardGems: 30,
      completed: false,
    },
    {
      id: 'Q_CH5',
      chapterNo: 5,
      unlockStage: 3,
      minLevel: 12,
      chapter: 'Chương 5 (Lv.12): Tiếng Còi Tàu Thống Nhất Bắc – Nam',
      title: 'Đóng Toa Hàng Xuyên Việt & Kết Nối Đặc Sản 3 Miền',
      npcSpeaker: '👧 Út Nhỏ Miền Tây',
      npcQuote: '"Ghe Sầu riêng Ri6 của em vừa cập bến tàu! Mình kết nghĩa giao thương 3 miền Bắc – Trung – Nam nghen!"',
      desc: 'Đóng 1 Toa Hàng trên Ga Tàu Thống Nhất hoặc đăng bán nông sản lên Chợ Phiên 3 Miền để mở Trang Gia Phả #5.',
      choiceEmpLabel: '🤝 Kết nghĩa đồng hương 3 miền (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đón đầu Thương Lái giá sốt x2.5 (+350 🪙)',
      rewardGold: 2000,
      rewardGems: 35,
      completed: false,
    },
    {
      id: 'Q_CH6',
      chapterNo: 6,
      unlockStage: 2,
      minLevel: 14,
      chapter: 'Chương 6 (Lv.14): Lán Thợ Đồng Quê & Giọt Mồ Hôi Chú Tư',
      title: 'Xây Lán Thợ 6 Gia Nhân & Dọn Mâm Cơm Quê Ấm Áp',
      npcSpeaker: '👨‍🌾 Chú Tư Cày',
      npcQuote: '"Cậu/Cô chủ không chê lão nông này già cả, còn nấu canh cải cá rô đãi cơm trưa... Tôi xin thề chăm từng gốc lúa như ruộng nhà!"',
      desc: 'Thuê nhân công Lán Thợ, dọn cơm lên Bàn Ăn Chung và thu hoạch Giỏ Kho Thợ (120 ô) mở Trang Gia Phả #6.',
      choiceEmpLabel: '🤝 Đãi thêm trà bánh ngày mùa (+30 Phong Thủy)',
      choicePragLabel: '🪙 Phân ca tự động hóa 24/7 (+350 🪙)',
      rewardGold: 2500,
      rewardGems: 40,
      completed: false,
    },
    {
      id: 'Q_CH7',
      chapterNo: 7,
      unlockStage: 2,
      minLevel: 16,
      chapter: 'Chương 7 (Lv.16): Bí Truyền Khung Cửi Lụa & Áo Mới',
      title: 'Nuôi Tằm Dệt Lụa Tân Châu & Dự Thi Duyên Dáng',
      npcSpeaker: '👗 Cô Ba Tiệm May',
      npcQuote: '"Tơ tằm năm nay óng ả như nắng thu! Điền chủ muốn may áo bảo hộ cho Lán Thợ trước hay may Áo Dài Ngũ Thân dự hội?"',
      desc: 'Cấp phát áo quần bảo hộ 72h cho nhân công và khâu ghép trang phục 12 Slots để mở Trang Gia Phả #7.',
      choiceEmpLabel: '🤝 Ưu tiên áo ấm cho 6 Gia nhân (+30 Phong Thủy)',
      choicePragLabel: '🪙 May Lễ phục dự thi Duyên Dáng (+350 🪙)',
      rewardGold: 3200,
      rewardGems: 45,
      completed: false,
    },
    {
      id: 'Q_CH8',
      chapterNo: 8,
      unlockStage: 4,
      minLevel: 18,
      chapter: 'Chương 8 (Lv.18): Hạt Giống Ngũ Sắc Trong Rừng Trúc Cổ',
      title: 'Thám Hiểm Rừng Trúc & Lai Tạo Lúa Tím Đột Biến',
      npcSpeaker: '🪵 Chú Tám Mộc',
      npcQuote: '"Hũ sành cổ trong Rừng Trúc chứa phấn hoa đột biến của Ông Nội cháu đấy! Chiết cành đủ Pity là chắc chắn nổ 100%!"',
      desc: 'Thám hiểm Rừng Trúc (-6⚡) và chiết cành tại Vườn Ươm Đột Biến Đình Làng để mở Trang Gia Phả #8.',
      choiceEmpLabel: '🤝 Chia sẻ giống quý cho Hợp Tác Xã (+30 Phong Thủy)',
      choicePragLabel: '🪙 Đấu giá giống đột biến ở Chợ Đêm (+350 🪙)',
      rewardGold: 4000,
      rewardGems: 50,
      completed: false,
    },
    {
      id: 'Q_CH9',
      chapterNo: 9,
      unlockStage: 4,
      minLevel: 22,
      chapter: 'Chương 9 (Lv.22): Đại Tiệc Tiến Vua Cảm Hóa Bá Kiến',
      title: 'Nấu Cá Kho Vũ Đại 3 Miền & Xóa Khế Ước 50,000 Xu',
      npcSpeaker: '🎩 Thương Nhân Bá Kiến',
      npcQuote: '"Miếng cá trắm kho tiêu thấm nước dừa này... 40 năm rồi ta mới được ăn lại vị mẹ nấu. Ta xin đốt tờ khế ước và góp tiền xây Đình Làng!"',
      desc: 'Nấu món Đại Tiệc Giao Thoa 3 Miền và công đức trùng tu Đình Làng để mở Trang Gia Phả #9.',
      choiceEmpLabel: '🤝 Mời Bá Kiến khắc tên Bia Công Đức (+30 Phong Thủy)',
      choicePragLabel: '🪙 Ký hiệp ước bao tiêu Chợ Đêm 0% thuế (+350 🪙)',
      rewardGold: 6000,
      rewardGems: 60,
      completed: false,
    },
    {
      id: 'Q_CH10',
      chapterNo: 10,
      unlockStage: 5,
      minLevel: 25,
      chapter: 'Chương 10 (Lv.25+): Trầu Cau Nên Duyên & Gia Bảo Truyền Đời',
      title: 'Lễ Cưới 10 Tim ❤️, Homestay Đầm Sen & Bằng Khen Điền Chủ',
      npcSpeaker: '💍 Người Bạn Đời Tri Kỷ',
      npcQuote: '"Từ hai bàn tay trắng ngày mới về quê, giờ cánh đồng lúa chín vàng rực rỡ... Mình viết tiếp cuốn Gia Phả Ba Miền cho đời con cháu nhé!"',
      desc: 'Đạt 10/10 Tim Kết hôn, đón đoàn khách Du lịch Homestay Đầm Sen và xuất ảnh Bằng Khen Điền Chủ Mẫu Mực (.PNG).',
      choiceEmpLabel: '🤝 Khắc chữ Gia Phả Tình Quê (+30 Phong Thủy)',
      choicePragLabel: '🪙 Mở rộng Đại Điền Trang Bốn Biển (+350 🪙)',
      rewardGold: 10000,
      rewardGems: 100,
      completed: false,
    },
];
