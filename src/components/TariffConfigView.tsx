/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Settings, Percent, DollarSign, RefreshCw, Zap, Landmark, Factory, Sprout } from 'lucide-react';
import { TariffConfig, ConnectionType } from '../types';

interface TariffConfigViewProps {
  tariffs: TariffConfig[];
  onUpdateTariff: (config: TariffConfig) => void;
  onResetDefaults: () => void;
}

export default function TariffConfigView({ tariffs, onUpdateTariff, onResetDefaults }: TariffConfigViewProps) {
  const [selectedTab, setSelectedTab] = useState<ConnectionType>('domestic');

  const activeTariff = tariffs.find((t) => t.connectionType === selectedTab);

  const handleBaseChange = (value: number) => {
    if (!activeTariff) return;
    onUpdateTariff({
      ...activeTariff,
      baseCharge: Math.max(0, parseFloat(value.toFixed(2))),
    });
  };

  const handleTaxChange = (value: number) => {
    if (!activeTariff) return;
    onUpdateTariff({
      ...activeTariff,
      taxPercentage: Math.max(0, Math.min(100, parseFloat(value.toFixed(2)))),
    });
  };

  const handleSlabRateChange = (index: number, newRate: number) => {
    if (!activeTariff) return;
    const updatedSlabs = [...activeTariff.slabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      rate: Math.max(0, parseFloat(newRate.toFixed(3))),
    };
    onUpdateTariff({
      ...activeTariff,
      slabs: updatedSlabs,
    });
  };

  const categories = [
    { key: 'domestic' as ConnectionType, label: 'Domestic Grid', icon: Zap, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { key: 'commercial' as ConnectionType, label: 'Commercial Hub', icon: Landmark, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { key: 'industrial' as ConnectionType, label: 'Industrial Complex', icon: Factory, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { key: 'agricultural' as ConnectionType, label: 'Agricultural Sector', icon: Sprout, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="space-y-6" id="tariff-config-root">
      {/* Top dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            Tariff Rate Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure multi-tiered consumer rate slabs, static service fees, and state levies</p>
        </div>
        <button
          id="btn-rec-tariffs"
          onClick={onResetDefaults}
          className="px-4 py-2 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Load Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs (Left Sidebar) */}
        <div className="md:col-span-1 space-y-2">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedTab === cat.key;
            return (
              <button
                key={cat.key}
                id={`tab-btn-${cat.key}`}
                onClick={() => setSelectedTab(cat.key)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 font-semibold text-xs ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900 shadow-xxs'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600'}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span>{cat.label}</span>
              </button>
            );
          })}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[10.5px] font-medium leading-relaxed text-slate-500">
            Tiers represent a progressive structure: customers that conserve energy utilize cheaper low-tier blocks, while heavy consumers scale into upper tariff rates.
          </div>
        </div>

        {/* Configuration settings (Right Workspace) */}
        {activeTariff && (
          <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-base capitalize">{selectedTab} Parameter Matrix</h3>
                <p className="text-xs text-slate-500 mt-1">Fine-tune billing rates and taxes for this active connection segment</p>
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-md font-mono border">
                ACTIVE STATE ENGINE
              </span>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 font-semibold" id="tariff-inputs-grid">
              {/* Charge */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-slate-600 font-medium">Standard Subscription Fee ($)</label>
                <div className="relative mt-1">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="base-charge-input"
                    type="number"
                    step="0.01"
                    value={activeTariff.baseCharge}
                    onChange={(e) => handleBaseChange(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2.5 font-mono font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Charged on every generated bill regardless of energy consumption units.
                </span>
              </div>

              {/* Tax percentage */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-slate-600 font-medium font-sans">State Duty Taxation (%)</label>
                <div className="relative mt-1">
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="tax-percentage-input"
                    type="number"
                    step="0.1"
                    value={activeTariff.taxPercentage}
                    onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2.5 font-mono font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Applicable percentage added as environmental regulatory taxes onto gross values.
                </span>
              </div>
            </div>

            {/* Slabs configuration */}
            <div className="space-y-4">
              <h4 className="font-sans font-semibold text-slate-800 text-sm">Consumption Bracket Unit Slabs</h4>
              <div className="space-y-3" id="tariff-slabs-list">
                {activeTariff.slabs.map((slab, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/40 transition"
                    id={`slab-row-${index}`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono tracking-wider">
                        TIER BRACKET {index + 1}
                      </span>
                      <p className="font-semibold text-slate-700 text-xs">
                        From <strong className="font-mono">{slab.minUnits}</strong> to{' '}
                        <strong className="font-mono">
                          {slab.maxUnits === Infinity ? 'Unlimited' : `${slab.maxUnits}`}
                        </strong>{' '}
                        kWh consumed
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-semibold text-xs text-slate-700 shrink-0 w-full sm:w-auto justify-end">
                      <span className="text-slate-400 font-medium font-sans">Charge Rate ($/kWh):</span>
                      <div className="flex items-center gap-2">
                        <input
                          id={`slab-rate-input-${index}`}
                          type="number"
                          step="0.01"
                          value={slab.rate}
                          onChange={(e) => handleSlabRateChange(index, parseFloat(e.target.value) || 0)}
                          className="w-24 text-center font-mono font-bold text-slate-800 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
