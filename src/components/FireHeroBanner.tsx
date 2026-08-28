import React, { useEffect, useRef, useState } from 'react';
import { Flame, Shield, Award, Sparkles, ChevronRight, X, Compass, Info } from 'lucide-react';
import { LAMBORGHINI_HERITAGE } from '../data/lamborghiniData';

interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  alpha: number;
}

export const FireHeroBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showHeritageModal, setShowHeritageModal] = useState(false);
  const [fireIntensity, setFireIntensity] = useState<'normal' | 'raging'>('normal');

  // Interactive Particle Fire Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: FireParticle[] = [];
    const width = canvas.width = canvas.parentElement?.clientWidth || 900;
    const height = canvas.height = canvas.parentElement?.clientHeight || 340;

    const fireColors = [
      '#ff2a00', '#ff5500', '#ff8800', '#ffbb00', '#ffd700', '#fff4b8', '#990000'
    ];

    const createParticle = (originX: number, originY: number): FireParticle => {
      const spread = (Math.random() - 0.5) * (width * 0.45);
      const isRaging = fireIntensity === 'raging';
      return {
        x: originX + spread,
        y: originY + (Math.random() * 20),
        vx: (Math.random() - 0.5) * (isRaging ? 2.5 : 1.5),
        vy: -(Math.random() * (isRaging ? 4.5 : 3.0) + (isRaging ? 2.0 : 1.2)),
        size: Math.random() * (isRaging ? 28 : 20) + (isRaging ? 10 : 6),
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: fireColors[Math.floor(Math.random() * fireColors.length)],
        alpha: Math.random() * 0.7 + 0.3
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient dark background with fiery ambient bottom glow
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0a0c');
      bgGrad.addColorStop(0.5, '#120907');
      bgGrad.addColorStop(0.9, '#300a00');
      bgGrad.addColorStop(1, '#501000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Spawn particles
      const spawnCount = fireIntensity === 'raging' ? 14 : 8;
      for (let i = 0; i < spawnCount; i++) {
        particles.push(createParticle(width / 2, height - 10));
      }

      // Update and draw particles
      ctx.globalCompositeOperation = 'screen';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.08) * 0.8;
        p.y += p.vy;
        p.size *= 0.965;

        const progress = p.life / p.maxLife;
        const currentAlpha = Math.max(0, p.alpha * (1 - progress));

        if (p.life >= p.maxLife || p.size <= 0.5 || currentAlpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        radial.addColorStop(0, p.color);
        radial.addColorStop(0.5, p.color);
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radial;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bottom intense heat bar
      const heatGrad = ctx.createLinearGradient(0, height - 60, 0, height);
      heatGrad.addColorStop(0, 'rgba(255, 120, 0, 0)');
      heatGrad.addColorStop(0.7, 'rgba(255, 60, 0, 0.45)');
      heatGrad.addColorStop(1, 'rgba(255, 200, 50, 0.85)');
      ctx.fillStyle = heatGrad;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, height - 60, width, 60);

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fireIntensity]);

  return (
    <div id="lamborghini-hero-box" className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-md mb-8">
      {/* Animated Fire Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/40 to-[#050505]/85" />
      </div>

      {/* Sleek Top Banner Status Bar */}
      <div className="relative z-10 px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-orange-200/80">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="font-mono tracking-wider uppercase font-semibold text-orange-400">Automobili Lamborghini Official Heritage</span>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">Sant’Agata Bolognese, Italy • Est. 1963</span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <button
            onClick={() => setFireIntensity(prev => prev === 'normal' ? 'raging' : 'normal')}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1.5 transition-all border cursor-pointer ${
              fireIntensity === 'raging'
                ? 'bg-orange-500 text-black font-bold border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-orange-500/50 hover:bg-white/10'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${fireIntensity === 'raging' ? 'animate-bounce text-black' : 'text-orange-400'}`} />
            <span>{fireIntensity === 'raging' ? 'Raging Fire Active 🔥' : 'Ignite Raging Fire'}</span>
          </button>

          <button
            onClick={() => setShowHeritageModal(true)}
            className="px-3 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-orange-400 border border-white/10 flex items-center space-x-1 transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Logo & Bull Details</span>
          </button>
        </div>
      </div>

      {/* Main Flanked Content: Left Lambo + Centered Golden Shield in Box + Right Lambo */}
      <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Flank: Lamborghini Temerario Silhouette / Visual */}
        <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>NEW 10,000 RPM HPEV</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">
            Lamborghini <span className="text-cyan-400">Temerario</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
            920 CV Twin-Turbo V8 HPEV with 3 electric axial-flux motors and high-revving 10k RPM symphony.
          </p>

          {/* Left Car SVG Vector Profile */}
          <div className="mt-4 w-full max-w-[240px] h-20 relative flex items-center justify-center group cursor-pointer">
            <svg viewBox="0 0 300 90" className="w-full h-full filter drop-shadow-[0_10px_15px_rgba(0,140,255,0.3)] transition-transform duration-300 group-hover:scale-105">
              <defs>
                <linearGradient id="lamboBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e6b9e" />
                  <stop offset="50%" stopColor="#0d3b66" />
                  <stop offset="100%" stopColor="#05192d" />
                </linearGradient>
                <linearGradient id="glowCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0077ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Sleek Aerodynamic Supercar Silhouette Facing Right towards Logo */}
              <path d="M 285 62 L 265 52 L 210 40 L 155 30 L 110 32 L 65 48 L 25 58 L 10 65 L 15 72 L 45 74 C 48 64 62 64 65 74 L 205 74 C 208 64 222 64 225 74 L 285 72 Z" fill="url(#lamboBlue)" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Cockpit Canopy */}
              <path d="M 175 32 L 135 32 L 105 44 L 180 42 Z" fill="#080c14" stroke="#0284c7" strokeWidth="1" />
              {/* Y-shaped LED Headlight */}
              <polygon points="280,60 270,58 274,62 265,63" fill="#38bdf8" className="animate-pulse" />
              <circle cx="282" cy="61" r="3" fill="#ffffff" />
              {/* Hexagonal Wheels */}
              <circle cx="55" cy="72" r="14" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="55" cy="72" r="7" fill="#27272a" />
              <circle cx="215" cy="72" r="14" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="215" cy="72" r="7" fill="#27272a" />
              {/* Ground Shadow & Aero Glow */}
              <ellipse cx="145" cy="84" rx="130" ry="4" fill="url(#glowCyan)" />
            </svg>
            <div className="absolute -bottom-1 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20">
              TEMERARIO HPEV
            </div>
          </div>
        </div>

        {/* Center: The Golden Lamborghini Shield Crest In Detail Box */}
        <div className="relative flex-shrink-0 flex flex-col items-center justify-center order-1 md:order-2 my-2">
          
          {/* Sleek Box Frame with Orange Glow & Backdrop Blur */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/15 shadow-[0_0_40px_rgba(249,115,22,0.25)] flex flex-col items-center text-center max-w-[290px] backdrop-blur-xl group hover:border-orange-500/40 transition-all duration-300">
            
            {/* Fire Eruption Aura Behind Logo */}
            <div className="absolute -top-6 w-36 h-36 bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* High-Resolution Vector Lamborghini Bull Shield */}
            <div className="relative w-28 h-32 sm:w-32 sm:h-36 mb-3 filter drop-shadow-[0_12px_24px_rgba(212,175,55,0.5)] transform transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 200 240" className="w-full h-full">
                <defs>
                  {/* Shield Outer Gold Gradient */}
                  <linearGradient id="shieldGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff2a3" />
                    <stop offset="30%" stopColor="#d4af37" />
                    <stop offset="70%" stopColor="#997a15" />
                    <stop offset="100%" stopColor="#e5c158" />
                  </linearGradient>
                  {/* Shield Inner Dark Texture */}
                  <linearGradient id="shieldDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1e24" />
                    <stop offset="40%" stopColor="#0a0a0c" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  {/* Bull Gold Shimmer */}
                  <linearGradient id="bullGold" x1="0%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#fff8cc" />
                    <stop offset="35%" stopColor="#e6ca65" />
                    <stop offset="65%" stopColor="#c59b27" />
                    <stop offset="100%" stopColor="#87650e" />
                  </linearGradient>
                </defs>

                {/* Outer Shield Border */}
                <path
                  d="M 10 15 L 190 15 L 190 145 C 190 190, 130 225, 100 238 C 70 225, 10 190, 10 145 Z"
                  fill="url(#shieldGoldBorder)"
                  stroke="#ffd700"
                  strokeWidth="3"
                />

                {/* Inner Shield Black Body */}
                <path
                  d="M 18 23 L 182 23 L 182 143 C 182 182, 126 215, 100 226 C 74 215, 18 182, 18 143 Z"
                  fill="url(#shieldDark)"
                  stroke="#5e4c16"
                  strokeWidth="1.5"
                />

                {/* Top Gold Typography Banner Box */}
                <rect x="22" y="27" width="156" height="34" fill="#0c0d10" rx="3" stroke="#b38f29" strokeWidth="1" />
                
                {/* LAMBORGHINI Inscription */}
                <text
                  x="100"
                  y="50"
                  fill="url(#shieldGoldBorder)"
                  fontFamily="'Cinzel', 'Trajan Pro', 'Helvetica Neue', sans-serif"
                  fontSize="15"
                  fontWeight="900"
                  letterSpacing="2.5"
                  textAnchor="middle"
                  style={{ textTransform: 'uppercase', fontStyle: 'italic' }}
                >
                  LAMBORGHINI
                </text>

                {/* The Legendary Charging Bull (Toro Scatenato) Vector */}
                <g transform="translate(32, 68) scale(0.68)">
                  {/* Bull Silhouette & Anatomy */}
                  <path
                    d="M 160 30 C 150 20, 135 15, 120 18 C 115 10, 100 0, 85 5 C 80 12, 85 20, 90 28 C 80 32, 70 40, 65 52 C 60 62, 50 72, 35 78 C 25 82, 10 75, 0 85 C 15 90, 30 92, 45 88 C 48 100, 42 118, 38 135 C 36 142, 45 145, 50 140 C 60 125, 68 108, 75 92 C 90 92, 105 95, 118 90 C 122 108, 128 128, 132 148 C 135 155, 145 152, 144 142 C 140 120, 135 98, 132 78 C 145 70, 160 55, 168 38 C 172 30, 168 28, 160 30 Z"
                    fill="url(#bullGold)"
                    stroke="#fff"
                    strokeWidth="0.5"
                  />
                  {/* Charging Front Legs & Muscular Shoulder */}
                  <path
                    d="M 125 45 C 140 50, 155 70, 165 95 C 170 108, 185 130, 192 145 C 196 152, 205 148, 202 140 C 192 115, 178 85, 160 65 C 150 55, 135 48, 125 45 Z"
                    fill="url(#bullGold)"
                  />
                  {/* Curved Lethal Horns */}
                  <path
                    d="M 88 20 C 75 10, 60 0, 45 2 C 55 12, 68 18, 80 24 Z"
                    fill="#ffffff"
                    stroke="#d4af37"
                    strokeWidth="1"
                  />
                  <path
                    d="M 102 16 C 98 6, 88 -2, 75 0 C 82 8, 92 14, 100 20 Z"
                    fill="#ffffff"
                    stroke="#d4af37"
                    strokeWidth="1"
                  />
                  {/* Tail Whipping High with Ferocity */}
                  <path
                    d="M 18 80 C 10 70, 5 50, 12 35 C 18 25, 28 20, 32 10 C 25 15, 15 28, 8 45 C 2 60, 6 78, 18 80 Z"
                    fill="url(#bullGold)"
                  />
                </g>

                {/* Sub-Shield Details */}
                <circle cx="100" cy="195" r="3" fill="#d4af37" />
                <path d="M 85 200 L 115 200" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>

            {/* Emblem Labeling */}
            <div className="w-full">
              <span className="inline-block text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                IL TORO SCATENATO
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide mt-0.5">
                The Raging Bull Emblem
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-tight">
                Embodying ferocious power, courage, & Sant’Agata Bolognese DNA
              </p>
            </div>

            {/* Quick Details Pills Inside Center Box */}
            <div className="grid grid-cols-2 gap-1.5 w-full mt-3 pt-2.5 border-t border-white/10 text-[10px] text-gray-300 font-mono">
              <div className="bg-white/5 px-2 py-1 rounded border border-white/10">
                <span className="text-gray-500">Zodiac:</span> Taurus ♉
              </div>
              <div className="bg-white/5 px-2 py-1 rounded border border-white/10">
                <span className="text-gray-500">Origin:</span> 1963 Italy
              </div>
            </div>

            {/* Inspect Crest Button */}
            <button
              onClick={() => setShowHeritageModal(true)}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Full Crest Specs</span>
            </button>
          </div>
        </div>

        {/* Right Flank: Lamborghini Revuelto Silhouette / Visual */}
        <div className="flex-1 w-full flex flex-col items-center md:items-end text-center md:text-right order-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>V12 FLAGSHIP 1,015 CV</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">
            Lamborghini <span className="text-orange-500">Revuelto</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
            1,015 CV naturally aspirated 6.5L V12 HPEV with iconic scissor doors & carbon Monofuselage.
          </p>

          {/* Right Car SVG Vector Profile (Facing Left towards Logo) */}
          <div className="mt-4 w-full max-w-[240px] h-20 relative flex items-center justify-center group cursor-pointer">
            <svg viewBox="0 0 300 90" className="w-full h-full filter drop-shadow-[0_10px_15px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-105">
              <defs>
                <linearGradient id="lamboOrange" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#9a3412" />
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>
                <linearGradient id="glowOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Sleek V12 Wedge Supercar Silhouette Facing Left towards Logo */}
              <path d="M 15 62 L 35 52 L 90 40 L 145 30 L 190 32 L 235 48 L 275 58 L 290 65 L 285 72 L 255 74 C 252 64 238 64 235 74 L 95 74 C 92 64 78 64 75 74 L 15 72 Z" fill="url(#lamboOrange)" stroke="#fb923c" strokeWidth="1.5" />
              {/* Scissor Door Canopy & Cockpit */}
              <path d="M 125 32 L 165 32 L 195 44 L 120 42 Z" fill="#0f0907" stroke="#ea580c" strokeWidth="1" />
              {/* Y-shaped LED Headlight pointing left */}
              <polygon points="20,60 30,58 26,62 35,63" fill="#f97316" className="animate-pulse" />
              <circle cx="18" cy="61" r="3" fill="#ffffff" />
              {/* Forged Racing Wheels */}
              <circle cx="85" cy="72" r="14" fill="#18181b" stroke="#f97316" strokeWidth="2" />
              <circle cx="85" cy="72" r="7" fill="#27272a" />
              <circle cx="245" cy="72" r="14" fill="#18181b" stroke="#f97316" strokeWidth="2" />
              <circle cx="245" cy="72" r="7" fill="#27272a" />
              {/* Ground Shadow & Aero Glow */}
              <ellipse cx="155" cy="84" rx="130" ry="4" fill="url(#glowOrange)" />
            </svg>
            <div className="absolute -bottom-1 text-[10px] font-mono text-orange-400/80 bg-black/60 px-2 py-0.5 rounded border border-orange-500/20">
              REVUELTO V12
            </div>
          </div>
        </div>

      </div>

      {/* Heritage & Logo Detail Modal */}
      {showHeritageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-black/90 border border-white/15 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Shield className="w-7 h-7 text-orange-500" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">The Lamborghini Shield & Crest Anatomy</h3>
                  <p className="text-xs text-gray-400 font-mono">Automobili Lamborghini S.p.A. • Historic Symbol Breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setShowHeritageModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story & History */}
            <div className="my-6 space-y-4 text-sm text-gray-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-orange-400 font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Ferruccio Lamborghini & The Taurus Origin (1963)
                </h4>
                <p className="text-xs sm:text-sm text-gray-300">{LAMBORGHINI_HERITAGE.bullStory}</p>
              </div>

              <h4 className="text-base font-bold text-white pt-2">Symbolic Elements in the Crest:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LAMBORGHINI_HERITAGE.shieldElements.map((el, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <span className="text-xs font-bold text-orange-400 font-mono">{el.title}</span>
                    <p className="text-xs text-gray-400 mt-2">{el.desc}</p>
                  </div>
                ))}
              </div>

              {/* Models named after fighting bulls */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h5 className="text-xs font-mono uppercase font-bold text-orange-400 mb-2">Fighting Bull Lineage in Today’s Showcase:</h5>
                <ul className="text-xs space-y-2 text-gray-300 font-mono">
                  <li><strong className="text-cyan-400">Temerario:</strong> Named after a heroic, fierce fighting bull celebrated for immense courage and unyielding spirit.</li>
                  <li><strong className="text-yellow-400">Urus:</strong> Named after the colossal, powerful ancestral wild bull (Aurochs) known for commanding size and dominance.</li>
                  <li><strong className="text-orange-400">Revuelto:</strong> Named after an unruly, revolutionary Spanish fighting bull in Barcelona in 1880, symbolizing Lamborghini’s rebel DNA.</li>
                </ul>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowHeritageModal(false)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                Close Heritage Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
