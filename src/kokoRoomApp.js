import * as THREE from 'three';
    import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

    /* ==========================================================================
       A. PROCEDURAL HARDWOOD FLOOR TEXTURE GENERATOR (REALISTIC PLANK GRAIN)
       ========================================================================== */
    function createHardwoodFloorTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Base warm golden-amber honey oak tone
      ctx.fillStyle = '#C89668';
      ctx.fillRect(0, 0, 1024, 1024);

      // Planks run longitudinally (front to back along Z)
      const plankWidth = 85;
      const numPlanks = Math.ceil(1024 / plankWidth);

      for (let i = 0; i < numPlanks; i++) {
        const x = i * plankWidth;
        const toneVar = ((i * 47) % 35) - 17;
        const r = Math.min(255, Math.max(0, 212 + toneVar));
        const g = Math.min(255, Math.max(0, 160 + toneVar * 0.88));
        const b = Math.min(255, Math.max(0, 115 + toneVar * 0.72));

        // Individual plank gradient
        const pGrad = ctx.createLinearGradient(x, 0, x + plankWidth, 0);
        pGrad.addColorStop(0, `rgb(${r - 8}, ${g - 8}, ${b - 8})`);
        pGrad.addColorStop(0.5, `rgb(${r + 6}, ${g + 6}, ${b + 6})`);
        pGrad.addColorStop(1, `rgb(${r - 12}, ${g - 12}, ${b - 12})`);
        ctx.fillStyle = pGrad;
        ctx.fillRect(x, 0, plankWidth, 1024);

        // Natural longitudinal woodgrain streaks
        ctx.strokeStyle = `rgba(${r - 45}, ${g - 42}, ${b - 36}, 0.22)`;
        ctx.lineWidth = 1.2;
        for (let j = 0; j < 9; j++) {
          ctx.beginPath();
          const offsetX = x + 6 + Math.random() * (plankWidth - 12);
          ctx.moveTo(offsetX, 0);
          ctx.bezierCurveTo(
            offsetX + (Math.random() - 0.5) * 14, 300,
            offsetX + (Math.random() - 0.5) * 14, 700,
            offsetX + (Math.random() - 0.5) * 8, 1024
          );
          ctx.stroke();
        }

        // Staggered horizontal plank end seams
        const offset = (i % 3) * 340;
        for (let y = offset; y < 1024; y += 512) {
          ctx.fillStyle = 'rgba(50, 28, 16, 0.65)';
          ctx.fillRect(x, y, plankWidth, 2.5);
          ctx.fillStyle = 'rgba(255, 240, 215, 0.35)';
          ctx.fillRect(x, y + 2.5, plankWidth, 1.2);
        }

        // Deep groove seam between vertical planks
        ctx.fillStyle = 'rgba(45, 24, 12, 0.75)';
        ctx.fillRect(x + plankWidth - 2.5, 0, 2.5, 1024);
        // Bevel highlight edge on opposing side
        ctx.fillStyle = 'rgba(255, 245, 225, 0.3)';
        ctx.fillRect(x, 0, 1.8, 1024);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    }

    /* ==========================================================================
       B. PROCEDURAL SUNSET SKYLINE (PANORAMIC CITY SKYLINE VIEW)
       ========================================================================== */
    function createCitySunsetTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Sunset gradient: Blue-violet -> Peach -> Warm Amber -> Golden Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
      skyGrad.addColorStop(0, '#3E4D74');
      skyGrad.addColorStop(0.35, '#B77682');
      skyGrad.addColorStop(0.68, '#F09B74');
      skyGrad.addColorStop(0.92, '#FFD596');
      skyGrad.addColorStop(1, '#FFF5DD');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Distant silhouette skyscrapers
      ctx.fillStyle = 'rgba(95, 70, 100, 0.45)';
      for (let x = 0; x < 1024; x += 32) {
        const h = 80 + Math.sin(x * 0.05) * 50 + ((x * 13) % 70);
        ctx.fillRect(x, 512 - h, 26, h);
      }

      // Midground skyscraper silhouettes with glowing windows
      ctx.fillStyle = 'rgba(70, 50, 80, 0.75)';
      for (let x = 12; x < 1024; x += 48) {
        const h = 110 + Math.sin(x * 0.08) * 60 + ((x * 19) % 80);
        ctx.fillRect(x, 512 - h, 38, h);

        ctx.fillStyle = 'rgba(255, 235, 160, 0.8)';
        for (let wy = 512 - h + 15; wy < 500; wy += 14) {
          if ((x + wy) % 5 === 0) {
            ctx.fillRect(x + 6, wy, 4, 6);
            ctx.fillRect(x + 16, wy, 4, 6);
          }
        }
        ctx.fillStyle = 'rgba(70, 50, 80, 0.75)';
      }

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

    function createStarryNightSkyTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Deep nocturnal starry sky gradient: Midnight Indigo -> Cosmic Navy -> Deep Twilight Horizon
      const nightGrad = ctx.createLinearGradient(0, 0, 0, 512);
      nightGrad.addColorStop(0, '#030511');
      nightGrad.addColorStop(0.32, '#09102A');
      nightGrad.addColorStop(0.65, '#131C42');
      nightGrad.addColorStop(0.88, '#1E2554');
      nightGrad.addColorStop(1, '#292D64');
      ctx.fillStyle = nightGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Soft Milky Way stardust band
      const nebulaGrad = ctx.createRadialGradient(520, 160, 20, 520, 160, 420);
      nebulaGrad.addColorStop(0, 'rgba(147, 130, 255, 0.16)');
      nebulaGrad.addColorStop(0.5, 'rgba(96, 165, 250, 0.08)');
      nebulaGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Twinkling starfield across the upper sky
      for (let i = 0; i < 220; i++) {
        const sx = (i * 173 + (i * i * 31)) % 1024;
        const sy = (i * 97 + (i * 43)) % 390;
        const radius = (i % 7 === 0) ? 2.1 : (i % 3 === 0 ? 1.4 : 0.9);
        const alpha = 0.45 + ((i * 19) % 55) / 100;

        const starColors = ['#FFFFFF', '#E0F2FE', '#FEF3C7', '#F3E8FF'];
        ctx.fillStyle = starColors[i % starColors.length];
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle 4-point starlight flare on brightest stars
        if (i % 14 === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - 6, sy);
          ctx.lineTo(sx + 6, sy);
          ctx.moveTo(sx, sy - 6);
          ctx.lineTo(sx, sy + 6);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1.0;

      // Glowing Crescent Moon & Lunar Aura
      const moonX = 760;
      const moonY = 118;
      const haloGrad = ctx.createRadialGradient(moonX, moonY, 12, moonX, moonY, 115);
      haloGrad.addColorStop(0, 'rgba(254, 249, 195, 0.42)');
      haloGrad.addColorStop(0.45, 'rgba(199, 210, 254, 0.16)');
      haloGrad.addColorStop(1, 'rgba(199, 210, 254, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 115, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF9C3';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
      ctx.fill();

      // Carve crescent shadow
      ctx.fillStyle = '#0B1330';
      ctx.beginPath();
      ctx.arc(moonX + 13, moonY - 8, 30, 0, Math.PI * 2);
      ctx.fill();

      // Distant midnight city silhouettes
      ctx.fillStyle = 'rgba(12, 16, 38, 0.85)';
      for (let x = 0; x < 1024; x += 32) {
        const h = 80 + Math.sin(x * 0.05) * 50 + ((x * 13) % 70);
        ctx.fillRect(x, 512 - h, 26, h);
      }

      // Foreground nocturnal buildings with cozy golden-amber lit windows
      for (let x = 12; x < 1024; x += 48) {
        const h = 110 + Math.sin(x * 0.08) * 60 + ((x * 19) % 80);
        ctx.fillStyle = 'rgba(7, 10, 25, 0.94)';
        ctx.fillRect(x, 512 - h, 38, h);

        for (let wy = 512 - h + 15; wy < 500; wy += 14) {
          if ((x + wy) % 5 === 0) {
            ctx.fillStyle = ((x + wy) % 2 === 0) ? 'rgba(253, 224, 71, 0.85)' : 'rgba(147, 197, 253, 0.7)';
            ctx.fillRect(x + 6, wy, 4, 6);
            ctx.fillRect(x + 16, wy, 4, 6);
          }
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

    /* ==========================================================================
       C. PROCEDURAL POSTER TEXTURES ("Dream Code Build Repeat" & Mountain Art)
       ========================================================================== */
    function createDreamPosterTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#161820';
      ctx.fillRect(0, 0, 512, 768);

      ctx.strokeStyle = '#282C3D';
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 476, 732);

      ctx.fillStyle = '#E5B558';
      ctx.beginPath();
      ctx.moveTo(256, 135);
      ctx.lineTo(216, 185);
      ctx.lineTo(234, 195);
      ctx.lineTo(256, 172);
      ctx.lineTo(278, 195);
      ctx.lineTo(296, 185);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 52px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText('Dream', 256, 265);
      ctx.fillText('Code', 256, 345);
      ctx.fillText('Build', 256, 425);
      ctx.fillText('Repeat', 256, 505);

      ctx.strokeStyle = '#E5B558';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(175, 570);
      ctx.quadraticCurveTo(256, 586, 337, 570);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

    function createMountainPosterTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 0, 768);
      grad.addColorStop(0, '#2D286A');
      grad.addColorStop(0.35, '#854FE5');
      grad.addColorStop(0.65, '#F56518');
      grad.addColorStop(0.85, '#FCD34D');
      grad.addColorStop(1, '#FEF08A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 768);

      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.arc(256, 410, 68, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1A1844';
      ctx.beginPath();
      ctx.moveTo(256, 265);
      ctx.lineTo(400, 580);
      ctx.lineTo(112, 580);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2B2668';
      ctx.fillRect(0, 580, 512, 188);

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    }

    /* ==========================================================================
       D. PROCEDURAL BABY PANDA ACOUSTIC ENGINE (AUTHENTIC BABY SOUNDS)
       ========================================================================== */
    class BabyPandaAudioEngine {
      constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterGain = null;
        this.compressor = null;
        this.analyser = null;
        this.analyserData = null;
        this.rmsLevel = 0;
      }

      init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        this.compressor = this.ctx.createDynamicsCompressor();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }

      setMute(muted) {
        this.isMuted = muted;
        if (!this.masterGain) return;
        this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.55, this.ctx.currentTime, 0.03);
      }

      // 1. ADORABLE BABY GIGGLE (Bubbling micro-bursts: "He-he-he-he!")
      playGiggle() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const baseTime = this.ctx.currentTime;
        const bursts = [0, 0.075, 0.155, 0.235, 0.315];

        bursts.forEach((offset, idx) => {
          const t0 = baseTime + offset;
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';

          const pitch = 750 + idx * 45 + Math.random() * 30;
          osc.frequency.setValueAtTime(pitch, t0);
          osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, t0 + 0.03);
          osc.frequency.exponentialRampToValueAtTime(pitch * 0.95, t0 + 0.065);

          // Infant vocal formant filter
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1150 + idx * 40, t0);
          filter.Q.setValueAtTime(3.8, t0);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(0.42, t0 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.068);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.compressor);

          osc.start(t0);
          osc.stop(t0 + 0.07);
        });
      }

      // 2. SWEET BABY PANDA COO ("Aww-cooo~")
      playCoo() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(540, t0);
        osc.frequency.exponentialRampToValueAtTime(780, t0 + 0.16);
        osc.frequency.exponentialRampToValueAtTime(610, t0 + 0.38);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950, t0);
        filter.frequency.exponentialRampToValueAtTime(680, t0 + 0.38);
        filter.Q.setValueAtTime(3.2, t0);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.38, t0 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.42);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        osc.start(t0);
        osc.stop(t0 + 0.44);
      }

      // 3. CUTE HIGH-PITCHED SQUEAK (Joyful Baby Squeak)
      playSqueak() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(880, t0);
        osc.frequency.exponentialRampToValueAtTime(1380, t0 + 0.08);
        osc.frequency.exponentialRampToValueAtTime(920, t0 + 0.18);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.36, t0 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.20);

        osc.connect(gain);
        gain.connect(this.compressor);

        osc.start(t0);
        osc.stop(t0 + 0.22);
      }

      // 4. BABY FEEDING / SLURP SOUND (When drinking warm milk or berries)
      playSip() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const baseTime = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
          const t0 = baseTime + i * 0.12;
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(350 + i * 80, t0);
          osc.frequency.exponentialRampToValueAtTime(900 + i * 60, t0 + 0.06);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(0.28, t0 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);

          osc.connect(gain);
          gain.connect(this.compressor);
          osc.start(t0);
          osc.stop(t0 + 0.10);
        }
      }

      // CUTE BABY BUMP / BOOP SOUND (When bumping into furniture or walls)
      playBump() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t0);
        osc.frequency.exponentialRampToValueAtTime(140, t0 + 0.12);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t0);
        filter.frequency.exponentialRampToValueAtTime(160, t0 + 0.12);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.35, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        osc.start(t0);
        osc.stop(t0 + 0.15);

        setTimeout(() => {
          if (!this.ctx || this.isMuted) return;
          const t1 = this.ctx.currentTime;
          const osc2 = this.ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(560, t1);
          osc2.frequency.exponentialRampToValueAtTime(740, t1 + 0.08);

          const gain2 = this.ctx.createGain();
          gain2.gain.setValueAtTime(0.001, t1);
          gain2.gain.linearRampToValueAtTime(0.18, t1 + 0.02);
          gain2.gain.exponentialRampToValueAtTime(0.001, t1 + 0.10);

          osc2.connect(gain2);
          gain2.connect(this.compressor);
          osc2.start(t1);
          osc2.stop(t1 + 0.11);
        }, 55);
      }

      // 5. BABY YAWN & SIGH (When nap time / sleeping)
      playYawn() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(620, t0);
        osc.frequency.exponentialRampToValueAtTime(740, t0 + 0.25);
        osc.frequency.exponentialRampToValueAtTime(340, t0 + 0.85);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, t0);
        filter.frequency.exponentialRampToValueAtTime(300, t0 + 0.85);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.32, t0 + 0.20);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.90);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        osc.start(t0);
        osc.stop(t0 + 0.92);
      }

      // 6. FUTURISTIC ENTRANCE PORTAL CHIME (When entering Koko's room)
      playPortalChime() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];

        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t0 + idx * 0.04);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0 + idx * 0.04);
          gain.gain.linearRampToValueAtTime(0.22, t0 + idx * 0.04 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + idx * 0.04 + 0.9);

          osc.connect(gain);
          gain.connect(this.compressor);

          osc.start(t0 + idx * 0.04);
          osc.stop(t0 + idx * 0.04 + 0.95);
        });
      }

      // 7. STARDUST CELESTIAL CHIME (Chapter I - 404 Se Janam)
      playStardust() {
        if (!this.ctx) this.init();
        if (this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const notes = [587.33, 659.25, 880.00, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t0 + idx * 0.05);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0 + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.18, t0 + idx * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + idx * 0.05 + 0.6);
          osc.connect(gain);
          gain.connect(this.compressor);
          osc.start(t0 + idx * 0.05);
          osc.stop(t0 + idx * 0.05 + 0.65);
        });
        setTimeout(() => this.playCoo(), 250);
      }

      // 8. VINTAGE 56K DIAL-UP HANDSHAKE & GIGGLE (Chapter II - Lost & Found)
      playDialupBeep() {
        if (!this.ctx) this.init();
        if (this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const freqs = [1209, 1336, 941, 1477];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t0 + idx * 0.06);
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1800, t0 + idx * 0.06);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0 + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.08, t0 + idx * 0.06 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + idx * 0.06 + 0.055);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.compressor);
          osc.start(t0 + idx * 0.06);
          osc.stop(t0 + idx * 0.06 + 0.06);
        });
        setTimeout(() => this.playGiggle(), 320);
      }

      // 9. 56K MODEM LULLABY & SLEEPY YAWN (Chapter III - Lori Ki Mithas)
      playLullabyChime() {
        if (!this.ctx) this.init();
        if (this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t0 + idx * 0.12);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t0 + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.18, t0 + idx * 0.12 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + idx * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(this.compressor);
          osc.start(t0 + idx * 0.12);
          osc.stop(t0 + idx * 0.12 + 0.85);
        });
        setTimeout(() => this.playYawn(), 600);
      }

      // 10. PROCEDURAL LOFI AMBIENT SYNTH MELODY
      toggleMusic() {
        if (!this.ctx) this.init();
        this.resume();
        this.isMusicPlaying = !this.isMusicPlaying;
        if (this.isMusicPlaying) {
          this.startMusic();
        } else {
          this.stopMusic();
        }
        return this.isMusicPlaying;
      }

      startMusic() {
        if (this.musicTimer) clearInterval(this.musicTimer);
        const chords = [
          [349.23, 440.0, 523.25, 659.25],
          [392.00, 493.88, 587.33, 698.46],
          [329.63, 392.00, 493.88, 587.33],
          [440.00, 523.25, 659.25, 783.99]
        ];
        let chordIdx = 0;
        const playBar = () => {
          if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;
          const chord = chords[chordIdx % chords.length];
          chordIdx++;
          const t0 = this.ctx.currentTime;
          chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t0 + i * 0.18);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, t0 + i * 0.18);
            gain.gain.linearRampToValueAtTime(0.04, t0 + i * 0.18 + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.18 + 1.6);
            osc.connect(gain);
            gain.connect(this.compressor);
            osc.start(t0 + i * 0.18);
            osc.stop(t0 + i * 0.18 + 1.7);
          });
        };
        playBar();
        this.musicTimer = setInterval(playBar, 2400);
      }

      stopMusic() {
        if (this.musicTimer) {
          clearInterval(this.musicTimer);
          this.musicTimer = null;
        }
      }

      getVoiceRMS() {
        const synthBoost = this.speakingRmsBoost ? (0.18 + Math.abs(Math.sin(performance.now() * 0.018)) * 0.28) : 0;
        if (!this.analyser || !this.analyserData) return synthBoost;
        this.analyser.getByteTimeDomainData(this.analyserData);
        let sum = 0;
        for (let i = 0; i < this.analyserData.length; i++) {
          const v = (this.analyserData[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.max(Math.sqrt(sum / this.analyserData.length), synthBoost);
        this.rmsLevel += (rms - this.rmsLevel) * 0.35;
        return this.rmsLevel;
      }

      // 11. SOFT NATURE CHIME & LEAF SHIMMER (When clicking the 3D Interactive Plant)
      playNatureChime() {
        if (!this.ctx) this.init();
        if (this.isMuted) return;
        this.resume();
        const t0 = this.ctx.currentTime;
        // Woodland pentatonic chime notes (C5, D5, E5, G5, A5, C6)
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

        notes.forEach((freq, idx) => {
          const start = t0 + idx * 0.065;
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          // Harmonic overtone for organic wooden wind-chime warmth
          const overtone = this.ctx.createOscillator();
          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(freq * 2.0, start);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.20, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.85);

          const overGain = this.ctx.createGain();
          overGain.gain.setValueAtTime(0.001, start);
          overGain.gain.linearRampToValueAtTime(0.05, start + 0.015);
          overGain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

          osc.connect(gain);
          overtone.connect(overGain);
          gain.connect(this.compressor);
          overGain.connect(this.compressor);

          osc.start(start);
          osc.stop(start + 0.9);
          overtone.start(start);
          overtone.stop(start + 0.4);
        });

        // Subtle leaf rustle shimmer
        const bufferSize = this.ctx.sampleRate * 0.28;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, t0);
        filter.Q.setValueAtTime(2.5, t0);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, t0);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.27);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.compressor);
        whiteNoise.start(t0);
      }

      // 12. MULTILINGUAL BABY PANDA TALKING VOICE (Web Speech TTS + Cute Syllable Babble)
      speakInPandaVoice(rawText, bcp47Lang = 'en-US', onComplete = null) {
        if (!this.ctx) this.init();
        this.resume();

        // Strip stage directions like *giggle* so TTS reads only the natural words
        const cleanSpeech = rawText.replace(/\*[^*]+\*/g, '').trim() || rawText;

        // Play melodic baby panda syllable coos underneath so Koko's mouth animates and voice always sounds cute
        const wordCount = Math.min(12, Math.max(3, cleanSpeech.split(/\s+/).length));
        if (!this.isMuted) {
          const baseTime = this.ctx.currentTime;
          for (let i = 0; i < wordCount; i++) {
            const t0 = baseTime + i * 0.14;
            const osc = this.ctx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            const basePitch = 520 + ((i * 67) % 180);
            osc.frequency.setValueAtTime(basePitch, t0);
            osc.frequency.exponentialRampToValueAtTime(basePitch * 1.18, t0 + 0.05);
            osc.frequency.exponentialRampToValueAtTime(basePitch * 0.92, t0 + 0.11);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1050, t0);
            filter.Q.setValueAtTime(2.8, t0);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, t0);
            gain.gain.linearRampToValueAtTime(0.14, t0 + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.compressor);
            osc.start(t0);
            osc.stop(t0 + 0.125);
          }
        }

        let finished = false;
        const finishCallback = () => {
          if (finished) return;
          finished = true;
          this.speakingRmsBoost = false;
          if (typeof onComplete === 'function') onComplete();
        };

        // Trigger Web Speech API Synthesis in the detected language with cute baby panda pitch
        if ('speechSynthesis' in window && !this.isMuted) {
          try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(cleanSpeech);
            utter.lang = bcp47Lang;
            utter.pitch = 1.55; // Adorable high baby panda pitch
            utter.rate = 1.04;
            utter.volume = 0.95;

            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
              const langPrefix = bcp47Lang.split('-')[0].toLowerCase();
              const exactVoice = voices.find(v => v.lang.toLowerCase() === bcp47Lang.toLowerCase());
              const prefixVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
              if (exactVoice) utter.voice = exactVoice;
              else if (prefixVoice) utter.voice = prefixVoice;
            }

            this.speakingRmsBoost = true;
            utter.onend = () => finishCallback();
            utter.onerror = () => finishCallback();
            window.speechSynthesis.speak(utter);

            // Safety timeout to clear mouth animation boost
            if (this.speakBoostTimer) clearTimeout(this.speakBoostTimer);
            this.speakBoostTimer = setTimeout(() => {
              finishCallback();
            }, Math.max(1600, wordCount * 280));
          } catch (err) {
            finishCallback();
          }
        } else {
          if (this.speakBoostTimer) clearTimeout(this.speakBoostTimer);
          this.speakBoostTimer = setTimeout(() => {
            finishCallback();
          }, Math.max(1200, wordCount * 180));
        }
      }
    }

    /* ==========================================================================
       E. PROCEDURAL 3D KOKO PANDA COMPANION (ADORABLE CHIBI TODDLER)
       ========================================================================== */
    class KokoPandaCharacter {
      constructor(audio) {
        this.audio = audio;
        this.group = new THREE.Group();
        this.hitboxes = [];

        // Stand in the center-foreground facing front in the spacious room
        this.group.position.set(0.0, 0, 1.15);
        this.group.rotation.y = 0.05;
        this.targetPos = new THREE.Vector3(0.0, 0, 1.15);

        this.walkSpeed = 2.1;
        this.walkCycle = 0;
        this.currentAction = 'walk'; // walk, dance, sit, sleep, wave, peekaboo

        this.danceTimer = 0;
        this.waveTimer = 0;
        this.peekabooTimer = 0;
        this.blinkTimer = 2.5;
        this.isBlinking = false;
        this.blinkProgress = 0;
        this.mouthOpen = 0;
        this.bumpCooldown = 0;
        this.bumpWobble = 0;
        this.onBumpCallback = null;
        this.pandaRadius = 0.40;

        this.buildMesh();
      }

      buildMesh() {
        const matFurWhite = new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.92 });
        const matFurDark = new THREE.MeshStandardMaterial({ color: 0x1E1E24, roughness: 0.88 });
        const matPinkBlush = new THREE.MeshStandardMaterial({ color: 0xFFA4B6, transparent: true, opacity: 0.74 });
        const matEyeGloss = new THREE.MeshStandardMaterial({ color: 0x0A0A0E, roughness: 0.04 });
        const matSparkle = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.55 });
        const matBackpack = new THREE.MeshStandardMaterial({ color: 0x6A7B54, roughness: 0.85 }); // Sage green backpack
        const matStrap = new THREE.MeshStandardMaterial({ color: 0x485438, roughness: 0.9 });

        // Chubby Toddler Body
        this.bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.56, 32, 28), matFurWhite);
        this.bodyMesh.scale.set(0.96, 1.15, 0.96);
        this.bodyMesh.position.set(0, 0.55, 0);
        this.bodyMesh.castShadow = true;
        this.group.add(this.bodyMesh);
        this.hitboxes.push(this.bodyMesh);

        // Fluffy Belly Patch
        const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), matFurWhite);
        bellyPatch.scale.set(0.85, 1.0, 0.7);
        bellyPatch.position.set(0, -0.05, 0.22);
        this.bodyMesh.add(bellyPatch);

        // Sage Green Backpack
        const backpack = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.48, 0.28, 6, 0.08), matBackpack);
        backpack.position.set(0, 0.12, -0.48);
        backpack.castShadow = true;
        this.bodyMesh.add(backpack);

        // Backpack Straps
        const strapL = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.032, 8, 24, Math.PI), matStrap);
        strapL.position.set(-0.2, 0.08, -0.15);
        strapL.rotation.y = Math.PI * 0.45;
        this.bodyMesh.add(strapL);

        const strapR = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.032, 8, 24, Math.PI), matStrap);
        strapR.position.set(0.2, 0.08, -0.15);
        strapR.rotation.y = -Math.PI * 0.45;
        this.bodyMesh.add(strapR);

        // Dark Panda Toddler Arms / Paws
        const pawGeo = new THREE.CapsuleGeometry(0.095, 0.2, 14, 14);
        this.pawFL = new THREE.Mesh(pawGeo, matFurDark);
        this.pawFL.rotation.x = Math.PI * 0.38;
        this.pawFL.position.set(-0.28, -0.38, 0.35);
        this.pawFL.castShadow = true;
        this.bodyMesh.add(this.pawFL);

        this.pawFR = new THREE.Mesh(pawGeo, matFurDark);
        this.pawFR.rotation.x = Math.PI * 0.38;
        this.pawFR.position.set(0.28, -0.38, 0.35);
        this.pawFR.castShadow = true;
        this.bodyMesh.add(this.pawFR);

        // Dark Panda Toddler Feet
        const footGeo = new THREE.CapsuleGeometry(0.11, 0.16, 14, 14);
        this.pawBL = new THREE.Mesh(footGeo, matFurDark);
        this.pawBL.rotation.x = Math.PI * 0.5;
        this.pawBL.position.set(-0.35, -0.48, 0.12);
        this.pawBL.castShadow = true;
        this.bodyMesh.add(this.pawBL);

        this.pawBR = new THREE.Mesh(footGeo, matFurDark);
        this.pawBR.rotation.x = Math.PI * 0.5;
        this.pawBR.position.set(0.35, -0.48, 0.12);
        this.pawBR.castShadow = true;
        this.bodyMesh.add(this.pawBR);

        // Head Group
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 1.05, 0.08);
        this.group.add(this.headGroup);

        this.headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.56, 32, 32), matFurWhite);
        this.headMesh.scale.set(1.15, 0.98, 1.02);
        this.headMesh.castShadow = true;
        this.headGroup.add(this.headMesh);
        this.hitboxes.push(this.headMesh);

        // Round Fuzzy Panda Ears (10 & 2 o'clock)
        const earGeo = new THREE.SphereGeometry(0.18, 18, 18);
        this.earL = new THREE.Mesh(earGeo, matFurDark);
        this.earL.position.set(-0.46, 0.44, 0.02);
        this.earL.scale.set(1.0, 1.15, 0.7);
        this.headGroup.add(this.earL);

        this.earR = new THREE.Mesh(earGeo, matFurDark);
        this.earR.position.set(0.46, 0.44, 0.02);
        this.earR.scale.set(1.0, 1.15, 0.7);
        this.headGroup.add(this.earR);

        // Big Anime Eye Patches & Sparkling Eyes
        const createEye = (sign) => {
          const eyeGroup = new THREE.Group();
          eyeGroup.position.set(sign * 0.22, 0.02, 0.46);

          const patch = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), matFurDark);
          patch.scale.set(1.15, 1.18, 0.35);
          patch.rotation.z = sign * 0.15;
          eyeGroup.add(patch);

          const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.118, 24, 24), matEyeGloss);
          eyeball.position.set(0, 0, 0.06);
          eyeGroup.add(eyeball);

          const sparkle1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), matSparkle);
          sparkle1.position.set(sign * 0.03, 0.038, 0.125);
          eyeGroup.add(sparkle1);

          const sparkle2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), matSparkle);
          sparkle2.position.set(sign * -0.035, -0.036, 0.125);
          eyeGroup.add(sparkle2);

          const eyelid = new THREE.Mesh(new THREE.SphereGeometry(0.128, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), matFurDark);
          eyelid.rotation.x = -Math.PI * 0.5;
          eyelid.position.set(0, 0, 0.065);
          eyelid.scale.set(1.05, 1.05, 0.001);
          eyeGroup.add(eyelid);

          return { group: eyeGroup, eyelid };
        };

        this.eyeL = createEye(-1);
        this.eyeR = createEye(1);
        this.headGroup.add(this.eyeL.group);
        this.headGroup.add(this.eyeR.group);

        // Pink Cheeks Blush
        const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matPinkBlush);
        blushL.scale.set(1.2, 0.7, 0.25);
        blushL.position.set(-0.38, -0.08, 0.42);
        blushL.rotation.y = -0.3;
        this.headGroup.add(blushL);

        const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matPinkBlush);
        blushR.scale.set(1.2, 0.7, 0.25);
        blushR.position.set(0.38, -0.08, 0.42);
        blushR.rotation.y = 0.3;
        this.headGroup.add(blushR);

        // Snout, Black Nose & Open Smiling Mouth
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 18), matFurWhite);
        snout.scale.set(1.15, 0.85, 0.65);
        snout.position.set(0, -0.07, 0.51);
        this.headGroup.add(snout);

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 14), matFurDark);
        nose.scale.set(1.2, 0.8, 0.6);
        nose.position.set(0, -0.02, 0.57);
        this.headGroup.add(nose);

        this.mouthOpenMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x881E34, roughness: 0.6 })
        );
        this.mouthOpenMesh.position.set(0, -0.10, 0.54);
        this.mouthOpenMesh.scale.set(0.75, 0.75, 0.75);
        this.headGroup.add(this.mouthOpenMesh);

        const tongue = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xFFA0B4, roughness: 0.5 })
        );
        tongue.position.set(0, -0.02, 0.02);
        this.mouthOpenMesh.add(tongue);

        // Build 3D Soft Plush Dress-Up Accessories (Knitted Scarf, Plush Bow, Flower Crown)
        this.activeAccessories = new Set();
        this.buildDressUpAccessories();
      }

      buildDressUpAccessories() {
        // 1. TINY KNITTED SCARF (Soft Coral-Berry & Cream Yarn wrapped around Koko's neck)
        this.scarfGroup = new THREE.Group();
        this.scarfGroup.position.set(0, 0.80, 0.05);
        this.scarfGroup.visible = false;

        const matYarnCoral = new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.96 });
        const matYarnCream = new THREE.MeshStandardMaterial({ color: 0xFFF5F7, roughness: 0.96 });
        const matYarnRose = new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.95 });

        // Main plump knitted neck ring
        const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.092, 20, 36), matYarnCoral);
        collarRing.rotation.x = Math.PI * 0.52;
        collarRing.scale.set(1.06, 0.98, 1.05);
        collarRing.castShadow = true;
        this.scarfGroup.add(collarRing);

        // Chunky knitted rib loops around the collar for authentic plush yarn texture
        const ribCount = 16;
        for (let i = 0; i < ribCount; i++) {
          const angle = (i / ribCount) * Math.PI * 2;
          const rib = new THREE.Mesh(
            new THREE.SphereGeometry(0.096, 12, 12),
            i % 3 === 0 ? matYarnCream : matYarnCoral
          );
          rib.scale.set(0.65, 1.05, 1.0);
          rib.position.set(Math.cos(angle) * 0.40, Math.sin(angle) * -0.01, Math.sin(angle) * 0.38);
          rib.rotation.y = -angle;
          this.scarfGroup.add(rib);
        }

        // Cozy plump knot on Koko's front-left chest
        const scarfKnot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), matYarnRose);
        scarfKnot.scale.set(1.1, 0.95, 1.0);
        scarfKnot.position.set(-0.16, -0.04, 0.39);
        scarfKnot.castShadow = true;
        this.scarfGroup.add(scarfKnot);

        // Dangling knitted scarf tail 1 (Front longer tail)
        this.scarfTail1 = new THREE.Group();
        this.scarfTail1.position.set(-0.17, -0.08, 0.42);
        const tail1Body = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, 0.24, 12, 16), matYarnCoral);
        tail1Body.scale.set(1.15, 1.0, 0.55);
        tail1Body.position.set(0, -0.14, 0.02);
        tail1Body.rotation.z = 0.08;
        tail1Body.castShadow = true;
        this.scarfTail1.add(tail1Body);

        // Cream knitted stripe on tail 1
        const tail1Stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.076, 0.045, 16), matYarnCream);
        tail1Stripe.scale.set(1.16, 1.0, 0.58);
        tail1Stripe.position.set(0.01, -0.23, 0.02);
        tail1Stripe.rotation.z = 0.08;
        this.scarfTail1.add(tail1Stripe);

        // Soft yarn pom-pom fringes at bottom of tail 1
        [-0.045, 0, 0.045].forEach((ox) => {
          const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), matYarnCream);
          fringe.scale.set(0.8, 1.35, 0.8);
          fringe.position.set(ox + 0.01, -0.31, 0.02);
          this.scarfTail1.add(fringe);
        });
        this.scarfGroup.add(this.scarfTail1);

        // Dangling knitted scarf tail 2 (Shorter overlapping tail)
        this.scarfTail2 = new THREE.Group();
        this.scarfTail2.position.set(-0.07, -0.07, 0.43);
        const tail2Body = new THREE.Mesh(new THREE.CapsuleGeometry(0.064, 0.16, 12, 16), matYarnRose);
        tail2Body.scale.set(1.1, 1.0, 0.55);
        tail2Body.position.set(0.03, -0.10, 0.03);
        tail2Body.rotation.z = -0.22;
        tail2Body.castShadow = true;
        this.scarfTail2.add(tail2Body);

        [-0.035, 0.035].forEach((ox) => {
          const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), matYarnCream);
          fringe.scale.set(0.8, 1.3, 0.8);
          fringe.position.set(ox + 0.05, -0.22, 0.03);
          this.scarfTail2.add(fringe);
        });
        this.scarfGroup.add(this.scarfTail2);

        this.group.add(this.scarfGroup);

        // 2. SOFT PLUSH RIBBON BOW (Perched adorably on Koko's head beside his ear)
        this.bowGroup = new THREE.Group();
        this.bowGroup.position.set(-0.32, 0.45, 0.24);
        this.bowGroup.rotation.set(0.15, -0.22, 0.34);
        this.bowGroup.visible = false;

        const matBowPlush = new THREE.MeshStandardMaterial({ color: 0xFF5D8F, roughness: 0.90 });
        const matBowLight = new THREE.MeshStandardMaterial({ color: 0xFFC2D4, roughness: 0.92 });

        // Center plump bow knot
        const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.078, 18, 18), matBowPlush);
        bowKnot.scale.set(0.95, 1.08, 0.82);
        bowKnot.castShadow = true;
        this.bowGroup.add(bowKnot);

        // Left & Right Puffy Plush Loops
        [-1, 1].forEach((dir) => {
          const loopWing = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 20), matBowPlush);
          loopWing.scale.set(1.25, 0.88, 0.56);
          loopWing.position.set(dir * 0.15, 0.02, -0.01);
          loopWing.rotation.z = dir * -0.18;
          loopWing.rotation.y = dir * -0.15;
          loopWing.castShadow = true;
          this.bowGroup.add(loopWing);

          // Soft pastel inner dimple crease
          const innerCrease = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.09, 8, 10), matBowLight);
          innerCrease.rotation.z = Math.PI * 0.5 + dir * 0.12;
          innerCrease.position.set(dir * 0.11, 0.01, 0.055);
          this.bowGroup.add(innerCrease);

          // Cute rounded ribbon tail hanging down
          const ribbonTail = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.13, 10, 12), matBowLight);
          ribbonTail.scale.set(1.1, 1.0, 0.55);
          ribbonTail.position.set(dir * 0.065, -0.13, 0.01);
          ribbonTail.rotation.z = dir * -0.32;
          this.bowGroup.add(ribbonTail);
        });

        this.headGroup.add(this.bowGroup);

        // 3. PASTEL BOTANICAL FLOWER CROWN (Resting across Koko's forehead between his ears)
        this.crownGroup = new THREE.Group();
        this.crownGroup.position.set(0, 0.36, 0.06);
        this.crownGroup.rotation.x = 0.22;
        this.crownGroup.visible = false;

        const matVine = new THREE.MeshStandardMaterial({ color: 0x4E9A67, roughness: 0.88 });
        const matLeaf = new THREE.MeshStandardMaterial({ color: 0x74C69D, roughness: 0.82 });
        const matPollen = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.7 });
        const petalPalettes = [
          new THREE.MeshStandardMaterial({ color: 0xFFB3C6, roughness: 0.85 }), // Sakura Pink
          new THREE.MeshStandardMaterial({ color: 0xFDE68A, roughness: 0.85 }), // Buttercup Yellow
          new THREE.MeshStandardMaterial({ color: 0xE9D5FF, roughness: 0.85 }), // Soft Lavender
          new THREE.MeshStandardMaterial({ color: 0xBAE6FD, roughness: 0.85 })  // Sky Pastel Blue
        ];

        // Soft braided botanical vine ring
        const vineRing = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.032, 16, 40), matVine);
        vineRing.rotation.x = Math.PI * 0.5;
        vineRing.scale.set(1.08, 0.94, 1.0);
        this.crownGroup.add(vineRing);

        // 9 Plump 5-Petal Pastel Blossoms & Soft Leaves around the crown
        const numFlowers = 9;
        for (let i = 0; i < numFlowers; i++) {
          const angle = (i / numFlowers) * Math.PI * 2;
          const fx = Math.cos(angle) * 0.485;
          const fz = Math.sin(angle) * 0.425;

          const flowerNode = new THREE.Group();
          flowerNode.position.set(fx, 0.02, fz);
          flowerNode.lookAt(fx * 2, 0.15, fz * 2);

          // Golden center bud
          const centerBud = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), matPollen);
          centerBud.position.set(0, 0, 0.02);
          flowerNode.add(centerBud);

          // 5 puffy rounded petals around the center bud
          const petalMat = petalPalettes[i % petalPalettes.length];
          for (let p = 0; p < 5; p++) {
            const pAngle = (p / 5) * Math.PI * 2;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), petalMat);
            petal.scale.set(1.0, 1.0, 0.65);
            petal.position.set(Math.cos(pAngle) * 0.048, Math.sin(pAngle) * 0.048, 0.008);
            flowerNode.add(petal);
          }

          // Cute little rounded leaf tucked beside each blossom
          const tinyLeaf = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), matLeaf);
          tinyLeaf.scale.set(1.4, 0.55, 0.45);
          tinyLeaf.position.set(0.065, -0.02, -0.01);
          tinyLeaf.rotation.z = 0.4;
          flowerNode.add(tinyLeaf);

          this.crownGroup.add(flowerNode);
        }

        this.headGroup.add(this.crownGroup);
      }

      // Toggle or set Koko's 3D plush accessory ('scarf', 'bow', 'crown', or 'none')
      toggleAccessory(type) {
        if (type === 'none') {
          this.activeAccessories.clear();
        } else {
          if (this.activeAccessories.has(type)) {
            this.activeAccessories.delete(type);
          } else {
            this.activeAccessories.add(type);
          }
        }
        this.syncAccessoryVisibility();
        return this.activeAccessories.has(type);
      }

      equipAccessory(type) {
        if (type === 'none') {
          this.activeAccessories.clear();
        } else {
          this.activeAccessories.add(type);
        }
        this.syncAccessoryVisibility();
      }

      syncAccessoryVisibility() {
        if (this.scarfGroup) this.scarfGroup.visible = this.activeAccessories.has('scarf');
        if (this.bowGroup) this.bowGroup.visible = this.activeAccessories.has('bow');
        if (this.crownGroup) this.crownGroup.visible = this.activeAccessories.has('crown');
      }

      resolveCollisions(px, pz) {
        let bumped = false;
        let obstacleName = "";
        const r = this.pandaRadius; // 0.40

        // 1. Circle obstacles in the expanded room (all soft & rounded)
        const circles = [
          // Soft Panda Pouf Bed (Right side)
          { name: "Soft Panda Pouf Bed", cx: 3.35, cz: -0.25, radius: 0.92 },
          // Interactive Wiggling Nature Plant (Back-Left near desk)
          { name: "Interactive Nature Plant", cx: -1.15, cz: -3.45, radius: 0.48 },
          // Sunny Window Leafy Plant Stand (Far Left)
          { name: "Sunny Window Plant", cx: -4.25, cz: -2.55, radius: 0.42 },
          // Honey Bear Plushie (Right-center floor)
          { name: "Honey Bear Plushie", cx: 2.30, cz: -1.65, radius: 0.36 },
          // Pastel Bunny Plushie (Left-center near sofa)
          { name: "Bunny Plushie", cx: -1.85, cz: -1.55, radius: 0.34 }
        ];

        for (let i = 0; i < circles.length; i++) {
          const c = circles[i];
          const dx = px - c.cx;
          const dz = pz - c.cz;
          const dist = Math.hypot(dx, dz);
          const minDist = c.radius + r;
          if (dist < minDist) {
            bumped = true;
            obstacleName = c.name;
            const nx = dist > 0.001 ? dx / dist : 1.0;
            const nz = dist > 0.001 ? dz / dist : 0.0;
            px = c.cx + nx * minDist;
            pz = c.cz + nz * minDist;
          }
        }

        // 2. Soft Rounded Box obstacles in the expanded room
        const boxes = [
          // Plump Rounded Sofa (Far Left)
          { name: "Plush Sofa", minX: -4.85, maxX: -2.15, minZ: -1.95, maxZ: -0.25 },
          // Organic Pebble Coffee Table
          { name: "Pebble Table", minX: -3.35, maxX: -1.85, minZ: 0.05, maxZ: 0.85 },
          // Rounded Study Desk (Back Right)
          { name: "Rounded Study Desk", minX: -0.05, maxX: 2.85, minZ: -4.35, maxZ: -3.05 },
          // Rounded Desk Chair
          { name: "Cozy Desk Chair", minX: 0.75, maxX: 1.55, minZ: -3.05, maxZ: -2.35 }
        ];

        for (let i = 0; i < boxes.length; i++) {
          const b = boxes[i];
          const bMinX = b.minX - r;
          const bMaxX = b.maxX + r;
          const bMinZ = b.minZ - r;
          const bMaxZ = b.maxZ + r;

          if (px > bMinX && px < bMaxX && pz > bMinZ && pz < bMaxZ) {
            bumped = true;
            obstacleName = b.name;

            const dLeft = px - bMinX;
            const dRight = bMaxX - px;
            const dBottom = pz - bMinZ;
            const dTop = bMaxZ - pz;
            const minD = Math.min(dLeft, dRight, dBottom, dTop);

            if (minD === dLeft) px = bMinX;
            else if (minD === dRight) px = bMaxX;
            else if (minD === dBottom) pz = bMinZ;
            else pz = bMaxZ;
          }
        }

        // 3. Expanded Room Wall Boundaries (Nearly 2x larger walkable area!)
        const boundMinX = -4.55;
        const boundMaxX = 4.55;
        const boundMinZ = -3.85;
        const boundMaxZ = 3.25;

        if (px < boundMinX) {
          px = boundMinX;
          bumped = true;
          obstacleName = "Sunset Window";
        } else if (px > boundMaxX) {
          px = boundMaxX;
          bumped = true;
          obstacleName = "Cozy Nursery Wall";
        }

        if (pz < boundMinZ) {
          pz = boundMinZ;
          bumped = true;
          obstacleName = "Back Nursery Wall";
        } else if (pz > boundMaxZ) {
          pz = boundMaxZ;
          bumped = true;
          obstacleName = "Front Rug Perimeter";
        }

        return { x: px, z: pz, bumped, obstacleName };
      }

      walkTo(x, z) {
        if (this.currentAction === 'sleep') {
          this.group.position.set(1.95, 0, -0.10);
          this.headGroup.rotation.z = 0;
        }
        this.targetPos.set(x, 0, z);
        this.currentAction = 'walk';
      }

      setAction(act) {
        const wasSleeping = this.currentAction === 'sleep';
        this.currentAction = act;
        // Reset paw positions in case coming from peekaboo
        this.pawFL.position.set(-0.28, -0.38, 0.35);
        this.pawFR.position.set(0.28, -0.38, 0.35);

        if (act !== 'sleep') {
          this.headGroup.rotation.z = 0;
          // If waking up from the right-side couch, step onto the floor in front of the couch
          const distFromRightCouch = Math.hypot(this.group.position.x - 3.35, this.group.position.z - (-0.25));
          if (wasSleeping || distFromRightCouch < 1.38 || this.group.position.y > 0.05) {
            this.group.position.set(1.95, 0, -0.10);
            this.targetPos.set(1.95, 0, -0.10);
          }
        }

        if (act === 'dance') {
          this.danceTimer = 0;
          this.audio.playGiggle();
        } else if (act === 'wave') {
          this.waveTimer = 0;
          this.audio.playSqueak();
        } else if (act === 'peekaboo') {
          this.peekabooTimer = 0;
          this.audio.playCoo();
        } else if (act === 'sit') {
          this.audio.playCoo();
        } else if (act === 'sleep') {
          this.targetPos.set(3.35, 0, -0.25);
          this.audio.playYawn();
        } else if (act === 'walk') {
          this.audio.playCoo();
        }
      }

      update(dt, time, pointerNdc) {
        // Natural blinking
        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
          this.isBlinking = true;
          this.blinkProgress = 0;
          this.blinkTimer = 2.5 + Math.random() * 3.5;
        }
        if (this.isBlinking) {
          this.blinkProgress += dt * 14.0;
          const blinkVal = Math.sin(this.blinkProgress);
          if (blinkVal <= 0 && this.blinkProgress > 1.5) {
            this.isBlinking = false;
            this.eyeL.eyelid.scale.z = 0.001;
            this.eyeR.eyelid.scale.z = 0.001;
          } else {
            const lidScale = THREE.MathUtils.clamp(Math.abs(blinkVal), 0.001, 1.0);
            this.eyeL.eyelid.scale.z = lidScale;
            this.eyeR.eyelid.scale.z = lidScale;
          }
        }

        // Bump recoil wobble & head reaction
        if (this.bumpWobble > 0) {
          this.bumpWobble -= dt;
          const wobble = Math.sin(this.bumpWobble * 22.0) * (this.bumpWobble * 0.4);
          this.headGroup.rotation.x += wobble;
          this.headGroup.rotation.z += wobble * 0.5;
          this.eyeL.eyelid.scale.z = Math.max(this.eyeL.eyelid.scale.z, 0.65);
          this.eyeR.eyelid.scale.z = Math.max(this.eyeR.eyelid.scale.z, 0.65);
        }
        if (this.bumpCooldown > 0) {
          this.bumpCooldown -= dt;
        }

        // Head subtly turns toward cursor when awake
        const damp = 1.0 - Math.exp(-dt * 6.0);
        if (this.currentAction !== 'sleep') {
          const targetYaw = -pointerNdc.x * 0.35;
          const targetPitch = pointerNdc.y * 0.20;
          this.headGroup.rotation.y += (targetYaw - this.headGroup.rotation.y) * damp;
          this.headGroup.rotation.x += (targetPitch - this.headGroup.rotation.x) * damp;
          this.group.position.y += (0 - this.group.position.y) * (1.0 - Math.exp(-dt * 8.0));
        }

        // Mouth react to audio RMS & multilingual speech
        const rms = this.audio.getVoiceRMS();
        let targetMouth = 0.75;
        if (rms > 0.04) {
          targetMouth = 0.75 + THREE.MathUtils.clamp(rms * 4.2, 0, 0.72);
        }
        this.mouthOpen += (targetMouth - this.mouthOpen) * (1.0 - Math.exp(-dt * 15.0));
        this.mouthOpenMesh.scale.set(this.mouthOpen, this.mouthOpen, this.mouthOpen);

        // Character State Actions
        if (this.currentAction === 'walk') {
          const dx = this.targetPos.x - this.group.position.x;
          const dz = this.targetPos.z - this.group.position.z;
          const dist = Math.hypot(dx, dz);

          if (dist > 0.08) {
            const targetRotY = Math.atan2(dx, dz);
            let diff = targetRotY - this.group.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.group.rotation.y += diff * Math.min(1.0, dt * 7.5);

            const step = Math.min(dist, this.walkSpeed * dt);
            const tryX = this.group.position.x + Math.sin(this.group.rotation.y) * step;
            const tryZ = this.group.position.z + Math.cos(this.group.rotation.y) * step;

            // Resolve physical collision so Koko never enters inside objects
            const col = this.resolveCollisions(tryX, tryZ);
            this.group.position.x = col.x;
            this.group.position.z = col.z;

            if (col.bumped) {
              if (this.bumpCooldown <= 0) {
                this.bumpCooldown = 0.9;
                this.bumpWobble = 0.35;
                this.audio.playBump();
                if (this.onBumpCallback) {
                  this.onBumpCallback(col.obstacleName);
                }
              }
              if (dist < 0.25) {
                this.targetPos.copy(this.group.position);
              }
            }

            this.walkCycle += dt * (this.walkSpeed * 5.5);
            const swingL = Math.sin(this.walkCycle) * 0.48;
            const swingR = Math.sin(this.walkCycle + Math.PI) * 0.48;
            this.pawFL.rotation.x = Math.PI * 0.38 + swingL;
            this.pawFR.rotation.x = Math.PI * 0.38 + swingR;
            this.pawBL.rotation.x = Math.PI * 0.5 + swingR * 0.35;
            this.pawBR.rotation.x = Math.PI * 0.5 + swingL * 0.35;
            this.bodyMesh.position.y = 0.55 + Math.abs(Math.sin(this.walkCycle)) * 0.045;
            this.headGroup.position.y = 1.05 + Math.abs(Math.sin(this.walkCycle)) * 0.03;
          } else {
            // Idle breathing & naturally face front toward user
            let diffFront = 0.05 - this.group.rotation.y;
            while (diffFront < -Math.PI) diffFront += Math.PI * 2;
            while (diffFront > Math.PI) diffFront -= Math.PI * 2;
            this.group.rotation.y += diffFront * Math.min(1.0, dt * 4.0);

            this.pawFL.rotation.x = Math.PI * 0.38;
            this.pawFR.rotation.x = Math.PI * 0.38;
            this.pawBL.rotation.x = Math.PI * 0.5;
            this.pawBR.rotation.x = Math.PI * 0.5;
            this.bodyMesh.position.y = 0.55 + Math.sin(time * 2.8) * 0.015;
          }
        } else if (this.currentAction === 'dance') {
          this.danceTimer += dt * 4.5;
          this.group.rotation.y += dt * 3.5;
          this.bodyMesh.position.y = 0.55 + Math.abs(Math.sin(this.danceTimer)) * 0.25;
          this.pawFL.rotation.x = Math.sin(this.danceTimer * 2) * 0.8;
          this.pawFR.rotation.x = Math.cos(this.danceTimer * 2) * 0.8;
        } else if (this.currentAction === 'wave') {
          this.waveTimer += dt * 8.0;
          this.pawFR.rotation.x = -0.5 + Math.sin(this.waveTimer) * 0.4;
          this.pawFL.rotation.x = Math.PI * 0.38;
          this.bodyMesh.position.y = 0.52;
        } else if (this.currentAction === 'peekaboo') {
          this.peekabooTimer += dt * 5.0;
          this.pawFL.position.set(-0.15, -0.15, 0.52);
          this.pawFR.position.set(0.15, -0.15, 0.52);
          this.pawFL.rotation.x = Math.PI * 0.15;
          this.pawFR.rotation.x = Math.PI * 0.15;
        } else if (this.currentAction === 'sit') {
          this.bodyMesh.position.y = 0.38;
          this.headGroup.position.y = 0.88;
          this.pawFL.rotation.x = Math.PI * 0.25;
          this.pawFR.rotation.x = Math.PI * 0.25;
        } else if (this.currentAction === 'sleep') {
          // Move onto the right-side plush couch (x = 3.35, y = 0.25, z = -0.25) and curl up to sleep
          const sleepLerp = 1.0 - Math.exp(-dt * 4.8);
          this.group.position.x += (3.35 - this.group.position.x) * sleepLerp;
          this.group.position.y += (0.25 - this.group.position.y) * sleepLerp;
          this.group.position.z += (-0.25 - this.group.position.z) * sleepLerp;

          let diffRot = -0.48 - this.group.rotation.y;
          while (diffRot < -Math.PI) diffRot += Math.PI * 2;
          while (diffRot > Math.PI) diffRot -= Math.PI * 2;
          this.group.rotation.y += diffRot * sleepLerp;

          const sleepBreath = Math.sin(time * 1.8) * 0.018;
          this.bodyMesh.position.y = 0.28 + sleepBreath;
          this.headGroup.position.y = 0.63 + sleepBreath * 0.8;
          this.headGroup.rotation.y += (-0.12 - this.headGroup.rotation.y) * sleepLerp;
          this.headGroup.rotation.x += (0.16 - this.headGroup.rotation.x) * sleepLerp;
          this.headGroup.rotation.z += (0.22 - this.headGroup.rotation.z) * sleepLerp;

          this.pawFL.rotation.x = Math.PI * 0.18;
          this.pawFR.rotation.x = Math.PI * 0.18;
          this.pawBL.rotation.x = Math.PI * 0.42;
          this.pawBR.rotation.x = Math.PI * 0.42;

          this.eyeL.eyelid.scale.z = 1.0;
          this.eyeR.eyelid.scale.z = 1.0;
        }

        // Keep 3D Knitted Scarf anchored snugly at Koko's neck and animate plush accessory sway
        if (this.scarfGroup) {
          this.scarfGroup.position.y = this.headGroup.position.y - 0.24;
          this.scarfGroup.rotation.y = this.headGroup.rotation.y * 0.35;
          if (this.scarfTail1 && this.scarfTail2) {
            const sway = Math.sin(time * 3.8 + this.walkCycle) * 0.08;
            this.scarfTail1.rotation.z = sway;
            this.scarfTail2.rotation.z = -sway * 0.85;
          }
        }
        if (this.bowGroup && this.bowGroup.visible) {
          this.bowGroup.rotation.z = 0.34 + Math.sin(time * 4.2 + this.walkCycle) * 0.06;
        }
      }
    }

    /* ==========================================================================
       F. SPACIOUS, CUTE & SOFT ROUNDED ROOM WITH INTERACTIVE PLANT & PLUSH TOYS
       ========================================================================== */
    class GenuineRoom {
      constructor(scene) {
        this.scene = scene;
        this.floorMeshes = [];
        this.plantHitboxes = [];
        this.interactivePlants = [];
        this.plushHitboxes = [];
        this.plushToys = [];
        this.fairyLightBulbs = [];
        this.fairyPointLights = [];
        this.isNightMode = false;
        this.build();
      }

      // Helper to build an interactive wiggling potted plant with 100% rounded geometry
      createInteractivePlant(x, y, z, scale = 1.0, potColor = 0xFFF5EB) {
        const rootGroup = new THREE.Group();
        rootGroup.position.set(x, y, z);
        rootGroup.scale.set(scale, scale, scale);

        const matPot = new THREE.MeshStandardMaterial({ color: potColor, roughness: 0.45 });
        const matPotRim = new THREE.MeshStandardMaterial({ color: 0xFDE2E4, roughness: 0.5 });
        const matSoil = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.95 });
        const matLeafMain = new THREE.MeshStandardMaterial({ color: 0x439A63, roughness: 0.65 });
        const matLeafLight = new THREE.MeshStandardMaterial({ color: 0x68B984, roughness: 0.6 });
        const matBlossom = new THREE.MeshStandardMaterial({
          color: 0xFFB3C6,
          emissive: 0xFF8FA3,
          emissiveIntensity: 0.22,
          roughness: 0.5
        });

        // Soft rounded ceramic pot body
        const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.21, 0.42, 24), matPot);
        potBody.position.set(0, 0.21, 0);
        potBody.castShadow = true;
        potBody.receiveShadow = true;
        rootGroup.add(potBody);

        // Chubby rounded torus lip on top of the pot
        const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.038, 14, 28), matPotRim);
        potRim.rotation.x = Math.PI * 0.5;
        potRim.position.set(0, 0.41, 0);
        rootGroup.add(potRim);

        // Rounded saucer plate underneath
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 0.04, 24), matPotRim);
        saucer.position.set(0, 0.02, 0);
        rootGroup.add(saucer);

        // Soft rounded soil dome
        const soil = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 12), matSoil);
        soil.scale.set(1.0, 0.35, 1.0);
        soil.position.set(0, 0.38, 0);
        rootGroup.add(soil);

        // Foliage group that wiggles when clicked!
        const foliageGroup = new THREE.Group();
        foliageGroup.position.set(0, 0.40, 0);
        rootGroup.add(foliageGroup);

        // Central plump stem
        const centerStem = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.38, 10, 12), matLeafMain);
        centerStem.position.set(0, 0.22, 0);
        foliageGroup.add(centerStem);

        // 7 Lush Rounded Plump Leaves radiating out like a cute monstera/peperomia
        const leafAngles = 7;
        const leafMeshes = [];
        for (let i = 0; i < leafAngles; i++) {
          const angle = (i / leafAngles) * Math.PI * 2;
          const leafPivot = new THREE.Group();
          leafPivot.rotation.y = angle;
          leafPivot.position.set(0, 0.12 + (i % 3) * 0.09, 0);

          const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.24, 8, 10), matLeafMain);
          stem.position.set(0.10, 0.10, 0);
          stem.rotation.z = -0.58;
          leafPivot.add(stem);

          // Soft rounded heart/spoon-like leaf pad (flattened sphere)
          const leafPad = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 18, 16),
            i % 2 === 0 ? matLeafMain : matLeafLight
          );
          leafPad.scale.set(1.25, 0.26, 0.95);
          leafPad.position.set(0.22, 0.20, 0);
          leafPad.rotation.z = -0.32;
          leafPad.castShadow = true;
          leafPivot.add(leafPad);

          foliageGroup.add(leafPivot);
          leafMeshes.push(leafPivot);
        }

        // Cute pastel pink flower bud on top
        const flowerBud = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), matBlossom);
        flowerBud.scale.set(1.0, 1.25, 1.0);
        flowerBud.position.set(0, 0.48, 0);
        foliageGroup.add(flowerBud);

        // Invisible generous sphere hitbox so tapping/clicking the plant is effortless on mobile & desktop
        const hitbox = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 12, 12),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false })
        );
        hitbox.position.set(0, 0.48, 0);
        rootGroup.add(hitbox);

        const plantRecord = {
          rootGroup,
          foliageGroup,
          leafMeshes,
          wiggleTimer: 0,
          baseScale: scale
        };
        hitbox.userData.plantRecord = plantRecord;
        potBody.userData.plantRecord = plantRecord;

        this.scene.add(rootGroup);
        this.plantHitboxes.push(hitbox, potBody);
        this.interactivePlants.push(plantRecord);
        return plantRecord;
      }

      // Helper to build a soft 3D Bunny Plushie (100% rounded spheres & capsules)
      createPlushBunny(x, y, z, rotY = 0.4) {
        const bunny = new THREE.Group();
        bunny.position.set(x, y, z);
        bunny.rotation.y = rotY;

        const matPlushPink = new THREE.MeshStandardMaterial({ color: 0xF9C6D3, roughness: 0.95 });
        const matPlushCream = new THREE.MeshStandardMaterial({ color: 0xFFFDF9, roughness: 0.95 });
        const matEye = new THREE.MeshStandardMaterial({ color: 0x221E24, roughness: 0.2 });

        // Chubby body
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 20), matPlushPink);
        body.scale.set(1.0, 1.08, 0.95);
        body.position.set(0, 0.20, 0);
        body.castShadow = true;
        bunny.add(body);

        // Soft cream belly patch
        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), matPlushCream);
        belly.scale.set(0.9, 1.0, 0.5);
        belly.position.set(0, 0.19, 0.13);
        bunny.add(belly);

        // Round head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), matPlushPink);
        head.scale.set(1.08, 0.96, 1.0);
        head.position.set(0, 0.42, 0.02);
        head.castShadow = true;
        bunny.add(head);

        // Floppy rounded lop ears
        const earGeo = new THREE.CapsuleGeometry(0.045, 0.18, 10, 12);
        const earL = new THREE.Mesh(earGeo, matPlushPink);
        earL.position.set(-0.15, 0.48, 0.0);
        earL.rotation.z = 0.55;
        bunny.add(earL);

        const earR = new THREE.Mesh(earGeo, matPlushPink);
        earR.position.set(0.15, 0.48, 0.0);
        earR.rotation.z = -0.55;
        bunny.add(earR);

        // Cute button eyes
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matEye);
        eyeL.position.set(-0.06, 0.44, 0.17);
        bunny.add(eyeL);

        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matEye);
        eyeR.position.set(0.06, 0.44, 0.17);
        bunny.add(eyeR);

        // Round paws
        const pawGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const pawFL = new THREE.Mesh(pawGeo, matPlushPink); pawFL.position.set(-0.14, 0.22, 0.12); bunny.add(pawFL);
        const pawFR = new THREE.Mesh(pawGeo, matPlushPink); pawFR.position.set(0.14, 0.22, 0.12); bunny.add(pawFR);
        const footL = new THREE.Mesh(pawGeo, matPlushPink); footL.position.set(-0.11, 0.07, 0.15); bunny.add(footL);
        const footR = new THREE.Mesh(pawGeo, matPlushPink); footR.position.set(0.11, 0.07, 0.15); bunny.add(footR);

        // Puffball tail
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), matPlushCream);
        tail.position.set(0, 0.12, -0.19);
        bunny.add(tail);

        const toyRecord = { group: bunny, bounceTimer: 0, name: "Pink Bunny Plushie" };
        body.userData.toyRecord = toyRecord;
        head.userData.toyRecord = toyRecord;
        this.plushHitboxes.push(body, head);
        this.plushToys.push(toyRecord);
        this.scene.add(bunny);
      }

      // Helper to build a soft 3D Honey Bear Plushie
      createPlushBear(x, y, z, rotY = -0.45) {
        const bear = new THREE.Group();
        bear.position.set(x, y, z);
        bear.rotation.y = rotY;

        const matHoney = new THREE.MeshStandardMaterial({ color: 0xDCA265, roughness: 0.94 });
        const matCream = new THREE.MeshStandardMaterial({ color: 0xFFF6E8, roughness: 0.94 });
        const matBow = new THREE.MeshStandardMaterial({ color: 0xF472B6, roughness: 0.8 });
        const matEye = new THREE.MeshStandardMaterial({ color: 0x1E1B18, roughness: 0.2 });

        const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), matHoney);
        body.scale.set(1.04, 1.08, 0.96);
        body.position.set(0, 0.22, 0);
        body.castShadow = true;
        bear.add(body);

        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), matCream);
        belly.scale.set(0.92, 1.0, 0.45);
        belly.position.set(0, 0.21, 0.15);
        bear.add(belly);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), matHoney);
        head.position.set(0, 0.46, 0.02);
        head.castShadow = true;
        bear.add(head);

        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), matCream);
        snout.scale.set(1.2, 0.9, 0.7);
        snout.position.set(0, 0.43, 0.19);
        bear.add(snout);

        const earL = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), matHoney);
        earL.position.set(-0.14, 0.61, 0.0);
        bear.add(earL);

        const earR = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), matHoney);
        earR.position.set(0.14, 0.61, 0.0);
        bear.add(earR);

        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matEye);
        eyeL.position.set(-0.065, 0.48, 0.185);
        bear.add(eyeL);

        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), matEye);
        eyeR.position.set(0.065, 0.48, 0.185);
        bear.add(eyeR);

        // Cute ribbon bow tie
        const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), matBow);
        bowCenter.position.set(0, 0.33, 0.19);
        bear.add(bowCenter);

        const pawGeo = new THREE.SphereGeometry(0.072, 12, 12);
        const pawFL = new THREE.Mesh(pawGeo, matHoney); pawFL.position.set(-0.16, 0.24, 0.13); bear.add(pawFL);
        const pawFR = new THREE.Mesh(pawGeo, matHoney); pawFR.position.set(0.16, 0.24, 0.13); bear.add(pawFR);
        const footL = new THREE.Mesh(pawGeo, matHoney); footL.position.set(-0.12, 0.08, 0.17); bear.add(footL);
        const footR = new THREE.Mesh(pawGeo, matHoney); footR.position.set(0.12, 0.08, 0.17); bear.add(footR);

        const toyRecord = { group: bear, bounceTimer: 0, name: "Honey Bear Plushie" };
        body.userData.toyRecord = toyRecord;
        head.userData.toyRecord = toyRecord;
        this.plushHitboxes.push(body, head);
        this.plushToys.push(toyRecord);
        this.scene.add(bear);
      }

      // Helper to build a soft 3D Cloud Plush Pillow
      createCloudPlushPillow(x, y, z, rotY = 0.2, colorHex = 0xE9D5FF) {
        const cloud = new THREE.Group();
        cloud.position.set(x, y, z);
        cloud.rotation.y = rotY;
        const matCloud = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.94 });

        const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), matCloud);
        c1.scale.set(1.2, 0.65, 0.85);
        c1.position.set(0, 0.11, 0);
        c1.castShadow = true;
        cloud.add(c1);

        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), matCloud);
        c2.scale.set(1.1, 0.65, 0.85);
        c2.position.set(-0.15, 0.09, 0.02);
        cloud.add(c2);

        const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), matCloud);
        c3.scale.set(1.1, 0.65, 0.85);
        c3.position.set(0.15, 0.09, 0.02);
        cloud.add(c3);

        const toyRecord = { group: cloud, bounceTimer: 0, name: "Soft Cloud Cushion" };
        c1.userData.toyRecord = toyRecord;
        this.plushHitboxes.push(c1);
        this.plushToys.push(toyRecord);
        this.scene.add(cloud);
      }

      triggerPlantWiggle(plantRecord) {
        if (!plantRecord) return;
        plantRecord.wiggleTimer = 1.4;
      }

      triggerPlushBounce(toyRecord) {
        if (!toyRecord) return;
        toyRecord.bounceTimer = 0.95;
      }

      // Switch room between Sunset (Day) and Starry Night Mode (Fairy lights + Starry sky + Cozy lamp)
      setNightMode(enabled) {
        this.isNightMode = Boolean(enabled);

        if (this.skyPlane && this.skyPlane.material) {
          this.skyPlane.material.map = this.isNightMode ? this.starryNightTex : this.sunsetSkyTex;
          this.skyPlane.material.needsUpdate = true;
        }

        if (this.windowGlass && this.windowGlass.material) {
          this.windowGlass.material.color.setHex(this.isNightMode ? 0x3B4C88 : 0xFFEADB);
          this.windowGlass.material.opacity = this.isNightMode ? 0.22 : 0.15;
        }

        if (this.deskLampLight) {
          this.deskLampLight.intensity = this.isNightMode ? 3.4 : 1.6;
        }

        // Enable or dim the fairy lights and their warm point lights
        for (let i = 0; i < this.fairyLightBulbs.length; i++) {
          const bulb = this.fairyLightBulbs[i];
          bulb.material.emissiveIntensity = this.isNightMode ? 2.4 : 0.22;
        }

        for (let i = 0; i < this.fairyPointLights.length; i++) {
          this.fairyPointLights[i].intensity = this.isNightMode ? 1.45 : 0.0;
        }
      }

      update(dt, time) {
        // Gentle fairy light twinkle in Night-Time mode
        if (this.isNightMode) {
          for (let i = 0; i < this.fairyLightBulbs.length; i++) {
            const bulb = this.fairyLightBulbs[i];
            const twinkle = 2.0 + Math.sin(time * 3.2 + i * 1.1) * 0.65;
            bulb.material.emissiveIntensity = twinkle;
          }
          for (let i = 0; i < this.fairyPointLights.length; i++) {
            this.fairyPointLights[i].intensity = 1.35 + Math.sin(time * 2.4 + i * 1.7) * 0.22;
          }
        }

        // Animate all interactive 3D plants (gentle breathing sway + energetic click wiggle)
        for (let i = 0; i < this.interactivePlants.length; i++) {
          const p = this.interactivePlants[i];
          const idleSway = Math.sin(time * 1.8 + i * 1.3) * 0.035;

          if (p.wiggleTimer > 0) {
            p.wiggleTimer = Math.max(0, p.wiggleTimer - dt);
            const env = p.wiggleTimer / 1.4;
            const wiggleAngle = Math.sin((1.4 - p.wiggleTimer) * 28.0) * env * 0.28;
            const bounceScale = p.baseScale * (1.0 + Math.sin((1.4 - p.wiggleTimer) * 22.0) * env * 0.14);

            p.foliageGroup.rotation.z = idleSway + wiggleAngle;
            p.foliageGroup.rotation.x = Math.cos((1.4 - p.wiggleTimer) * 24.0) * env * 0.18;
            p.rootGroup.scale.set(bounceScale, p.baseScale * (1.0 - (bounceScale - p.baseScale) * 0.5), bounceScale);

            for (let j = 0; j < p.leafMeshes.length; j++) {
              p.leafMeshes[j].rotation.z = Math.sin((1.4 - p.wiggleTimer) * 32.0 + j) * env * 0.22;
            }
          } else {
            p.foliageGroup.rotation.z = idleSway;
            p.foliageGroup.rotation.x = Math.cos(time * 1.4 + i) * 0.02;
            p.rootGroup.scale.set(p.baseScale, p.baseScale, p.baseScale);
          }
        }

        // Animate soft 3D plush toys
        for (let i = 0; i < this.plushToys.length; i++) {
          const toy = this.plushToys[i];
          if (toy.bounceTimer > 0) {
            toy.bounceTimer = Math.max(0, toy.bounceTimer - dt);
            const env = toy.bounceTimer / 0.95;
            const sq = Math.sin((0.95 - toy.bounceTimer) * 24.0) * env * 0.18;
            toy.group.scale.set(1.0 + sq, 1.0 - sq * 0.7, 1.0 + sq);
            toy.group.rotation.z = Math.sin((0.95 - toy.bounceTimer) * 20.0) * env * 0.15;
          } else {
            toy.group.scale.set(1, 1, 1);
            toy.group.rotation.z = Math.sin(time * 1.6 + i) * 0.015;
          }
        }
      }

      build() {
        const matWallWarm = new THREE.MeshStandardMaterial({ color: 0xF5EBE1, roughness: 0.92 });
        const matBaseboard = new THREE.MeshStandardMaterial({ color: 0xFFFDF9, roughness: 0.75 });
        const matMetalDark = new THREE.MeshStandardMaterial({ color: 0x2C2A35, roughness: 0.35, metalness: 0.6 });
        const matSofaPlush = new THREE.MeshStandardMaterial({ color: 0xF3E5DC, roughness: 0.92 });
        const matDeskWood = new THREE.MeshStandardMaterial({ color: 0xD4A87E, roughness: 0.62 });
        const matDarkWood = new THREE.MeshStandardMaterial({ color: 0x8A5D42, roughness: 0.65 });
        const matDoorWood = new THREE.MeshStandardMaterial({ color: 0xA46D4B, roughness: 0.62 });
        const matPlantGreen = new THREE.MeshStandardMaterial({ color: 0x458B58, roughness: 0.82 });
        const matYellowPillow = new THREE.MeshStandardMaterial({ color: 0xFBD38D, roughness: 0.92 });
        const matRosePillow = new THREE.MeshStandardMaterial({ color: 0xFBB6CE, roughness: 0.92 });

        // 1. EXPANDED HARDWOOD FLOOR (28m x 24m) WITH SPECULAR SUNLIGHT REFLECTIONS
        const floorTex = createHardwoodFloorTexture();
        const matFloor = new THREE.MeshStandardMaterial({
          map: floorTex,
          roughness: 0.25,
          metalness: 0.04,
        });

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 24), matFloor);
        floor.rotation.x = -Math.PI * 0.5;
        floor.position.set(0, 0, 0);
        floor.receiveShadow = true;
        this.scene.add(floor);
        this.floorMeshes.push(floor);

        // 2. EXPANDED BACK WALL, RIGHT WALL & ROUNDED BASEBOARDS
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 9), matWallWarm);
        backWall.position.set(0, 4.5, -4.6);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), matWallWarm);
        rightWall.rotation.y = -Math.PI * 0.5;
        rightWall.position.set(5.2, 4.5, 1.0);
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        const baseboardBack = new THREE.Mesh(new RoundedBoxGeometry(24, 0.18, 0.06, 4, 0.025), matBaseboard);
        baseboardBack.position.set(0, 0.09, -4.57);
        this.scene.add(baseboardBack);

        const baseboardRight = new THREE.Mesh(new RoundedBoxGeometry(20, 0.18, 0.06, 4, 0.025), matBaseboard);
        baseboardRight.rotation.y = -Math.PI * 0.5;
        baseboardRight.position.set(5.17, 0.09, 1.0);
        this.scene.add(baseboardRight);

        // 3. PANORAMIC FLOOR-TO-CEILING WINDOW (Far Left at x = -5.2 with Rounded Mullions)
        const windowGroup = new THREE.Group();
        windowGroup.position.set(-5.2, 3.4, -0.5);

        this.sunsetSkyTex = createCitySunsetTexture();
        this.starryNightTex = createStarryNightSkyTexture();
        this.skyPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(14, 8.2),
          new THREE.MeshBasicMaterial({ map: this.sunsetSkyTex })
        );
        this.skyPlane.rotation.y = Math.PI * 0.5;
        this.skyPlane.position.set(-0.5, 0, 0);
        windowGroup.add(this.skyPlane);

        this.windowGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(11.5, 7.2),
          new THREE.MeshPhysicalMaterial({
            color: 0xFFEADB,
            transparent: true,
            opacity: 0.15,
            roughness: 0.05,
            transmission: 0.9,
          })
        );
        this.windowGlass.rotation.y = Math.PI * 0.5;
        windowGroup.add(this.windowGlass);

        // Smooth cylindrical rounded window mullions (Zero sharp BoxGeometry!)
        const mullionGeo = new THREE.CylinderGeometry(0.045, 0.045, 7.2, 16);
        const frameV1 = new THREE.Mesh(mullionGeo, matMetalDark); frameV1.position.set(0, 0, -3.6); windowGroup.add(frameV1);
        const frameV2 = new THREE.Mesh(mullionGeo, matMetalDark); frameV2.position.set(0, 0, 0); windowGroup.add(frameV2);
        const frameV3 = new THREE.Mesh(mullionGeo, matMetalDark); frameV3.position.set(0, 0, 3.6); windowGroup.add(frameV3);

        const frameH = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.09, 7.6, 4, 0.035), matMetalDark);
        frameH.position.set(0, 1.0, 0);
        windowGroup.add(frameH);

        this.scene.add(windowGroup);

        // 4. NEW INTERACTIVE WIGGLING NATURE PLANTS (Click to wiggle & play nature chime!)
        // Primary Interactive Nature Plant in a cozy spot by the back nursery wall
        this.createInteractivePlant(-1.15, 0, -3.45, 1.35, 0xFFF5EB);
        // Second Interactive Nature Plant near the sunny window
        this.createInteractivePlant(-4.25, 0, -2.55, 1.2, 0xE6FFFA);

        // 5. COZY ROUNDED LIVING SOFA & PLUMP BOLSTER CUSHIONS (Left Side)
        const sofaGroup = new THREE.Group();
        sofaGroup.position.set(-3.5, 0, -1.1);
        sofaGroup.rotation.y = 0.24;

        const sofaBase = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.45, 1.18, 8, 0.16), matSofaPlush);
        sofaBase.position.set(0, 0.32, 0);
        sofaBase.castShadow = true;
        sofaGroup.add(sofaBase);

        const sofaBack = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.82, 0.42, 8, 0.16), matSofaPlush);
        sofaBack.position.set(0, 0.78, -0.40);
        sofaBack.castShadow = true;
        sofaGroup.add(sofaBack);

        const armL = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.64, 1.18, 8, 0.16), matSofaPlush);
        armL.position.set(-1.26, 0.52, 0);
        armL.castShadow = true;
        sofaGroup.add(armL);

        const armR = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.64, 1.18, 8, 0.16), matSofaPlush);
        armR.position.set(1.26, 0.52, 0);
        armR.castShadow = true;
        sofaGroup.add(armR);

        const pillow1 = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.44, 0.22, 8, 0.10), matRosePillow);
        pillow1.position.set(-0.72, 0.66, -0.18);
        pillow1.rotation.y = 0.25;
        sofaGroup.add(pillow1);

        const pillow2 = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.42, 0.22, 8, 0.10), matYellowPillow);
        pillow2.position.set(0.68, 0.64, -0.18);
        pillow2.rotation.y = -0.22;
        sofaGroup.add(pillow2);

        this.scene.add(sofaGroup);

        // 6. LARGE SOFT CIRCULAR PASTEL NURSERY RUG & ORGANIC ROUNDED PEBBLE TABLE
        const rugOuter = new THREE.Mesh(
          new THREE.CylinderGeometry(2.55, 2.55, 0.022, 48),
          new THREE.MeshStandardMaterial({ color: 0xFCE7F3, roughness: 0.96 })
        );
        rugOuter.position.set(0.0, 0.011, 0.35);
        rugOuter.receiveShadow = true;
        this.scene.add(rugOuter);

        const rugInner = new THREE.Mesh(
          new THREE.CylinderGeometry(1.85, 1.85, 0.026, 48),
          new THREE.MeshStandardMaterial({ color: 0xFFF5F7, roughness: 0.96 })
        );
        rugInner.position.set(0.0, 0.014, 0.35);
        rugInner.receiveShadow = true;
        this.scene.add(rugInner);

        const tableGroup = new THREE.Group();
        tableGroup.position.set(-2.6, 0, 0.45);

        // Smooth rounded cylinder-disk pebble tabletop
        const tableTop = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.08, 0.82, 8, 0.038), matDeskWood);
        tableTop.position.set(0, 0.40, 0);
        tableTop.castShadow = true;
        tableGroup.add(tableTop);

        const legGeo = new THREE.CylinderGeometry(0.03, 0.022, 0.40, 14);
        const l1 = new THREE.Mesh(legGeo, matDarkWood); l1.position.set(-0.55, 0.20, -0.28); tableGroup.add(l1);
        const l2 = new THREE.Mesh(legGeo, matDarkWood); l2.position.set(0.55, 0.20, -0.28); tableGroup.add(l2);
        const l3 = new THREE.Mesh(legGeo, matDarkWood); l3.position.set(-0.55, 0.20, 0.28); tableGroup.add(l3);
        const l4 = new THREE.Mesh(legGeo, matDarkWood); l4.position.set(0.55, 0.20, 0.28); tableGroup.add(l4);

        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.14, 18), new THREE.MeshStandardMaterial({ color: 0xFFFDF9, roughness: 0.3 }));
        mug.position.set(-0.18, 0.50, 0);
        mug.castShadow = true;
        tableGroup.add(mug);

        this.scene.add(tableGroup);

        // 7. SOFT ROUNDED STUDY DESK, MONITOR & DOME LAMP (Back Right)
        const deskGroup = new THREE.Group();
        deskGroup.position.set(1.4, 0, -3.7);

        const deskTop = new THREE.Mesh(new RoundedBoxGeometry(2.8, 0.09, 1.25, 8, 0.042), matDeskWood);
        deskTop.position.set(0, 1.05, 0);
        deskTop.castShadow = true;
        deskGroup.add(deskTop);

        // Smooth rounded cylindrical legs (No sharp BoxGeometry!)
        const dLegGeo = new THREE.CylinderGeometry(0.045, 0.038, 1.05, 16);
        [
          [-1.25, 0.525, -0.48],
          [1.25, 0.525, -0.48],
          [-1.25, 0.525, 0.48],
          [1.25, 0.525, 0.48]
        ].forEach(([lx, ly, lz]) => {
          const dLeg = new THREE.Mesh(dLegGeo, matDarkWood);
          dLeg.position.set(lx, ly, lz);
          dLeg.castShadow = true;
          deskGroup.add(dLeg);
        });

        const drawerUnit = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.82, 0.96, 8, 0.08), matDeskWood);
        drawerUnit.position.set(0.85, 0.48, 0);
        drawerUnit.castShadow = true;
        deskGroup.add(drawerUnit);

        for (let i = 0; i < 3; i++) {
          const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.16, 8, 8), matMetalDark);
          handle.rotation.z = Math.PI * 0.5;
          handle.position.set(0.85, 0.26 + i * 0.24, 0.49);
          deskGroup.add(handle);
        }

        const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.22, 14), matMetalDark);
        monitorStand.position.set(-0.25, 1.18, -0.15);
        deskGroup.add(monitorStand);

        const monitorBase = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.03, 0.24, 6, 0.014), matMetalDark);
        monitorBase.position.set(-0.25, 1.09, -0.15);
        deskGroup.add(monitorBase);

        const monitorScreen = new THREE.Mesh(
          new RoundedBoxGeometry(1.22, 0.74, 0.06, 6, 0.03),
          new THREE.MeshStandardMaterial({
            color: 0x1E2238,
            emissive: 0x283252,
            emissiveIntensity: 0.45,
            roughness: 0.3
          })
        );
        monitorScreen.position.set(-0.25, 1.58, -0.15);
        deskGroup.add(monitorScreen);

        const lampArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.42, 10, 12), matMetalDark);
        lampArm.position.set(-1.05, 1.32, -0.15);
        lampArm.rotation.z = -0.28;
        deskGroup.add(lampArm);

        // Soft dome lampshade
        const lampShade = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
          new THREE.MeshStandardMaterial({ color: 0xF6AD55, roughness: 0.4, side: THREE.DoubleSide })
        );
        lampShade.position.set(-0.96, 1.52, -0.15);
        lampShade.rotation.z = -0.35;
        deskGroup.add(lampShade);

        this.deskLampLight = new THREE.PointLight(0xFFAA44, 1.6, 6.5, 1.4);
        this.deskLampLight.position.set(-0.95, 1.46, -0.15);
        deskGroup.add(this.deskLampLight);

        const chair = new THREE.Group();
        chair.position.set(-0.25, 0, 0.95);
        const chairSeat = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.10, 0.58, 8, 0.045), matRosePillow);
        chairSeat.position.set(0, 0.58, 0);
        chair.add(chairSeat);

        const chairBack = new THREE.Mesh(new RoundedBoxGeometry(0.54, 0.66, 0.10, 8, 0.045), matRosePillow);
        chairBack.position.set(0, 0.94, 0.24);
        chair.add(chairBack);

        const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.5, 14), matMetalDark);
        chairStem.position.set(0, 0.28, 0);
        chair.add(chairStem);
        deskGroup.add(chair);

        this.scene.add(deskGroup);

        // 8. WALL SHELVES WITH HANGING VINE, POSTERS & FAIRY LIGHTS
        const dreamTex = createDreamPosterTexture();
        const poster1 = new THREE.Mesh(
          new RoundedBoxGeometry(1.15, 1.65, 0.03, 4, 0.015),
          new THREE.MeshStandardMaterial({ map: dreamTex, roughness: 0.5 })
        );
        poster1.position.set(-2.1, 2.65, -4.56);
        this.scene.add(poster1);

        const mountainTex = createMountainPosterTexture();
        const poster2 = new THREE.Mesh(
          new RoundedBoxGeometry(1.15, 1.55, 0.03, 4, 0.015),
          new THREE.MeshStandardMaterial({ map: mountainTex, roughness: 0.5 })
        );
        poster2.position.set(-0.65, 2.6, -4.56);
        this.scene.add(poster2);

        const shelfBoard = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.07, 0.40, 6, 0.03), matDeskWood);
        shelfBoard.position.set(1.5, 2.8, -4.38);
        this.scene.add(shelfBoard);

        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.18, 18), new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.5 }));
        pot.position.set(0.6, 2.93, -4.38);
        this.scene.add(pot);

        const vineCluster = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matPlantGreen);
        vineCluster.position.set(0.6, 3.05, -4.38);
        this.scene.add(vineCluster);

        const vine1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.65, 8, 8), matPlantGreen);
        vine1.position.set(0.54, 2.6, -4.26);
        this.scene.add(vine1);

        const vine2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.45, 8, 8), matPlantGreen);
        vine2.position.set(0.66, 2.67, -4.24);
        this.scene.add(vine2);

        // Warm pastel fairy lights along the top of the back wall & right wall (Enabled in Night-Time Mode)
        const fairyPoints = [];
        for (let i = 0; i < 15; i++) {
          const ratio = i / 14;
          const fx = -4.2 + ratio * 8.6;
          const fy = 3.98 - Math.sin(ratio * Math.PI * 2) * 0.22;
          fairyPoints.push(new THREE.Vector3(fx, fy, -4.52));

          const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.062, 14, 14),
            new THREE.MeshStandardMaterial({
              color: i % 2 === 0 ? 0xFFF3B0 : 0xFFC8DD,
              emissive: i % 2 === 0 ? 0xFFD166 : 0xFFAFCC,
              emissiveIntensity: 0.22,
              roughness: 0.3
            })
          );
          bulb.position.set(fx, fy, -4.52);
          this.scene.add(bulb);
          this.fairyLightBulbs.push(bulb);

          // Add warm fairy PointLights every few bulbs to cast magical glow in Night Mode
          if (i % 3 === 1) {
            const fLight = new THREE.PointLight(i % 2 === 0 ? 0xFFD166 : 0xFFAFCC, 0.0, 5.5, 1.4);
            fLight.position.set(fx, fy - 0.05, -4.25);
            this.scene.add(fLight);
            this.fairyPointLights.push(fLight);
          }
        }

        // Smooth curved fairy light string wire
        const fairyCurve = new THREE.CatmullRomCurve3(fairyPoints);
        const wireGeo = new THREE.TubeGeometry(fairyCurve, 44, 0.008, 8, false);
        const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: 0x6D597A, roughness: 0.7 }));
        this.scene.add(wireMesh);

        // 9. ROUNDED OAK DOOR & PLUMP BEANBAG PET BED (Right Side)
        const door = new THREE.Mesh(new RoundedBoxGeometry(0.09, 2.75, 1.35, 6, 0.035), matDoorWood);
        door.position.set(5.15, 1.42, -1.2);
        this.scene.add(door);

        const doorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), matMetalDark);
        doorHandle.position.set(5.06, 1.32, -0.72);
        this.scene.add(doorHandle);

        const petBedGroup = new THREE.Group();
        petBedGroup.position.set(3.35, 0, -0.25);
        petBedGroup.rotation.y = -0.48;

        const matPouf = new THREE.MeshStandardMaterial({ color: 0xF4ACB7, roughness: 0.94 });
        const matPoufCream = new THREE.MeshStandardMaterial({ color: 0xFFF5F7, roughness: 0.94 });
        const poufMesh = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.30, 20, 36), matPouf);
        poufMesh.rotation.x = Math.PI * 0.5;
        poufMesh.position.set(0, 0.24, 0);
        poufMesh.castShadow = true;
        petBedGroup.add(poufMesh);

        const poufCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.24, 32), matPoufCream);
        poufCenter.position.set(0, 0.14, 0);
        petBedGroup.add(poufCenter);

        // Soft curved plush couch backrest bolster & side cushions on the right couch
        const couchBack = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.85, 14, 20), matPouf);
        couchBack.rotation.z = Math.PI * 0.5;
        couchBack.position.set(0, 0.54, -0.56);
        couchBack.castShadow = true;
        petBedGroup.add(couchBack);

        const couchPillow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 18), new THREE.MeshStandardMaterial({ color: 0xFDE68A, roughness: 0.92 }));
        couchPillow.scale.set(1.25, 0.75, 0.85);
        couchPillow.position.set(-0.32, 0.36, -0.28);
        couchPillow.rotation.z = -0.25;
        petBedGroup.add(couchPillow);

        const earBedL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), matPouf);
        earBedL.position.set(-0.46, 0.76, -0.58);
        petBedGroup.add(earBedL);

        const earBedR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), matPouf);
        earBedR.position.set(0.46, 0.76, -0.58);
        petBedGroup.add(earBedR);

        this.scene.add(petBedGroup);

        // 10. SOFT PLUSH TOYS IN THE ROOM (Bunny Plushie, Honey Bear Plushie, Cloud Cushions, Pastel Plush Ball)
        this.createPlushBunny(-1.85, 0, -1.55, 0.42);
        this.createPlushBear(2.30, 0, -1.65, -0.48);
        this.createCloudPlushPillow(-1.25, 0.02, 1.45, 0.35, 0xE9D5FF);
        this.createCloudPlushPillow(1.55, 0.02, 1.35, -0.30, 0xFDE68A);
      }
    }

    /* ==========================================================================
       G. MULTILINGUAL PANDA KNOWLEDGE & LANGUAGE UNDERSTANDING ENGINE
       ========================================================================== */
    const MULTILINGUAL_QA = {
      en: {
        name: "English",
        bcp47: "en-US",
        questions: {
          who: "Who are you?",
          dance: "Do a happy dance",
          food: "Favorite snack?",
          lullaby: "Sing a lullaby",
          room: "Show plant & plushies",
          secret: "Tell a sweet secret"
        },
        answers: {
          who: "*wave* Hi friend! I am Koko, your cuddly baby panda companion in the 404 Sanctuary!",
          dance: "*dance* Yay! Watch my happy bouncy baby panda dance across the big nursery!",
          food: "*slurp* I love warm honey milk, sweet red berries, and crunchy tender bamboo shoots!",
          lullaby: "*yawn* Hush little star, drift on a soft pink cloud... sweet dreams, my friend.",
          room: "*giggle* Tap my leafy green plant to hear a nature chime, or cuddle my bunny and bear plushies!",
          secret: "*coo* Whenever a webpage gets lost, I keep its happiest memories safe in my little green backpack!"
        },
        plantChime: "*chime* My leafy plant wiggled and sang a soft nature melody!",
        plushCuddle: "*squeak* So soft and squishy! I love my plushie friends!",
        defaultReply: (q) => `*coo* I heard you say "${q}"! I love chatting and playing with you in my cozy room!`
      },
      hi: {
        name: "हिन्दी / Hinglish",
        bcp47: "hi-IN",
        questions: {
          who: "तुम कौन हो?",
          dance: "प्यारा डांस दिखाओ",
          food: "तुम्हें क्या खाना पसंद है?",
          lullaby: "एक मीठी लोरी सुनाओ",
          room: "पौधा और खिलौने दिखाओ",
          secret: "एक प्यारा राज़ बताओ"
        },
        answers: {
          who: "*wave* नमस्ते दोस्त! मैं कोको हूँ, आपका प्यारा नन्हा बेबी पांडा दोस्त!",
          dance: "*dance* ये! देखो मेरा खुशियों भरा नन्हा पांडा डांस!",
          food: "*slurp* मुझे गुनगुना मीठा दूध, ताज़ी बेरी और नरम बांस की पत्तियां बहुत पसंद हैं!",
          lullaby: "*yawn* चंदा मामा आओ ना, गुलाबी बादलों की लोरी सुनाओ ना... मीठे सपने मेरे दोस्त।",
          room: "*giggle* मेरे हरे पौधे को छूकर देखो, वो हिलकर मीठी धुन बजाता है, और मेरे टेडी खिलौने बहुत नरम हैं!",
          secret: "*coo* जब इंटरनेट पर कोई पन्ना खो जाता है, मैं उसकी प्यारी यादें अपने छोटे बैग में संभाल लेता हूँ!"
        },
        plantChime: "*chime* वाह! नन्हे पौधे ने हिलकर प्रकृति की मीठी धुन सुनाई!",
        plushCuddle: "*squeak* कितना नरम और प्यारा खिलौना है!",
        defaultReply: (q) => `*coo* आपकी बात सुनकर बहुत अच्छा लगा! मैं हमेशा आपका प्यारा दोस्त कोको हूँ!`
      },
      es: {
        name: "Español",
        bcp47: "es-ES",
        questions: {
          who: "¿Quién eres tú?",
          dance: "Haz un baile feliz",
          food: "¿Comida favorita?",
          lullaby: "Canta una canción",
          room: "Planta y peluches",
          secret: "Dime un secreto"
        },
        answers: {
          who: "*wave* ¡Hola amigo! ¡Soy Koko, tu tierno bebé panda en este santuario acogedor!",
          dance: "*dance* ¡Siii! ¡Mira cómo bailo de alegría por toda mi habitación grande!",
          food: "*slurp* ¡Me encanta la leche tibia, las fresas dulces y el bambú tierno!",
          lullaby: "*yawn* Duerme estrellita en una nube suave... dulces sueños, amigo mío.",
          room: "*giggle* ¡Toca mi plantita verde para escuchar su melodía natural y mira mis suaves peluches!",
          secret: "*coo* ¡Guardo todos los recuerdos perdidos de internet dentro de mi mochilitas verde!"
        },
        plantChime: "*chime* ¡La plantita se movió y cantó una melodía suave de la naturaleza!",
        plushCuddle: "*squeak* ¡Qué peluche tan suave y abrazable!",
        defaultReply: (q) => `*coo* ¡Me encanta escucharte decir "${q}"! ¡Juguemos juntos en mi cuarto!`
      },
      fr: {
        name: "Français",
        bcp47: "fr-FR",
        questions: {
          who: "Qui es-tu ?",
          dance: "Fais une danse joyeuse",
          food: "Ton goûter préféré ?",
          lullaby: "Chante une berceuse",
          room: "Plante et peluches",
          secret: "Dis un doux secret"
        },
        answers: {
          who: "*wave* Coucou mon ami ! Je suis Koko, ton adorable petit bébé panda !",
          dance: "*dance* Youpi ! Regarde ma petite danse joyeuse sur le tapis tout doux !",
          food: "*slurp* J'adore le lait chaud au miel, les baies sucrées et le tendre bambou !",
          lullaby: "*yawn* Fais dodo petite étoile sur un nuage rose... fais de beaux rêves.",
          room: "*giggle* Touche ma plante verte pour entendre son carillon naturel et câline mes peluches !",
          secret: "*coo* Je garde précieusement les souvenirs oubliés du web dans mon petit sac à dos !"
        },
        plantChime: "*chime* Ma petite plante a frémi avec une douce mélodie de la nature !",
        plushCuddle: "*squeak* Oh, cette peluche est tellement douce !",
        defaultReply: (q) => `*coo* C'est trop mignon ce que tu dis ! Je suis ravi de discuter avec toi !`
      },
      ja: {
        name: "日本語",
        bcp47: "ja-JP",
        questions: {
          who: "あなたはだあれ？",
          dance: "ハッピーダンスして",
          food: "すきな食べ物は？",
          lullaby: "子守唄をうたって",
          room: "植物とぬいぐるみ",
          secret: "ひみつを教えて"
        },
        answers: {
          who: "*wave* こんにちは！ぼくはココ、ふわふわのお部屋に住んでいる赤ちゃんパンダだよ！",
          dance: "*dance* わーい！ぼくのハッピーダンスを見てみて！",
          food: "*slurp* あったかいミルクと甘いベリー、やわらかい竹が大好物だよ！",
          lullaby: "*yawn* ふわふわの雲の上で、お星さまと一緒におやすみなさい…いい夢みてね。",
          room: "*giggle* 緑の植物をタップすると優しい自然のチャイムが鳴るよ！うさぎとくまのぬいぐるみもふわふわだよ！",
          secret: "*coo* インターネットで迷子になった大切な思い出を、ぼくの緑のリュックにしまっているんだよ！"
        },
        plantChime: "*chime* 葉っぱがゆれて、優しい自然のメロディが鳴ったよ！",
        plushCuddle: "*squeak* ふわふわでとっても気持ちいいぬいぐるみだね！",
        defaultReply: (q) => `*coo* お話ししてくれてありがとう！ぼくと一緒にいっぱい遊ぼうね！`
      },
      ko: {
        name: "한국어",
        bcp47: "ko-KR",
        questions: {
          who: "너는 누구야?",
          dance: "신나는 춤 춰줘",
          food: "좋아하는 간식은?",
          lullaby: "자장가 불러줘",
          room: "화분이랑 인형 보여줘",
          secret: "귀여운 비밀 알려줘"
        },
        answers: {
          who: "*wave* 안녕 친구야! 나는 포근한 방에 사는 아기 판다 코코야!",
          dance: "*dance* 신난다! 내 귀여운 아기 판다 춤을 봐줘!",
          food: "*slurp* 나는 따뜻한 우유랑 달콤한 산딸기, 부드러운 대나무가 제일 좋아!",
          lullaby: "*yawn* 분홍 구름 위에서 반짝이는 별들과 함께 잘 자요, 내 친구.",
          room: "*giggle* 초록 화분을 눌러봐, 흔들리면서 예쁜 자연의 종소리가 나! 폭신한 인형들도 있어!",
          secret: "*coo* 잃어버린 웹페이지의 소중한 추억들을 내 초록 배낭 속에 안전하게 보관하고 있어!"
        },
        plantChime: "*chime* 초록 식물이 흔들리며 맑은 자연의 멜로디를 들려줬어!",
        plushCuddle: "*squeak* 정말 폭신폭신하고 귀여운 인형이야!",
        defaultReply: (q) => `*coo* 나에게 다정하게 말해줘서 고마워! 우리 재미있게 놀자!`
      },
      de: {
        name: "Deutsch",
        bcp47: "de-DE",
        questions: {
          who: "Wer bist du?",
          dance: "Mach einen Freudentanz",
          food: "Lieblingssnack?",
          lullaby: "Sing ein Schlaflied",
          room: "Pflanze & Kuscheltiere",
          secret: "Verrate ein Geheimnis"
        },
        answers: {
          who: "*wave* Hallo Freund! Ich bin Koko, dein kleiner kuscheliger Baby-Panda!",
          dance: "*dance* Juhu! Schau dir meinen fröhlichen Panda-Tanz im großen Zimmer an!",
          food: "*slurp* Ich liebe warme Honigmilch, süße Beeren und zarten Bambus!",
          lullaby: "*yawn* Schlaf kleiner Stern auf einer weichen Wolke... träum was Schönes.",
          room: "*giggle* Tippe auf meine grüne Pflanze für ein sanftes Naturglöckchen, und schau meine weichen Kuscheltiere an!",
          secret: "*coo* Ich bewahre alle verlorenen Internet-Erinnerungen sicher in meinem kleinen Rucksack auf!"
        },
        plantChime: "*chime* Die kleine Pflanze hat gewackelt und ein Naturglöckchen gespielt!",
        plushCuddle: "*squeak* So weich und kuschelig!",
        defaultReply: (q) => `*coo* Wie schön, dass du mit mir sprichst! Lass uns zusammen spielen!`
      },
      pt: {
        name: "Português",
        bcp47: "pt-BR",
        questions: {
          who: "Quem é você?",
          dance: "Faça uma dança feliz",
          food: "Lanche favorito?",
          lullaby: "Cante uma canção",
          room: "Planta e pelúcias",
          secret: "Conte um segredo"
        },
        answers: {
          who: "*wave* Oi amigo! Eu sou o Koko, seu filhotinho de panda super fofo!",
          dance: "*dance* Eba! Olha a minha dancinha feliz pelo quarto!",
          food: "*slurp* Eu adoro leitinho morno, frutinhas doces e bambu fresquinho!",
          lullaby: "*yawn* Durma bem estrelinha na nuvem macia... bons sonhos, meu amigo.",
          room: "*giggle* Toque na minha plantinha para ouvir o sino da natureza e veja meus ursinhos de pelúcia!",
          secret: "*coo* Eu guardo todas as memórias perdidas da internet na minha mochilinha verde!"
        },
        plantChime: "*chime* A plantinha balançou e tocou uma melodia suave da natureza!",
        plushCuddle: "*squeak* Que pelúcia mais fofinha e macia!",
        defaultReply: (q) => `*coo* Adorei ouvir você! Vamos brincar juntos no meu quarto aconchegante!`
      },
      ru: {
        name: "Русский",
        bcp47: "ru-RU",
        questions: {
          who: "Кто ты?",
          dance: "Станцуй весёлый танец",
          food: "Любимая еда?",
          lullaby: "Спой колыбельную",
          room: "Растение и игрушки",
          secret: "Расскажи секрет"
        },
        answers: {
          who: "*wave* Привет, друг! Я Коко, твой милый маленький медвежонок панда!",
          dance: "*dance* Ура! Посмотри, как весело я танцую в своей просторной комнате!",
          food: "*slurp* Я обожаю тёплое молочко, сладкие ягоды и нежный бамбук!",
          lullaby: "*yawn* Баю-бай, маленькая звёздочка на пушистом облачке... сладких снов!",
          room: "*giggle* Нажми на моё зелёное растение, чтобы услышать мелодию природы, и посмотри на плюшевых друзей!",
          secret: "*coo* Я бережно храню все забытые воспоминания интернета в своём зелёном рюкзачке!"
        },
        plantChime: "*chime* Растение покачнулось и прозвенело нежным колокольчиком природы!",
        plushCuddle: "*squeak* Какая мягкая и уютная плюшевая игрушка!",
        defaultReply: (q) => `*coo* Мне так приятно болтать с тобой! Давай играть вместе!`
      },
      ar: {
        name: "العربية",
        bcp47: "ar-SA",
        questions: {
          who: "من أنت؟",
          dance: "ارقص رقصة سعيدة",
          food: "طعامك المفضل؟",
          lullaby: "غنِّ تهويدة لطيفة",
          room: "النبتة والألعاب القطنية",
          secret: "أخبرني سراً لطيفاً"
        },
        answers: {
          who: "*wave* أهلاً يا صديقي! أنا كوكو، صغير الباندا اللطيف في غرفتي الدافئة!",
          dance: "*dance* يااي! شاهد رقصتي السعيدة في غرفتي الواسعة!",
          food: "*slurp* أحب الحليب الدافئ والتوت الحلو وأوراق الخيزران الطرية!",
          lullaby: "*yawn* نامي يا نجمة صغيرة فوق سحابة وردية ناعمة... أحلام سعيدة يا صديقي.",
          room: "*giggle* المس نبتتي الخضراء لتسمع رنين الطبيعة اللطيف، وشاهد ألعابي القطنية الناعمة!",
          secret: "*coo* أحتفظ بكل الذكريات الجميلة المفقودة في الإنترنت داخل حقيبتي الخضراء الصغيرة!"
        },
        plantChime: "*chime* اهتزت النبتة الصغيرة وعزفت لحن الطبيعة الهادئ!",
        plushCuddle: "*squeak* لعبة قطنية ناعمة ولطيفة جداً!",
        defaultReply: (q) => `*coo* يسعدني جداً التحدث معك يا صديقي! هيا نلعب معاً!`
      }
    };

    /* ==========================================================================
       H. MAIN APPLICATION CONTROLLER
       ========================================================================== */
    class KokoRoomApplication {
      constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.clock = new THREE.Clock();
        this.pointerNdc = new THREE.Vector2(0, 0);
        this.pointerScreen = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        // Eye-level camera perspective framing the expanded room
        this.cameraDistance = 5.4;
        this.cameraAngleH = 0.0;
        this.cameraAngleV = 0.21;
        this.cameraTarget = new THREE.Vector3(0.0, 0.92, 0.15);

        this.isOrbiting = false;
        this.orbitStartX = 0;
        this.orbitStartY = 0;
        this.isFollowingCursor = true;
        this.hasEntered = false;
        this.activeLang = 'en';

        this.initThree();
        this.initAudioAndSystems();
        this.updateResponsiveCamera();
        this.initUIEvents();
        this.animate();
      }

      initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x07080F);

        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(44, aspect, 0.1, 45);

        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        // Warm Ambient & Golden-Hour Sunlight (From Left Window)
        this.hemiLight = new THREE.HemisphereLight(0xFFEADB, 0x3A2B24, 1.18);
        this.scene.add(this.hemiLight);

        this.sunLight = new THREE.DirectionalLight(0xFFE2B2, 2.6);
        this.sunLight.position.set(-7.5, 5.2, 2.0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 1024;
        this.sunLight.shadow.mapSize.height = 1024;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 24;
        this.sunLight.shadow.camera.left = -7.5;
        this.sunLight.shadow.camera.right = 7.5;
        this.sunLight.shadow.camera.top = 7.5;
        this.sunLight.shadow.camera.bottom = -7.5;
        this.sunLight.shadow.bias = -0.0003;
        this.sunLight.shadow.radius = 3.2;
        this.scene.add(this.sunLight);

        this.fillLight = new THREE.PointLight(0xFFA57D, 0.95, 14, 1.2);
        this.fillLight.position.set(0, 3.6, 2.2);
        this.scene.add(this.fillLight);
        this.isNightMode = false;
      }

      // Toggle between Sunset Mode and Night-Time Mode (dims room lighting, enables fairy lights, starry night sky)
      setNightMode(enabled) {
        this.isNightMode = Boolean(enabled);

        if (this.isNightMode) {
          this.hemiLight.color.setHex(0x3B4C84);
          this.hemiLight.groundColor.setHex(0x141224);
          this.hemiLight.intensity = 0.42;

          this.sunLight.color.setHex(0x6E8EFF);
          this.sunLight.intensity = 0.52;

          this.fillLight.color.setHex(0xFFB38A);
          this.fillLight.intensity = 0.38;

          this.renderer.toneMappingExposure = 0.96;
        } else {
          this.hemiLight.color.setHex(0xFFEADB);
          this.hemiLight.groundColor.setHex(0x3A2B24);
          this.hemiLight.intensity = 1.18;

          this.sunLight.color.setHex(0xFFE2B2);
          this.sunLight.intensity = 2.6;

          this.fillLight.color.setHex(0xFFA57D);
          this.fillLight.intensity = 0.95;

          this.renderer.toneMappingExposure = 1.15;
        }

        if (this.room) {
          this.room.setNightMode(this.isNightMode);
        }

        // In Night Mode, make Koko sleep on the couch on the right; wake up when returning to Day Mode
        if (this.koko) {
          if (this.isNightMode) {
            if (this.koko.currentAction !== 'sleep') {
              this.koko.setAction('sleep');
            }
            document.querySelectorAll('.action-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.action === 'sleep');
            });
          } else if (this.koko.currentAction === 'sleep') {
            this.koko.setAction('walk');
            document.querySelectorAll('.action-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.action === 'walk');
            });
          }
        }

        const nightTool = document.getElementById('tool-night');
        const nightLabel = document.getElementById('tool-night-label');
        if (nightTool) nightTool.classList.toggle('active', this.isNightMode);
        if (nightLabel) nightLabel.textContent = this.isNightMode ? 'Night Mode On' : 'Night Mode';
      }

      // Automatically adapt camera distance & FOV so the expanded room and Koko fit all mobile, tablet & desktop screens
      updateResponsiveCamera() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const aspect = w / Math.max(1, h);
        this.camera.aspect = aspect;

        if (aspect < 0.56) {
          // Extra-narrow mobile portrait (320px-375px)
          this.camera.fov = 56;
          this.cameraDistance = 8.1;
        } else if (aspect < 0.75) {
          // Standard mobile portrait (376px-480px)
          this.camera.fov = 53;
          this.cameraDistance = 7.4;
        } else if (aspect < 1.05) {
          // Tablet portrait / foldable (481px-768px)
          this.camera.fov = 48;
          this.cameraDistance = 6.4;
        } else if (aspect < 1.45) {
          // Small laptop / landscape tablet (769px-1024px)
          this.camera.fov = 45;
          this.cameraDistance = 5.7;
        } else if (h < 500) {
          // Short mobile landscape viewport
          this.camera.fov = 46;
          this.cameraDistance = 5.9;
        } else {
          // Wide desktop & ultrawide (1025px-1441px+)
          this.camera.fov = 43;
          this.cameraDistance = 5.3;
        }

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }

      initAudioAndSystems() {
        this.audio = new BabyPandaAudioEngine();
        this.room = new GenuineRoom(this.scene);
        this.koko = new KokoPandaCharacter(this.audio);
        this.scene.add(this.koko.group);

        this.koko.onBumpCallback = (obstacleName) => {
          const bumpReactions = [
            "*bump* Soft boop!",
            "*bump* Oopsie! Cuddly bump!",
            "*bump* Pitter-patter boop!",
            "*tap* Booped into " + obstacleName + "!"
          ];
          const reaction = bumpReactions[Math.floor(Math.random() * bumpReactions.length)];
          this.showBubble(reaction);
        };

        this.bubble = document.getElementById('speech-bubble');
        this.bubbleText = document.getElementById('bubble-text');
      }

      showBubble(text) {
        this.bubbleText.textContent = text;
        this.bubble.classList.add('visible');
      }

      // Detect user language from script or keywords and return language code
      detectUserLanguage(text) {
        const raw = (text || '').trim();
        if (!raw) return this.activeLang || 'en';

        // Script-based detection
        if (/[\u0900-\u097F]/.test(raw)) return 'hi'; // Devanagari (Hindi)
        if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(raw)) return 'ja'; // Japanese / Kanji
        if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(raw)) return 'ko'; // Korean Hangul
        if (/[\u0400-\u04FF]/.test(raw)) return 'ru'; // Cyrillic (Russian)
        if (/[\u0600-\u06FF]/.test(raw)) return 'ar'; // Arabic

        const lower = raw.toLowerCase();
        // Hinglish keywords
        if (/\b(kya|kaun|tum|aap|kaise|kaisa|naach|lori|khana|pyaar|dost|namaste|batao|dikhao|paudha|khilona)\b/.test(lower)) {
          return 'hi';
        }
        // Spanish keywords
        if (/[¿¡ñáéíóú]/.test(lower) || /\b(hola|quién|quien|eres|bailar|baile|comida|canción|planta|secreto|amigo)\b/.test(lower)) {
          return 'es';
        }
        // French keywords
        if (/\b(bonjour|salut|qui|es-tu|danse|danser|chanson|berceuse|manger|plante|peluche)\b/.test(lower)) {
          return 'fr';
        }
        // German keywords
        if (/[äöüß]/.test(lower) || /\b(hallo|wer|bist|du|tanzen|tanz|essen|schlaflied|pflanze|geheimnis)\b/.test(lower)) {
          return 'de';
        }
        // Portuguese keywords
        if (/[ãõç]/.test(lower) || /\b(olá|ola|quem|você|voce|dança|dancar|lanche|planta|segredo)\b/.test(lower)) {
          return 'pt';
        }

        return this.activeLang || 'en';
      }

      // Match spoken voice transcript to a topic or return a warm verbal reply
      classifyIntent(text) {
        const lower = (text || '').toLowerCase();
        if (/(scarf|muffler|knit)/.test(lower)) return 'dress_scarf';
        if (/(bow|ribbon)/.test(lower)) return 'dress_bow';
        if (/(crown|flower crown|wreath|tiara)/.test(lower)) return 'dress_crown';
        if (/(peekaboo|pikachu|peek a boo)/.test(lower)) return 'secret';
        if (/(hello|hi\b|hey\b|good morning|good evening|how are you|namaste|hola|bonjour|salut|こんにちは|안녕|hallo|olá|привет|مرحبا)/.test(lower)) return 'who';
        if (/(who|name|kaun|कौन|quién|quien|qui|だあれ|だれ|누구|wer|quem|кто|من)/.test(lower)) return 'who';
        if (/(dance|naach|डांस|नाच|bail|dans|ダンス|춤|tanz|danç|танц|ارقص|happy|jump)/.test(lower)) return 'dance';
        if (/(food|eat|milk|snack|berry|hungry|khana|दूध|खाना|comid|comer|lait|goûter|食べ|ミルク|간식|우유|essen|milch|lanche|еда|молоко|طعام|حليب)/.test(lower)) return 'food';
        if (/(sleep|lullaby|sing|song|nap|tired|lori|लोरी|सोना|canción|dormir|berceuse|子守唄|ねむ|자장가|schlaflied|canção|колыбел|تهويدة)/.test(lower)) return 'lullaby';
        if (/(plant|plush|toy|room|flower|bunny|bear|paudha|पौधा|खिलौने|planta|peluche|植物|ぬいぐるみ|화분|인형|pflanze|kuschel|растен|игрушк|نبتة)/.test(lower)) return 'room';
        if (/(secret|404|story|love|cute|friend|hug|raaz|राज़|secreto|secret|ひみつ|비밀|geheimnis|segredo|секрет|سر)/.test(lower)) return 'secret';
        return null;
      }

      updateDressUpUI() {
        const activeSet = this.koko.activeAccessories;
        const statusEl = document.getElementById('dressup-status');
        const dressCircleBtn = document.getElementById('btn-circle-dressup');
        document.querySelectorAll('.dressup-btn').forEach(btn => {
          const acc = btn.dataset.accessory;
          if (acc === 'none') {
            btn.classList.toggle('active', activeSet.size === 0);
          } else {
            btn.classList.toggle('active', activeSet.has(acc));
          }
        });

        if (dressCircleBtn) {
          dressCircleBtn.classList.toggle('active', activeSet.size > 0);
        }

        if (statusEl) {
          if (activeSet.size === 0) {
            statusEl.textContent = 'Natural Fur';
          } else {
            const names = [];
            if (activeSet.has('scarf')) names.push('Scarf');
            if (activeSet.has('bow')) names.push('Bow');
            if (activeSet.has('crown')) names.push('Crown');
            statusEl.textContent = names.join(' + ');
          }
        }
      }

      // Supports boolean or explicit state: 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
      setMicUIState(stateOrBool, subtitleText) {
        const micBtn = document.getElementById('btn-verbal-mic');
        const micTitle = document.getElementById('verbal-mic-title');
        const liveStatusEl = document.getElementById('live-voice-status');
        const liveToggleLabel = document.getElementById('btn-live-session-label');
        let mode = 'idle';
        if (typeof stateOrBool === 'string') {
          mode = stateOrBool;
        } else if (stateOrBool === true) {
          mode = 'listening';
        }

        if (micBtn) {
          micBtn.classList.toggle('listening', mode === 'listening');
          micBtn.classList.toggle('processing', mode === 'processing');
          micBtn.classList.toggle('speaking', mode === 'speaking');
          micBtn.classList.toggle('error', mode === 'error');
          micBtn.setAttribute('aria-pressed', mode !== 'idle' && mode !== 'error' ? 'true' : 'false');
        }
        if (micTitle) {
          if (mode === 'listening') micTitle.textContent = 'Live Voice (Listening...)';
          else if (mode === 'processing') micTitle.textContent = 'Live Voice (Connecting...)';
          else if (mode === 'speaking') micTitle.textContent = 'Live Voice (Koko Speaking)';
          else if (mode === 'error') micTitle.textContent = 'Live Voice (Retry)';
          else micTitle.textContent = 'Live Voice';
        }
        if (liveStatusEl) {
          if (subtitleText) {
            liveStatusEl.textContent = subtitleText;
          } else if (mode === 'listening') {
            liveStatusEl.textContent = 'Live · Listening';
          } else if (mode === 'speaking') {
            liveStatusEl.textContent = 'Live · Koko Speaking';
          } else if (mode === 'processing') {
            liveStatusEl.textContent = 'Connecting...';
          } else if (mode === 'error') {
            liveStatusEl.textContent = 'Connection Error';
          } else {
            liveStatusEl.textContent = 'Ready';
          }
        }
        if (liveToggleLabel) {
          liveToggleLabel.textContent = this.isVerbalListeningActive
            ? 'End Live Conversation'
            : 'Start Live Conversation';
        }
      }

      float32ToPcm16Base64(float32Array) {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < float32Array.length; i++) {
          const s = Math.max(-1, Math.min(1, float32Array[i]));
          view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
      }

      playLivePcmChunk(base64Data) {
        if (!base64Data || this.audio.isMuted) return;
        if (!this.liveOutputAudioCtx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.liveOutputAudioCtx = new AudioCtx({ sampleRate: 24000 });
        }
        if (this.liveOutputAudioCtx.state === 'suspended') {
          this.liveOutputAudioCtx.resume().catch(() => {});
        }

        const binary = atob(base64Data);
        const sampleCount = Math.floor(binary.length / 2);
        if (sampleCount <= 0) return;

        const bytes = new Uint8Array(sampleCount * 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const view = new DataView(bytes.buffer);
        const audioBuffer = this.liveOutputAudioCtx.createBuffer(1, sampleCount, 24000);
        const channelData = audioBuffer.getChannelData(0);

        for (let i = 0; i < sampleCount; i++) {
          channelData[i] = view.getInt16(i * 2, true) / 32768.0;
        }

        const source = this.liveOutputAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.liveOutputAudioCtx.destination);

        const now = this.liveOutputAudioCtx.currentTime;
        if (!this.liveNextStartTime || this.liveNextStartTime < now) {
          this.liveNextStartTime = now + 0.02;
        }
        const startTime = this.liveNextStartTime;
        this.liveNextStartTime = startTime + audioBuffer.duration;

        if (!this.liveActiveSources) this.liveActiveSources = new Set();
        this.liveActiveSources.add(source);

        this.isKokoSpeaking = true;
        this.audio.speakingRmsBoost = true;
        this.setMicUIState('speaking', 'Live · Koko Speaking');

        source.onended = () => {
          if (this.liveActiveSources) {
            this.liveActiveSources.delete(source);
          }
          if (!this.liveActiveSources || this.liveActiveSources.size === 0) {
            this.isKokoSpeaking = false;
            this.audio.speakingRmsBoost = false;
            if (this.isVerbalListeningActive) {
              this.setMicUIState('listening', 'Live · Speak Anytime');
            } else {
              this.setMicUIState('idle', 'Ready');
            }
          }
        };

        source.start(startTime);
      }

      clearLiveAudioQueue() {
        if (this.liveActiveSources) {
          this.liveActiveSources.forEach((src) => {
            try { src.stop(); } catch (e) {}
            try { src.disconnect(); } catch (e) {}
          });
          this.liveActiveSources.clear();
        }
        this.liveNextStartTime = 0;
        this.isKokoSpeaking = false;
        this.audio.speakingRmsBoost = false;
        if (this.isVerbalListeningActive) {
          this.setMicUIState('listening', 'Live · Speak Anytime');
        }
      }

      executeLiveRoomAction(action) {
        const act = String(action || '').toLowerCase();
        if (act === 'dance') {
          this.koko.setAction('dance');
        } else if (act === 'sit') {
          this.koko.setAction('sit');
        } else if (act === 'wave') {
          this.koko.setAction('wave');
        } else if (act === 'peekaboo') {
          this.koko.setAction('peekaboo');
        } else if (act === 'walk') {
          this.koko.setAction('walk');
        } else if (act === 'sleep' || act === 'night_on') {
          this.setNightMode(true);
          this.koko.setAction('sleep');
        } else if (act === 'night_off') {
          this.setNightMode(false);
          this.koko.setAction('walk');
        } else if (act === 'wear_scarf') {
          this.koko.equipAccessory('scarf');
          this.updateDressUpUI();
          this.koko.setAction('wave');
        } else if (act === 'wear_bow') {
          this.koko.equipAccessory('bow');
          this.updateDressUpUI();
          this.koko.setAction('dance');
        } else if (act === 'wear_crown') {
          this.koko.equipAccessory('crown');
          this.updateDressUpUI();
          this.koko.setAction('wave');
        } else if (act === 'remove_accessories') {
          this.koko.equipAccessory('none');
          this.updateDressUpUI();
          this.koko.setAction('wave');
        } else if (act === 'wiggle_plant') {
          if (this.room.interactivePlants[0]) {
            this.room.triggerPlantWiggle(this.room.interactivePlants[0]);
            this.audio.playNatureChime();
          }
        } else if (act === 'bounce_plush') {
          if (this.room.plushToys[0]) {
            this.room.triggerPlushBounce(this.room.plushToys[0]);
            this.audio.playSqueak();
          }
        } else if (act === 'drink_milk') {
          this.audio.playSip();
          this.koko.setAction('sit');
        } else if (act === 'giggle') {
          this.audio.playGiggle();
          this.koko.setAction('dance');
        }
      }

      // Start real-time Gemini Live API voice conversation via WebSocket (/live) + 16kHz PCM mic capture
      async startVerbalListening() {
        this.audio.init();
        this.audio.resume();
        this.stopVerbalListening();

        this.isVerbalListeningActive = true;
        this.selectedLiveVoice = this.selectedLiveVoice || 'Puck';
        this.liveOutputTranscriptBuffer = '';
        this.liveInputTranscriptBuffer = '';
        this.setMicUIState('processing', 'Connecting Live Voice...');

        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Microphone access is not supported in this browser.');
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: 1,
              sampleRate: 16000,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });

          if (!this.isVerbalListeningActive) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          this.micMediaStream = stream;

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!this.liveOutputAudioCtx) {
            this.liveOutputAudioCtx = new AudioCtx({ sampleRate: 24000 });
          }
          if (this.liveOutputAudioCtx.state === 'suspended') {
            await this.liveOutputAudioCtx.resume().catch(() => {});
          }

          const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = `${wsProto}//${window.location.host}/live?voice=${encodeURIComponent(this.selectedLiveVoice)}`;
          const ws = new WebSocket(wsUrl);
          this.liveWs = ws;

          ws.onopen = () => {
            if (!this.isVerbalListeningActive || this.liveWs !== ws) return;
            this.setMicUIState('listening', `Live (${this.selectedLiveVoice})`);

            // Start 16kHz microphone capture & stream raw PCM chunks to Gemini Live
            const inputCtx = new AudioCtx({ sampleRate: 16000 });
            this.liveInputAudioCtx = inputCtx;
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            this.liveScriptProcessor = processor;

            const silentGain = inputCtx.createGain();
            silentGain.gain.value = 0;

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(inputCtx.destination);

            processor.onaudioprocess = (e) => {
              if (!this.isVerbalListeningActive || ws.readyState !== WebSocket.OPEN) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const base64Audio = this.float32ToPcm16Base64(inputData);
              ws.send(JSON.stringify({ audio: base64Audio }));
            };
          };

          ws.onmessage = (event) => {
            if (!this.isVerbalListeningActive || this.liveWs !== ws) return;
            try {
              const msg = JSON.parse(event.data);
              if (msg.type === 'connected') {
                this.setMicUIState('listening', `Live (${msg.voice || this.selectedLiveVoice})`);
              } else if (msg.type === 'audio' && msg.audio) {
                this.playLivePcmChunk(msg.audio);
              } else if (msg.type === 'inputTranscription' && msg.text) {
                this.liveInputTranscriptBuffer = (this.liveInputTranscriptBuffer + msg.text).trim();
                this.liveOutputTranscriptBuffer = '';
                this.showBubble(`"${this.liveInputTranscriptBuffer}"`);
              } else if (msg.type === 'outputTranscription' && msg.text) {
                this.liveInputTranscriptBuffer = '';
                this.liveOutputTranscriptBuffer = (this.liveOutputTranscriptBuffer + msg.text).trim();
                this.showBubble(this.liveOutputTranscriptBuffer);
              } else if (msg.type === 'turnComplete') {
                this.liveInputTranscriptBuffer = '';
                this.liveOutputTranscriptBuffer = '';
              } else if (msg.type === 'interrupted') {
                this.clearLiveAudioQueue();
                this.liveOutputTranscriptBuffer = '';
              } else if (msg.type === 'roomAction' && msg.action) {
                this.executeLiveRoomAction(msg.action);
              } else if (msg.type === 'error' && msg.error) {
                this.setMicUIState('error', 'Live API Error');
                this.showBubble(`Voice connection notice: ${msg.error}`);
              }
            } catch (err) {
              console.error('Error parsing Live WS message:', err);
            }
          };

          ws.onerror = () => {
            if (this.liveWs === ws && this.isVerbalListeningActive) {
              this.setMicUIState('error', 'Connection Error');
            }
          };

          ws.onclose = () => {
            if (this.liveWs === ws && this.isVerbalListeningActive) {
              this.stopVerbalListening();
            }
          };
        } catch (err) {
          this.isVerbalListeningActive = false;
          this.setMicUIState('error', 'Mic Unavailable');
          this.showBubble('Please allow microphone access to start a live voice conversation with Koko!');
        }
      }

      stopVerbalListening() {
        this.isVerbalListeningActive = false;
        this.isProcessingPrompt = false;
        this.clearLiveAudioQueue();

        if (this.liveScriptProcessor) {
          try {
            this.liveScriptProcessor.onaudioprocess = null;
            this.liveScriptProcessor.disconnect();
          } catch (e) {}
          this.liveScriptProcessor = null;
        }

        if (this.liveInputAudioCtx) {
          try {
            this.liveInputAudioCtx.close();
          } catch (e) {}
          this.liveInputAudioCtx = null;
        }

        if (this.liveWs) {
          const ws = this.liveWs;
          this.liveWs = null;
          try {
            ws.close();
          } catch (e) {}
        }

        if (this.micMediaStream) {
          try {
            this.micMediaStream.getTracks().forEach((track) => track.stop());
          } catch (e) {}
          this.micMediaStream = null;
        }

        this.setMicUIState('idle', 'Ready');
      }

      initUIEvents() {
        window.addEventListener('resize', () => {
          this.updateResponsiveCamera();
        });

        // Accessible Mobile Navigation Drawer (Landing Page)
        const btnMobileNav = document.getElementById('btn-mobile-nav');
        const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
        const closeMobileNav = () => {
          if (mobileNavDrawer && btnMobileNav) {
            mobileNavDrawer.classList.remove('open');
            btnMobileNav.setAttribute('aria-expanded', 'false');
          }
        };
        if (btnMobileNav && mobileNavDrawer) {
          btnMobileNav.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !mobileNavDrawer.classList.contains('open');
            mobileNavDrawer.classList.toggle('open', willOpen);
            btnMobileNav.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          });
          mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
              closeMobileNav();
            });
          });
        }

        // Pointer Movement & Walking across the expanded room
        window.addEventListener('pointermove', (e) => {
          this.pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
          this.pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
          this.pointerScreen.set(e.clientX, e.clientY);

          if (this.isOrbiting) {
            const dx = e.clientX - this.orbitStartX;
            const dy = e.clientY - this.orbitStartY;
            this.orbitStartX = e.clientX;
            this.orbitStartY = e.clientY;
            this.cameraAngleH -= dx * 0.0055;
            this.cameraAngleV = THREE.MathUtils.clamp(this.cameraAngleV + dy * 0.0045, 0.05, 0.85);
          } else if (this.hasEntered && this.isFollowingCursor && this.koko.currentAction === 'walk') {
            this.raycaster.setFromCamera(this.pointerNdc, this.camera);
            const hits = this.raycaster.intersectObjects(this.room.floorMeshes, true);
            if (hits.length > 0) {
              const pt = hits[0].point;
              const clampedX = THREE.MathUtils.clamp(pt.x, -4.4, 4.4);
              const clampedZ = THREE.MathUtils.clamp(pt.z, -3.7, 3.1);
              this.koko.walkTo(clampedX, clampedZ);
            }
          }
        });

        const popoverDressup = document.getElementById('popover-dressup');
        const popoverCare = document.getElementById('popover-care');
        const popoverLiveVoice = document.getElementById('popover-live-voice');
        const btnCircleDressup = document.getElementById('btn-circle-dressup');
        const btnCircleCare = document.getElementById('btn-circle-care');
        const verbalMicBtn = document.getElementById('btn-verbal-mic');

        const closeLeftPopovers = () => {
          if (popoverDressup) popoverDressup.classList.remove('open');
          if (popoverCare) popoverCare.classList.remove('open');
          if (popoverLiveVoice) popoverLiveVoice.classList.remove('open');
          if (btnCircleDressup) btnCircleDressup.setAttribute('aria-expanded', 'false');
          if (btnCircleCare) btnCircleCare.setAttribute('aria-expanded', 'false');
          if (verbalMicBtn) verbalMicBtn.setAttribute('aria-expanded', 'false');
        };

        if (btnCircleDressup && popoverDressup) {
          btnCircleDressup.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !popoverDressup.classList.contains('open');
            closeLeftPopovers();
            if (willOpen) {
              popoverDressup.classList.add('open');
              btnCircleDressup.setAttribute('aria-expanded', 'true');
            }
          });
        }

        if (btnCircleCare && popoverCare) {
          btnCircleCare.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !popoverCare.classList.contains('open');
            closeLeftPopovers();
            if (willOpen) {
              popoverCare.classList.add('open');
              btnCircleCare.setAttribute('aria-expanded', 'true');
            }
          });
        }

        // Click anywhere in room (Interactive Plant, Plush Toys, Koko, or Floor)
        window.addEventListener('click', (e) => {
          if (!e.target.closest('#mobile-nav-drawer') && !e.target.closest('#btn-mobile-nav')) {
            closeMobileNav();
          }
          if (!e.target.closest('.left-circle-item')) {
            closeLeftPopovers();
          }
          if (!this.hasEntered) return;
          if (e.target.closest('.interactive') || e.target.closest('.fourie-landing-portal')) return;

          this.pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
          this.pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;

          this.raycaster.setFromCamera(this.pointerNdc, this.camera);

          // 1. Check if clicked on the 3D Interactive Plant -> Wiggle & play soft nature chime!
          const plantHits = this.raycaster.intersectObjects(this.room.plantHitboxes, true);
          if (plantHits.length > 0) {
            let obj = plantHits[0].object;
            while (obj && !obj.userData.plantRecord) obj = obj.parent;
            const record = obj ? obj.userData.plantRecord : this.room.interactivePlants[0];
            this.room.triggerPlantWiggle(record);
            this.audio.playNatureChime();
            const pack = MULTILINGUAL_QA[this.activeLang] || MULTILINGUAL_QA.en;
            this.showBubble(pack.plantChime);
            return;
          }

          // 2. Check if clicked on any Soft 3D Plush Toy -> Squish bounce & cute squeak!
          const plushHits = this.raycaster.intersectObjects(this.room.plushHitboxes, true);
          if (plushHits.length > 0) {
            let obj = plushHits[0].object;
            while (obj && !obj.userData.toyRecord) obj = obj.parent;
            const toyRecord = obj ? obj.userData.toyRecord : this.room.plushToys[0];
            this.room.triggerPlushBounce(toyRecord);
            this.audio.playSqueak();
            const pack = MULTILINGUAL_QA[this.activeLang] || MULTILINGUAL_QA.en;
            this.showBubble(pack.plushCuddle);
            return;
          }

          // 3. Check if clicked on Koko Panda directly
          const pandaHits = this.raycaster.intersectObjects(this.koko.hitboxes, true);
          if (pandaHits.length > 0) {
            this.audio.playGiggle();
            this.koko.setAction('dance');
            this.showBubble("*giggle* That tickles!");
            return;
          }

          // 4. Otherwise walk to clicked spot on the spacious floor
          const floorHits = this.raycaster.intersectObjects(this.room.floorMeshes, true);
          if (floorHits.length > 0) {
            const pt = floorHits[0].point;
            const clampedX = THREE.MathUtils.clamp(pt.x, -4.4, 4.4);
            const clampedZ = THREE.MathUtils.clamp(pt.z, -3.7, 3.1);
            this.koko.walkTo(clampedX, clampedZ);
          }
        });

        // ======================================================================
        // GEMINI LIVE API VOICE CONVERSATION CONTROLLER (Circular Mic Button)
        // ======================================================================
        this.selectedLiveVoice = 'Puck';

        if (verbalMicBtn) {
          verbalMicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPopoverOpen = popoverLiveVoice && popoverLiveVoice.classList.contains('open');
            closeLeftPopovers();

            if (!this.isVerbalListeningActive) {
              if (popoverLiveVoice) {
                popoverLiveVoice.classList.add('open');
                verbalMicBtn.setAttribute('aria-expanded', 'true');
              }
              this.startVerbalListening();
              this.showBubble("*listening* Gemini Live Voice active! Speak to me in any language!");
            } else if (!isPopoverOpen && popoverLiveVoice) {
              popoverLiveVoice.classList.add('open');
              verbalMicBtn.setAttribute('aria-expanded', 'true');
            } else {
              this.stopVerbalListening();
              this.showBubble("Live voice conversation paused. Tap the Mic button whenever you want to talk!");
            }
          });
        }

        const btnLiveSessionToggle = document.getElementById('btn-live-session-toggle');
        if (btnLiveSessionToggle) {
          btnLiveSessionToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isVerbalListeningActive) {
              this.stopVerbalListening();
              this.showBubble("Live voice conversation ended. Tap Start Live Conversation anytime!");
            } else {
              this.startVerbalListening();
              this.showBubble("*listening* Gemini Live Voice active! Speak to me in any language!");
            }
          });
        }

        document.querySelectorAll('.live-voice-select').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const voice = btn.dataset.voice || 'Puck';
            this.selectedLiveVoice = voice;
            document.querySelectorAll('.live-voice-select').forEach((b) => {
              b.classList.toggle('active', b.dataset.voice === voice);
            });
            if (this.isVerbalListeningActive) {
              this.startVerbalListening();
              this.showBubble(`*coo* Switched Koko's live voice to ${voice}! Say hello!`);
            } else {
              this.showBubble(`*coo* Selected ${voice} voice! Tap Start Live Conversation to talk!`);
            }
          });
        });

        // ======================================================================
        // FOURIE 404 SANCTUARY: NORMAL LANDING PAGE & IN-ROOM CONTROLLER
        // ======================================================================
        const landingPortal = document.getElementById('landing-portal');
        const soundboxStatusText = document.getElementById('soundbox-status-text');

        // Sound triggers for soundbox & story cards
        document.querySelectorAll('.card-audio-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio.init();
            this.audio.resume();
            const snd = btn.dataset.sound;
            const label = btn.dataset.label;
            if (soundboxStatusText && label) {
              soundboxStatusText.textContent = label;
            }
            if (snd === 'stardust') this.audio.playStardust();
            else if (snd === 'dialup') this.audio.playDialupBeep();
            else if (snd === 'lullaby') this.audio.playLullabyChime();
            else if (snd === 'giggle') this.audio.playGiggle();
            else if (snd === 'sip') this.audio.playSip();
          });
        });

        // Hero Art Card Tap Trigger (Plays Baby Giggle)
        const heroArtCard = document.getElementById('hero-art-card');
        if (heroArtCard) {
          heroArtCard.addEventListener('click', () => {
            this.audio.init();
            this.audio.resume();
            this.audio.playGiggle();
            if (soundboxStatusText) {
              soundboxStatusText.textContent = "Playing Baby Fourie's happy giggle";
            }
          });
        }

        // Header Audio Controls
        const btnNavMusic = document.getElementById('btn-nav-music');
        if (btnNavMusic) {
          btnNavMusic.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPlaying = this.audio.toggleMusic();
            btnNavMusic.classList.toggle('active', isPlaying);
          });
        }

        const btnNavSound = document.getElementById('btn-nav-sound');
        if (btnNavSound) {
          btnNavSound.addEventListener('click', (e) => {
            e.stopPropagation();
            const isMuted = !this.audio.isMuted;
            this.audio.setMute(isMuted);
            btnNavSound.classList.toggle('active', !isMuted);
          });
        }

        // Room Entrance: Transition to Koko's 3D Room & start Gemini Live voice session
        const triggerEnterRoom = () => {
          this.hasEntered = true;
          closeMobileNav();
          this.audio.init();
          this.audio.resume();
          this.audio.playPortalChime();

          landingPortal.classList.add('hidden');
          this.canvas.classList.remove('blurred');

          setTimeout(() => {
            document.getElementById('ui-overlay').style.opacity = '1';
            const pack = MULTILINGUAL_QA[this.activeLang] || MULTILINGUAL_QA.en;
            this.koko.setAction('wave');
            this.showBubble(pack.answers.who);
            this.startVerbalListening();
          }, 600);
        };

        // Wire up all 'Let's visit Koko's room' buttons
        document.querySelectorAll('.btn-enter-room').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerEnterRoom();
          });
        });

        // In-Room Return to Story Button
        const btnBackStory = document.getElementById('btn-back-to-story');
        if (btnBackStory) {
          btnBackStory.addEventListener('click', () => {
            this.hasEntered = false;
            this.stopVerbalListening();
            closeLeftPopovers();
            document.getElementById('ui-overlay').style.opacity = '0';
            this.canvas.classList.add('blurred');
            landingPortal.classList.remove('hidden');
          });
        }

        // Top Right Tickle Button (if present)
        const btnTopTickle = document.getElementById('btn-top-tickle');
        if (btnTopTickle) {
          btnTopTickle.addEventListener('click', () => {
            this.audio.playGiggle();
            this.koko.setAction('dance');
            this.showBubble("*giggle* That tickles!");
          });
        }

        window.addEventListener('keydown', (e) => {
          if (e.code === 'Escape') {
            closeLeftPopovers();
            closeMobileNav();
            return;
          }
          if (e.code === 'Space' && this.hasEntered && !e.target.closest('button')) {
            e.preventDefault();
            this.audio.playGiggle();
            this.koko.setAction('dance');
            this.showBubble("*giggle* Giggles!");
          }
        });

        // Left Circular Action Buttons (Walk, Happy Dance, Sit Down, Cute Wave, Peekaboo)
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLeftPopovers();
            actionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const act = btn.dataset.action;
            this.koko.setAction(act);

            if (act === 'dance') this.showBubble("*dance* Look at my happy dance!");
            else if (act === 'sit') this.showBubble("*sit* Resting comfortably on the soft rug.");
            else if (act === 'wave') this.showBubble("*wave* Hello there, friend!");
            else if (act === 'peekaboo') this.showBubble("*peekaboo* Here I am!");
            else if (act === 'walk') this.showBubble("*patter* Walking together across the spacious floor.");
          });
        });

        // Koko's Dress-Up Menu Buttons (3D Plush Scarf, Bow, Flower Crown)
        document.querySelectorAll('.dressup-btn[data-accessory]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audio.init();
            this.audio.resume();
            const acc = btn.dataset.accessory;
            const isEquipped = this.koko.toggleAccessory(acc);
            this.updateDressUpUI();

            if (acc === 'none') {
              this.audio.playCoo();
              this.koko.setAction('wave');
              this.showBubble("*coo* Back to my fluffy natural fur!");
            } else if (acc === 'scarf') {
              this.audio.playSqueak();
              this.koko.setAction('wave');
              this.showBubble(isEquipped
                ? "*coo* Yay! My tiny knitted scarf feels so warm and cozy!"
                : "*coo* Took off my knitted scarf!");
            } else if (acc === 'bow') {
              this.audio.playGiggle();
              this.koko.setAction('dance');
              this.showBubble(isEquipped
                ? "*giggle* Look at my soft plush ribbon bow!"
                : "*coo* Took off my plush bow!");
            } else if (acc === 'crown') {
              this.audio.playNatureChime();
              this.koko.setAction('wave');
              this.showBubble(isEquipped
                ? "*chime* I love my pastel flower crown!"
                : "*coo* Took off my flower crown!");
            }
          });
        });

        // Right Column Tools
        document.getElementById('tool-voice').addEventListener('click', () => {
          const isMuted = !this.audio.isMuted;
          this.audio.setMute(isMuted);
          if (isMuted) {
            this.clearLiveAudioQueue();
          }
          document.getElementById('tool-voice').classList.toggle('active', !isMuted);
          this.showBubble(isMuted ? "Baby sounds muted" : "Baby sounds enabled");
          if (!isMuted) this.audio.playGiggle();
        });

        document.getElementById('tool-expressions').addEventListener('click', () => {
          this.audio.playGiggle();
          this.showBubble("*giggle* Tickles and smiles!");
        });

        document.getElementById('tool-follow').addEventListener('click', () => {
          this.isFollowingCursor = !this.isFollowingCursor;
          document.getElementById('tool-follow').classList.toggle('active', this.isFollowingCursor);
          this.showBubble(this.isFollowingCursor ? "Following cursor enabled" : "Click floor to walk");
        });

        const toolNight = document.getElementById('tool-night');
        if (toolNight) {
          toolNight.addEventListener('click', () => {
            this.audio.init();
            this.audio.resume();
            const nextNight = !this.isNightMode;
            this.setNightMode(nextNight);
            if (nextNight) {
              this.audio.playLullabyChime();
              this.showBubble("*yawn* Night-time mode! Sleeping cozily on my couch on the right under the fairy lights... zzz");
            } else {
              this.audio.playStardust();
              this.showBubble("*giggle* Golden sunset mode is back! Good morning!");
            }
          });
        }

        document.getElementById('tool-room').addEventListener('click', () => {
          this.isOrbiting = !this.isOrbiting;
          document.getElementById('tool-room').classList.toggle('active', this.isOrbiting);
          this.canvas.style.cursor = this.isOrbiting ? 'grabbing' : 'default';
        });

        // Koko Baby Care Buttons
        const careStatus = document.getElementById('care-status');
        document.querySelectorAll('.care-btn[data-care]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const care = btn.dataset.care;
            if (btnCircleCare) btnCircleCare.classList.add('active');
            if (care === 'milk') {
              this.audio.playSip();
              this.koko.setAction('sit');
              this.showBubble("*slurp* Delicious warm milk!");
              if (careStatus) careStatus.textContent = "Full & Content";
            } else if (care === 'tickle') {
              this.audio.playGiggle();
              this.koko.setAction('dance');
              this.showBubble("*giggle* Hehehe! That tickles!");
              if (careStatus) careStatus.textContent = "Giggling Joyfully";
            } else if (care === 'berry') {
              this.audio.playSip();
              this.koko.setAction('walk');
              this.showBubble("*munch* Sweet fresh berries!");
              if (careStatus) careStatus.textContent = "Tasting Sweet Berries";
            } else if (care === 'toy') {
              this.audio.playSqueak();
              this.koko.setAction('dance');
              if (this.room.plushToys[0]) this.room.triggerPlushBounce(this.room.plushToys[0]);
              this.showBubble("*squeak* Playing with my soft plushie toys!");
              if (careStatus) careStatus.textContent = "Playing with Plushies";
            } else if (care === 'lullaby') {
              this.setNightMode(true);
              this.audio.playYawn();
              this.koko.setAction('sleep');
              this.showBubble("*yawn* Soft lullaby under the starry sky... sweet dreams.");
              if (careStatus) careStatus.textContent = "Dreaming Peacefully";
            } else if (care === 'hug') {
              this.audio.playCoo();
              this.koko.setAction('wave');
              this.showBubble("*coo* Warm gentle panda hug!");
              if (careStatus) careStatus.textContent = "Feeling Loved & Happy";
            }
          });
        });
      }

      updateBubbleAnchor() {
        if (!this.bubble.classList.contains('visible')) return;
        this.koko.headGroup.getWorldPosition(_v1);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        _v1.x += vw <= 540 ? 0.0 : 0.18;
        _v1.y += 0.56;
        _screenProj.copy(_v1).project(this.camera);

        const halfW = Math.min(vw * 0.46, Math.max(96, (this.bubble.offsetWidth || 200) * 0.5 + 14));
        const minX = Math.min(vw * 0.5, halfW);
        const maxX = Math.max(vw * 0.5, vw - halfW);

        const topMinY = vw <= 540 ? 115 : 88;
        const bottomReserve = vw <= 540 ? 148 : 120;
        const maxY = Math.max(topMinY + 20, vh - bottomReserve);

        const x = THREE.MathUtils.clamp((_screenProj.x * 0.5 + 0.5) * vw, minX, maxX);
        const y = THREE.MathUtils.clamp((-(_screenProj.y * 0.5) + 0.5) * vh, topMinY, maxY);
        this.bubble.style.left = `${Math.round(x)}px`;
        this.bubble.style.top = `${Math.round(y)}px`;
      }

      animate() {
        requestAnimationFrame(() => this.animate());
        const dt = Math.min(this.clock.getDelta(), 0.05);
        const time = this.clock.getElapsedTime();

        // Camera smoothly framing the expanded room and Koko (including when sleeping on the right couch)
        const targetCamX = this.cameraTarget.x + Math.sin(this.cameraAngleH) * (this.cameraDistance * Math.cos(this.cameraAngleV));
        const targetCamY = this.cameraTarget.y + Math.sin(this.cameraAngleV) * this.cameraDistance + 0.18;
        const targetCamZ = this.cameraTarget.z + Math.cos(this.cameraAngleH) * (this.cameraDistance * Math.cos(this.cameraAngleV));

        const dampCam = 1.0 - Math.exp(-dt * 5.0);
        this.camera.position.x += (targetCamX - this.camera.position.x) * dampCam;
        this.camera.position.y += (targetCamY - this.camera.position.y) * dampCam;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * dampCam;

        const followRatioX = this.camera.aspect < 0.85 ? 0.58 : 0.38;
        _v2.set(this.koko.group.position.x * followRatioX, 0.92, this.koko.group.position.z * 0.28);
        this.cameraTarget.lerp(_v2, 1.0 - Math.exp(-dt * 3.5));
        this.camera.lookAt(this.cameraTarget);

        this.room.update(dt, time);
        this.koko.update(dt, time, this.pointerNdc);

        this.renderer.render(this.scene, this.camera);
        this.updateBubbleAnchor();
      }
    }

    const _v1 = new THREE.Vector3();
    const _v2 = new THREE.Vector3();
    const _screenProj = new THREE.Vector3();

    if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => new KokoRoomApplication());
} else {
  new KokoRoomApplication();
}
