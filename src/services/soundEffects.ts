/**
 * 🎵 COZY ACOUSTIC WEBAUDIO SYNTHESIZER & ADAPTIVE PENTATONIC BGM ENGINE v2.0
 * Dự án: VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)
 * Thực hiện bởi: @game-audio-engineer, @technical-artist & @frontend-developer
 *
 * Triết lý âm thanh (Tham khảo Stardew Valley, Animal Crossing: New Horizons, Harvest Moon & Dorfromantik):
 * - 100% Trong trẻo, ấm áp, nhẹ nhàng, thư giãn (Cozy, Warm, Crystal-Clear Acoustic Timbre).
 * - Không dùng sóng vuông/răng cưa thô gây chói tai: Mọi nốt nhạc đều đi qua Bộ lọc Ấm (Warm Low-pass Filter 2800Hz),
 *   Đường bao ADSR mềm mại (Soft Attack & Natural Decay) và Buồng Vang Sương Sớm (Stereo Acoustic Echo/Reverb).
 * - Tích hợp 4 Bản Nhạc Nền Ngũ Cung Thích Ứng (Adaptive BGM) + Lớp Âm Thanh Tự Nhiên (Chim hót ban mai / Chuông gió đêm)
 *   và 16 Hiệu Ứng Âm Thanh Tương Tác (SFX) độ trễ 0ms trên Web/Mobile PWA/iOS/Android.
 */

export type BgmTrackId =
  | 'MORNING_BAMBOO' // 🎋 Bình Minh Sáo Trúc & Đàn Tranh (Stardew Spring Vibe)
  | 'BREEZY_NOON'    // 🍃 Trưa Hè Đàn Bầu & Kalimba Miệt Vườn (Animal Crossing Vibe)
  | 'FIREFLY_NIGHT'  // 🌙 Đêm Trăng Đom Đóm & Chuông Gió Tre (Dorfromantik / Harvest Moon Night Vibe)
  | 'FESTIVAL_DRUM'; // 🏮 Hội Làng Đình Đám & Sới Vật PK (Giai đoạn 6 Social Plaza & Arena Vibe)

export interface BgmTrackMeta {
  id: BgmTrackId;
  name: string;
  shortLabel: string;
  description: string;
  tempoMs: number;
}

export const BGM_TRACK_CATALOG: BgmTrackMeta[] = [
  {
    id: 'MORNING_BAMBOO',
    name: '🎋 Bình Minh Sáo Trúc & Đàn Tranh',
    shortLabel: '🎋 Bình Minh',
    description: 'Thang âm Ngũ cung Hò-Xự-Xang-Xê-Cống trong trẻo kèm tiếng chim sẻ gọi bầy sớm mai.',
    tempoMs: 620,
  },
  {
    id: 'BREEZY_NOON',
    name: '🍃 Trưa Hè Kalimba & Gió Đồng Nội',
    shortLabel: '🍃 Trưa Hè',
    description: 'Tiếng đàn gảy mộc mạc, êm dịu như làn gió mát thổi qua rặng dừa và cánh đồng lúa chín.',
    tempoMs: 560,
  },
  {
    id: 'FIREFLY_NIGHT',
    name: '🌙 Đêm Trăng Đom Đóm & Chuông Gió',
    shortLabel: '🌙 Đêm Trăng',
    description: 'Âm sắc hộp nhạc Celesta và chuông gió tre tĩnh lặng, sâu lắng dưới bầu trời đêm đom đóm.',
    tempoMs: 760,
  },
  {
    id: 'FESTIVAL_DRUM',
    name: '🏮 Trống Hội Chợ Đình & Sới Vật Dân Gian',
    shortLabel: '🏮 Hội Làng',
    description: 'Nhịp trống hội ấm tròn kết hợp phách tre và sáo trúc rộn ràng tại Sảnh Chung & Võ Đài PK.',
    tempoMs: 420,
  },
];

class CozySoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private warmFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;

  public muted = false;
  public bgmPlaying = false;
  public currentTrack: BgmTrackId = 'MORNING_BAMBOO';
  public volume = 0.78;

  private bgmTimer: number | null = null;
  private stepIdx = 0;

  /**
   * Khởi tạo AudioContext kèm Chuỗi Xử Lý Âm Thanh Ấm (Warm Filter + Soft Acoustic Delay/Reverb)
   */
  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      // Master Gain & Warmth Low-pass Filter (Loại bỏ hoàn toàn tần số chói gắt > 3000Hz)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.warmFilter = this.ctx.createBiquadFilter();
      this.warmFilter.type = 'lowpass';
      this.warmFilter.frequency.setValueAtTime(2950, this.ctx.currentTime);
      this.warmFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      // Tạo hiệu ứng Vang Sương Sớm (Soft Acoustic Echo 190ms) giúp tiếng đàn/sáo ngân tự nhiên
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.19, this.ctx.currentTime);

      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.22, this.ctx.currentTime);

      const wetGain = this.ctx.createGain();
      wetGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.warmFilter.connect(this.masterGain);
      this.warmFilter.connect(this.delayNode);
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(wetGain);
      wetGain.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getOutputNode(ctx: AudioContext): AudioNode {
    return this.warmFilter ?? ctx.destination;
  }

  /**
   * Nhạc cụ 1: Tiếng Gảy Đàn Tranh / Kalimba Gỗ Mộc (Plucked Acoustic String/Tine)
   * Kết hợp sóng Sine cơ bản + Họa âm bậc 2 Triangle nhẹ, tạo âm sắc trong trẻo như giọt sương.
   */
  private playPluckedNote(
    freq: number,
    startTimeOffset = 0,
    duration = 0.85,
    peakGain = 0.055
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const start = ctx.currentTime + startTimeOffset;

    // Âm cơ bản (Fundamental Sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, start);

    gain1.gain.setValueAtTime(0.0001, start);
    gain1.gain.linearRampToValueAtTime(peakGain, start + 0.014);
    gain1.gain.exponentialRampToValueAtTime(0.0008, start + duration);

    osc1.connect(gain1);
    gain1.connect(out);
    osc1.start(start);
    osc1.stop(start + duration + 0.02);

    // Họa âm bậc 2 (Octave Overtone tạo độ óng ánh của dây đàn tranh/kalimba)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, start);

    gain2.gain.setValueAtTime(0.0001, start);
    gain2.gain.linearRampToValueAtTime(peakGain * 0.22, start + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0005, start + duration * 0.45);

    osc2.connect(gain2);
    gain2.connect(out);
    osc2.start(start);
    osc2.stop(start + duration * 0.48);
  }

  /**
   * Nhạc cụ 2: Tiếng Sáo Trúc Ngân Rung Nhẹ (Breathy Bamboo Flute with Soft Vibrato)
   */
  private playFluteNote(
    freq: number,
    startTimeOffset = 0,
    duration = 1.15,
    peakGain = 0.042
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const start = ctx.currentTime + startTimeOffset;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // Rung hơi sáo trúc tự nhiên (5Hz LFO)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.2, start);
    lfoGain.gain.setValueAtTime(3.2, start);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Đường bao hơi thở mềm (Fade-in 95ms -> Sustain -> Gentle Release)
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.095);
    gain.gain.setValueAtTime(peakGain * 0.88, start + duration * 0.65);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + duration);

    osc.connect(gain);
    gain.connect(out);

    osc.start(start);
    lfo.start(start);
    osc.stop(start + duration + 0.03);
    lfo.stop(start + duration + 0.03);
  }

  /**
   * Nhạc cụ 3: Chuông Gió Tre & Hộp Nhạc Celesta (Crystal Wind Chime)
   */
  private playCelestaChime(
    freq: number,
    startTimeOffset = 0,
    duration = 1.25,
    peakGain = 0.045
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const start = ctx.currentTime + startTimeOffset;

    [1, 2, 3].forEach((harmonic, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * harmonic, start);

      const amp = peakGain * (idx === 0 ? 1 : idx === 1 ? 0.18 : 0.06);
      const dec = duration * (idx === 0 ? 1 : 0.45);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(amp, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0005, start + dec);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + dec + 0.02);
    });
  }

  /**
   * Lớp Âm Thanh Thiên Nhiên Điểm Xuyết: Tiếng Chim Sẻ Hót Sớm Mai (Soft Morning Bird Chirp)
   */
  private playAmbientBirdChirp(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const now = ctx.currentTime;

    [0, 0.11].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const base = idx === 0 ? 1760 : 1975.5;
      osc.frequency.setValueAtTime(base, now + offset);
      osc.frequency.exponentialRampToValueAtTime(base * 1.28, now + offset + 0.055);
      osc.frequency.exponentialRampToValueAtTime(base * 1.08, now + offset + 0.09);

      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.linearRampToValueAtTime(0.018, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + offset + 0.095);

      osc.connect(gain);
      gain.connect(out);
      osc.start(now + offset);
      osc.stop(now + offset + 0.1);
    });
  }

  /**
   * Bật / Tắt Nhạc Nền Ngũ Cung Đồng Quê (Giữ nguyên 100% tương thích ngược)
   */
  toggleFolkBgm(preferredTrack?: BgmTrackId): boolean {
    if (preferredTrack && preferredTrack !== this.currentTrack) {
      this.currentTrack = preferredTrack;
      if (this.bgmPlaying) {
        this.restartBgmLoop();
        return true;
      }
    }

    if (this.bgmPlaying) {
      this.stopFolkBgm();
      return false;
    }

    this.bgmPlaying = true;
    this.stepIdx = 0;
    this.restartBgmLoop();
    return true;
  }

  /**
   * Đổi sang Bản Nhạc Nền Cụ Thể (Hoặc xoay vòng qua 4 Giai Điệu Đồng Quê)
   */
  setBgmTrack(trackId: BgmTrackId): BgmTrackMeta {
    this.currentTrack = trackId;
    if (!this.bgmPlaying) {
      this.bgmPlaying = true;
    }
    this.stepIdx = 0;
    this.restartBgmLoop();
    return this.getCurrentTrackMeta();
  }

  cycleBgmTrack(): BgmTrackMeta {
    const idx = BGM_TRACK_CATALOG.findIndex((t) => t.id === this.currentTrack);
    const next = BGM_TRACK_CATALOG[(idx + 1) % BGM_TRACK_CATALOG.length];
    return this.setBgmTrack(next.id);
  }

  getCurrentTrackMeta(): BgmTrackMeta {
    return (
      BGM_TRACK_CATALOG.find((t) => t.id === this.currentTrack) ?? BGM_TRACK_CATALOG[0]
    );
  }

  /**
   * Tự động điều chỉnh Giai điệu theo Thời tiết khi Nhạc đang bật
   */
  syncWithWeather(weather: 'SUNNY' | 'RAINY' | 'FIREFLY_NIGHT'): void {
    if (weather === 'RAINY') {
      this.playRaindropChime();
      if (this.bgmPlaying && this.currentTrack !== 'FESTIVAL_DRUM') {
        this.setBgmTrack('BREEZY_NOON');
      }
    } else if (weather === 'FIREFLY_NIGHT') {
      this.playGoldenSparkle();
      if (this.bgmPlaying && this.currentTrack !== 'FESTIVAL_DRUM') {
        this.setBgmTrack('FIREFLY_NIGHT');
      }
    } else {
      this.playAmbientBirdChirp();
      if (this.bgmPlaying && this.currentTrack !== 'FESTIVAL_DRUM') {
        this.setBgmTrack('MORNING_BAMBOO');
      }
    }
  }

  /**
   * Bật nhanh Nhạc Trống Hội Đình Làng cho Sảnh Chung & Võ Đài PK (Giai đoạn 6)
   */
  playArenaDrumBgm(): BgmTrackMeta {
    return this.setBgmTrack('FESTIVAL_DRUM');
  }

  private restartBgmLoop(): void {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    const meta = this.getCurrentTrackMeta();

    // Các chuỗi giai điệu Ngũ cung Việt Nam (Hò - Xự - Xang - Xê - Cống) phối bè trầm ấm
    // C4=261.63, D4=293.66, E4=329.63, G4=392.00, A4=440.00
    // C5=523.25, D5=587.33, E5=659.25, F5=698.46, G5=783.99, A5=880.00, C6=1046.50
    const morningMelody = [
      523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 1046.5, 880.0, 783.99, 587.33, 523.25,
    ];
    const morningBass = [261.63, 293.66, 329.63, 392.0];

    const noonMelody = [
      659.25, 587.33, 523.25, 392.0, 440.0, 523.25, 587.33, 659.25,
      783.99, 659.25, 587.33, 523.25, 440.0, 392.0, 440.0, 523.25,
    ];
    const noonBass = [261.63, 220.0, 196.0, 261.63];

    const nightMelody = [
      1046.5, 880.0, 783.99, 659.25, 587.33, 659.25, 783.99, 523.25,
      880.0, 783.99, 659.25, 523.25, 440.0, 523.25, 587.33, 523.25,
    ];

    const festivalMelody = [
      523.25, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25,
    ];

    const tickStep = () => {
      if (this.muted || !this.bgmPlaying) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const step = this.stepIdx++;

      if (this.currentTrack === 'MORNING_BAMBOO') {
        const note = morningMelody[step % morningMelody.length];
        // Đàn tranh gảy nốt chính + Sáo trúc ngân ở phách mạnh
        this.playPluckedNote(note, 0, 0.95, 0.042);
        if (step % 4 === 0) {
          const bass = morningBass[(step / 4) % morningBass.length];
          this.playPluckedNote(bass, 0, 1.45, 0.032);
          this.playFluteNote(note, 0.04, 1.15, 0.028);
        }
        if (step % 12 === 6) {
          this.playAmbientBirdChirp();
        }
      } else if (this.currentTrack === 'BREEZY_NOON') {
        const note = noonMelody[step % noonMelody.length];
        this.playPluckedNote(note, 0, 0.85, 0.038);
        if (step % 2 === 1) {
          this.playPluckedNote(note * 1.5, 0.24, 0.65, 0.02);
        }
        if (step % 4 === 0) {
          const bass = noonBass[(step / 4) % noonBass.length];
          this.playPluckedNote(bass, 0, 1.35, 0.03);
        }
      } else if (this.currentTrack === 'FIREFLY_NIGHT') {
        const note = nightMelody[step % nightMelody.length];
        this.playCelestaChime(note, 0, 1.4, 0.034);
        if (step % 4 === 0) {
          this.playPluckedNote(note * 0.5, 0.05, 1.6, 0.024);
        }
      } else if (this.currentTrack === 'FESTIVAL_DRUM') {
        const note = festivalMelody[step % festivalMelody.length];
        // Trống cái ấm ở phách chẵn + Phách tre ở phách lẻ + Sáo hội
        if (step % 2 === 0) {
          this.playWarmDrumBeat(115, 58, 0.055);
          this.playPluckedNote(note, 0, 0.55, 0.038);
        } else {
          this.playBambooClick(720, 0.022);
          this.playPluckedNote(note, 0, 0.45, 0.03);
        }
        if (step % 4 === 0) {
          this.playFluteNote(note, 0.02, 0.72, 0.03);
        }
      }
    };

    tickStep();
    this.bgmTimer = window.setInterval(tickStep, meta.tempoMs);
  }

  private playWarmDrumBeat(startFreq: number, endFreq: number, peakGain: number): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.18);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  private playBambooClick(freq: number, peakGain: number): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.65, now + 0.035);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.04);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  stopFolkBgm(): void {
    this.bgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // ============================================================================
  // 16 HIỆU ỨNG ÂM THANH TƯƠNG TÁC TRONG TRẺO (CRYSTAL-CLEAR COZY SFX)
  // ============================================================================

  /**
   * 1. Tưới nước Giếng Làng / Vét Bùn Ao: Tiếng giọt nước suối trong trẻo (3 giọt nối tiếp)
   */
  playWaterSplash(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const now = ctx.currentTime;

    [
      { start: 440, end: 880, delay: 0, dur: 0.11, gain: 0.075 },
      { start: 587.33, end: 1174.66, delay: 0.055, dur: 0.1, gain: 0.06 },
      { start: 659.25, end: 1318.5, delay: 0.105, dur: 0.12, gain: 0.05 },
    ].forEach((drop) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(drop.start, now + drop.delay);
      osc.frequency.exponentialRampToValueAtTime(drop.end, now + drop.delay + drop.dur);

      gain.gain.setValueAtTime(0.0001, now + drop.delay);
      gain.gain.linearRampToValueAtTime(drop.gain, now + drop.delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + drop.delay + drop.dur);

      osc.connect(gain);
      gain.connect(out);
      osc.start(now + drop.delay);
      osc.stop(now + drop.delay + drop.dur + 0.01);
    });
  }

  /**
   * 2. Thu hoạch nông sản & Nhận Xu Vàng: Hợp âm Kalimba C5 -> E5 -> G5 -> C6 êm dịu, tròn tiếng
   */
  playHarvestCoin(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playPluckedNote(freq, idx * 0.052, 0.42, 0.068 - idx * 0.008);
    });
  }

  /**
   * 3. Nổ Nông Sản Hoàng Kim ⭐ / Cây Đột Biến / Nhận Ngọc 💎: Chuông gió Celesta 5 nốt lấp lánh
   */
  playGoldenSparkle(): void {
    const sparkleNotes = [587.33, 783.99, 987.77, 1174.66, 1567.98];
    sparkleNotes.forEach((freq, idx) => {
      this.playCelestaChime(freq, idx * 0.06, 0.75, 0.048);
    });
  }

  /**
   * 4. Gieo hạt xuống đất mềm / Thả cá giống: Tiếng chạm đất mộc mạc kèm mầm non nảy lên
   */
  playSeedPlant(): void {
    this.playWarmDrumBeat(195, 110, 0.055);
    this.playPluckedNote(392.0, 0.04, 0.28, 0.042);
    this.playPluckedNote(523.25, 0.09, 0.32, 0.045);
  }

  /**
   * 5. Bấm nút UI Gỗ/Tre: Tiếng gõ tre mộc nhẹ nhàng kiểu Animal Crossing
   */
  playUiClick(): void {
    this.playBambooClick(660, 0.032);
  }

  /**
   * 6. Xé Lịch Bloc / Lật trang Sổ Tay Gia Phả / Báo Chợ: Tiếng lật giấy dó mềm kèm chuông nhỏ
   */
  playPageFlip(): void {
    this.playBambooClick(520, 0.028);
    this.playPluckedNote(659.25, 0.035, 0.35, 0.04);
    this.playPluckedNote(880.0, 0.085, 0.45, 0.045);
  }

  /**
   * 7. Đỏ lửa Bếp Củi Quê Mẹ & Khám phá Món Ăn Mới: Tiếng nước sôi lục bục ấm áp + Hợp âm Mỹ Vị
   */
  playCookingSizzle(): void {
    [293.66, 349.23, 440.0].forEach((f, i) => {
      this.playWarmDrumBeat(f, f * 1.25, 0.038);
      this.playPluckedNote(f * 2, 0.12 + i * 0.065, 0.55, 0.052);
    });
  }

  /**
   * 8. Đãi Cơm Lán Thợ / Chăm sóc Vật Nuôi vui vẻ: Giai điệu 3 nốt ấm áp tình quê
   */
  playAnimalHappy(): void {
    [440.0, 554.37, 659.25].forEach((freq, idx) => {
      this.playPluckedNote(freq, idx * 0.065, 0.45, 0.055);
    });
  }

  /**
   * 9. Chó Phú Quốc sủa canh vườn: 2 nhịp "Gâu! Gâu!" ấm áp (Dùng sóng Triangle qua bộ lọc ấm thay vì Sawtooth chói)
   */
  playDogBark(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const out = this.getOutputNode(ctx);
    const now = ctx.currentTime;

    [0, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now + offset);
      osc.frequency.exponentialRampToValueAtTime(340, now + offset + 0.035);
      osc.frequency.exponentialRampToValueAtTime(135, now + offset + 0.13);

      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.linearRampToValueAtTime(0.095, now + offset + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);

      osc.connect(gain);
      gain.connect(out);
      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });
  }

  /**
   * 10. Còi Tàu Thống Nhất Bắc – Nam & Thương Đội Liên Gia: Hợp âm còi hơi ấm áp ngân xa
   */
  playTrainWhistle(): void {
    [349.23, 440.0, 523.25].forEach((freq) => {
      this.playFluteNote(freq, 0, 0.65, 0.035);
      this.playFluteNote(freq, 0.42, 0.78, 0.038);
    });
  }

  /**
   * 11. Đập Niêu Đất Đình Làng: Tiếng niêu gốm vỡ giòn tan kèm tiếng chuông mở thưởng
   */
  playClayPotSmash(): void {
    this.playWarmDrumBeat(340, 95, 0.085);
    this.playBambooClick(480, 0.06);
    this.playCelestaChime(783.99, 0.06, 0.55, 0.052);
    this.playCelestaChime(1046.5, 0.12, 0.68, 0.055);
  }

  /**
   * 12. Chiêng Trống Mừng Lễ Cưới / Bằng Khen / Trùng Tu Đình Làng: Chiêng đồng ấm ngân dài + Ngũ cung đại cát
   */
  playCelebrationGong(): void {
    // Tiếng chiêng đồng trầm ấm (Fundamental 196Hz + Harmonic 392Hz)
    this.playPluckedNote(196.0, 0, 1.65, 0.075);
    this.playPluckedNote(293.66, 0.02, 1.35, 0.048);

    // Chuỗi nốt Ngũ cung thăng hoa
    [523.25, 659.25, 783.99, 880.0, 1046.5].forEach((freq, idx) => {
      this.playCelestaChime(freq, 0.05 + idx * 0.065, 0.95, 0.052);
    });
  }

  /**
   * 13. Mưa Rào Quê Hương: Tiếng giọt mưa rơi êm trên tàu lá chuối
   */
  playRaindropChime(): void {
    [659.25, 587.33, 523.25, 783.99].forEach((freq, idx) => {
      this.playCelestaChime(freq, idx * 0.07, 0.6, 0.035);
    });
  }

  /**
   * 14. Võ Đài PK 1v1 / 3v3 (Giai đoạn 6): Tiếng gậy bông chạm êm / Húc vai Sới Vật
   */
  playJoustHit(): void {
    this.playWarmDrumBeat(220, 75, 0.075);
    this.playPluckedNote(440.0, 0.02, 0.25, 0.045);
  }

  /**
   * 15. Máy Thùng Hyper-Casual (Giai đoạn 6): Tiếng vuốt chẻ tre / Nhảy lá sen thanh thoát
   */
  playArcadeSlice(): void {
    this.playBambooClick(820, 0.045);
    this.playPluckedNote(659.25, 0.015, 0.22, 0.042);
    this.playPluckedNote(880.0, 0.045, 0.28, 0.045);
  }

  /**
   * 16. Mừng Lên Cấp / Hoàn Thành Chương Gia Phả: Khúc Sáo Trúc & Đàn Tranh khải hoàn
   */
  playLevelUpFanfare(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      this.playPluckedNote(freq, idx * 0.08, 0.85, 0.06);
      if (idx === 3) {
        this.playFluteNote(freq, idx * 0.08, 1.1, 0.048);
      }
    });
  }
}

export const soundFX = new CozySoundManager();
