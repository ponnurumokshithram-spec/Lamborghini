import React from 'react';
import { 
  Users, 
  Palette, 
  Gauge, 
  Zap, 
  ArrowRight, 
  Volume2, 
  DollarSign, 
  CheckCircle2, 
  Flame,
  Check
} from 'lucide-react';
import { LamborghiniCar, Currency } from '../types/lamborghini';
import { playEngineRev } from '../utils/audioSynth';

interface CarGridProps {
  cars: LamborghiniCar[];
  selectedCarId: string;
  onSelectCar: (car: LamborghiniCar) => void;
  currency: Currency;
}

export const CarGrid: React.FC<CarGridProps> = ({
  cars,
  selectedCarId,
  onSelectCar,
  currency,
}) => {
  const formatPrice = (car: LamborghiniCar) => {
    switch (currency) {
      case 'EUR':
        return car.startingPrice.formattedEUR;
      case 'GBP':
        return car.startingPrice.formattedGBP;
      case 'USD':
      default:
        return car.startingPrice.formattedUSD;
    }
  };

  const handleQuickRev = (e: React.MouseEvent, car: LamborghiniCar) => {
    e.stopPropagation();
    playEngineRev(car.id);
  };

  return (
    <div id="car-selection-grid" className="w-full mb-10">
      
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/10 gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] font-light text-orange-500 mb-1">
            Current Lineup & Flagships
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
            Select A Lamborghini Model
          </h2>
        </div>
        <p className="text-xs text-gray-400 max-w-sm">
          Click any model to load its 3D interactive model above and explore its full engineering specifications, pricing, seats, and color catalog below.
        </p>
      </div>

      {/* 3-Column Sleek Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => {
          const isSelected = car.id === selectedCarId;

          return (
            <div
              key={car.id}
              onClick={() => onSelectCar(car)}
              className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden border backdrop-blur-md ${
                isSelected
                  ? 'bg-white/5 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)] border-b-4'
                  : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20 border-b-4 border-b-transparent'
              }`}
            >
              <div>
                {/* Top Badge & Sound Trigger */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-orange-500 text-black' : 'bg-white/10 text-gray-300'
                  }`}>
                    {car.badge}
                  </span>

                  <button
                    onClick={(e) => handleQuickRev(e, car)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-orange-400 border border-white/10 hover:border-orange-500/40 transition-colors cursor-pointer"
                    title={`Hear ${car.name} Engine Rev Note`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Car Title & Subtitle */}
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  {isSelected ? 'SELECTED MODEL' : 'FLAGSHIP'}
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-white group-hover:text-orange-400 transition-colors">
                  {car.name.replace('Lamborghini ', '')}
                </h3>
                <p className="text-orange-500 font-mono tracking-widest text-xs mb-4">
                  {car.subtitle}
                </p>

                {/* Quick Spec Highlights Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-5 p-3.5 rounded-xl bg-black/50 border border-white/10">
                  
                  {/* Price */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-orange-400" /> Price
                    </span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {formatPrice(car)}
                    </div>
                  </div>

                  {/* Seating */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3 text-orange-400" /> Seats
                    </span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {car.seats.count} {car.seats.count === 2 ? 'Seats' : 'Seats (4/5 opt)'}
                    </div>
                  </div>

                  {/* Max Power & Engine */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-orange-400" /> Max Power
                    </span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {car.id === 'revuelto' ? '1,015 CV' : (car.id === 'temerario' ? '920 CV' : '800 CV')}
                    </div>
                  </div>

                  {/* 0-100 km/h */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-orange-400" /> 0-100 km/h
                    </span>
                    <div className="text-sm font-bold text-orange-400 font-mono mt-0.5">
                      {car.performance.acceleration0_100}
                    </div>
                  </div>
                </div>

                {/* Engine Type Summary Tag */}
                <div className="mb-4 text-xs text-gray-300 font-mono bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-gray-500 uppercase text-[10px] block mb-0.5">Engine Architecture:</span>
                  <span className="font-semibold text-white">{car.engineSummary.type}</span>
                </div>

                {/* Colors Preview Pill */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400 flex items-center gap-1 text-[11px] font-mono">
                      <Palette className="w-3.5 h-3.5 text-orange-400" /> {car.totalColorsCount}+ Colors Available
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {car.featuredColors.slice(0, 6).map((c, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-gray-500 pl-1">
                      +{car.totalColorsCount - 6} more
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <button
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    : 'bg-white/5 text-gray-300 hover:bg-orange-500 hover:text-black border border-white/10 hover:border-orange-500'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Currently Viewing</span>
                  </>
                ) : (
                  <>
                    <span>Select & View Full Specs</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
