import { LamborghiniCar } from '../types/lamborghini';

export const LAMBORGHINI_CARS: LamborghiniCar[] = [
  {
    id: 'temerario',
    name: 'Lamborghini Temerario',
    subtitle: 'The All-New 10,000 RPM V8 Twin-Turbo HPEV',
    tagline: 'You Can’t Hide Who You Are',
    badge: 'NEW • 10,000 RPM V8 HPEV',
    badgeColor: 'from-amber-500 to-orange-600',
    startingPrice: {
      USD: 357621,
      EUR: 350000,
      GBP: 298000,
      formattedUSD: '$357,621',
      formattedEUR: '€350,000',
      formattedGBP: '£298,000',
      priceNote: 'Base MSRP excluding destination and personalization. Typical specification with Alleggerita Package: ~$420,000+'
    },
    seats: {
      count: 2,
      description: '2 Seats (Sport Bucket Seats / Heated Power Comfort Seats)',
      configurations: [
        'Lightweight Carbon Fiber Sport Seats (Alleggerita spec)',
        '18-way Electrically Adjustable Heated Comfort Seats with Memory',
        'Corsa Race Seats with 4-point Harness capability'
      ]
    },
    colorsCountDescription: 'Over 400+ Ad Personam exterior combinations & 2 bespoke launch colors',
    totalColorsCount: 400,
    featuredColors: [
      { name: 'Blu Marinus', hex: '#134e7a', category: 'Launch', finish: 'Matt', description: 'Exclusive launch matte cobalt blue created specially for Temerario' },
      { name: 'Verde Mercurius', hex: '#7fb92b', category: 'Launch', finish: 'Pearl', description: 'Electric acid green metallic highlighting aerodynamic edges' },
      { name: 'Giallo Auge', hex: '#f0c000', category: 'Sport', finish: 'Gloss', description: 'Iconic Lamborghini vibrant racing yellow' },
      { name: 'Rosso Bia', hex: '#8a0f1a', category: 'Sport', finish: 'Metallic', description: 'Deep lustrous Italian racing ruby metallic' },
      { name: 'Nero Noctis', hex: '#0f0f10', category: 'Sport', finish: 'Gloss', description: 'Deep glossy pitch black' },
      { name: 'Nero Nemesis', hex: '#1c1d1e', category: 'Sport Matt', finish: 'Matt', description: 'Stealth tactical matte black' },
      { name: 'Bianco Monocerus', hex: '#f4f5f7', category: 'Classica', finish: 'Gloss', description: 'Pure glacier solid white' },
      { name: 'Grigio Telesto', hex: '#5b6166', category: 'Contemporary', finish: 'Gloss', description: 'Iconic solid battleship grey' },
      { name: 'Arancio Apodis', hex: '#e85d04', category: 'Sport', finish: 'Pearl', description: 'Vibrant fiery solar pearl orange' },
      { name: 'Viola Pasifae', hex: '#481d6d', category: 'Eclectic', finish: 'Metallic', description: 'Deep royal metallic amethyst purple' },
      { name: 'Verde Gea', hex: '#4f5d4e', category: 'Contemporary', finish: 'Matt', description: 'Earthy metallic satin sage green' },
      { name: 'Blu Uranus', hex: '#00a6c0', category: 'Contemporary', finish: 'Metallic', description: 'Brilliant metallic Caribbean turquoise' },
      { name: 'Grigio Lynx', hex: '#3d4147', category: 'Classica', finish: 'Metallic', description: 'High-flake metallic dark titanium' },
      { name: 'Rosso Mars', hex: '#c8102e', category: 'Sport', finish: 'Gloss', description: 'Classic vivid Bolognese sport scarlet' },
      { name: 'Oro Elios', hex: '#bfa15f', category: 'Ad Personam', finish: 'Pearl', description: 'Exclusive pearlescent liquid champagne gold' }
    ],
    engineSummary: {
      type: '4.0-liter 90° Twin-Turbo Flat-Plane V8 + 3 Axial Flux Electric Motors (HPEV)',
      displacement: '3,995 cc',
      aspiration: 'Twin Turbochargers (Hot-V configuration, up to 2.5 bar boost)',
      electricMotors: '3 Axial Flux motors (2 front e-axle + 1 integrated in 8-speed DCT)',
      maxPowerCombined: '920 CV (907 hp / 677 kW)',
      maxPowerICE: '800 CV (789 hp) @ 9,000 - 9,750 RPM',
      maxTorque: '730 Nm @ 4,000 - 7,000 RPM (ICE) + 300 Nm (Electric)',
      maxRPM: '10,000 RPM (First-ever production supercar turbo V8 to reach 10,000 RPM)',
      specificOutput: '200 CV / Liter',
      soundCharacter: 'Screaming flat-plane acoustic resonance with active dual exhaust bypass valves'
    },
    performance: {
      acceleration0_100: '2.7 seconds',
      acceleration0_200: '7.3 seconds',
      acceleration0_60: '2.6 seconds',
      topSpeed: '343 km/h (213 mph)',
      braking100_0: '32.0 meters'
    },
    transmission: {
      type: '8-speed Dual-Clutch (DCT) transverse mounted gearbox behind engine',
      drive: 'All-Wheel Drive (Electric Front Axle + Mechanical/Electric Rear)',
      drivetrainDetails: 'Electric Torque Vectoring on front wheels + Mechanical limited-slip differential on rear'
    },
    batteryAndHybrid: {
      batteryCapacity: '3.8 kWh Lithium-Ion high-specific power pouch cells in central tunnel',
      evRange: 'Up to 10 km (6.2 miles) pure electric zero-emission Città mode',
      recharging: '7 kW AC home charging (30 mins) or 6 mins self-recharge via V8 engine / regen',
      systemVoltage: '400V high-efficiency architecture'
    },
    dimensions: {
      length: '4,706 mm (185.3 in)',
      width: '1,996 mm (78.6 in) excl. mirrors / 2,246 mm with mirrors',
      height: '1,201 mm (47.3 in)',
      wheelbase: '2,658 mm (104.6 in)',
      dryWeight: '1,690 kg (3,726 lbs) / 1,665 kg with Alleggerita Package',
      powerToWeight: '1.84 kg/CV (1.81 kg/CV with Alleggerita)',
      cargoVolume: '112 Liters front trunk (Frunk) + cabin luggage shelf behind seats'
    },
    drivingModes: [
      'Città (Pure Electric EV Drive)',
      'Strada (Daily High Comfort Hybrid)',
      'Sport (High Dynamic Fun-to-Drive & Drift Mode)',
      'Corsa (Maximum 920 CV Track Attack)',
      'Corsa Plus / ESC OFF (Unrestricted Performance & Drift Assist)'
    ],
    aerodynamics: '+103% rear downforce compared to Huracán EVO (+158% with Alleggerita Package)',
    chassis: '100% High-Resistance Aluminum spaceframe with 20% higher torsional rigidity',
    highlights: [
      'Revolutionary 10,000 RPM twin-turbo V8 engine',
      '920 CV total system power from 3 axial-flux electric motors',
      'Dual-screen telemetry system with onboard track camera & dashcam',
      'Optional lightweight Alleggerita Package shedding 25 kg with carbon aero',
      'Hexagonal daytime signature LED headlights with integrated air intakes'
    ],
    description: 'The Lamborghini Temerario marks a seismic shift in super sports car history: combining an unprecedented 10,000 RPM twin-turbo V8 with three electric motors to deliver 920 CV of pure Italian fury, lightning-fast all-wheel drive response, and unparalleled aerodynamic precision.',
    defaultColorHex: '#134e7a',
    model3DConfig: {
      bodyType: 'supercar',
      wheelType: 'sport-y',
      exhaustPosition: 'high-center'
    }
  },
  {
    id: 'urus',
    name: 'Lamborghini Urus',
    subtitle: 'The Super SUV (Urus SE Plug-in Hybrid & Urus Performante)',
    tagline: 'Unlock Any Road',
    badge: 'SUPER SUV • 800 CV HYBRID',
    badgeColor: 'from-yellow-500 to-amber-600',
    startingPrice: {
      USD: 258000,
      EUR: 260000,
      GBP: 215000,
      formattedUSD: '$258,000 - $270,000',
      formattedEUR: '€260,000 - €275,000',
      formattedGBP: '£215,000 - £230,000',
      priceNote: 'Urus SE PHEV starting ~$258,000 MSRP; Urus Performante ~$269,885; Urus S ~$237,848'
    },
    seats: {
      count: 5,
      description: '4 or 5 Seats (Standard 5-Seat Bench or 4-Seat Executive Rear Consoles)',
      configurations: [
        '5 Seats: Standard 3-passenger rear seat with 40/20/40 folding split & Isofix',
        '4 Seats: Executive 2-Seat rear layout with individual power massaging captain chairs & central console',
        '18-way ventilated & heated front seats with Q-Citura leather and Alcantara'
      ]
    },
    colorsCountDescription: 'Over 100+ colors with Ad Personam palette, 2-tone Nero Noctis roof & carbon accents',
    totalColorsCount: 120,
    featuredColors: [
      { name: 'Giallo Auge', hex: '#f3c40f', category: 'Sport', finish: 'Gloss', description: 'The hallmark Urus launch yellow that redefined the Super SUV' },
      { name: 'Verde Mantis', hex: '#59b32c', category: 'Sport', finish: 'Pearl', description: 'Luminous pearlescent mantis green with high gold undertones' },
      { name: 'Rosso Mars', hex: '#bd1026', category: 'Sport', finish: 'Gloss', description: 'Fiery racing red with deep glossy coat' },
      { name: 'Nero Helene', hex: '#111215', category: 'Classica', finish: 'Metallic', description: 'Deep metallic obsidian black with subtle silver flake' },
      { name: 'Bianco Icarus', hex: '#eff1f3', category: 'Classica', finish: 'Metallic', description: 'Brilliant arctic white metallic with subtle blue-violet crystal' },
      { name: 'Blu Eleos', hex: '#183863', category: 'Contemporary', finish: 'Metallic', description: 'Rich royal sapphire blue metallic' },
      { name: 'Arancio Borealis', hex: '#eb6112', category: 'Sport', finish: 'Pearl', description: 'Four-layer pearl orange that glows brilliantly under direct sunlight' },
      { name: 'Grigio Nimbus', hex: '#8a9199', category: 'Contemporary', finish: 'Metallic', description: 'Liquid silver grey metallic with ultra-fine grain' },
      { name: 'Blu Astraeus', hex: '#0f1d38', category: 'Classica', finish: 'Metallic', description: 'Stately dark midnight blue metallic' },
      { name: 'Marrone Alcestis', hex: '#5a3d31', category: 'Eclectic', finish: 'Metallic', description: 'Warm bronze copper brown with golden metallic reflections' },
      { name: 'Verde Viper', hex: '#00aa4f', category: 'Sport', finish: 'Gloss', description: 'High-contrast vibrant racing green' },
      { name: 'Grigio Keres', hex: '#31353a', category: 'Contemporary', finish: 'Metallic', description: 'Deep anthracite metallic with aggressive road presence' }
    ],
    engineSummary: {
      type: '4.0-liter Twin-Turbo 90° V8 (Urus SE PHEV with Permanent Magnet Electric Motor)',
      displacement: '3,996 cc',
      aspiration: 'Twin-Scroll Twin Turbochargers',
      electricMotors: 'Permanent Magnet Synchronous motor inside 8-speed transmission (Urus SE: 192 CV / 483 Nm)',
      maxPowerCombined: '800 CV (789 hp / 588 kW) in Urus SE / 666 CV in Performante & S',
      maxPowerICE: '620 CV (612 hp) @ 6,000 RPM in Urus SE (666 CV in Performante)',
      maxTorque: '950 Nm (701 lb-ft) @ 1,750 - 5,750 RPM',
      maxRPM: '6,800 RPM',
      specificOutput: '200 CV / Liter (Combined in Urus SE)',
      soundCharacter: 'Deep baritone V8 rumble with active multi-mode exhaust pops on downshifts'
    },
    performance: {
      acceleration0_100: '3.4 seconds (Urus SE) / 3.3s (Performante)',
      acceleration0_200: '11.2 seconds (Urus SE) / 11.5s (Performante)',
      acceleration0_60: '3.1 seconds',
      topSpeed: '312 km/h (194 mph) [Urus SE] / 306 km/h [Performante]',
      braking100_0: '33.5 meters (Carbon ceramic brakes 440mm front / 410mm rear)'
    },
    transmission: {
      type: '8-speed Automatic Gearbox with integrated torque converter and e-motor',
      drive: 'Permanent 4-Wheel Drive with central self-locking differential and rear torque vectoring',
      drivetrainDetails: 'Electro-hydraulic multi-plate clutch active torque vectoring with 4-wheel active rear steering'
    },
    batteryAndHybrid: {
      batteryCapacity: '25.9 kWh Lithium-Ion high-voltage battery located below load floor (Urus SE)',
      evRange: 'Over 60 km (37 miles) pure electric zero-emission range (WLTP)',
      recharging: '7.4 kW AC onboard charger (0 to 100% in ~3.5 hours) + regenerative braking',
      systemVoltage: '400V High Voltage hybrid powertrain'
    },
    dimensions: {
      length: '5,123 mm (201.7 in)',
      width: '2,022 mm (79.6 in) excl. mirrors / 2,181 mm with mirrors',
      height: '1,638 mm (64.5 in)',
      wheelbase: '3,003 mm (118.2 in)',
      dryWeight: '2,505 kg (5,522 lbs) [Urus SE] / 2,150 kg [Performante]',
      powerToWeight: '3.13 kg/CV (Urus SE)',
      cargoVolume: '616 Liters (expands to 1,596 Liters with rear seats folded down)'
    },
    drivingModes: [
      'STRADA (Comfort & Luxury daily cruising)',
      'SPORT (Dynamic rear-biased agileness)',
      'CORSA (Maximum track grip & downforce)',
      'NEVE (Snow & Ice maximum traction)',
      'TERRA (Off-road gravel & rough terrain)',
      'SABBIA (Sand dunes & loose surface)',
      'EGO (Customizable Steering, Suspension, Engine setting)'
    ],
    aerodynamics: 'Active front spoiler, rear aerodynamic roof wing, underbody air deflectors',
    chassis: 'Adaptive air suspension with active electro-mechanical 48V roll stabilization',
    highlights: [
      '800 CV Super SUV combining twin-turbo V8 with 25.9 kWh plug-in hybrid battery',
      'Over 60 km pure electric silent city range',
      'Massive 616L - 1,596L practical luxury luggage space for family & luggage',
      'Carbon ceramic 10-piston front brakes (world’s largest on a production car)',
      'Tamburo driving mode selector with 6 distinct off-road & track setups'
    ],
    description: 'The Lamborghini Urus is the world’s benchmark Super SUV. In its newest Urus SE plug-in hybrid configuration, it synthesizes 800 CV of earth-shattering power with 60 km of pure electric serenity, effortless all-terrain capability, and uncompromised Italian luxury for up to 5 occupants.',
    defaultColorHex: '#f3c40f',
    model3DConfig: {
      bodyType: 'suv',
      wheelType: 'sport-y',
      exhaustPosition: 'quad-diffuser'
    }
  },
  {
    id: 'revuelto',
    name: 'Lamborghini Revuelto',
    subtitle: 'The 1,015 CV V12 Flagship HPEV Super Sports Car',
    tagline: 'From Now On',
    badge: 'FLAGSHIP • 1,015 CV V12 HPEV',
    badgeColor: 'from-orange-500 to-red-600',
    startingPrice: {
      USD: 608358,
      EUR: 500000,
      GBP: 450000,
      formattedUSD: '$608,358+',
      formattedEUR: '€500,000+',
      formattedGBP: '£450,000+',
      priceNote: 'Starting MSRP without options. Personalization through Ad Personam typically totals $680,000 - $750,000+'
    },
    seats: {
      count: 2,
      description: '2 Seats (Carbon Fiber Monofuselage Cockpit with Y-Design Space-Age Bucket Seats)',
      configurations: [
        'Monocoque Integrated Carbon Racing Seats with Alcantara & Corsa Inlays',
        'Full Electric Heated Memory Seats with Q-Citura hexagonal stitching',
        'Ad Personam custom two-tone leather & carbon interior tailored to driver'
      ]
    },
    colorsCountDescription: 'Over 400+ Ad Personam exterior finishes (the most customizable Lamborghini in history)',
    totalColorsCount: 400,
    featuredColors: [
      { name: 'Arancio Apodis', hex: '#f05a10', category: 'Launch', finish: 'Pearl', description: 'Iconic launch color - radiant multi-coat metallic sun orange' },
      { name: 'Giallo Inti', hex: '#f5cb0c', category: 'Sport', finish: 'Pearl', description: 'Intense luminous pearlescent yellow with sharp golden highlights' },
      { name: 'Verde Scandal', hex: '#87e02b', category: 'Sport', finish: 'Gloss', description: 'Pure high-voltage acid lime green solid' },
      { name: 'Blu Uranus', hex: '#00afc7', category: 'Contemporary', finish: 'Metallic', description: 'Vibrant Mediterranean turquoise sky blue metallic' },
      { name: 'Rosso Efesto', hex: '#940f1a', category: 'Sport', finish: 'Metallic', description: 'Deep volcanic magma ruby metallic' },
      { name: 'Nero Pegaso', hex: '#121316', category: 'Classica', finish: 'Metallic', description: 'Stunning metallic deep jet black with prismatic sparkles' },
      { name: 'Bianco Monocerus', hex: '#f7f8fa', category: 'Classica', finish: 'Gloss', description: 'Pure crisp alpine glacier solid white' },
      { name: 'Grigio Artis', hex: '#63666a', category: 'Contemporary', finish: 'Matt', description: 'Aviation titanium satin matte grey' },
      { name: 'Viola Bast', hex: '#511b5e', category: 'Eclectic', finish: 'Metallic', description: 'Rich ultraviolet royal metallic purple' },
      { name: 'Verde Turbine', hex: '#374235', category: 'Sport Matt', finish: 'Matt', description: 'Tactical stealth military matte dark olive' },
      { name: 'Grigio Acheso', hex: '#3a3c40', category: 'Contemporary', finish: 'Matt', description: 'Matte dark pewter finish highlighting sharp carbon fiber edges' },
      { name: 'Tormenta Blue', hex: '#16335d', category: 'Ad Personam', finish: 'Metallic', description: 'Hyper deep electric cobalt with liquid gloss clearcoat' }
    ],
    engineSummary: {
      type: '6.5-liter Naturally Aspirated 60° Mid-Mounted V12 (L545) + 3 Axial Flux Electric Motors',
      displacement: '6,498 cc',
      aspiration: 'Naturally Aspirated (Highest revving V12 in Lamborghini history)',
      electricMotors: '3 Axial Flux electric motors (2 front oil-cooled e-axle + 1 integrated above 8-speed gearbox)',
      maxPowerCombined: '1,015 CV (1,001 hp / 746 kW)',
      maxPowerICE: '825 CV (814 hp) @ 9,250 RPM',
      maxTorque: '725 Nm @ 6,750 RPM (ICE) + 350 Nm each front electric motor',
      maxRPM: '9,500 RPM (Majestic naturally aspirated Italian V12 symphony)',
      specificOutput: '127 CV / Liter (Naturally Aspirated)',
      soundCharacter: 'Unmatched 9,500 RPM Naturally Aspirated V12 crescendo with exposed high-exit titanium exhausts'
    },
    performance: {
      acceleration0_100: '2.5 seconds',
      acceleration0_200: 'Under 7.0 seconds',
      acceleration0_60: '2.3 seconds',
      topSpeed: 'Over 350 km/h (217+ mph)',
      braking100_0: '31.0 meters (CCB Plus Carbon Ceramic Brakes 410mm / 10-piston)'
    },
    transmission: {
      type: '8-speed Dual-Clutch (DCT) mounted transversely behind the longitudinal V12',
      drive: 'Electric All-Wheel Drive (e-AWD with Torque Vectoring)',
      drivetrainDetails: 'Front electric motors provide independent wheel torque vectoring; rear motor recharges battery and boosts V12'
    },
    batteryAndHybrid: {
      batteryCapacity: '3.8 kWh High-power Lithium-Ion battery housed in central chassis tunnel',
      evRange: 'Up to 10 km (6.2 miles) pure electric zero-emission Città mode',
      recharging: '7 kW AC home charging (30 mins) or 6 mins self-recharge via V12 engine combustion',
      systemVoltage: '400V High-performance powertrain'
    },
    dimensions: {
      length: '4,947 mm (194.8 in)',
      width: '2,032 mm (80.0 in) excl. mirrors / 2,266 mm with mirrors',
      height: '1,160 mm (45.7 in)',
      wheelbase: '2,779 mm (109.4 in)',
      dryWeight: '1,772 kg (3,906 lbs)',
      powerToWeight: '1.75 kg/CV (Best power-to-weight in Lamborghini V12 history)',
      cargoVolume: 'Front luggage compartment holds 2 cabin trolley bags + parcel shelf behind seats'
    },
    drivingModes: [
      'Città (Pure Electric EV Drive, 180 CV)',
      'Strada (Everyday Hybrid Touring, 886 CV)',
      'Sport (High Excitement & Rear-biased Drift, 907 CV)',
      'Corsa (Maximum 1,015 CV Track Domination)',
      'Recharge / Hybrid / Performance Powertrain energy modes'
    ],
    aerodynamics: '+61% aerodynamic efficiency and +66% front downforce vs Aventador Ultimae with active 3-position rear wing',
    chassis: 'Forged Composites Monofuselage: Complete carbon-fiber monocoque with Forged Matrix front structure',
    highlights: [
      'First-ever V12 High Performance Electrified Vehicle (HPEV) generating 1,015 CV',
      '9,500 RPM Naturally Aspirated 6.5L V12 engine weighing only 218 kg',
      'Iconic Vertically-Opening Scissor Doors (Lamborghini signature since Countach)',
      'Exposed mid-engine bay and high-mounted hexagonal twin exhaust ports',
      'Carbon-fiber Monofuselage with 25% higher torsional stiffness than Aventador'
    ],
    description: 'The Lamborghini Revuelto is the crowning achievement of Sant’Agata Bolognese: an epoch-making 1,015 CV flagship that unites an uninhibited 9,500 RPM naturally aspirated 6.5L V12 with three cutting-edge axial-flux electric motors, iconic scissor doors, and an all-carbon Monofuselage.',
    defaultColorHex: '#f05a10',
    model3DConfig: {
      bodyType: 'flagship-v12',
      wheelType: 'v12-forged',
      exhaustPosition: 'dual-hex-center'
    }
  }
];

export const LAMBORGHINI_HERITAGE = {
  founder: 'Ferruccio Lamborghini',
  foundedYear: 1963,
  headquarters: 'Sant’Agata Bolognese, Italy',
  bullStory: 'The iconic golden Raging Bull emblem was chosen by Ferruccio Lamborghini, who was born under the Taurus zodiac sign and had a deep passion for Spanish fighting bulls (Miura, Murciélago, Gallardo, Revuelto, Temerario are all legendary brave fighting bulls).',
  motto: 'Driving Humans Beyond',
  shieldElements: [
    { title: 'The Gold Raging Bull (Toro Scatenato)', desc: 'Symbol of relentless power, unyielding determination, and charging spirit' },
    { title: 'Black & Gold Shield', desc: 'Prestige, luxury, Italian craftsmanship, and timeless racing heritage' },
    { title: 'Sant’Agata Bolognese Origin', desc: 'The historic factory in Emilia-Romagna where every Lamborghini is hand-assembled' }
  ]
};
