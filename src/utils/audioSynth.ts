/**
 * High-fidelity Web Audio API engine sound and rev synthesizer
 * Generates custom acoustic harmonic profiles for V8 Twin-Turbo and V12 NA engines.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEngineRev(carType: 'temerario' | 'urus' | 'revuelto'): () => void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.4, now + 1.2);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    masterGain.connect(ctx.destination);

    // Distortion wave shaper for aggressive exhaust grit
    const distortion = ctx.createWaveShaper();
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    const k = carType === 'revuelto' ? 45 : (carType === 'temerario' ? 40 : 30);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';
    distortion.connect(masterGain);

    // Lowpass filter representing the acoustic muffler chamber
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(carType === 'revuelto' ? 3800 : 2600, now);
    filter.frequency.linearRampToValueAtTime(carType === 'revuelto' ? 6800 : 4200, now + 1.2);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 2.7);
    filter.Q.setValueAtTime(4.5, now);
    filter.connect(distortion);

    // Fundamental frequencies based on cylinder count and target RPM
    // Temerario: V8 @ 10,000 RPM = fundamental pulses ~666 Hz
    // Urus: V8 @ 6,800 RPM = fundamental pulses ~450 Hz
    // Revuelto: V12 @ 9,500 RPM = fundamental pulses ~950 Hz
    const fundamental = carType === 'revuelto' ? 95 : (carType === 'temerario' ? 80 : 65);
    const peakFreq = carType === 'revuelto' ? 480 : (carType === 'temerario' ? 420 : 280);

    const oscillators: OscillatorNode[] = [];

    // Base fundamental oscillator (sawtooth for rich harmonic spectrum)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(fundamental, now);
    osc1.frequency.exponentialRampToValueAtTime(fundamental * 1.3, now + 0.3);
    osc1.frequency.exponentialRampToValueAtTime(peakFreq, now + 1.1);
    osc1.frequency.exponentialRampToValueAtTime(peakFreq * 1.05, now + 1.3);
    osc1.frequency.exponentialRampToValueAtTime(fundamental * 0.9, now + 2.5);
    osc1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 2.9);
    oscillators.push(osc1);

    // Harmonic layer 1 (V12 high pitch or V8 sub-rumble)
    const osc2 = ctx.createOscillator();
    osc2.type = carType === 'revuelto' ? 'triangle' : 'square';
    osc2.frequency.setValueAtTime(fundamental * 1.5, now);
    osc2.frequency.exponentialRampToValueAtTime(peakFreq * 1.5, now + 1.1);
    osc2.frequency.exponentialRampToValueAtTime(fundamental * 1.5, now + 2.5);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.5, now);
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now);
    osc2.stop(now + 2.9);
    oscillators.push(osc2);

    // Harmonic layer 2 (Exhaust scream for Revuelto & Temerario)
    if (carType === 'revuelto' || carType === 'temerario') {
      const osc3 = ctx.createOscillator();
      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(fundamental * 3, now);
      osc3.frequency.exponentialRampToValueAtTime(peakFreq * 3, now + 1.15);
      osc3.frequency.exponentialRampToValueAtTime(fundamental * 2.8, now + 2.6);

      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0.3, now);
      osc3.connect(gain3);
      gain3.connect(filter);
      osc3.start(now);
      osc3.stop(now + 2.9);
      oscillators.push(osc3);
    }

    // Exhaust pop / crackle simulation on throttle lift-off (at t = 1.6s)
    const bufferSize = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const popTimes = [1.6, 1.85, 2.05, 2.2];
    popTimes.forEach((popTime) => {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const popFilter = ctx.createBiquadFilter();
      popFilter.type = 'bandpass';
      popFilter.frequency.value = 1200 + Math.random() * 800;
      popFilter.Q.value = 2;

      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.4, now + popTime);
      popGain.gain.exponentialRampToValueAtTime(0.01, now + popTime + 0.06);

      noise.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(masterGain);

      noise.start(now + popTime);
      noise.stop(now + popTime + 0.08);
    });

    return () => {
      try {
        oscillators.forEach(o => o.stop());
        masterGain.disconnect();
      } catch {
        // cleanup ignore
      }
    };
  } catch (err) {
    console.warn('Web Audio synthesis not supported or blocked:', err);
    return () => {};
  }
}
