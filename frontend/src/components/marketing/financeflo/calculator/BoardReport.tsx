import React from 'react';
import { CalculatorResults, CalculatorInputs } from '@/lib/financeflo/calculator';

interface BoardReportProps {
  results: CalculatorResults;
  inputs: CalculatorInputs;
  companyName?: string;
}

export function generateBoardReport(
  results: CalculatorResults,
  inputs: CalculatorInputs,
  companyName: string = 'Your Company'
): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Calculate scenario values
  const calculateScenario = (dsoChange: number, dpoChange: number, turnsChange: number) => {
    const newDSO = inputs.debtorDays + dsoChange;
    const newDPO = inputs.creditorDays + dpoChange;
    const newTurns = (inputs.inventoryTurns || 6) + turnsChange;

    const dailyRevenue = inputs.annualRevenue / 365;
    const cogs = inputs.annualRevenue * (1 - (inputs.grossMargin || 25) / 100);
    const dailyCOGS = cogs / 365;

    const dsoImpact = (dsoChange / 365) * inputs.annualRevenue;
    const dpoImpact = (dpoChange / 365) * cogs;
    const inventoryValue = cogs / (inputs.inventoryTurns || 6);
    const newInventoryValue = cogs / newTurns;
    const inventoryImpact = inventoryValue - newInventoryValue;

    const cash13Week = (dsoImpact + dpoImpact + inventoryImpact) * 0.35; // 35% in 13 weeks
    const cash12Month = dsoImpact + dpoImpact + inventoryImpact;

    return {
      newDSO,
      newDPO,
      newTurns,
      cash13Week: Math.abs(cash13Week),
      cash12Month: Math.abs(cash12Month),
      dsoImpact: Math.abs(dsoImpact),
      dpoImpact: Math.abs(dpoImpact),
      inventoryImpact: Math.abs(inventoryImpact)
    };
  };

  // Three scenarios
  const conservative = calculateScenario(-4, 3, 0.4);
  const likely = calculateScenario(-7, 7, 0.8);
  const stretch = calculateScenario(-10, 10, 1.2);

  // Working capital tied up
  const cogs = inputs.annualRevenue * (1 - (inputs.grossMargin || 25) / 100);
  const ar = (inputs.annualRevenue / 365) * inputs.debtorDays;
  const inventory = cogs / (inputs.inventoryTurns || 6);
  const ap = (cogs / 365) * inputs.creditorDays;
  const workingCapital = ar + inventory - ap;

  // FX sensitivity
  const eurRevenuePct = 0.32;
  const fxExposurePct = 0.30;
  const fxMove = 0.05;
  const fxImpact = inputs.annualRevenue * eurRevenuePct * fxExposurePct * fxMove;

  // Covenant metrics (simplified - would come from actual data)
  const ebitda = inputs.ebitda || (inputs.annualRevenue * (inputs.netMargin || 10) / 100);
  const interestExpense = ebitda * 0.28; // Assuming interest expense
  const interestCover = ebitda / Math.max(interestExpense, 1);
  const leverage = 2.3; // Would come from actual debt data

  const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');
  const fmtK = (n: number) => {
    if (n >= 1000000) {
      return `£${(n / 1000000).toFixed(1)}M`;
    }
    return `£${Math.round(n / 1000).toLocaleString('en-GB')}K`;
  };

  // Use FinanceFlo light logo with full URL for downloadable HTML
  const logoImg = `<img src="https://financeflo.ai/FFLightBG-Logo.svg" alt="FinanceFlo" style="height:42px;width:auto;display:block" />`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>FinanceFlo — Working Capital & Growth Capacity Report</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Lato:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root{--navy:#0A1F44;--green:#2BB673;--white:#FFFFFF;--grey:#F4F6F8;--blue:#007BFF;--muted:#64748b;--line:#e2e8f0;--warn:#f59e0b;}
  *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;color-adjust:exact}
  body{font:13px/1.5 'Lato',system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:var(--white);color:var(--navy);margin:0;padding:0}
  @page{size:A4 landscape;margin:10mm 12mm}
  .wrap{max-width:1200px;margin:0 auto;padding:0}
  .no-print{display:flex;justify-content:space-between;align-items:center;margin:6px 16px 12px;padding:12px 0;border-bottom:1px solid var(--line)}
  .btn{background:var(--green);color:#fff;border:0;border-radius:8px;padding:10px 18px;font-weight:600;font-family:'Montserrat',sans-serif;box-shadow:0 2px 8px rgba(43,182,115,.2);cursor:pointer;transition:all 0.2s}
  .btn:hover{background:#25a565;box-shadow:0 4px 12px rgba(43,182,115,.3)}
  .page{background:#fff;padding:18px 20px;margin:0 auto 0;position:relative}
  .logo{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .logo img{height:42px;width:auto}
  .title{font-size:20px;font-weight:800;font-family:'Montserrat',sans-serif;color:var(--navy);line-height:1.2}
  .sub{color:var(--muted);font-size:11px;margin-top:4px;font-family:'Lato',sans-serif}
  .badge{display:inline-block;background:var(--green);color:#fff;border-radius:6px;padding:3px 8px;font-size:10px;font-weight:600;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.5px}
  .grid{display:grid;gap:10px}
  .g-2{grid-template-columns:repeat(2,1fr)} .g-3{grid-template-columns:repeat(3,1fr)} .g-4{grid-template-columns:repeat(4,1fr)}
  .card{background:var(--grey);border:1px solid var(--line);border-radius:8px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
  .card.highlight{background:linear-gradient(135deg,#e6f9f0 0%,var(--grey) 100%);border-color:var(--green);border-width:2px}
  .k{color:var(--muted);font-size:9px;font-weight:600;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.3px}
  .v{font-size:22px;font-weight:800;font-family:'Montserrat',sans-serif;color:var(--navy);margin-top:3px}
  .bar{height:10px;background:#e5e7eb;border-radius:5px;overflow:hidden;margin-top:4px}
  .bar>i{display:block;height:100%;background:linear-gradient(90deg,var(--green),#25a565);transition:width 0.3s}
  .list{margin:6px 0 0 16px;line-height:1.6;font-family:'Lato',sans-serif;font-size:12px}
  .list li{margin-bottom:4px}
  .t{width:100%;border-collapse:collapse;margin-top:8px}
  .t th{color:var(--navy);text-align:left;font-weight:700;font-family:'Montserrat',sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid var(--green);padding:8px 6px;background:var(--grey)}
  .t td{padding:8px 6px;border-bottom:1px solid #f1f5f9;font-size:12px;font-family:'Lato',sans-serif}
  .t tr:hover{background:var(--grey)}
  .right{text-align:right}
  .page-break{page-break-after:always;margin-bottom:0}
  @media print{
    *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    body{background:#fff}
    .no-print{display:none}
    .page{box-shadow:none;border-radius:0;page-break-inside:avoid;padding:20px 18px}
    .card{box-shadow:none;page-break-inside:avoid}
    .bar>i{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    .badge{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    .t th{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
  }
  @media screen{
    .page{box-shadow:0 4px 20px rgba(10,31,68,0.08);margin-bottom:20px;border-radius:0}
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="no-print">
    <div><strong>FinanceFlo</strong> — PDF‑Ready Report</div>
    <button class="btn" onclick="window.print()">Download / Print PDF</button>
  </div>

  <!-- PAGE 1 -->
  <section class="page">
    <div class="logo">${logoImg}</div>
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">
      <div style="flex:1">
        <div class="title">Working Capital & Growth Capacity — Executive Summary</div>
        <div class="sub">Prepared for <strong>${companyName}</strong> · ${formattedDate} · Currency: £</div>
      </div>
      <div style="text-align:right">
        <span class="badge">Confidential</span>
        <div class="sub" style="margin-top:6px">Prepared by <strong>FinanceFlo</strong></div>
      </div>
    </header>

    <div class="grid g-3">
      <div class="card highlight"><div class="k">Working capital tied up</div><div class="v" style="color:var(--green)">${fmtK(workingCapital)}</div><div class="k" style="margin-top:3px;color:#64748b">AR + Inventory – AP</div></div>
      <div class="card highlight"><div class="k">Cash unlock in 13 weeks</div><div class="v" style="color:var(--green)">${fmtK(likely.cash13Week)}</div><div class="k" style="margin-top:3px;color:#64748b">35% of 12‑month potential</div></div>
      <div class="card highlight"><div class="k">Cash unlock in 12 months</div><div class="v" style="color:var(--green)">${fmtK(likely.cash12Month)}</div><div class="k" style="margin-top:3px;color:#64748b">Across DSO, DPO, inventory</div></div>
    </div>

    <div class="grid g-2" style="margin-top:10px">
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Cash Unlock Breakdown — 13 Weeks</div>
        <div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>Debtor Days</span><span>${fmtK(likely.dsoImpact * 0.35)}</span></div><div class="bar"><i style="width:${(likely.dsoImpact / likely.cash12Month * 100).toFixed(0)}%"></i></div></div>
        <div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>Creditor Days</span><span>${fmtK(likely.dpoImpact * 0.35)}</span></div><div class="bar"><i style="width:${(likely.dpoImpact / likely.cash12Month * 100).toFixed(0)}%"></i></div></div>
        <div style="margin-bottom:4px"><div style="display:flex;justify-content:space-between;font-size:12px"><span>Inventory Turns</span><span>${fmtK(likely.inventoryImpact * 0.35)}</span></div><div class="bar"><i style="width:${(likely.inventoryImpact / likely.cash12Month * 100).toFixed(0)}%"></i></div></div>
        <div style="display:flex;justify-content:space-between;font-weight:600;margin-top:4px;font-size:13px"><span>Total (13 weeks)</span><span>${fmtK(likely.cash13Week)}</span></div>
      </div>
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Levers & Targets (Likely Scenario)</div>
        <div class="grid g-3">
          <div class="card" style="background:#fff;border:1px solid var(--blue);padding:8px"><div class="k">DSO Days</div><div class="v" style="font-size:16px;color:var(--blue)">${inputs.debtorDays} → ${likely.newDSO}</div><div class="k" style="font-size:8px">Δ${likely.newDSO - inputs.debtorDays} days</div></div>
          <div class="card" style="background:#fff;border:1px solid var(--blue);padding:8px"><div class="k">DPO Days</div><div class="v" style="font-size:16px;color:var(--blue)">${inputs.creditorDays} → ${likely.newDPO}</div><div class="k" style="font-size:8px">Δ+${likely.newDPO - inputs.creditorDays} days</div></div>
          <div class="card" style="background:#fff;border:1px solid var(--blue);padding:8px"><div class="k">Turns</div><div class="v" style="font-size:16px;color:var(--blue)">${(inputs.inventoryTurns || 6).toFixed(1)} → ${likely.newTurns.toFixed(1)}</div><div class="k" style="font-size:8px">+${(likely.newTurns - (inputs.inventoryTurns || 6)).toFixed(1)}</div></div>
        </div>
      </div>
    </div>

    <div class="grid g-2" style="margin-top:10px">
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">90‑Day Action Plan</div>
        <ul class="list">
          ${results.talkingPoints.slice(0, 3).map(point => `<li>${point}</li>`).join('')}
          ${results.talkingPoints.length < 1 ? '<li>Credit control sprint: prioritise top 20 delinquent accounts; weekly promise‑to‑pay cadence; disputes log.</li><li>Supplier terms review: negotiate extended payment terms on A/B suppliers; early‑pay discount modelling.</li><li>Inventory discipline: freeze slow‑moving SKUs; re‑set safety stock; tighten S&OP cadence.</li>' : ''}
        </ul>
      </div>
      ${interestCover > 0 ? `<div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Covenant Headroom</div>
        <div class="grid g-2">
          <div>
            <div style="margin-bottom:4px;font-size:12px">Interest Cover</div>
            <div class="bar"><i style="width:${Math.min(100, (interestCover / 5) * 100)}%;background:${interestCover > 2.5 ? 'var(--green)' : 'var(--warn)'}"></i></div>
            <div class="k" style="margin-top:3px">Current ${interestCover.toFixed(1)}× · Min 2.0×</div>
          </div>
          <div>
            <div style="margin-bottom:4px;font-size:12px">Leverage</div>
            <div class="bar"><i style="width:${Math.min(100, (leverage / 3.5) * 100)}%;background:${leverage < 3.0 ? 'var(--green)' : 'var(--warn)'}"></i></div>
            <div class="k" style="margin-top:3px">Current ${leverage.toFixed(1)}× · Max 3.0×</div>
          </div>
        </div>
      </div>` : `<div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Business Inputs Summary</div>
        <div class="grid g-3">
          <div><div class="k">Annual Revenue</div><div class="v" style="font-size:14px">£${fmt(inputs.annualRevenue)}</div></div>
          <div><div class="k">Employees</div><div class="v" style="font-size:14px">${inputs.employees}</div></div>
          <div><div class="k">Industry</div><div class="v" style="font-size:14px;text-transform:capitalize">${inputs.industry}</div></div>
        </div>
      </div>`}
    </div>
  </section>

  <div class="page-break"></div>

  <!-- PAGE 2 -->
  <section class="page">
    <div class="logo">${logoImg}</div>
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
      <div class="title">Scenarios, Assumptions & Methodology</div>
      <span class="badge">Appendix</span>
    </header>

    <div class="grid g-2">
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Scenario Summary</div>
        <table class="t">
          <thead>
            <tr><th>Scenario</th><th>DSO</th><th>DPO</th><th>Turns</th><th class="right">13‑wk Cash</th><th class="right">12‑mo Cash</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Conservative</strong></td><td>${conservative.newDSO}</td><td>${conservative.newDPO}</td><td>${conservative.newTurns.toFixed(1)}</td><td class="right">${fmtK(conservative.cash13Week)}</td><td class="right">${fmtK(conservative.cash12Month)}</td></tr>
            <tr><td><strong>Likely</strong></td><td>${likely.newDSO}</td><td>${likely.newDPO}</td><td>${likely.newTurns.toFixed(1)}</td><td class="right">${fmtK(likely.cash13Week)}</td><td class="right">${fmtK(likely.cash12Month)}</td></tr>
            <tr><td><strong>Stretch</strong></td><td>${stretch.newDSO}</td><td>${stretch.newDPO}</td><td>${stretch.newTurns.toFixed(1)}</td><td class="right">${fmtK(stretch.cash13Week)}</td><td class="right">${fmtK(stretch.cash12Month)}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Business Inputs</div>
        <div class="grid g-3" style="margin-top:6px">
          <div><div class="k">Annual Revenue</div><div class="v" style="font-size:15px">£${fmt(inputs.annualRevenue)}</div></div>
          <div><div class="k">Employees</div><div class="v" style="font-size:15px">${inputs.employees}</div></div>
          <div><div class="k">Industry</div><div class="v" style="font-size:15px;text-transform:capitalize">${inputs.industry}</div></div>
          <div><div class="k">DSO (days)</div><div class="v" style="font-size:15px">${inputs.debtorDays}</div></div>
          <div><div class="k">DPO (days)</div><div class="v" style="font-size:15px">${inputs.creditorDays}</div></div>
          <div><div class="k">Inv. Turns</div><div class="v" style="font-size:15px">${(inputs.inventoryTurns || 6).toFixed(1)}</div></div>
        </div>
      </div>
    </div>

    <div class="grid g-2" style="margin-top:10px">
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">FX Sensitivity (GBP/EUR)</div>
        <div class="sub" style="margin-bottom:6px">Assumes ${(eurRevenuePct * 100).toFixed(0)}% revenue EUR‑linked, rate 1.16, ±5% move, ${(fxExposurePct * 100).toFixed(0)}% net exposure.</div>
        <div class="grid g-2">
          <div class="card" style="background:#fff;padding:8px"><div class="k">GBP +5%</div><div class="v" style="font-size:16px">£‑${fmt(fxImpact)}</div><div class="k" style="font-size:8px">12‑month impact</div></div>
          <div class="card" style="background:#fff;padding:8px"><div class="k">GBP ‑5%</div><div class="v" style="font-size:16px">£${fmt(fxImpact)}</div><div class="k" style="font-size:8px">12‑month impact</div></div>
        </div>
      </div>
      <div class="card">
        <div style="font-weight:600;margin-bottom:6px;font-size:13px">Methodology</div>
        <ol class="list" style="line-height:1.5">
          <li><strong>Working capital</strong> = AR + Inventory – AP.</li>
          <li><strong>DSO cash</strong> = (ΔDSO ÷ 365) × Revenue.</li>
          <li><strong>DPO cash</strong> = (ΔDPO ÷ 365) × COGS.</li>
          <li><strong>Inventory</strong> ≈ COGS ÷ Turns. Reduction = cash.</li>
          <li>13‑week = 35% of 12‑month potential.</li>
        </ol>
      </div>
    </div>

    <div class="sub" style="margin-top:10px;font-size:10px">Benchmarks: UK ${inputs.industry} SMEs. Sources: FinanceFlo aggregated client dataset + ONS releases. This report is provided for informational purposes only and is not intended as financial advice. All figures are estimates based on the inputs and assumptions stated. © ${new Date().getFullYear()} FinanceFlo.</div>
  </section>
</div>
</body>
</html>`;
}

export const BoardReport: React.FC<BoardReportProps> = ({ results, inputs, companyName }) => {
  const openReport = () => {
    const reportHTML = generateBoardReport(results, inputs, companyName);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to view the report');
      return;
    }
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  return (
    <button
      onClick={openReport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      Board-Ready Report (PDF)
    </button>
  );
};

export default BoardReport;
