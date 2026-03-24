export type Unit = {
  id: string;
  type: string;
  size: number;
  variant: number;
  title: string;
  image: string;
  url?: string;
  price_wood?: number;
  price_steel?: number;
  hashtags?: string[];
};

export type UnitTypeGroup = Record<string, Unit[]>;
