// Mathematical utilities for options calculations

export function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function erf(x: number): number {
  // Abramowitz & Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function formatIndianNumber(n: number): string {
  const isNegative = n < 0;
  const s = Math.round(Math.abs(n)).toString();
  if (s.length <= 3) return (isNegative ? "-" : "") + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (isNegative ? "-" : "") + rest + "," + last3;
}

export function formatINR(n: number): string {
  return "₹" + formatIndianNumber(n);
}

export function formatPercent(n: number, decimals: number = 2): string {
  return n.toFixed(decimals) + "%";
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

export interface CalculationInputs {
  spot: number;
  strike: number;
  premium: number;
  iv: number;
  days: number;
  lotSize: number;
  lots: number;
  zTail: number;
}

export interface CalculationResults {
  oneSigma: number;
  zScore: number;
  probProfit: number;
  probLoss: number;
  units: number;
  maxProfit: number;
  tailPrice: number;
  maxLoss: number;
  ev: number;
  ratio: number;
  sigmaLevels: { level: number; price: number }[];
}

export function calculateEV(inputs: CalculationInputs): CalculationResults {
  const { spot, strike, premium, iv, days, lotSize, lots, zTail } = inputs;

  const timeFraction = days / 365;
  const oneSigma = spot * (iv / 100) * Math.sqrt(timeFraction);
  const zScore = (strike - spot) / oneSigma;
  const probProfit = normalCDF(zScore);
  const probLoss = 1 - probProfit;
  const units = lotSize * lots;
  const maxProfit = premium * units;
  const tailPrice = spot + zTail * oneSigma;
  const maxLoss = (tailPrice - strike - premium) * units;
  const ev = probProfit * maxProfit - probLoss * Math.abs(maxLoss);
  const ratio = maxProfit > 0 ? Math.abs(maxLoss) / maxProfit : 0;

  const sigmaLevels = [1, 2, 3, 4].map((level) => ({
    level,
    price: Math.round(spot + level * oneSigma),
  }));

  return {
    oneSigma,
    zScore,
    probProfit,
    probLoss,
    units,
    maxProfit,
    tailPrice,
    maxLoss,
    ev,
    ratio,
    sigmaLevels,
  };
}
