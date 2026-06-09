/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bolt, Users, Receipt, Settings, Code, TrendingUp } from 'lucide-react';
import { Consumer, Bill, TariffConfig } from './types';
import { initialConsumers, initialBills, initialTariffs } from './mockData';

// Component Imports
import DashboardView from './components/DashboardView';
import ConsumerView from './components/ConsumerView';
import BillingView from './components/BillingView';
import TariffConfigView from './components/TariffConfigView';
import JavaCodeView from './components/JavaCodeView';

type ViewType = 'dashboard' | 'consumers' | 'billing' | 'tariffs' | 'java';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [consumers, setConsumers] = useState<Consumer[]>(initialConsumers);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [tariffs, setTariffs] = useState<TariffConfig[]>(initialTariffs);
  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);

  // 1. ADD CONSUMER HANDLER (Safe unique ID and Meter allocation)
  const handleAddConsumer = (newConsumerData: Omit<Consumer, 'id' | 'dateJoined'>) => {
    const lastIdNum = Math.max(
      ...consumers.map((c) => parseInt(c.id.replace('CON-', '')) || 1000)
    );
    const newId = `CON-${lastIdNum + 1}`;
    const today = new Date().toISOString().split('T')[0];

    const newConsumer: Consumer = {
      id: newId,
      dateJoined: today,
      ...newConsumerData,
    };

    setConsumers((prev) => [newConsumer, ...prev]);
  };

  // 2. DELETE CONSUMER HANDLER (Clean reference removals)
  const handleDeleteConsumer = (id: string) => {
    if (confirm('Are you sure you want to delete this consumer? All corresponding account readings will remain in archive.')) {
      setConsumers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // 3. CAPTURE / SETTLE CASH TRANSACTIONS
  const handlePayBill = (billId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            status: 'paid',
            paymentDate: todayStr,
          };
        }
        return b;
      })
    );

    // If active invoice modal is open, sync status instantly
    if (selectedInvoice && selectedInvoice.id === billId) {
      setSelectedInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: 'paid',
              paymentDate: todayStr,
            }
          : null
      );
    }
  };

  // 4. GENERATE NEW METER COMPUTATION BILL
  const handleAddBill = (newBillData: Omit<Bill, 'id'>) => {
    const lastBillNum = Math.max(
      ...bills.map((b) => parseInt(b.id.replace('BIL-', '')) || 5000)
    );
    const newBillId = `BIL-${lastBillNum + 1}`;

    const newBill: Bill = {
      id: newBillId,
      ...newBillData,
    };

    setBills((prev) => [newBill, ...prev]);
  };

  // 5. UPDATE TARIFF BRACKET COEFFICIENTS
  const handleUpdateTariff = (newConfig: TariffConfig) => {
    setTariffs((prev) =>
      prev.map((t) => (t.connectionType === newConfig.connectionType ? newConfig : t))
    );
  };

  // 6. RELOAD STATIC DEFAULT COEFFICIENTS
  const handleResetDefaults = () => {
    if (confirm('Revert all tiered unit slabs and service base charges to default state guidelines?')) {
      setTariffs(initialTariffs);
    }
  };

  // Render proper workspace content
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            consumers={consumers}
            bills={bills}
            onSelectView={setActiveView}
            onPayBill={handlePayBill}
            onViewInvoice={setSelectedInvoice}
          />
        );
      case 'consumers':
        return (
          <ConsumerView
            consumers={consumers}
            onAddConsumer={handleAddConsumer}
            onDeleteConsumer={handleDeleteConsumer}
          />
        );
      case 'billing':
        return (
          <BillingView
            consumers={consumers}
            bills={bills}
            tariffs={tariffs}
            onAddBill={handleAddBill}
            onPayBill={handlePayBill}
            selectedInvoice={selectedInvoice}
            onSelectInvoice={setSelectedInvoice}
          />
        );
      case 'tariffs':
        return (
          <TariffConfigView
            tariffs={tariffs}
            onUpdateTariff={handleUpdateTariff}
            onResetDefaults={handleResetDefaults}
          />
        );
      case 'java':
        return <JavaCodeView />;
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="applet-viewport">
      {/* Dynamic Upper Navigation (Hidden when printing invoice) */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 no-print" id="app-top-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Branding */}
            <div className="flex items-center gap-2" id="brand-logo-area">
              <div className="p-2 bg-amber-500 rounded-xl text-slate-900 shadow-sm">
                <Bolt className="w-5 h-5 text-slate-950 animate-pulse" />
              </div>
              <div>
                <span className="font-sans font-extrabold tracking-tight text-slate-900 text-sm">VOLT-GRID</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block tracking-wider font-mono">Electricity Management</span>
              </div>
            </div>

            {/* View navigation endpoints */}
            <nav className="flex items-center gap-1" id="main-nav-bar">
              <button
                id="tab-btn-nav-dashboard"
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all focus:outline-none ${
                  activeView === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Control Room</span>
              </button>

              <button
                id="tab-btn-nav-consumers"
                onClick={() => setActiveView('consumers')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all focus:outline-none ${
                  activeView === 'consumers'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Account Directory</span>
              </button>

              <button
                id="tab-btn-nav-billing"
                onClick={() => setActiveView('billing')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all focus:outline-none ${
                  activeView === 'billing'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Receipt className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Billing Ledgers</span>
              </button>

              <button
                id="tab-btn-nav-tariffs"
                onClick={() => setActiveView('tariffs')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all focus:outline-none ${
                  activeView === 'tariffs'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Tariff Matrix</span>
              </button>

              <div className="w-[1px] h-6 bg-slate-200 mx-1 hidden sm:block" />

              <button
                id="tab-btn-nav-java"
                onClick={() => setActiveView('java')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-tight transition-all border focus:outline-none ${
                  activeView === 'java'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Code className="w-4 h-4 shrink-0" />
                <span>Java Source</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" id="applet-primary-pane">
        {renderViewContent()}
      </main>

      {/* Footer controls (Hidden when printing invoice) */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-semibold font-mono uppercase no-print mt-12" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>VOLT-GRID CO. © 2026 GENERAL INFRASTRUCTURES</span>
          <span className="text-slate-300 font-sans font-medium text-[11px] normal-case tracking-normal">
            Designed for secure grid enrollment under licensing protocols
          </span>
        </div>
      </footer>
    </div>
  );
}
