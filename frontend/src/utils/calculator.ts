import benchmarksData from '../data/benchmarks.json';

export interface CalculatorInputs {
  annualRevenue: number;
  debtorDays: number;
  creditorDays: number;
  employees: number;
  cashOnHand: number;
  averageBankBalance: number;
  currentDebtors: number;
  currentCreditors: number;
  industry: string;
  grossMargin?: number;
  netMargin?: number;
  ebitda?: number;
  debtorDaysDelta?: number;
  creditorDaysDelta?: number;
  revenueGrowth?: number;
  inventoryTurns?: number;
  benchmarkMode?: 'sme' | 'listed';
}

export interface CashCoverage {
  days: number;
  covered: boolean;
  gap: number;
}

export interface CalculatorResults {
  revenuePerEmployee: number;
  industryBenchmark: number;
  benchmarkDelta: number;
  netWorkingCapital: number;
  cashUnlockDirection: 'positive' | 'negative' | 'neutral';
  cashUnlockGuidance: string;
  // New cash flow analysis
  coverage: CashCoverage[];
  cashNeedForOps: number;
  cashNeedForGrowth: number;
  unlock90: number;
  unlock12m: number;
  unlockDays: number;
  talkingPoints: string[];
}

export interface IndustryBenchmark {
  industry: string;
  revenuePerEmployee: number;
  debtorDays: number;
  creditorDays: number;
  inventoryTurns?: number;
}

// Calculate revenue per employee
export function revenuePerEmployee(annualRevenue: number, employees: number): number {
  if (employees <= 0) return 0;
  return annualRevenue / employees;
}

// Estimate Net Working Capital
export function estimateNWC(
  annualRevenue: number,
  debtorDays: number,
  creditorDays: number,
  inventoryTurns?: number
): number {
  const dailyRevenue = annualRevenue / 365;
  const debtorBalance = dailyRevenue * debtorDays;
  const creditorBalance = dailyRevenue * creditorDays;
  
  let inventoryBalance = 0;
  if (inventoryTurns && inventoryTurns > 0) {
    inventoryBalance = dailyRevenue * (365 / inventoryTurns);
  }
  
  return debtorBalance + inventoryBalance - creditorBalance;
}

// Apply sensitivity adjustments
export function applySensitivity(
  baseValue: number,
  delta: number,
  minValue: number = 0,
  maxValue: number = 180
): number {
  const adjusted = baseValue + delta;
  return Math.max(minValue, Math.min(maxValue, adjusted));
}

// Calculate daily cash flows
export function calculateDailyFlows(inputs: CalculatorInputs): {
  dailyOutflow: number;
  dailyInflow: number;
  dailyPayables: number;
} {
  const { annualRevenue, netMargin = 0.1, currentDebtors, debtorDays, currentCreditors, creditorDays } = inputs;
  
  // Daily outflow based on net margin
  const dailyOutflow = (annualRevenue * (1 - netMargin / 100)) / 365;
  
  // Daily inflow from debtors (rough average collections per day)
  const dailyInflow = currentDebtors / debtorDays;
  
  // Daily payables outflow
  const dailyPayables = currentCreditors / creditorDays;
  
  return { dailyOutflow, dailyInflow, dailyPayables };
}

// Calculate cash coverage for different time horizons
export function calculateCashCoverage(inputs: CalculatorInputs): CashCoverage[] {
  const { cashOnHand, averageBankBalance } = inputs;
  const { dailyOutflow, dailyInflow, dailyPayables } = calculateDailyFlows(inputs);
  
  const currentLiquidity = cashOnHand + averageBankBalance;
  const netDailyFlow = dailyInflow - dailyPayables - dailyOutflow;
  
  const horizons = [30, 60, 90, 120, 180];
  
  return horizons.map(days => {
    const projectedNet = currentLiquidity + (days * netDailyFlow);
    const covered = projectedNet >= 0;
    const gap = covered ? 0 : Math.abs(projectedNet);
    
    return { days, covered, gap };
  });
}

// Calculate cash injection needs
export function calculateCashInjectionNeeds(inputs: CalculatorInputs): {
  cashNeedForOps: number;
  cashNeedForGrowth: number;
} {
  const coverage = calculateCashCoverage(inputs);
  
  // Cash need for current operations (max gap across all horizons)
  const cashNeedForOps = Math.max(0, ...coverage.map(c => c.gap));
  
  // Cash need for growth (simplified calculation)
  const { annualRevenue, revenueGrowth = 0 } = inputs;
  const growthRevenue = annualRevenue * (1 + revenueGrowth / 100);
  const { dailyOutflow } = calculateDailyFlows(inputs);
  const growthDailyOutflow = (growthRevenue * (1 - (inputs.netMargin || 10) / 100)) / 365;
  const growthDeltaPerDay = growthDailyOutflow - dailyOutflow;
  const cashNeedForGrowth = Math.max(0, 90 * growthDeltaPerDay);
  
  return { cashNeedForOps, cashNeedForGrowth };
}

