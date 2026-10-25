/**
 * Cozy WebAudio Synthesizer & Pentatonic Folk BGM (0ms latency on Mobile PWA & iPad)
 * Tạo hiệu ứng âm thanh làng quê Việt Nam: Giọt nước tưới, Thu hoạch, Chó Phú Quốc sủa,
 * Còi Tàu Thống Nhất, Đập Niêu Đất, Xé Lịch Bloc, Khung Cửi Dệt Lụa & Nhạc nền Ngũ Cung Ba Miền.
 */
class CozySoundManager {
  private ctx: AudioContext | null = null;
  public muted = false;
  public bgmPlaying = false;
  private bgmTimer: number | null = null;
  private noteIdx = 0;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Bật / Tắt Nhạc Nền Ngũ Cung Đồng Quê (Âm sắc Sáo Trúc & Đàn Tranh nhẹ nhàng)
   */
  toggleFolkBgm(): boolean {
    if (this.bgmPlaying) {
      this.stopFolkBgm();
      return false;
    }
    this.bgmPlaying = true;
    // Thang âm Ngũ cung Việt Nam (Hò - Xự - Xang - Xê - Cống: C5, D5, F5, G5, A5, C6)
    const melody = [523.25, 587.33, 698.46, 783.99, 880.0, 783.99, 698.46, 587.33];
    this.bgmTimer = window.setInterval(() => {
      if (this.muted || !this.bgmPlaying) return;
      const ctx = this.getContext();
      if (!ctx) return;
      const freq = melody[this.noteIdx % melody.length];
      this.noteIdx++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.58);
    }, 680);
    return true;
  }

  stopFolkBgm(): void {
    this.bgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playWaterSplash(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.11);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  playHarvestCoin(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    [660, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.008, ctx.currentTime + idx * 0.07 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.16);
    });
  }

  playDogBark(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.19);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  }

  playTrainWhistle(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    [440, 554.37].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.008, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    });
  }

  playClayPotSmash(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(310, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  playCelebrationGong(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * 0.06 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
    });
  }
}

export const soundFX = new CozySoundManager();
