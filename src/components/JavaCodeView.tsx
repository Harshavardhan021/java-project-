/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Copy, Check, Play, BookOpen, Trash2, Cpu, FileCode2 } from 'lucide-react';
import { javaFiles } from '../mockData';

export default function JavaCodeView() {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Microsoft Windows [Version 10.0.22631]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\workspace\\electricity-billing-system> java -version',
    'openjdk version "21.0.2" 2024-01-16 LTS',
    'OpenJDK Runtime Environment Temurin-21.0.2+13 (build 21.0.2+13-LTS)',
    'OpenJDK 64-Bit Server VM Temurin-21.0.2+13 (build 21.0.2+13-LTS, mixed mode, sharing)',
    '',
    'C:\\workspace\\electricity-billing-system> _ (Select a quick demo execution script below)'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const activeFile = javaFiles[activeFileIndex];

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Handle clipboard actions
  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to push logs with a slight typing delay
  const pushSimulatedLogs = async (lines: string[], delayMs = 150) => {
    setIsSimulating(true);
    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      setTerminalLogs((prev) => [...prev, line]);
    }
    setIsSimulating(false);
  };

  // Simulation script runners
  const runMainSimulation = () => {
    if (isSimulating) return;
    setTerminalLogs((prev) => [
      ...prev,
      '',
      'C:\\workspace\\electricity-billing-system> javac com/billing/*.java',
      '[INFO] Compiling ConnectionType.java...',
      '[INFO] Compiling Consumer.java...',
      '[INFO] Compiling TariffSlab.java...',
      '[INFO] Compiling Bill.java...',
      '[INFO] Compiling ElectricityBillingSystem.java...',
      '[INFO] Compiling Main.java...',
      '[INFO] Compilation completed successfully. Output path target/classes/',
      '',
      'C:\\workspace\\electricity-billing-system> java com.billing.Main',
    ]);

    const executionLog = [
      '⚡ [JVM] Booting virtual threading container...',
      '=== INITIALIZING JAVA ELECTRICITY SYSTEM ===',
      '-> [Success] Registered consumer: Eleanor Vance [CON_1001]',
      '-> [Success] Registered consumer: Apex Market [CON_1002]',
      '',
      '--- GENERATING MAY 2026 METER READINGS ---',
      '-> [Calculated] Auto-billed 215.0 units for Eleanor Vance',
      '-> [Calculated] Auto-billed 670.0 units for Apex Market',
      '',
      '--- SIMULATING REAL-TIME TRANSACTION ---',
      '-> [Payment] Success! Confirmed payment of $57.02 for bill: BIL_5001',
      '',
      '========== CORE JAVA REPORT SYSTEM ==========',
      'Registered Consumers Count: 2',
      'Generated Bills Count:      2',
      'Total Amount Billed:        $354.38',
      'Total Amount Collected:     $57.02',
      '=============================================',
      '',
      'C:\\workspace\\electricity-billing-system> _'
    ];

    pushSimulatedLogs(executionLog, 200);
  };

  const runConsumerRegistrySimulation = () => {
    if (isSimulating) return;
    setTerminalLogs((prev) => [
      ...prev,
      '',
      'C:\\workspace\\electricity-billing-system> java -cp target/classes com.billing.TestRegistry',
    ]);

    const executionLog = [
      '☕ Initializing TestRegistry unit driver...',
      '🔍 Inspecting Object Memory allocations (TariffRegistry initialized):',
      '   - DOMESTIC      -> Map Entry: 3 progressive Slabs loaded',
      '   - COMMERCIAL    -> Map Entry: 3 progressive Slabs loaded',
      '   - INDUSTRIAL    -> Map Entry: 2 progressive Slabs loaded',
      '   - AGRICULTURAL  -> Map Entry: 1 progressive Slab loaded',
      '',
      '🛠️ Instantiating Consumer instances on Heap:',
      '   - Eleanor Vance: ConnectionType=DOMESTIC, addr="742 Evergreen"',
      '   - Hilltop Farms: ConnectionType=AGRICULTURAL, addr="Rural Route 4"',
      '',
      '🚀 Calling ElectricityBillingSystem.registerConsumer():',
      '-> [Success] Registered consumer: Eleanor Vance [CON_1001]',
      '-> [Success] Registered consumer: Hilltop Farms [CON_1004]',
      '',
      '✅ [Success] All Object state parameters validated on Heap. Memory reference OK.',
      'C:\\workspace\\electricity-billing-system> _'
    ];

    pushSimulatedLogs(executionLog, 150);
  };

  const runSlabDiagnosticsSimulation = () => {
    if (isSimulating) return;
    setTerminalLogs((prev) => [
      ...prev,
      '',
      'C:\\workspace\\electricity-billing-system> java -cp target/classes com.billing.TestSlabs',
    ]);

    const executionLog = [
      '☕ Running Slab diagnostics for connection type: COMMERCIAL',
      '🔍 Testing tiered bill calculation logic for consumption: 670 kWh',
      '   Tariff config: baseCharge=$45, tax=12%',
      '',
      '🧾 [Diagnostics LOG] Math steps:',
      '   1. Slab 1 [0 - 200 kWh]: 200 units * $0.24 = $48.00',
      '   2. Slab 2 [201 - 500 kWh]: 300 units * $0.32 = $96.00',
      '   3. Slab 3 [501 - Infinity]: 170 units * $0.45 = $76.50',
      '   -----------------------------------------------------',
      '   Calculated Gross Slabs Sum:                     $220.50',
      '   Add Base Fixed Charges:                          $45.00',
      '   Taxable base sum:                               $265.50',
      '   Add State Duty/Levy tax (12% of 265.50):         $31.86',
      '   -----------------------------------------------------',
      '   ESTIMATED NET BILL AMOUNT:                      $297.36',
      '',
      '✅ Assertion Test Passed: Calculated $297.36 matches client database expectations.',
      'C:\\workspace\\electricity-billing-system> _'
    ];

    pushSimulatedLogs(executionLog, 180);
  };

  const clearTerminal = () => {
    setTerminalLogs([
      'C:\\workspace\\electricity-billing-system> cls',
      'C:\\workspace\\electricity-billing-system> _ (Terminal buffer wiped)'
    ]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="java-view-root">
      
      {/* Java Code Browser (Left Side - 7 columns) */}
      <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between" id="java-code-panel">
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Java OOP Architecture Core
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore standard multi-class Object Oriented designs and entity structures</p>
            </div>
            
            <button
              id="copy-java-code-btn"
              onClick={handleCopyCode}
              className="px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1 focus:outline-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Tab buttons representing multiple java classes */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3" id="java-classes-tabs">
            {javaFiles.map((file, idx) => (
              <button
                key={file.name}
                id={`java-tab-${idx}`}
                onClick={() => {
                  setActiveFileIndex(idx);
                  setCopied(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeFileIndex === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-transparent hover:border-slate-200'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                {file.name}
              </button>
            ))}
          </div>

          {/* Description for current active Java file */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">{activeFile.name}</p>
              <p className="mt-0.5 font-medium">{activeFile.description}</p>
            </div>
          </div>

          {/* Code display segment */}
          <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-900 border-t-4 border-t-blue-600 font-mono text-[11.5px] leading-relaxed text-slate-300 max-h-[460px] overflow-y-auto select-text shadow-inner">
            <pre className="whitespace-pre">{activeFile.code}</pre>
          </div>
        </div>

        {/* Java Design Patterns educational info footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-semibold uppercase font-mono tracking-wider flex justify-between items-center">
          <span>Target Architecture: JDK 21+</span>
          <span className="text-slate-500 bg-slate-50 py-1 px-2 border rounded-md">Enterprise OO Patterns</span>
        </div>
      </div>

      {/* Retro Simulator Console (Right Side - 5 columns) */}
      <div className="xl:col-span-5 flex flex-col gap-4 text-xs font-semibold text-slate-700" id="java-terminal-panel">
        
        {/* Console Box */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl h-[460px]">
          
          {/* Header segment of the console */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="font-sans font-semibold text-xs tracking-tight text-slate-300">Java Virtual CLI Terminal</span>
            </div>
            
            {/* Control lights */}
            <div className="flex gap-1.5 items-center">
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] text-slate-500 font-semibold font-mono tracking-wide uppercase">
                {isSimulating ? 'SIMULATING RUN' : 'ONLINE'}
              </span>
            </div>
          </div>

          {/* Virtual terminal content window */}
          <div className="p-4 overflow-y-auto flex-1 font-mono text-[10.5px] leading-relaxed text-[#00ff66] bg-slate-950 select-text scrollbar-thin">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {log}
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Console controls bar */}
          <div className="bg-slate-900/40 border-t border-slate-800/80 p-3 flex gap-2 shrink-0">
            <button
              id="term-btn-cls"
              onClick={clearTerminal}
              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700/80 text-amber-500 font-semibold transition hover:text-amber-400 rounded-md flex items-center gap-1"
              title="Clear Terminal Buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              CLS
            </button>
            <div className="text-[10px] text-slate-500 font-sans flex items-center justify-end flex-grow">
              Compiled inside simulated JVM Container
            </div>
          </div>
        </div>

        {/* Diagnostic controls triggers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="font-sans font-semibold text-slate-800 text-sm">Interactive Console Triggers</h3>
            <p className="text-[11px] text-slate-500">Call standard class compiled endpoints to demo OOP state functions</p>
          </div>

          <div className="grid grid-cols-2 gap-3" id="terminal-trigger-buttons">
            <button
              id="term-trigger-main"
              onClick={runMainSimulation}
              disabled={isSimulating}
              className="px-3.5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50"
            >
              <Play className="w-4 h-4 text-emerald-400 shrink-0" />
              Run Main.java
            </button>

            <button
              id="term-trigger-diag"
              onClick={runSlabDiagnosticsSimulation}
              disabled={isSimulating}
              className="px-3.5 py-3 hover:bg-slate-100 text-slate-800 rounded-xl transition border border-slate-200 flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50"
            >
              <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
              Slab Diagnostics
            </button>

            <button
              id="term-trigger-reg"
              onClick={runConsumerRegistrySimulation}
              disabled={isSimulating}
              className="px-3.5 py-3 hover:bg-slate-100 text-slate-800 rounded-xl transition border border-slate-200 flex items-center justify-center gap-2 font-bold text-xs col-span-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 text-blue-500 shrink-0" />
              Benchmark Registry Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