// Calculate working capital unlock potential
export function calculateWorkingCapitalUnlock(inputs: CalculatorInputs): {
  unlock90: number;
  unlock12m: number;
  unlockDays: number;
} {
  const { annualRevenue, debtorDays, creditorDays, debtorDaysDelta = 0, creditorDaysDelta = 0 } = inputs;
  
  const adjustedDebtorDays = Math.max(0, debtorDays + debtorDaysDelta);
  const adjustedCreditorDays = Math.max(0, creditorDays + creditorDaysDelta);
  
  const dailyRevenue = annualRevenue / 365;
  const currentNWC = (dailyRevenue * adjustedDebtorDays) - (dailyRevenue * adjustedCreditorDays);
  const baselineNWC = (dailyRevenue * debtorDays) - (dailyRevenue * creditorDays);
  
  const unlock90 = (baselineNWC - currentNWC) * (90 / 365);
  const unlock12m = baselineNWC - currentNWC;
  const unlockDays = Math.abs(unlock90 / dailyRevenue);
  
  return { unlock90, unlock12m, unlockDays };
}

// Generate talking points
export function generateTalkingPoints(inputs: CalculatorInputs, results: CalculatorResults): string[] {
  const points: string[] = [];
  
  if (results.cashNeedForOps > 0) {
    points.push(`Immediate cash injection of ${formatCurrency(results.cashNeedForOps)} needed to sustain operations`);
  }
  
  if (results.cashNeedForGrowth > 0) {
    points.push(`Growth funding of ${formatCurrency(results.cashNeedForGrowth)} required for ${inputs.revenueGrowth || 0}% growth`);
  }
  
  if (results.unlock90 > 0) {
    points.push(`Working capital optimization could unlock ${formatCurrency(results.unlock90)} in 90 days`);
  }
  
  if (results.benchmarkDelta > 0) {
    points.push(`Revenue per employee ${Math.abs(results.benchmarkDelta).toFixed(0)}% above industry average`);
  } else if (results.benchmarkDelta < 0) {
    points.push(`Revenue per employee ${Math.abs(results.benchmarkDelta).toFixed(0)}% below industry average`);
  }
  
  return points;
}

// Main computation function
export function compute(inputs: CalculatorInputs): CalculatorResults {
  const { annualRevenue, debtorDays, creditorDays, employees, industry } = inputs;
  
  // Calculate revenue per employee
  const rpe = revenuePerEmployee(annualRevenue, employees);
  
  // Get industry benchmark (simplified - in real app would come from benchmarks.json)
  const industryBenchmark = getIndustryBenchmark(industry);
  
  // Calculate benchmark delta
  const benchmarkDelta = rpe - industryBenchmark;
  
  // Apply sensitivity adjustments if provided
  const adjustedDebtorDays = inputs.debtorDaysDelta 
    ? applySensitivity(debtorDays, inputs.debtorDaysDelta, 0, 180)
    : debtorDays;
  
  const adjustedCreditorDays = inputs.creditorDaysDelta
    ? applySensitivity(creditorDays, inputs.creditorDaysDelta, 0, 180)
    : creditorDays;
  
  // Calculate Net Working Capital
  const nwc = estimateNWC(annualRevenue, adjustedDebtorDays, adjustedCreditorDays, inputs.inventoryTurns);
  
  // Determine cash unlock direction and guidance
  const { direction, guidance } = getCashUnlockGuidance(nwc, inputs.cashOnHand);
  
  // Calculate new cash flow analysis
  const coverage = calculateCashCoverage(inputs);
  const { cashNeedForOps, cashNeedForGrowth } = calculateCashInjectionNeeds(inputs);
  const { unlock90, unlock12m, unlockDays } = calculateWorkingCapitalUnlock(inputs);
  
  // Create initial results for talking points generation
  const initialResults: CalculatorResults = {
    revenuePerEmployee: rpe,
    industryBenchmark,
    benchmarkDelta,
    netWorkingCapital: nwc,
    cashUnlockDirection: direction,
    cashUnlockGuidance: guidance,
    coverage,
    cashNeedForOps,
    cashNeedForGrowth,
    unlock90,
    unlock12m,
    unlockDays,
    talkingPoints: [],
  };
  
  // Generate talking points
  const talkingPoints = generateTalkingPoints(inputs, initialResults);
  
  return {
    ...initialResults,
    talkingPoints,
  };
}

// Get industry benchmark
function getIndustryBenchmark(industry: string): number {
  const data = benchmarksData as Record<string, any>;
  const benchmark = data[industry];
  return benchmark ? benchmark.revenuePerEmployee : 150000;
}

// Get cash unlock guidance
function getCashUnlockGuidance(nwc: number, cashOnHand: number): {
  direction: 'positive' | 'negative' | 'neutral';
  guidance: string;
} {
  const ratio = cashOnHand / Math.abs(nwc);
  
  if (nwc > 0 && ratio < 0.5) {
    return {
      direction: 'negative',
      guidance: 'Consider improving debtor collection to reduce working capital needs.'
    };
  } else if (nwc < 0 && ratio > 2) {
    return {
      direction: 'positive',
      guidance: 'Strong cash position. Consider investing excess working capital.'
    };
  } else {
    return {
      direction: 'neutral',
      guidance: 'Working capital position is balanced with your cash reserves.'
    };
  }
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number for display
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}
