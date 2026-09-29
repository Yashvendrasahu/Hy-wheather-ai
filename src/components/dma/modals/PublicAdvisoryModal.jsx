// src/components/dma/modals/PublicAdvisoryModal.jsx
import React, { useState } from 'react';
import { useDisasterManagement } from '../../../context/DisasterManagementContext.jsx';
import {
  FileText,
  X,
  Sparkles,
  Send,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Download
} from 'lucide-react';

export default function PublicAdvisoryModal() {
  const {
    showPublicAdvisoryModal,
    setShowPublicAdvisoryModal,
    selectedSector,
    officerUser,
    handlePublishPublicAdvisory,
    showToast
  } = useDisasterManagement();

  const [activeLang, setActiveLang] = useState('EN'); // 'EN' | 'HI'
  const [advisoryEn, setAdvisoryEn] = useState(
    `Urgent Weather Advisory for ${selectedSector.name} & Low-Lying Catchments: Heavy rain spells expected between 4:00 PM and 7:00 PM. Citizens are advised to avoid waterlogged underpasses, stay indoors during peak downpour, and dial 112 / 1077 for emergency assistance. SDRF units have been positioned.`
  );

  const [advisoryHi, setAdvisoryHi] = useState(
    `${selectedSector.name} और निचले जलभराव क्षेत्रों के लिए आवश्यक मौसम परामर्श: शाम 4:00 से 7:00 बजे के बीच भारी बारिश की संभावना है। नागरिकों से अनुरोध है कि जलभराव वाले अंडरपास से बचें, आवश्यक न होने पर घर के अंदर रहें और आपात स्थिति में 112 / 1077 पर संपर्क करें। एसडीआरएफ टीमें तैनात हैं।`
  );

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!showPublicAdvisoryModal) return null;

  const handlePublish = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setShowPublicAdvisoryModal(false);
      handlePublishPublicAdvisory(activeLang === 'EN' ? advisoryEn : advisoryHi, activeLang);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Public Safety Advisory Creator
                </h3>
                <span className="px-2 py-0.2 rounded bg-sky-500/30 text-sky-300 font-mono text-[10px] font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-ASSISTED DRAFT</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized Public Dissemination for Citizen Portals, TV Tickers & SMS
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPublicAdvisoryModal(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs font-bold">
          
          {/* AI Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <strong>Human Authorization Required:</strong> Review and verify this AI-generated plain-language draft before official publication across State Citizen Portals and press wires.
            </div>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-slate-700 uppercase tracking-wider text-[11px]">
              BULLETIN TEXT (DUAL LANGUAGE VERIFIED)
            </span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveLang('EN')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLang === 'EN' ? 'bg-white text-sky-800 shadow-2xs font-black' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('HI')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLang === 'HI' ? 'bg-white text-sky-800 shadow-2xs font-black' : 'text-slate-600'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div>
            {activeLang === 'EN' ? (
              <textarea
                rows={5}
                value={advisoryEn}
                onChange={(e) => setAdvisoryEn(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <textarea
                rows={5}
                value={advisoryHi}
                onChange={(e) => setAdvisoryHi(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>

          {/* Dissemination Target Channels */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
            <div className="font-extrabold text-slate-700">TARGET DISSEMINATION CHANNELS:</div>
            <div className="flex flex-wrap gap-2 text-slate-600">
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">✓ Citizen Weather Portal</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">✓ Press Information Bureau (PIB) Wire</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">✓ Doordarshan / AIR Tickers</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">✓ Public SMS Gateway</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => showToast('Advisory draft saved to EOC workspace.', 'info')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPublicAdvisoryModal(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isAuthorizing}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isAuthorizing ? 'animate-spin' : ''}`} />
              <span>{isAuthorizing ? 'Authorizing...' : 'Authorize & Publish Advisory'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
