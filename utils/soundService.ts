class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('workoutron_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.enabled = !settings.isMuted;
      } catch (e) {}
    }
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private haptic(pattern: number | number[]) {
    if (this.enabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, ramp: 'linear' | 'expo' = 'expo') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    if (ramp === 'expo') {
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    } else {
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.05) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playTap() {
    this.haptic(10);
    this.playTone(1200, 'sine', 0.05, 0.05);
  }

  playNav() {
    this.haptic(15);
    this.playTone(800, 'sine', 0.1, 0.04);
  }

  playTick() {
    this.haptic(5);
    this.playTone(2000, 'sine', 0.01, 0.02);
  }

  playStart() {
    this.haptic([20, 50, 20]);
    this.playTone(880, 'sine', 0.2);
  }

  playSetComplete() {
    this.haptic([30, 40, 30]);
    this.playTone(660, 'sine', 0.15);
    setTimeout(() => this.playTone(880, 'sine', 0.3), 150);
  }

  playRestOver() {
    this.haptic([50, 100, 50]);
    this.playTone(1000, 'sine', 0.1);
    setTimeout(() => this.playTone(1200, 'sine', 0.2), 150);
  }

  playWorkoutComplete() {
    this.haptic([100, 50, 100, 50, 200]);
    const tones = [523.25, 659.25, 783.99, 1046.50];
    tones.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.6, 0.08), i * 150);
    });
  }

  playAscending() {
    this.haptic(10);
    const tones = [440, 554.37, 659.25];
    tones.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.06), i * 80);
    });
  }

  playDescending() {
    this.haptic(10);
    const tones = [659.25, 554.37, 440];
    tones.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.06), i * 80);
    });
  }

  playShutter() {
    this.haptic(50);
    this.playTone(2000, 'square', 0.02, 0.03);
    this.playNoise(0.1, 0.08);
  }

  playCameraTick() {
    this.haptic(5);
    this.playTone(3000, 'sine', 0.02, 0.02);
  }

  playSuccess() {
    this.haptic(20);
    this.playTone(440, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(880, 'sine', 0.3, 0.05), 100);
  }

  playTriumphant() {
    this.haptic([30, 60, 30, 90]);
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.06), i * 60);
    });
  }

  playFavorite() {
    this.haptic([20, 40, 20, 60, 20, 80]);
    const scale = [783.99, 1046.50, 1318.51, 1567.98];
    scale.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.04), i * 50);
    });
  }

  playPlayful() {
    this.haptic(10);
    this.playTone(1800, 'sine', 0.05, 0.03);
    setTimeout(() => this.playTone(2400, 'sine', 0.1, 0.03), 50);
  }

  playSad() {
    this.haptic(40);
    this.playTone(392.00, 'sine', 0.15, 0.06);
    setTimeout(() => this.playTone(311.13, 'sine', 0.3, 0.06), 150);
  }

  playDelete() {
    this.playSad();
  }

  playCancel() {
    this.haptic(10);
    this.playTone(300, 'sine', 0.1, 0.04);
  }
}

export const soundService = new SoundService();