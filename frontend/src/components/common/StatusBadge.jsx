import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const normalized = (status || 'UNVERIFIED').toUpperCase();

  const configs = {
    REAL: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      label: 'REAL',
    },
    'LIKELY REAL': {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      label: 'LIKELY REAL',
    },
    MISLEADING: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      label: 'MISLEADING',
    },
    'LIKELY FAKE': {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
      label: 'LIKELY FAKE',
    },
    FAKE: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
      label: 'LIKELY FAKE',
    },
    UNVERIFIED: {
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
      icon: HelpCircle,
      label: 'UNVERIFIED',
    },
  };

  const current = configs[normalized] || configs.UNVERIFIED;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-4 py-2 gap-2 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-sm ${current.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {current.label}
    </span>
  );
};

export default StatusBadge;
