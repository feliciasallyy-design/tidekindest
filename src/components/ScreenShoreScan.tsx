import React, { useState } from 'react';
import { ScreenId } from '../types';
import { SHORESCAN_SAMPLES } from '../data/mockData';

interface ScreenShoreScanProps {
  onNavigate: (screen: ScreenId) => void;
  onToast: (msg: string, icon?: string) => void;
  onNewReportAdded?: (reportId: string) => void;
}

export const ScreenShoreScan: React.FC<ScreenShoreScanProps> = ({
  onNavigate,
  onToast,
  onNewReportAdded,
}) => {
  const [selectedKey, setSelectedKey] = useState<'sanur' | 'reef' | 'buoy' | 'clean'>('sanur');
  const [testingDetection, setTestingDetection] = useState(false);
  const [category, setCategory] = useState('net_hdpe');
  const [fieldNotes, setFieldNotes] = useState(
    'Heavy braided net half-buried in low tide sand near rock jetty. Appears intact, no active wildlife entangled. Requires 2 people with sand shovel.'
  );

  const activeSample = SHORESCAN_SAMPLES[selectedKey] || SHORESCAN_SAMPLES.sanur;

  const handleSelectSample = (key: 'sanur' | 'reef' | 'buoy' | 'clean') => {
    setSelectedKey(key);
    const data = SHORESCAN_SAMPLES[key];
    if (data) {
      setCategory(data.category);
      setFieldNotes(data.notes);
      onToast(`Switched sensor viewfinder to ${data.title}`);
    }
  };

  const handleTestDetection = () => {
    setTestingDetection(true);
    setTimeout(() => {
      setTestingDetection(false);
      onToast('Optical inference re-run complete: 91.4% confidence verified', 'center_focus_strong');
    }, 600);
  };

  const handleSyncHardware = () => {
    onToast('Hardware synced with ESP32-CAM node over BLE (0 packet drops)', 'sync');
  };

  const handleSendToCommunity = () => {
    onToast('Dispatched to TIDEKIND! Incident #SS-2025-043 logged for Sanur Steward dispatch.', 'rocket_launch');
    if (onNewReportAdded) {
      onNewReportAdded('SS-2025-043');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-lg mx-auto">
      {/* Top Hardware Connectivity Ribbon */}
      <section className="bg-[#123b4a] text-white px-4 py-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#90f4e9] text-[#007169] text-[11px] font-bold font-['DM_Sans'] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#006a63] animate-ping"></span>
              <span>Connected (Demo Mode)</span>
            </div>
            <span className="text-[11px] font-mono text-[#a6ccdf] truncate hidden xs:inline">
              ESP32CAM-v1.4
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectSample('sanur')}
              className="h-7 px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#c2e8fb] flex items-center gap-1 text-[11px] font-semibold active:scale-95 transition-all font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => onToast('ESP32-CAM node configuration: Baud 115200, Sensor OV2640')}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#c2e8fb] flex items-center justify-center active:scale-95 transition-all"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined text-sm">settings_input_antenna</span>
            </button>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#a6ccdf]/80">
          <span className="truncate">Ref: ShoreScan-v1.4-ESP32CAM • Signal: -48dBm</span>
          <span className="shrink-0 flex items-center gap-1 text-[#90f4e9]">
            <span className="material-symbols-outlined text-[14px]">battery_horiz_075</span> 84%
          </span>
        </div>
      </section>

      {/* Physical-to-Digital Architecture Diagram */}
      <section className="px-4 pt-3 pb-1">
        <div className="bg-[#eef4fc] rounded-2xl p-4 shadow-xs border border-[#dce3eb]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#006a63] uppercase tracking-wider flex items-center gap-1 font-['DM_Sans']">
              <span className="material-symbols-outlined text-base">device_hub</span> Pipeline Flow
            </span>
            <span className="text-[11px] text-[#41484b] font-mono">Edge-to-Action v2</span>
          </div>

          {/* Pipeline Steps Flow */}
          <div className="overflow-x-auto py-1 -mx-2 px-2 no-scrollbar">
            <div className="flex items-center min-w-[340px] justify-between gap-1">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#123b4a] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                </div>
                <span className="text-[11px] font-bold text-[#151c22] mt-1 font-['DM_Sans']">ShoreScan</span>
                <span className="text-[9px] text-[#41484b] leading-tight">ESP32 Cam</span>
              </div>
              <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#006a63] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-base">memory</span>
                </div>
                <span className="text-[11px] font-bold text-[#151c22] mt-1 font-['DM_Sans']">Edge AI</span>
                <span className="text-[9px] text-[#41484b] leading-tight">MobileNet-v3</span>
              </div>
              <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#c2e8fb] text-[#001f29] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-base">smartphone</span>
                </div>
                <span className="text-[11px] font-bold text-[#151c22] mt-1 font-['DM_Sans']">TIDEKIND</span>
                <span className="text-[9px] text-[#41484b] leading-tight">Field Sync</span>
              </div>
              <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#dce3eb] text-[#151c22] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                </div>
                <span className="text-[11px] font-bold text-[#151c22] mt-1 font-['DM_Sans']">Stewards</span>
                <span className="text-[9px] text-[#41484b] leading-tight">Human Check</span>
              </div>
              <span className="material-symbols-outlined text-[#73d7cd] text-xs shrink-0">arrow_forward</span>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-8 h-8 rounded-full bg-[#90f4e9] text-[#007169] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-base">waves</span>
                </div>
                <span className="text-[11px] font-bold text-[#151c22] mt-1 font-['DM_Sans']">Retrieval</span>
                <span className="text-[9px] text-[#41484b] leading-tight">Clean Sweep</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#41484b] mt-2 pt-2 border-t border-[#dce3eb] leading-relaxed font-['Inter']">
            Physical edge computer vision model detects potential ghost gear; verified by community stewards before dispatch.
          </p>
        </div>
      </section>

      {/* Live Viewfinder & Sample Selector */}
      <section className="px-4 pt-2 pb-2">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#151c22] flex items-center gap-1.5 font-['DM_Sans']">
              <span className="material-symbols-outlined text-[#006a63] text-xl">videocam</span>
              <span>Live Edge Viewfinder</span>
            </h2>
            <span className="flex items-center gap-1 text-xs font-bold text-[#ba1a1a] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span> REC
            </span>
          </div>

          {/* Sample Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
            {(['sanur', 'reef', 'buoy', 'clean'] as const).map((key) => {
              const item = SHORESCAN_SAMPLES[key];
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectSample(key)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center gap-1 font-['DM_Sans'] ${
                    isSelected
                      ? 'bg-[#006a63] text-white'
                      : 'bg-[#e8eff7] text-[#41484b] hover:bg-[#dce3eb]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Simulated Viewfinder Screen */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#002531] mt-1 shadow-inner">
            {/* Viewfinder Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${activeSample.bgUrl})` }}
            ></div>

            {/* Camera HUD Overlays */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              {/* Top HUD */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#c2e8fb] bg-[#123b4a]/85 backdrop-blur-xs px-2 py-1 rounded-md">
                <span>FPS: 18.2 | 640x480</span>
                <span>MobileNet-v3 [INT8]</span>
                <span className="text-[#90f4e9]">CAM: ACTIVE</span>
              </div>

              {/* Bounding Box Overlay */}
              {activeSample.hasBox ? (
                <div
                  className={`relative mx-auto my-auto w-3/4 h-3/5 rounded-lg bg-[#006a63]/10 flex flex-col justify-between p-1.5 transition-all duration-300 shadow-[0_0_0_2px_#168C83] ${
                    testingDetection ? 'scale-105 ring-4 ring-[#90f4e9]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-[#006a63] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs truncate max-w-[200px]">
                      {activeSample.badgeText}
                    </span>
                    <span className="text-[#73d7cd] text-[10px] font-mono font-bold">ROI #1</span>
                  </div>

                  {/* Target Reticle Overlay */}
                  <div className="self-center w-6 h-6 flex items-center justify-center opacity-70">
                    <span className="material-symbols-outlined text-[#90f4e9] text-2xl">filter_center_focus</span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-white bg-[#123b4a]/90 px-1.5 py-0.5 rounded">
                    <span>X: 142 Y: 89 W: 380 H: 260</span>
                    <span className="text-[#ffb5a1] font-bold">{activeSample.risk}</span>
                  </div>
                </div>
              ) : (
                /* Negative Test HUD Notice */
                <div className="m-auto w-4/5 h-20 bg-[#123b4a]/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-2 text-white">
                  <span className="material-symbols-outlined text-[#90f4e9] text-2xl mb-0.5">verified</span>
                  <span className="text-xs font-bold text-[#90f4e9] font-['DM_Sans']">No Derelict Gear Detected</span>
                  <span className="text-[10px] text-slate-300">Confidence: 98.7% Clean Substrate</span>
                </div>
              )}

              {/* Bottom HUD */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/90 bg-[#123b4a]/75 backdrop-blur-xs px-2 py-1 rounded-md">
                <span>EXP: {activeSample.exposure}</span>
                <span>GRID: BALI-SECTOR-03</span>
                <span className="text-[#90f4e9] font-semibold">TIDE: LOW (-0.4m)</span>
              </div>
            </div>
          </div>

          {/* Viewfinder Quick Action Bar */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              disabled={testingDetection}
              onClick={handleTestDetection}
              className={`h-11 px-4 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all font-['DM_Sans'] ${
                testingDetection ? 'opacity-70' : ''
              }`}
            >
              <span className="material-symbols-outlined text-lg">center_focus_strong</span>
              <span>{testingDetection ? 'Analyzing...' : 'Test Detection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncHardware}
              className="h-11 px-4 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all font-['DM_Sans']"
            >
              <span className="material-symbols-outlined text-lg">sync</span>
              <span>Sync Hardware</span>
            </button>
          </div>
        </div>
      </section>

      {/* Detection Results & Human Verification Panel */}
      <section className="px-4 pt-1 pb-2">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7]">
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-xs font-bold text-[#006a63] uppercase tracking-wider font-['DM_Sans']">
                ShoreScan AI Inference Result
              </span>
              <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Candidate Gear Dossier</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8eff7] text-[#41484b] shrink-0">
              Prototype Model
            </span>
          </div>

          <div className="mt-2 p-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs flex items-center justify-between border border-[#dce3eb]/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a63] text-xl">auto_graph</span>
              <div>
                <div className="text-xs font-bold text-[#151c22] flex items-center gap-1.5 font-['DM_Sans']">
                  <span>{activeSample.confText}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#90f4e9] text-[#00504a]">Edge High</span>
                </div>
                <span className="text-[10px] text-[#41484b] font-['Inter']">
                  Edge Model: MobileNet-v3-Marine-0.8 (INT8 quantized)
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono text-[#151c22] font-bold">10:14 WITA</span>
              <span className="block text-[10px] text-[#41484b]">Live Paired</span>
            </div>
          </div>

          {/* Verification Form */}
          <form className="space-y-3 mt-3" onSubmit={(e) => e.preventDefault()}>
            {/* Editable Category */}
            <div>
              <label className="block text-xs font-bold text-[#151c22] mb-1 font-['DM_Sans']" htmlFor="gearCategory">
                Predicted Debris Category (Human Overridable)
              </label>
              <div className="relative">
                <select
                  id="gearCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs font-medium appearance-none focus:outline-none focus:bg-[#e2e9f1] transition-colors"
                >
                  <option value="net_hdpe">Fishing Net (High-density Polyethylene / Nylon)</option>
                  <option value="rope_reef">Derelict Mooring / Polypropylene Line</option>
                  <option value="buoy_rig">Drifting Buoy Line &amp; Trap Rigging</option>
                  <option value="crab_pot">Wire Trap / Abandoned Lobster Pot</option>
                  <option value="negative">False Positive / Clean Marine Substrate</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-[#41484b] pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
            </div>

            {/* Sensor & Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#eef4fc] border border-[#dce3eb]/50">
                <span className="text-[10px] text-[#41484b] block font-semibold font-['DM_Sans']">
                  Hardware Telemetry
                </span>
                <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[#151c22] font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm text-[#006a63]">memory</span>
                  <span>ESP32-S3 Lens Clean</span>
                </div>
                <span className="text-[10px] text-[#41484b] font-mono">
                  Temp: {activeSample.temp} | RAM: {activeSample.ram}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#eef4fc] border border-[#dce3eb]/50">
                <span className="text-[10px] text-[#41484b] block font-semibold font-['DM_Sans']">
                  Paired Field GPS
                </span>
                <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[#151c22] font-['DM_Sans']">
                  <span className="material-symbols-outlined text-sm text-[#006a63]">pin_drop</span>
                  <span className="truncate">Sanur Beach, Sector 3</span>
                </div>
                <span className="text-[10px] text-[#41484b] font-mono">{activeSample.coordinates}</span>
              </div>
            </div>

            {/* Field Ground Notes */}
            <div>
              <label className="block text-xs font-bold text-[#151c22] mb-1 font-['DM_Sans']" htmlFor="fieldNotes">
                Field Steward Ground Notes
              </label>
              <textarea
                id="fieldNotes"
                rows={3}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#eef4fc] text-[#151c22] text-xs focus:outline-none focus:bg-[#e2e9f1] transition-colors resize-none font-['Inter']"
              ></textarea>
            </div>

            {/* Safety Protocol Banner */}
            <div className="p-3 rounded-xl bg-[#ffdad6]/60 text-[#460b00] flex items-start gap-2 border border-[#ffdad6]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0 mt-0.5">info</span>
              <div className="text-[11px] leading-snug font-['Inter']">
                <strong className="font-bold">Important Safety Protocol:</strong> ShoreScan flags candidate debris. It does{' '}
                <span className="underline">NOT</span> automatically verify ghost gear or authorize unassisted marine salvage. Always adhere to local harbor salvage permits.
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSendToCommunity}
                className="w-full h-12 rounded-full bg-[#006a63] hover:bg-[#123b4a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                <span>Send to TIDEKIND Community Reports</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dossiers')}
                className="w-full h-11 rounded-full bg-[#e8eff7] hover:bg-[#dce3eb] text-[#002531] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all font-['DM_Sans']"
              >
                <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                <span>View Community Reports (14 Active in Sector)</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Recent ShoreScan Sync Queue */}
      <section className="px-4 pt-1 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8eff7]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-[#006a63] uppercase tracking-wider font-['DM_Sans']">
                Edge History
              </span>
              <h3 className="text-base font-bold text-[#151c22] font-['DM_Sans']">Recent ShoreScan Syncs</h3>
            </div>
            <span className="text-xs font-mono text-[#41484b]">3 Logs</span>
          </div>

          <div className="space-y-2">
            {/* Item 1 */}
            <div className="p-3 rounded-xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-[#151c22]">#SS-2025-042</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#90f4e9] text-[#00504a]">
                    Ready to Send
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#151c22] truncate mt-0.5 font-['DM_Sans']">
                  Fishing Net (Gillnet Segment)
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#41484b] mt-0.5 font-mono">
                  <span className="text-[#006a63] font-bold">91.4% Edge Conf</span>
                  <span>•</span>
                  <span>Today, 10:14 WITA</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dossiers')}
                className="shrink-0 h-8 px-3 rounded-full bg-[#dce3eb] hover:bg-[#c1c7cb] text-[#002531] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all font-['DM_Sans']"
              >
                <span>Review</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            {/* Item 2 */}
            <div className="p-3 rounded-xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-[#151c22]">#SS-2025-041</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#123b4a] text-white">
                    In Review
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#151c22] truncate mt-0.5 font-['DM_Sans']">
                  Heavy Rope &amp; Mooring Float
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#41484b] mt-0.5 font-mono">
                  <span>88.2% Edge Conf</span>
                  <span>•</span>
                  <span>Yesterday, 16:40 WITA</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dossiers')}
                className="shrink-0 h-8 px-3 rounded-full bg-[#dce3eb] hover:bg-[#c1c7cb] text-[#002531] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all font-['DM_Sans']"
              >
                <span>Details</span>
                <span className="material-symbols-outlined text-xs">visibility</span>
              </button>
            </div>

            {/* Item 3 */}
            <div className="p-3 rounded-xl bg-[#eef4fc] flex items-center justify-between gap-2 border border-[#dce3eb]/40">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-[#151c22]">#SS-2025-039</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#006a63] text-white">
                    Action Planned
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#151c22] truncate mt-0.5 font-['DM_Sans']">
                  Abandoned Wire Crab Trap
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#41484b] mt-0.5 font-mono">
                  <span>76.5% Edge Conf</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dossiers')}
                className="shrink-0 h-8 px-3 rounded-full bg-[#dce3eb] hover:bg-[#c1c7cb] text-[#002531] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all font-['DM_Sans']"
              >
                <span>Action Log</span>
                <span className="material-symbols-outlined text-xs">checklist</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
