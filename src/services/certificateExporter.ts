import { RegionType } from '../data/types';

export interface CertificatePayload {
  playerName: string;
  region: RegionType;
  level: number;
  styleScore: number;
  fengShuiScore: number;
  neighborPoints: number;
  dinhLangStage: number;
  isMarried: boolean;
}

/**
 * Vẽ trực tiếp tấm "BẰNG KHEN GIA ĐÌNH VĂN HÓA & ĐIỀN CHỦ MẪU MỰC BA MIỀN"
 * ra thẻ HTML5 Canvas chuẩn 960x540 (tỷ lệ 16:9 đẹp mắt để chia sẻ Zalo / Facebook)
 * và tự động tải file PNG về thiết bị.
 */
export function exportAchievementCertificate(payload: CertificatePayload): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Nền giấy dó cổ truyền & Viền gỗ lim mạ vàng
  const grad = ctx.createLinearGradient(0, 0, 960, 540);
  grad.addColorStop(0, '#fff8eb');
  grad.addColorStop(0.5, '#ffefc1');
  grad.addColorStop(1, '#fde6a8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 960, 540);

  // Khung ngoài gỗ nâu đậm
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#6e4121';
  ctx.strokeRect(14, 14, 932, 512);

  // Khung trong chỉ vàng
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#d97706';
  ctx.strokeRect(30, 30, 900, 480);

  // 2. Quốc hiệu / Tiêu đề Hợp Tác Xã Nông Trại Ba Miền
  ctx.fillStyle = '#b83224';
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ỦY BAN HỢP TÁC XÃ NÔNG NGHIỆP BA MIỀN — VAC ONLINE', 480, 78);

  ctx.fillStyle = '#6e4121';
  ctx.font = 'bold 14px "Segoe UI", sans-serif';
  ctx.fillText('★ HƯƠNG ĐỒNG GIÓ NỘI • VƯỜN – AO – CHUỒNG TUẦN HOÀN ★', 480, 104);

  // 3. Dòng chữ BẰNG KHEN lớn
  ctx.fillStyle = '#b83224';
  ctx.font = '900 42px "Segoe UI", sans-serif';
  ctx.fillText('BẰNG KHEN ĐIỀN CHỦ MẪU MỰC', 480, 162);

  // 4. Thông tin Điền chủ & Quê hương
  const regionLabel =
    payload.region === 'NORTH'
      ? 'Đồng Bằng Bắc Bộ'
      : payload.region === 'CENTRAL'
      ? 'Duyên Hải & Tây Nguyên Trung Bộ'
      : 'Miệt Vườn Sông Nước Nam Bộ';

  ctx.fillStyle = '#2a180c';
  ctx.font = 'bold 26px "Segoe UI", sans-serif';
  ctx.fillText(`Trao tặng Điền chủ: ${payload.playerName} (Cấp ${payload.level})`, 480, 218);

  ctx.fillStyle = '#4e8222';
  ctx.font = 'bold 20px "Segoe UI", sans-serif';
  ctx.fillText(`Quê hương lập nghiệp: ${regionLabel}`, 480, 252);

  // 5. Bảng 4 Cột mốc Thành tựu Vàng
  const boxes = [
    { label: '✨ ĐIỂM PHONG CÁCH', val: `${payload.styleScore.toLocaleString()} Điểm`, x: 150 },
    { label: '🏡 MỸ QUAN PHONG THỦY', val: `${payload.fengShuiScore.toLocaleString()} Điểm`, x: 370 },
    { label: '🤝 TÌNH LÀNG NGHĨA XÓM', val: `${payload.neighborPoints.toLocaleString()} Điểm`, x: 590 },
    { label: '⛩️ CÔNG ĐỨC ĐÌNH LÀNG', val: `Cấp ${payload.dinhLangStage}/3`, x: 810 },
  ];

  boxes.forEach((b) => {
    ctx.fillStyle = '#fffdf7';
    ctx.strokeStyle = '#c88a4b';
    ctx.lineWidth = 3;
    ctx.fillRect(b.x - 95, 285, 190, 92);
    ctx.strokeRect(b.x - 95, 285, 190, 92);

    ctx.fillStyle = '#664930';
    ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.fillText(b.label, b.x, 318);

    ctx.fillStyle = '#b83224';
    ctx.font = '900 22px "Segoe UI", sans-serif';
    ctx.fillText(b.val, b.x, 354);
  });

  // 6. Danh hiệu Gia Bảo & Ngày cấp
  ctx.fillStyle = '#2a180c';
  ctx.font = 'italic bold 18px "Segoe UI", sans-serif';
  ctx.fillText(
    payload.isMarried
      ? '🏅 Danh hiệu: Gia Đình Văn Hóa Kiểu Mẫu & Đại Điền Chủ Ba Miền'
      : '🏅 Danh hiệu: Thanh Niên Lập Nghiệp Tiêu Biểu Hương Đồng Gió Nội',
    480,
    420
  );

  // 7. Con dấu đỏ Hợp Tác Xã ở góc phải dưới
  ctx.save();
  ctx.translate(760, 445);
  ctx.rotate(-0.14);
  ctx.strokeStyle = 'rgba(184, 50, 36, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(184, 50, 36, 0.85)';
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillText('HỢP TÁC XÃ', 0, -10);
  ctx.fillText('ĐÃ ĐÓNG DẤU', 0, 8);
  ctx.fillText('★ VAC ONLINE ★', 0, 24);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  try {
    const link = document.createElement('a');
    link.download = `Bang_Khen_VAC_Online_${payload.playerName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  } catch {
    // Fallback in non-browser test environments
  }
  return dataUrl;
}
