import React, { useState } from 'react';
import { SHORESCAN_SAMPLES } from '../data/mockData';
import { ScreenId } from '../types';

interface ShoreScanScreenProps {
  onNavigate: (screen: ScreenId) => void;
  showToast: (msg: string, icon?: string) => void;
  onDispatchToReports: (sampleKey: string, notes: string, category: string) => void;
}

export const ShoreScanScreen: React.FC<ShoreScanScreenProps> = ({
  onNavigate,
  showToast,
  onDispatchToReports,
}) => {
  const [selectedKey, setSelectedKey] = useState<'sanur' | 'reef' | 'buoy' | 'clean'>('sanur');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('net_hdpe');
  const [fieldNotes, setFieldNotes] = useState(
    'Heavy braided net half-buried in low tide sand near rock jetty. Appears intact, no active wildlife entangled. Requires 2 people with sand shovel.'
  );

  const currentSample = SHORESCAN_SAMPLES[selectedKey];

  const handleSelectSample = (key: 'sanur' | 'reef' | 'buoy' | 'clean') => {
    setSelectedKey(key);
    const sample = SHORESCAN_SAMPLES[key];
    setSelectedCategory(sample.category);
    setFieldNotes(sample.notes);
    showToast(`Loaded ${sample.title} feed`, sample.icon);
  };

  const handleTestDetection = () => {
    setIsScanning(true);
    showToast('Running MobileNet-v3 INT8 optical tensor inference...', 'center_focus_strong');
    setTimeout(() => {
      setIsScanning(false);
      showToast(
        currentSample.hasBox
          ? `Detected ${currentSample.badgeText}`
          : 'Verified: Clean marine substrate',
        'verified'
      );
    }, 600);
  };

  const handleSyncHardware = () => {
    showToast('ESP32-CAM BLE telemetry synced (RSSI: -48dBm, 84% Battery)', 'sync');
  };

  const handleDispatch = () => {
    onDispatchToReports(selectedKey, fieldNotes, selectedCategory);
    showToast(`Incident logged for Sanur Steward dispatch!`, 'rocket_launch');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 max-w-lg mx-auto px-4 space-y-4">
      {/* Top Hardware Connectivity Ribbon */}
      <section className="bg-[#123b4a] text-white p-3.5 rounded-3xl shadow-md border border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#00504a] text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
              <span>Connected (Demo Mode)</span>
            </div>
            <span className="text-xs font-mono text-[#a6ccdf] truncate hidden xs:inline">
              ESP32CAM-v1.4
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleSelectSample('sanur')}
              className="h-7 px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#c2e8fb] flex items-center gap-1 text-xs font-semibold active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset</span>
            </button>
            <button
              onClick={() => showToast('ESP32-S3 hardware settings: BLE v5.0, INT8 Quantized', 'settings')}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#c2e8fb] flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">settings_input_antenna</span>
            </button>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#a6ccdf]/90 font-mono">
          <span className="truncate">Ref: ShoreScan-v1.4-ESP32CAM • Signal: -48dBm</span>
          <span className="shrink-0 flex items-center gap-1 text-[#90f4e9] font-bold">
            <span className="material-symbols-outlined text-xs">battery_horiz_075</span>
            <span>84%</span>
          </span>
        </div>
      </section>

      {/* Physical-to-Digital Architecture Diagram */}
      <section className="bg-[#eef4fc] rounded-3xl p-4 shadow-sm border border-[#dce3eb]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#006a63] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-base">device_hub</span>
            <span>Pipeline Flow</span>
          </span>
          <span className="text-[11px] font-mono text-[#41484b] font-semibold">Edge-to-Action v2</span>
        </div>

        {/* Steps Flow */}
        <div className="overflow-x-auto py-1 -mx-2 px-2 no-scrollbar">
          <div className="flex items-center min-w-[320px] justify-between gap-1 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#123b4a] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">photo_camera</span>
              </div>
              <span className="text-[11px] font-bold text-[#151c22] mt-1 leading-none">ShoreScan</span>
              <span className="text-[9px] text-[#72787c]">ESP32 Cam</span>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#006a63] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">memory</span>
              </div>
              <span className="text-[11px] font-bold text-[#151c22] mt-1 leading-none">Edge AI</span>
              <span className="text-[9px] text-[#72787c]">MobileNet-v3</span>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#c2e8fb] text-[#001f29] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">smartphone</span>
              </div>
              <span className="text-[11px] font-bold text-[#151c22] mt-1 leading-none">TIDEKIND</span>
              <span className="text-[9px] text-[#72787c]">Field Sync</span>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

            {/* Step 4 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#dce3eb] text-[#151c22] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <span className="text-[11px] font-bold text-[#151c22] mt-1 leading-none">Stewards</span>
              <span className="text-[9px] text-[#72787c]">Human Check</span>
            </div>
            <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

            {/* Step 5 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#90f4e9] text-[#007169] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">waves</span>
              </div>
              <span className="text-[11px] font-bold text-[#151c22] mt-1 leading-none">Retrieval</span>
              <span className="text-[9px] text-[#72787c]">Clean Sweep</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#41484b] mt-2 pt-2 border-t border-[#dce3eb]/60 leading-relaxed">
          Physical edge computer vision model detects potential ghost gear; verified by community
          stewards before dispatch.
        </p>
      </section>

      {/* Live Viewfinder & Sample Selector */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-[#151c22] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a63] text-xl">videocam</span>
            <span>Live Edge Viewfinder</span>
          </h2>
          <span className="flex items-center gap-1 text-xs font-bold text-[#ba1a1a] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <span>REC</span>
          </span>
        </div>

        {/* Sample Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {(Object.keys(SHORESCAN_SAMPLES) as (keyof typeof SHORESCAN_SAMPLES)[]).map((key) => {
            const s = SHORESCAN_SAMPLES[key];
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectSample(key as any)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#006a63] text-white'
                    : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Simulated Viewfinder Screen */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#002531] mt-1 shadow-inner">
          <img
            src={currentSample.bgUrl}
            alt={currentSample.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isScanning ? 'scale-105 brightness-110' : 'scale-100'
            }`}
          />

          {/* Camera HUD Overlays */}
          <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
            {/* Top HUD */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[#c2e8fb] bg-[#123b4a]/85 backdrop-blur-xs px-2 py-1 rounded">
              <span>FPS: 18.2 | 640x480</span>
              <span>MobileNet-v3 [INT8]</span>
              <span className="text-[#90f4e9]">CAM: ACTIVE</span>
            </div>

            {/* Bounding Box Overlay */}
            {currentSample.hasBox ? (
              <div
                className={`relative mx-auto my-auto w-3/4 h-3/5 rounded bg-[#006a63]/15 flex flex-col justify-between p-1.5 transition-all duration-300 shadow-[0_0_0_2px_#006a63] ${
                  isScanning ? 'scale-105 ring-4 ring-[#90f4e9]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#006a63] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs">
                    {currentSample.badgeText}
                  </span>
                  <span className="text-[#73d7cd] text-[9px] font-mono font-bold">ROI #1</span>
                </div>

                {/* Center reticle */}
                <div className="self-center w-6 h-6 flex items-center justify-center opacity-70">
                  <span className="material-symbols-outlined text-[#90f4e9] text-xl">
                    filter_center_focus
                  </span>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono text-white bg-[#123b4a]/90 px-1.5 py-0.5 rounded">
                  <span>X: 142 Y: 89 W: 380 H: 260</span>
                  <span className="text-[#ffdbd1] font-bold">{currentSample.risk}</span>
                </div>
              </div>
            ) : (
              /* Clean Shore notice */
              <div className="absolute inset-0 m-auto w-4/5 h-24 bg-[#123b4a]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-3 text-white border border-[#90f4e9]/30">
                <span className="material-symbols-outlined text-[#90f4e9] text-2xl mb-0.5">
                  verified
                </span>
                <span className="text-xs font-bold text-[#90f4e9]">No Derelict Gear Detected</span>
                <span className="text-[10px] text-[#e2e9f1]">Confidence: 98.7% Clean Substrate</span>
              </div>
            )}

            {/* Bottom HUD */}
            <div className="flex items-center justify-between text-[9px] font-mono text-white/90 bg-[#123b4a]/75 backdrop-blur-xs px-2 py-1 rounded">
              <span>EXP: {currentSample.exposure}</span>
              <span>GRID: BALI-SECTOR-03</span>
              <span className="text-[#90f4e9] font-semibold">TIDE: LOW (-0.4m)</span>
            </div>
          </div>
        </div>

        {/* Viewfinder Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={handleTestDetection}
            disabled={isScanning}
            className="h-11 px-4 rounded-full bg-[#006a63] hover:bg-[#007169] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">
              {isScanning ? 'sync' : 'center_focus_strong'}
            </span>
            <span>{isScanning ? 'Scanning...' : 'Test Detection'}</span>
          </button>
          <button
            onClick={handleSyncHardware}
            className="h-11 px-4 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">sync</span>
            <span>Sync Hardware</span>
          </button>
        </div>
      </section>

      {/* Detection Results & Human Verification Panel */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#006a63] uppercase tracking-wider">
              ShoreScan AI Inference Result
            </span>
            <h3 className="text-base font-bold text-[#151c22]">Candidate Gear Dossier</h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#e8eff7] text-[#41484b]">
            Prototype Model
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#eef4fc] text-[#151c22] flex items-center justify-between border border-[#dce3eb]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a63] text-2xl">auto_graph</span>
            <div>
              <div className="text-xs font-bold text-[#151c22] flex items-center gap-1.5">
                <span>{currentSample.confText}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#90f4e9] text-[#00504a] font-bold">
                  Edge High
                </span>
              </div>
              <span className="text-[10px] text-[#41484b]">
                Edge Model: MobileNet-v3-Marine-0.8 (INT8)
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-[#151c22]">10:14 WITA</span>
            <span className="block text-[10px] text-[#72787c]">Live Paired</span>
          </div>
        </div>

        {/* Verification Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#151c22] mb-1">
              Predicted Debris Category (Human Overridable)
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 pl-3 pr-10 rounded-2xl bg-[#f6faff] text-xs font-semibold text-[#151c22] border border-[#dce3eb] appearance-none focus:outline-none focus:ring-2 focus:ring-[#006a63]"
              >
                <option value="net_hdpe">Fishing Net (High-density Polyethylene / Nylon)</option>
                <option value="rope_reef">Derelict Mooring / Polypropylene Line</option>
                <option value="buoy_rig">Drifting Buoy Line & Trap Rigging</option>
                <option value="crab_pot">Wire Trap / Abandoned Lobster Pot</option>
                <option value="negative">False Positive / Clean Marine Substrate</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#72787c] pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="text-[10px] text-[#72787c] block font-semibold">
                Hardware Telemetry
              </span>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[#151c22]">
                <span className="material-symbols-outlined text-sm text-[#006a63]">memory</span>
                <span>ESP32-S3 Lens Clean</span>
              </div>
              <span className="text-[10px] text-[#72787c] font-mono">
                Temp: {currentSample.temp} | RAM: {currentSample.ram}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#f6faff] border border-[#e8eff7]">
              <span className="text-[10px] text-[#72787c] block font-semibold">
                Paired Field GPS
              </span>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[#151c22]">
                <span className="material-symbols-outlined text-sm text-[#006a63]">pin_drop</span>
                <span className="truncate">Sanur Beach, Sec 3</span>
              </div>
              <span className="text-[10px] text-[#72787c] font-mono">{currentSample.coordinates}</span>
            </div>
          </div>

          {/* Field Steward Ground Notes */}
          <div>
            <label className="block text-xs font-bold text-[#151c22] mb-1">
              Field Steward Ground Notes
            </label>
            <textarea
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#f6faff] text-xs text-[#151c22] border border-[#dce3eb] focus:outline-none focus:ring-2 focus:ring-[#006a63] resize-none"
              rows={3}
            ></textarea>
          </div>

          {/* Safety Advisory Banner */}
          <div className="p-3 rounded-2xl bg-[#ffdad6]/60 text-[#ba1a1a] flex items-start gap-2 border border-[#ffdad6]">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">info</span>
            <p className="text-xs font-medium leading-snug">
              <strong>Important Safety Protocol:</strong> ShoreScan flags candidate debris. It does{' '}
              <span className="underline">NOT</span> automatically verify ghost gear or authorize
              unassisted marine salvage. Always adhere to local harbor salvage permits.
            </p>
          </div>

          {/* Action Triggers */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={handleDispatch}
              className="w-full h-12 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              <span>Send to TIDEKIND Community Reports</span>
            </button>
            <button
              onClick={() => onNavigate('dossiers')}
              className="w-full h-11 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">format_list_bulleted</span>
              <span>View Community Reports (14 Active in Sector)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edge History (Recent ShoreScan Syncs) */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#e8eff7]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold text-[#006a63] uppercase tracking-wider">
              Edge History
            </span>
            <h3 className="text-base font-bold text-[#151c22]">Recent ShoreScan Syncs</h3>
          </div>
          <span className="text-xs text-[#72787c] font-mono">3 Logs</span>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <div className="p-3 rounded-2xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#002531] font-bold">#SS-2025-042</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#90f4e9] text-[#00504a]">
                  Ready to Send
                </span>
              </div>
              <p className="text-xs font-bold text-[#151c22] truncate mt-0.5">
                Fishing Net (Gillnet Segment)
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#72787c] font-mono mt-0.5">
                <span className="text-[#006a63] font-bold">91.4% Edge Conf</span>
                <span>•</span>
                <span>Today, 10:14 WITA</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('dossiers')}
              className="shrink-0 h-8 px-3 rounded-full bg-white hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <span>Review</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          {/* Item 2 */}
          <div className="p-3 rounded-2xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#002531] font-bold">#SS-2025-041</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c2e8fb] text-[#001f29]">
                  In Review
                </span>
              </div>
              <p className="text-xs font-bold text-[#151c22] truncate mt-0.5">
                Heavy Rope & Mooring Float
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#72787c] font-mono mt-0.5">
                <span>88.2% Edge Conf</span>
                <span>•</span>
                <span>Yesterday, 16:40 WITA</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('dossiers')}
              className="shrink-0 h-8 px-3 rounded-full bg-white hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <span>Details</span>
              <span className="material-symbols-outlined text-xs">visibility</span>
            </button>
          </div>

          {/* Item 3 */}
          <div className="p-3 rounded-2xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#002531] font-bold">#SS-2025-039</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006a63] text-white">
                  Action Planned
                </span>
              </div>
              <p className="text-xs font-bold text-[#151c22] truncate mt-0.5">
                Abandoned Wire Crab Trap
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#72787c] font-mono mt-0.5">
                <span>76.5% Edge Conf</span>
                <span>•</span>
                <span>2 days ago</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('dossiers')}
              className="shrink-0 h-8 px-3 rounded-full bg-white hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <span>Action Log</span>
              <span className="material-symbols-outlined text-xs">checklist</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
