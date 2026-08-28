import React, { useState } from 'react';
import { 
  Flame, 
  Shield, 
  Car, 
  Table as TableIcon, 
  Volume2, 
  DollarSign, 
  RotateCw, 
  Sparkles,
  ChevronDown,
  Layers,
  Compass
} from 'lucide-react';
import { LAMBORGHINI_CARS } from './data/lamborghiniData';
import { LamborghiniCar, Currency, CarColor } from './types/lamborghini';
import { FireHeroBanner } from './components/FireHeroBanner';
import { Car3DViewer } from './components/Car3DViewer';
import { CarGrid } from './components/CarGrid';
import { CarSpecsTable } from './components/CarSpecsTable';

export default function App() {
  const [selectedCar, setSelectedCar] = useState<LamborghiniCar>(LAMBORGHINI_CARS[0]); // Default: Temerario
  const [activeColor, setActiveColor] = useState<CarColor>(LAMBORGHINI_CARS[0].featuredColors[0]);
  const [currency, setCurrency] = useState<Currency>('USD');

  const handleSelectCar = (car: LamborghiniCar) => {
    setSelectedCar(car);
    setActiveColor(car.featuredColors[0]);

    // Scroll smoothly to 3D studio view
    const studioEl = document.getElementById('3d-car-studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleColorChange = (color: CarColor) => {
    setActiveColor(color);
  };

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-orange-500 selection:text-black relative overflow-x-hidden"
      style={{ background: 'radial-gradient(circle at 50% 20%, #1a1a1a 0%, #080808 60%, #020202 100%)' }}
    >
      {/* Sleek Ambient Bottom Glow */}
      <div 
        className="fixed inset-x-0 bottom-0 h-96 pointer-events-none opacity-30 z-0"
        style={{ background: 'linear-gradient(0deg, #f97316 0%, #7c2d12 35%, transparent 100%)', filter: 'blur(60px)' }}
      />

      {/* Aerodynamic Sleek Corner Accents */}
      <div className="pointer-events-none fixed top-12 left-6 opacity-20 transform -rotate-12 w-64 h-32 border-l-4 border-t-4 border-orange-500 rounded-tl-[120px] hidden md:block z-0" />
      <div className="pointer-events-none fixed top-12 right-6 opacity-20 transform rotate-12 w-64 h-32 border-r-4 border-t-4 border-orange-500 rounded-tr-[120px] hidden md:block z-0" />

      {/* Top Luxury Sleek Header */}
      <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-11 bg-[#d4af37] flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
                <path d="M12 .5L4 4v11.5l8 8 8-8V4L12 .5zM12 18l-3-4 1.5-1h3l1.5 1-3 4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xs uppercase tracking-[0.45em] font-light text-gray-300">
                LAMBORGHINI <span className="text-orange-500 font-medium">INTELLIGENCE</span>
              </h1>
              <p className="text-[10px] font-mono text-gray-500 tracking-wider">
                TEMERARIO • URUS SE • REVUELTO
              </p>
            </div>
          </div>

          {/* Quick Model Selector in Navbar */}
          <div className="hidden md:flex items-center space-x-1.5 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {LAMBORGHINI_CARS.map((car) => {
              const isSelected = selectedCar.id === car.id;
              return (
                <button
                  key={car.id}
                  onClick={() => handleSelectCar(car)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {car.name.replace('Lamborghini ', '')}
                </button>
              );
            })}
          </div>

          {/* Currency Toggle in Nav */}
          <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-xl border border-white/10 text-xs font-mono backdrop-blur-md">
            <span className="text-gray-500 text-[10px] hidden sm:inline tracking-wider">CURRENCY:</span>
            {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                  currency === c ? 'bg-orange-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* 1. Fire Background Box with Lamborghini Logo & Flanked Cars */}
        <FireHeroBanner />

        {/* 2. 3D Interactive Model Visualizer */}
        <div id="3d-car-studio" className="w-full">
          <Car3DViewer
            selectedCar={selectedCar}
            activeColor={activeColor}
            onColorChange={handleColorChange}
          />
        </div>

        {/* 3. Grid View of Cars */}
        <CarGrid
          cars={LAMBORGHINI_CARS}
          selectedCarId={selectedCar.id}
          onSelectCar={handleSelectCar}
          currency={currency}
        />

        {/* 4. Full Specifications Table */}
        <CarSpecsTable
          car={selectedCar}
          allCars={LAMBORGHINI_CARS}
          currency={currency}
          onCurrencyChange={setCurrency}
          activeColor={activeColor}
          onColorChange={handleColorChange}
        />

      </main>

      {/* Sleek Footer */}
      <footer className="relative z-10 mt-20 border-t border-white/10 bg-black/60 backdrop-blur-xl py-8 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Lamborghini Intelligence & Specifications Portal. Sant'Agata Bolognese.</p>
          <div className="flex items-center space-x-4 text-gray-400 text-[11px]">
            <span>Sant’Agata Bolognese, Italy</span>
            <span>•</span>
            <span className="text-orange-500 font-semibold">10,000 RPM V8 & 1,015 CV V12 HPEV Flagships</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
