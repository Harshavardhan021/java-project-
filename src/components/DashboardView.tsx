/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, DollarSign, Activity, Receipt, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Consumer, Bill } from '../types';

interface DashboardProps {
  consumers: Consumer[];
  bills: Bill[];
  onSelectView: (view: 'dashboard' | 'consumers' | 'billing' | 'tariffs' | 'java') => void;
  onPayBill: (billId: string) => void;
  onViewInvoice: (bill: Bill) => void;
}

export default function DashboardView({
  consumers,
  bills,
  onSelectView,
  onPayBill,
  onViewInvoice
}: DashboardProps) {
  // Compute metrics
  const totalConsumers = consumers.length;
  
  const totalEnergy = bills.reduce((sum, b) => sum + b.unitsConsumed, 0);
  
  const totalBilled = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  
  const totalCollected = bills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);
    
  const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;
  const outstandingAmount = totalBilled - totalCollected;

  // Connection type calculation
  const typeCounts = consumers.reduce(
    (acc, c) => {
      acc[c.connectionType] = (acc[c.connectionType] || 0) + 1;
      return acc;
    },
    { domestic: 0, commercial: 0, industrial: 0, agricultural: 0 } as Record<string, number>
  );

  // Recent 5 bills
  const recentBills = [...bills].slice(0, 5);

  // Data for customized SVG bar graph representing billed vs collected by category
  const categories: { label: string; key: 'domestic' | 'commercial' | 'industrial' | 'agricultural'; color: string }[] = [
    { label: 'Domestic', key: 'domestic', color: '#3b82f6' }, // Blue
    { label: 'Commercial', key: 'commercial', color: '#10b981' }, // Emerald
    { label: 'Industrial', key: 'industrial', color: '#8b5cf6' }, // Purple
    { label: 'Agricultural', key: 'agricultural', color: '#f59e0b' }, // Amber
  ];

  const categoryMetrics = categories.map((cat) => {
    const catBills = bills.filter((b) => b.connectionType === cat.key);
    const billed = catBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const collected = catBills
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    return {
      ...cat,
      billed,
      collected,
    };
  });

  const maxAmount = Math.max(...categoryMetrics.map((c) => Math.max(c.billed, c.collected, 500)), 1000);

  return (
    <div className="space-y-6" id="dashboard-view-root">
      {/* Welcome Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight">System Control Room</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Compute state tariffs, authorize consumption readings, log payments, and run simulated core execution on the virtual Java console.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            id="nav-to-billing-btn"
            onClick={() => onSelectView('billing')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Energy Bill
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            id="nav-to-java-btn"
            onClick={() => onSelectView('java')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 border border-slate-600"
          >
            Launch Java CLI
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between" id="kpi-consumers">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Consumers</span>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{totalConsumers}</p>
            <p className="text-xs text-slate-400 mt-1">Registered accounts</p>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between" id="kpi-energy">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Consumption</span>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{totalEnergy.toLocaleString()} <span className="text-sm font-normal text-slate-500">kWh</span></p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Grid efficiency normal
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between" id="kpi-revenue">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Collected Revenue</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">${totalCollected.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">Billed: ${totalBilled.toFixed(2)}</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between" id="kpi-rate">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Collection Rate</span>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{collectionRate.toFixed(1)}%</p>
            <p className="text-xs text-red-500 font-medium mt-1">
              Unpaid: ${outstandingAmount.toFixed(2)}
            </p>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics & Distribution Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Visual SVG Bar Graph of Billings vs Collections */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 flex flex-col justify-between" id="billing-chart-panel">
          <div>
            <h3 className="font-sans font-semibold text-slate-800 text-base">Billings vs Collections</h3>
            <p className="text-xs text-slate-500 mt-1">Historical ledger metrics grouped by system connection category ($)</p>
          </div>

          {/* SVG Bar Chart container */}
          <div className="mt-6 flex flex-col gap-4">
            {categoryMetrics.map((data) => {
              const billedPct = (data.billed / maxAmount) * 100;
              const collectedPct = (data.collected / maxAmount) * 100;
              return (
                <div key={data.key} className="space-y-1.5" id={`chart-row-${data.key}`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{data.label} Connection</span>
                    <span className="text-slate-500 font-mono">
                      Billed: <strong className="text-slate-700">${data.billed.toFixed(0)}</strong> · Collected: <strong className="text-emerald-600">${data.collected.toFixed(0)}</strong>
                    </span>
                  </div>
                  {/* Visual Dual progress bar */}
                  <div className="space-y-1">
                    {/* Billed indicator */}
                    <div className="w-full bg-slate-100 rounded-full h-3.5 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(billedPct, 3)}%`, backgroundColor: data.color }}
                      />
                    </div>
                    {/* Collected indicator */}
                    <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                        style={{ width: `${Math.max(collectedPct, 1)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 mt-6 pt-4 flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-xs" />
              <span>Domestic Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
              <span>Commercial Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-purple-500 rounded-xs" />
              <span>Industrial Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-xs" />
              <span>Agricultural Tier</span>
            </div>
          </div>
        </div>

        {/* Consumer Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between" id="distribution-panel">
          <div>
            <h3 className="font-sans font-semibold text-slate-800 text-base">Consumer Segment Mix</h3>
            <p className="text-xs text-slate-500 mt-1">Distribution of accounts by load classification</p>
          </div>

          <div className="my-6 flex justify-center relative">
            {/* Visual SVG Ring representing the distribution */}
            <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-95">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
              
              {/* Slices representation using dash arrays */}
              {/* Domestic: 40% (Blue #3b82f6) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" 
                strokeDasharray="40 60" strokeDashoffset="0" />
              {/* Commercial: 20% (Emerald #10b981) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                strokeDasharray="20 80" strokeDashoffset="-40" />
              {/* Industrial: 20% (Purple #8b5cf6) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" 
                strokeDasharray="20 80" strokeDashoffset="-60" />
              {/* Agricultural: 20% (Amber #f59e0b) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" 
                strokeDasharray="20 80" strokeDashoffset="-80" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold font-mono text-slate-800">{totalConsumers}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Accounts</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* Legend with exact count indicators */}
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span className="text-slate-600 font-medium">Domestic</span>
              </div>
              <span className="font-semibold text-slate-800">{typeCounts.domestic} consumers</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="text-slate-600 font-medium">Commercial</span>
              </div>
              <span className="font-semibold text-slate-800">{typeCounts.commercial} consumers</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
                <span className="text-slate-600 font-medium">Industrial</span>
              </div>
              <span className="font-semibold text-slate-800">{typeCounts.industrial} consumers</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                <span className="text-slate-600 font-medium">Agricultural</span>
              </div>
              <span className="font-semibold text-slate-800">{typeCounts.agricultural} consumers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recents Registry and Payments queue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs" id="recent-queue-panel">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-sans font-semibold text-slate-800 text-base">Recent Ledger Billings</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time meter readings processed and stored</p>
          </div>
          <button
            id="view-all-ledger-btn"
            onClick={() => onSelectView('billing')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            Manage All Ledger &rarr;
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Bill Number</th>
                <th className="py-2.5">Consumer</th>
                <th className="py-2.5">Month</th>
                <th className="py-2.5">KWh Consumed</th>
                <th className="py-2.5">Total Bill</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBills.map((bill) => {
                const badgeColor =
                  bill.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : bill.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-rose-50 text-rose-700 border-rose-100';

                return (
                  <tr key={bill.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="py-3 font-semibold font-mono text-slate-700">{bill.id}</td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-slate-800">{bill.consumerName}</div>
                        <div className="text-slate-400 text-[10px]">{bill.consumerId}</div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{bill.billingMonth}</td>
                    <td className="py-3 text-slate-600 font-mono font-medium">{bill.unitsConsumed} kWh</td>
                    <td className="py-3 text-slate-800 font-bold font-mono">${bill.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badgeColor}`}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          id={`bill-view-inv-${bill.id}`}
                          onClick={() => onViewInvoice(bill)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold transition"
                        >
                          Invoice
                        </button>
                        {bill.status !== 'paid' && (
                          <button
                            id={`bill-pay-dash-${bill.id}`}
                            onClick={() => onPayBill(bill.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition"
                          >
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
