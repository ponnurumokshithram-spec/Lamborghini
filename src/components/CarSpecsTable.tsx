import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  Palette, 
  Zap, 
  Gauge, 
  Settings2, 
  BatteryCharging, 
  Ruler, 
  Check, 
  Sparkles, 
  Download, 
  Copy, 
  CheckCheck,
  Columns,
  Table as TableIcon
} from 'lucide-react';
import { LamborghiniCar, Currency, CarColor } from '../types/lamborghini';

interface CarSpecsTableProps {
  car: LamborghiniCar;
  allCars: LamborghiniCar[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  activeColor: CarColor;
  onColorChange: (c: CarColor) => void;
}

export const CarSpecsTable: React.FC<CarSpecsTableProps> = ({
  car,
  allCars,
  currency,
  onCurrencyChange,
  activeColor,
  onColorChange,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'engine' | 'performance' | 'colors' | 'dimensions' | 'comparison'>('all');
  const [selectedColorCategory, setSelectedColorCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const formatPrice = (targetCar: LamborghiniCar) => {
    switch (currency) {
      case 'EUR':
        return targetCar.startingPrice.formattedEUR;
      case 'GBP':
        return targetCar.startingPrice.formattedGBP;
      case 'USD':
      default:
        return targetCar.startingPrice.formattedUSD;
    }
  };

  const handleCopySpecs = () => {
    const text = `
=== ${car.name} Full Specifications ===
Subtitle: ${car.subtitle}
Price: ${formatPrice(car)} (${currency})
Seats: ${car.seats.count} seats - ${car.seats.description}
Engine: ${car.engineSummary.type}
Combined Power: ${car.engineSummary.maxPowerCombined} (ICE: ${car.engineSummary.maxPowerICE})
Max RPM: ${car.engineSummary.maxRPM}
0-100 km/h: ${car.performance.acceleration0_100}
Top Speed: ${car.performance.topSpeed}
Transmission: ${car.transmission.type}
Battery: ${car.batteryAndHybrid.batteryCapacity} (EV Range: ${car.batteryAndHybrid.evRange})
Dry Weight: ${car.dimensions.dryWeight}
Colors: ${car.colorsCountDescription}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color categories for filtering
  const colorCategories = ['All', 'Launch', 'Sport', 'Contemporary', 'Classica', 'Eclectic', 'Ad Personam'];
  const filteredColors = selectedColorCategory === 'All'
    ? car.featuredColors
    : car.featuredColors.filter(c => c.category === selectedColorCategory || (selectedColorCategory === 'Sport' && c.category === 'Sport Matt'));

  return (
    <div id="specifications-section" className="w-full bg-black/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.3em] font-light text-orange-500">
            <span>Official Factory Technical Data</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">{car.tagline}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight mt-1">
            {car.name} <span className="text-orange-500">Specifications</span>
          </h2>
        </div>

        {/* Currency Switcher & Utility Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Currency Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
            <span className="text-[10px] font-mono text-gray-400 px-2 uppercase">Currency:</span>
            {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currency === c
                    ? 'bg-orange-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Copy Specs */}
          <button
            onClick={handleCopySpecs}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-orange-500/40 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
            title="Copy technical specifications to clipboard"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span>Copy Specs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 my-6 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Full Spec Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('engine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'engine'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Engine & Powertrain</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Performance & Speed</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'colors'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors & Paint Swatches ({car.totalColorsCount}+)</span>
        </button>

        <button
          onClick={() => setActiveTab('dimensions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'dimensions'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Dimensions & Seats</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'text-orange-400 hover:bg-white/5 border border-orange-500/30'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Side-by-Side Comparison Matrix</span>
        </button>
      </div>

      {/* Main Spec Content Depending on Active Tab */}
      {activeTab === 'comparison' ? (
        /* Side-by-Side Comparison Matrix */
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3.5 px-4 text-gray-400 font-semibold uppercase tracking-wider text-[11px]">Specification Metric</th>
                {allCars.map((c) => (
                  <th
                    key={c.id}
                    className={`py-3.5 px-4 font-bold uppercase text-sm ${
                      c.id === car.id ? 'text-orange-400 bg-orange-500/10' : 'text-white'
                    }`}
                  >
                    {c.name.replace('Lamborghini ', '')}
                    {c.id === car.id && <span className="block text-[10px] text-orange-400 font-normal">(Selected)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Starting Price ({currency})</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 font-bold text-white">
                    {formatPrice(c)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Seating Capacity</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-200">
                    {c.seats.count} {c.seats.count === 2 ? 'Seats (Coupe)' : 'Seats (Super SUV)'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Engine Type & Displacement</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-200">
                    {c.engineSummary.type}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Total System Power</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 font-bold text-orange-400">
                    {c.engineSummary.maxPowerCombined}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Maximum Engine RPM</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-200 font-bold">
                    {c.engineSummary.maxRPM}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Acceleration (0-100 km/h)</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 font-bold text-emerald-400">
                    {c.performance.acceleration0_100}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Top Speed</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-white">
                    {c.performance.topSpeed}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Electrification / Hybrid System</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-300">
                    {c.batteryAndHybrid.batteryCapacity} • {c.batteryAndHybrid.evRange} EV
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Available Colors</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-300">
                    {c.colorsCountDescription}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Transmission & AWD</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-300">
                    {c.transmission.type}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-3 px-4 text-gray-400 font-medium">Dry Weight</td>
                {allCars.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-gray-300">
                    {c.dimensions.dryWeight}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : activeTab === 'colors' ? (
        /* Dedicated Colors & Swatch Explorer */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">
                {car.name} Color Catalog ({car.totalColorsCount}+ Exterior Finishes)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {car.colorsCountDescription}. Click on any paint swatch below to instantly apply it to the 3D model!
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {colorCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedColorCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedColorCategory === cat
                      ? 'bg-orange-500 text-black font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredColors.map((color) => {
              const isSelected = activeColor.name === color.name;
              return (
                <div
                  key={color.name}
                  onClick={() => onColorChange(color)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between backdrop-blur-md ${
                    isSelected
                      ? 'bg-white/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                      : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full border shadow-inner flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-white ring-2 ring-orange-500' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{color.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
                        <span>{color.category}</span>
                        <span>•</span>
                        <span className="text-orange-400">{color.finish}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-tight mb-3">
                    {color.description || 'Authentic Lamborghini factory exterior coat.'}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">HEX: {color.hex}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-orange-400' : 'text-gray-500'}`}>
                      {isSelected ? 'APPLIED TO 3D' : 'CLICK TO APPLY'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full Structured Specifications Table (Categorized) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Price & Seating */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <DollarSign className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Pricing & Seating</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Starting MSRP ({currency})</span>
                <span className="font-bold text-orange-400 text-sm">{formatPrice(car)}</span>
              </div>
              <div className="text-[11px] text-gray-500 italic pb-2">
                {car.startingPrice.priceNote}
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Number of Seats</span>
                <span className="font-bold text-white">{car.seats.count} Passengers</span>
              </div>
              <div className="py-1">
                <span className="text-gray-400 block mb-1">Seating Options:</span>
                <ul className="space-y-1 text-gray-300 list-disc list-inside text-[11px]">
                  {car.seats.configurations.map((cfg, i) => (
                    <li key={i}>{cfg}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Luggage / Cargo Volume</span>
                <span className="text-white">{car.dimensions.cargoVolume}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Engine & Powertrain */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Zap className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Engine & Powertrain</h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Engine Type</span>
                <span className="font-semibold text-white text-right max-w-[200px]">{car.engineSummary.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Displacement</span>
                <span className="text-white">{car.engineSummary.displacement}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Aspiration</span>
                <span className="text-white">{car.engineSummary.aspiration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Electric Motors</span>
                <span className="text-white text-right max-w-[200px]">{car.engineSummary.electricMotors}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Total System Output</span>
                <span className="font-bold text-orange-400 text-sm">{car.engineSummary.maxPowerCombined}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Combustion Engine Power</span>
                <span className="text-white">{car.engineSummary.maxPowerICE}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Max Torque</span>
                <span className="text-white">{car.engineSummary.maxTorque}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Max Engine Rev Limit</span>
                <span className="font-bold text-red-400">{car.engineSummary.maxRPM}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Performance & Acceleration */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <Gauge className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Performance & Dynamics</h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">0 - 100 km/h (0 - 62 mph)</span>
                <span className="font-bold text-emerald-400 text-sm">{car.performance.acceleration0_100}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">0 - 200 km/h (0 - 124 mph)</span>
                <span className="text-white font-semibold">{car.performance.acceleration0_200}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">0 - 60 mph</span>
                <span className="text-white">{car.performance.acceleration0_60}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Top Speed</span>
                <span className="font-bold text-orange-400 text-sm">{car.performance.topSpeed}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Braking Distance (100 - 0 km/h)</span>
                <span className="text-white">{car.performance.braking100_0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Transmission</span>
                <span className="text-white text-right max-w-[200px]">{car.transmission.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Drive Type</span>
                <span className="text-white">{car.transmission.drive}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Battery, Dimensions & Aerodynamics */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
              <BatteryCharging className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Electrification & Dimensions</h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">High-Voltage Battery</span>
                <span className="text-white font-semibold">{car.batteryAndHybrid.batteryCapacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">EV Zero-Emission Range</span>
                <span className="text-cyan-400 font-semibold">{car.batteryAndHybrid.evRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Charging & Energy Recovery</span>
                <span className="text-white text-right max-w-[200px]">{car.batteryAndHybrid.recharging}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Dimensions (L × W × H)</span>
                <span className="text-white text-right">{car.dimensions.length} × {car.dimensions.width} × {car.dimensions.height}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Wheelbase</span>
                <span className="text-white">{car.dimensions.wheelbase}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Dry Weight</span>
                <span className="text-white font-semibold">{car.dimensions.dryWeight}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Power-to-Weight Ratio</span>
                <span className="text-orange-400 font-bold">{car.dimensions.powerToWeight}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Model Description & Key Innovations Banner */}
      <div className="mt-8 p-5 rounded-xl bg-black/40 border border-white/10 flex flex-col md:flex-row gap-5 items-start">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" /> About the {car.name}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {car.description}
          </p>
        </div>

        <div className="w-full md:w-80 flex-shrink-0">
          <span className="text-[11px] font-mono font-bold text-orange-400 uppercase block mb-2">Key Highlights</span>
          <ul className="space-y-1.5 text-xs text-gray-300 font-mono">
            {car.highlights.map((h, i) => (
              <li key={i} className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};
