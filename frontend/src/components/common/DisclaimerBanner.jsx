import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner = ({ compact = false }) => {
  return (
    <div className={`rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 ${compact ? 'p-3 text-xs' : 'p-4 text-xs md:text-sm'} text-amber-800 dark:text-amber-300 flex items-start gap-3 shadow-sm`}>
      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
      <div className="leading-relaxed">
        <span className="font-semibold block mb-0.5 text-amber-900 dark:text-amber-200">
          Important Verification Disclaimer:
        </span>
        AI-generated verification is an investigative aid and confidence score, not an absolute mathematical guarantee of truth. News develops continuously as primary evidence unfolds. Always review cited sources and apply independent critical thinking before sharing news content.
      </div>
    </div>
  );
};

export const DemoBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
      DEMO DATA
    </span>
  );
};

export default DisclaimerBanner;
