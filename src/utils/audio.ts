/**
 * Web Audio API based ambient romantic music synthesizer.
 * Creates an elegant, calming acoustic harp/music box ambient chord progression
 * without requiring external MP3 files that could fail to load or be blocked by CORS.
 */

class RomanticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private noteIndex: number = 0;

  // Romantic Pentatonic & Lydian chords in Hz (Canon in D / Wedding ambient tones)
  private readonly chords: number[][] = [
    // D Major / F# / A
    [293.66, 369.99, 440.00, 587.33, 739.99],
    // A Major / C# / E
    [220.00, 277.18, 329.63, 440.00, 659.25],
    // B Minor / D / F#
    [246.94, 293.66, 369.99, 493.88, 739.99],
    // F# Minor / A / C#
    [185.00, 220.00, 277.18, 369.99, 554.37],
    // G Major / B / D
    [196.00, 246.94, 293.66, 392.00, 587.33],
    // D Major inversion
    [220.00, 293.66, 369.99, 440.00, 587.33],
    // G Major / E Minor
    [196.00, 246.94, 329.63, 392.00, 659.25],
    // A Suspended to Major
    [220.00, 293.66, 329.63, 440.00, 554.37],
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  public play() {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.scheduleNotes();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playTone(freq: number, startTime: number, duration: number = 3.5) {
    if (!this.ctx || !this.gainNode) return;

    try {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Warm triangle wave with gentle sine overtone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Delicate envelope: quick smooth attack, prolonged ringing decay like a celesta/harp
      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  private scheduleNotes() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.noteIndex % this.chords.length];
    const now = this.ctx.currentTime;

    // Arpeggiate notes in chord gently
    chord.forEach((freq, i) => {
      this.playTone(freq, now + i * 0.32, 4.0);
    });

    this.noteIndex++;
    // Next chord in ~2.8 seconds
    this.timer = window.setTimeout(() => {
      this.scheduleNotes();
    }, 2800);
  }
}

export const romanticAudio = new RomanticAudioSynthesizer();
