/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Search, PlusCircle, Calendar, Receipt, ShieldAlert, CheckCircle, Calculator, ChevronRight, FileText, Printer, CreditCard } from 'lucide-react';
import { Consumer, Bill, TariffConfig } from '../types';

interface BillingViewProps {
  consumers: Consumer[];
  bills: Bill[];
  tariffs: TariffConfig[];
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  onPayBill: (billId: string) => void;
  selectedInvoice: Bill | null;
  onSelectInvoice: (bill: Bill | null) => void;
}

export default function BillingView({
  consumers,
  bills,
  tariffs,
  onAddBill,
  onPayBill,
  selectedInvoice,
  onSelectInvoice
}: BillingViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Bill Creator State
  const [selectedConsumerId, setSelectedConsumerId] = useState('');
  const [billingMonth, setBillingMonth] = useState('June 2026');
  const [currentReadingInput, setCurrentReadingInput] = useState('');
  const [prevReadingOverride, setPrevReadingOverride] = useState<number | null>(null);

  // Fetch consumer details
  const activeConsumer = consumers.find((c) => c.id === selectedConsumerId);

  // Determine standard previous reading based on historical bills
  const getPreviousReading = (consumerId: string) => {
    const consumerBills = bills.filter((b) => b.consumerId === consumerId);
    if (consumerBills.length > 0) {
      // Return highest current reading from past bills
      return Math.max(...consumerBills.map((b) => b.currReading));
    }
    // Return standard default if first-ever bill
    return 1000; 
  };

  const calculatedPrevReading = activeConsumer ? getPreviousReading(activeConsumer.id) : 0;
  const finalPrevReading = prevReadingOverride !== null ? prevReadingOverride : calculatedPrevReading;
  const currentReadingNum = Number(currentReadingInput) || 0;
  const unitsConsumed = Math.max(0, currentReadingNum - finalPrevReading);

  // Dynamic live calculations based on Selected Consumer & Input Units
  const getTariffCalculation = () => {
    if (!activeConsumer) return null;
    const config = tariffs.find((t) => t.connectionType === activeConsumer.connectionType);
    if (!config) return null;

    let remaining = unitsConsumed;
    let slabTotal = 0;
    const slabBreakdown: { range: string; rate: number; calculated: number; units: number }[] = [];

    for (const slab of config.slabs) {
      if (remaining <= 0) break;
      const slabMaxCapacity = slab.maxUnits - slab.minUnits;
      const unitsInSlab = Math.min(remaining, slabMaxCapacity);
      const charge = unitsInSlab * slab.rate;
      
      slabTotal += charge;
      remaining -= unitsInSlab;

      slabBreakdown.push({
        range: `${slab.minUnits}${slab.maxUnits === Infinity ? '+' : ` - ${slab.maxUnits}`} kWh`,
        rate: slab.rate,
        units: unitsInSlab,
        calculated: charge,
      });
    }

    const taxableBase = slabTotal + config.baseCharge;
    const tax = taxableBase * (config.taxPercentage / 100);
    const total = taxableBase + tax;

    return {
      slabAmount: slabTotal,
      fixedCharges: config.baseCharge,
      taxAmount: tax,
      totalAmount: total,
      breakdown: slabBreakdown,
      taxRate: config.taxPercentage,
    };
  };

  const liveCalculation = getTariffCalculation();

  const handleCreateBillSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeConsumer || !liveCalculation) return;

    if (currentReadingNum <= finalPrevReading) {
      alert('Error: Current meter reading must be strictly higher than previous meter reading.');
      return;
    }

    // Set standard due date (e.g. 15 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    const dueDateString = dueDate.toISOString().split('T')[0];

    onAddBill({
      consumerId: activeConsumer.id,
      consumerName: activeConsumer.name,
      connectionType: activeConsumer.connectionType,
      billingMonth,
      prevReading: finalPrevReading,
      currReading: currentReadingNum,
      unitsConsumed,
      slabAmount: liveCalculation.slabAmount,
      fixedCharges: liveCalculation.fixedCharges,
      taxAmount: liveCalculation.taxAmount,
      totalAmount: liveCalculation.totalAmount,
      dueDate: dueDateString,
      status: 'pending',
    });

    // Reset fields
    setSelectedConsumerId('');
    setCurrentReadingInput('');
    setPrevReadingOverride(null);
    setShowAddModal(false);
  };

  // Filter bills
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.consumerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="billing-view-root">
      {/* Upper header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Energy Calculations & Ledger</h2>
          <p className="text-xs text-slate-500 mt-1">Audit active meter counts, compute tiered system invoices, and authorize accounts</p>
        </div>
        <button
          id="btn-open-bill-wizard"
          onClick={() => {
            if (consumers.length === 0) {
              alert('Enroll at least one consumer before billing calculations.');
              return;
            }
            setSelectedConsumerId(consumers[0].id);
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          New Estimation Bill
        </button>
      </div>

      {/* Ledger search filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-100">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="ledger-search-input"
            type="text"
            placeholder="Search by consumer name, ID, or bill reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400 focus:outline-none transition-all font-medium"
          />
        </div>

        <div>
          <select
            id="ledger-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 focus:outline-none transition font-bold appearance-none"
          >
            <option value="all">Check All Ledger Bills</option>
            <option value="paid">Settled/Paid</option>
            <option value="pending">Awaiting Payment</option>
            <option value="overdue">Discrepant / Overdue</option>
          </select>
        </div>

        <div className="flex items-center justify-end px-3 font-mono text-xs text-slate-400 font-bold uppercase">
          Ledger size: {filteredBills.length} records
        </div>
      </div>

      {/* Database bills display table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Bill Code</th>
                <th className="p-4">Consumer</th>
                <th className="p-4">Statement Period</th>
                <th className="p-4">Meter Range</th>
                <th className="p-4">Energy Used</th>
                <th className="p-4">Net amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => {
                const statusTheme =
                  b.status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : b.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-rose-50 text-rose-700 border-rose-100';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-slate-700">{b.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-slate-800">{b.consumerName}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">{b.consumerId} · {b.connectionType}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{b.billingMonth}</td>
                    <td className="p-4 text-slate-500 font-mono">
                      {b.prevReading} &rarr; {b.currReading}
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700">{b.unitsConsumed} kWh</td>
                    <td className="p-4 font-mono font-bold text-slate-800">${b.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${statusTheme}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          id={`bill-list-inv-${b.id}`}
                          onClick={() => onSelectInvoice(b)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition flex items-center gap-1 shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Invoice
                        </button>
                        {b.status !== 'paid' && (
                          <button
                            id={`bill-list-pay-${b.id}`}
                            onClick={() => onPayBill(b.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1 shadow-xxs shrink-0"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Record Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <p className="p-3 bg-slate-100 text-slate-400 rounded-full mb-3">
                        <Receipt className="w-6 h-6" />
                      </p>
                      <h4 className="font-semibold text-slate-700">No Billings Listed</h4>
                      <p className="text-xs text-slate-400 mt-1">Adjust search metrics or start the meter computation wizard to post first invoice.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill creation wizard overlay */}
      {showAddModal && activeConsumer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="billing-wizard-overlay">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-slide-up">
            {/* Form control (Left - 7 columns) */}
            <div className="p-6 md:col-span-7 space-y-5 text-xs text-slate-600 font-semibold border-r border-slate-100">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 font-sans">Compute Energy Bill</h3>
                <p className="text-xs text-slate-500 font-medium">Verify consumed energy metrics to update active client account statements.</p>
              </div>

              <form onSubmit={handleCreateBillSubmit} className="space-y-4">
                {/* Select Consumer */}
                <div className="space-y-1.5">
                  <label className="block text-slate-700">Consumer Account</label>
                  <select
                    id="wizard-consumer-select"
                    value={selectedConsumerId}
                    onChange={(e) => {
                      setSelectedConsumerId(e.target.value);
                      setPrevReadingOverride(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    {consumers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id}) - {c.connectionType.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Billing Period Month */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700">Billing Statement Month</label>
                    <select
                      id="wizard-billing-month"
                      value={billingMonth}
                      onChange={(e) => setBillingMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="May 2026">May 2026</option>
                      <option value="June 2026">June 2026</option>
                      <option value="July 2026">July 2026</option>
                      <option value="August 2026">August 2026</option>
                    </select>
                  </div>

                  {/* Previous Reading Display */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700">Previous Reading (kWh)</label>
                    <div className="flex items-center gap-2">
                      <input
                        id="wizard-prev-reading"
                        type="number"
                        required
                        value={finalPrevReading}
                        onChange={(e) => setPrevReadingOverride(Number(e.target.value))}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Meter Key info */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Targeted Meter</span>
                    <span className="font-mono font-semibold text-slate-700">{activeConsumer.meterNo}</span>
                  </div>

                  {/* Current Entry */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-700">Current Reading (kWh)</label>
                    <input
                      id="wizard-curr-reading"
                      type="number"
                      required
                      placeholder={`Min: ${finalPrevReading + 1}`}
                      value={currentReadingInput}
                      onChange={(e) => setCurrentReadingInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {currentReadingInput && currentReadingNum <= finalPrevReading && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Calculations halted: Current meter reading must exceed previous read.</span>
                  </div>
                )}

                {/* Submit Controls */}
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                  <button
                    id="wizard-cancel"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="wizard-submit"
                    type="submit"
                    disabled={currentReadingNum <= finalPrevReading}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition font-bold disabled:opacity-50"
                  >
                    Commit Bill to Ledger
                  </button>
                </div>
              </form>
            </div>

            {/* Calculations Breakdown (Right - 5 columns) */}
            <div className="bg-slate-900 text-white p-6 md:col-span-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-semibold tracking-wide flex items-center gap-1.5 text-blue-400">
                    <Calculator className="w-4 h-4" />
                    Real-time Tariff Engine
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">Slab computations processed on-fly using current connections</p>
                </div>

                {liveCalculation ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Energy metrics</span>
                      <p className="text-xl font-bold font-mono text-slate-100 mt-0.5">
                        {unitsConsumed} <span className="text-xs font-normal text-slate-400">units (kWh)</span>
                      </p>
                    </div>

                    {/* Slabs list */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Slab Consumption Squeeze</span>
                      {liveCalculation.breakdown.length > 0 ? (
                        <div className="space-y-1.5 font-mono text-xs">
                          {liveCalculation.breakdown.map((b, i) => (
                            <div key={i} className="flex justify-between items-center text-slate-300">
                              <span className="text-slate-400 text-[10px]">{b.range} @ ${b.rate}/unit</span>
                              <span>{b.units} units = ${b.calculated.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic">No energy consumption mapped yet. Update readings above.</p>
                      )}
                    </div>

                    {/* Overall Summary items */}
                    <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Step Calculation Sum</span>
                        <span>${liveCalculation.slabAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Base/Fixed Grid Charge</span>
                        <span>${liveCalculation.fixedCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sky-400 text-[10px]">
                        <span>Connection Tax ({liveCalculation.taxRate}%)</span>
                        <span>+${liveCalculation.taxAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-4 mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total computed estimate</span>
                      <p className="text-3xl font-mono font-bold text-amber-400 mt-1">
                        ${liveCalculation.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <p className="text-xs">Select a client and enter reading estimates to trigger live computation logic.</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-xl text-[10px] text-slate-400 font-medium leading-relaxed mt-4">
                This dynamic engine matches standard Java Class billing patterns: mapping consumers, checking connection types, and using lists of TariffSlabs to execute logic.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice modal rendering */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="invoice-modal-overlay">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 shadow-2xl p-6 md:p-8 animate-slide-up relative">
            
            {/* Header control */}
            <div className="flex justify-between items-start no-print mb-6">
              <span className="text-xs uppercase bg-slate-100 text-slate-600 px-3 py-1 rounded-md font-semibold tracking-wider font-mono">
                Invoice Ledger Voucher
              </span>
              <div className="flex items-center gap-2 no-print">
                <button
                  id="btn-print-invoice"
                  onClick={() => window.print()}
                  className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  id="btn-close-invoice"
                  onClick={() => onSelectInvoice(null)}
                  className="p-1 px-3 text-slate-500 hover:text-slate-800 text-sm font-semibold transition"
                >
                  Close &times;
                </button>
              </div>
            </div>

            {/* Printable Frame Area */}
            <div className="print-content space-y-6" id="printable-bill-region">
              {/* Branding and Invoice identifier */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-sans tracking-tight text-slate-900">GRID ELECTRICITY CO.</h3>
                  <p className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase font-mono">Automated Ledger Settlement</p>
                </div>
                <div className="text-right space-y-1">
                  <h4 className="text-xl font-bold font-mono text-slate-800">{selectedInvoice.id}</h4>
                  <p className="text-xs text-slate-500 font-semibold">Dated: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Grid Accounts layout */}
              <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold text-slate-500">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consumer particulars</span>
                  <p className="font-bold text-slate-800">{selectedInvoice.consumerName}</p>
                  <p className="font-mono text-[10.5px]">{selectedInvoice.consumerId}</p>
                  <p className="font-semibold text-slate-600">{consumers.find((c) => c.id === selectedInvoice.consumerId)?.address}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Meter Registry</span>
                  <p className="font-bold text-slate-800">
                    Ser: {consumers.find((c) => c.id === selectedInvoice.consumerId)?.meterNo || 'MTR-UNKNOWN'}
                  </p>
                  <p className="font-semibold text-slate-600 uppercase">Service Tier: {selectedInvoice.connectionType}</p>
                  <p className="font-mono text-slate-600">Month: {selectedInvoice.billingMonth}</p>
                </div>
              </div>

              {/* Consumption statement stats */}
              <div className="grid grid-cols-3 gap-4 border border-slate-100 rounded-xl p-4 text-center font-semibold text-slate-500">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Previous index</span>
                  <p className="text-base font-mono font-bold text-slate-800 mt-1">{selectedInvoice.prevReading} kWh</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Current index</span>
                  <p className="text-base font-mono font-bold text-slate-800 mt-1">{selectedInvoice.currReading} kWh</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Grid Volume Used</span>
                  <p className="text-base font-mono font-bold text-blue-600 mt-1">{selectedInvoice.unitsConsumed} kWh</p>
                </div>
              </div>

              {/* Breakdown billing structure */}
              <div className="space-y-3">
                <h5 className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Statement breakdown</h5>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold">
                        <th className="p-3">Calculation Line</th>
                        <th className="p-3 text-right">Units</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr>
                        <td className="p-3">Estimated Tier Slabs usage sum</td>
                        <td className="p-3 text-right font-mono text-slate-500">{selectedInvoice.unitsConsumed}</td>
                        <td className="p-3 text-right font-mono text-slate-800">${selectedInvoice.slabAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="p-3">Standard connection base charge</td>
                        <td className="p-3 text-right font-mono text-slate-400">-</td>
                        <td className="p-3 text-right font-mono text-slate-800">${selectedInvoice.fixedCharges.toFixed(2)}</td>
                      </tr>
                      <tr className="text-[11px] text-slate-500 bg-slate-50/50">
                        <td className="p-3 pl-6">State service taxation / duties</td>
                        <td className="p-3 text-right font-mono">-</td>
                        <td className="p-3 text-right font-mono">+${selectedInvoice.taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-slate-50 text-slate-900 border-t border-slate-200">
                        <td className="p-4 font-bold text-sm">Statement Balance Outstanding</td>
                        <td className="p-4"></td>
                        <td className="p-4 text-right font-mono font-bold text-base text-indigo-700">
                          ${selectedInvoice.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom footer and mock barcode */}
              <div className="border-t border-slate-150 pt-5 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span>Status:</span>
                    {selectedInvoice.status === 'paid' ? (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        SETTLED / PAID
                      </span>
                    ) : (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        AWAITING CASH SETTLEMENT
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Valid for bank transfer or portal payment.</p>
                </div>

                {/* Simulated barcode */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-[1.5px] items-stretch h-8">
                    {[1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2].map((v, i) => (
                      <div
                        key={i}
                        className="bg-slate-800"
                        style={{ width: `${v}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-slate-400">{selectedInvoice.id}992381</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
