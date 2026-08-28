export type CarId = 'temerario' | 'urus' | 'revuelto';

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CarColor {
  name: string;
  code?: string;
  hex: string;
  category: 'Launch' | 'Sport' | 'Sport Matt' | 'Contemporary' | 'Eclectic' | 'Classica' | 'Ad Personam';
  finish: 'Metallic' | 'Matt' | 'Gloss' | 'Pearl';
  description?: string;
}

export interface SpecificationCategory {
  categoryName: string;
  iconName: string;
  specs: {
    label: string;
    value: string;
    highlight?: boolean;
    unit?: string;
    note?: string;
  }[];
}

export interface LamborghiniCar {
  id: CarId;
  name: string;
  subtitle: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  startingPrice: {
    USD: number;
    EUR: number;
    GBP: number;
    formattedUSD: string;
    formattedEUR: string;
    formattedGBP: string;
    priceNote: string;
  };
  seats: {
    count: number;
    description: string;
    configurations: string[];
  };
  colorsCountDescription: string;
  totalColorsCount: number;
  featuredColors: CarColor[];
  engineSummary: {
    type: string;
    displacement: string;
    aspiration: string;
    electricMotors: string;
    maxPowerCombined: string;
    maxPowerICE: string;
    maxTorque: string;
    maxRPM: string;
    specificOutput: string;
    soundCharacter: string;
  };
  performance: {
    acceleration0_100: string;
    acceleration0_200: string;
    acceleration0_60: string;
    topSpeed: string;
    braking100_0: string;
  };
  transmission: {
    type: string;
    drive: string;
    drivetrainDetails: string;
  };
  batteryAndHybrid: {
    batteryCapacity: string;
    evRange: string;
    recharging: string;
    systemVoltage: string;
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    dryWeight: string;
    powerToWeight: string;
    cargoVolume: string;
  };
  drivingModes: string[];
  aerodynamics: string;
  chassis: string;
  highlights: string[];
  description: string;
  defaultColorHex: string;
  model3DConfig: {
    bodyType: 'supercar' | 'suv' | 'flagship-v12';
    wheelType: 'sport-y' | 'aerodisc' | 'v12-forged';
    exhaustPosition: 'high-center' | 'quad-diffuser' | 'dual-hex-center';
  };
}
