import React from 'react';
import { Sprout } from 'lucide-react';

export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading fresh harvests...' }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center gap-4">
    <div className="w-14 h-14 rounded-3xl bg-emerald-100 flex items-center justify-center animate-pulse">
      <Sprout className="w-7 h-7 text-emerald-700" />
    </div>
    <p className="text-xs font-semibold text-stone-600">{label}</p>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs animate-pulse">
    <div className="aspect-16/10 bg-stone-200" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2"><div className="h-5 bg-stone-200 rounded-full w-24" /><div className="h-5 bg-stone-200 rounded-full w-20" /></div>
      <div className="h-4 bg-stone-200 rounded w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-1/2" />
      <div className="h-12 bg-stone-100 rounded-xl" />
      <div className="h-10 bg-stone-100 rounded-xl" />
    </div>
  </div>
);

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

export const ListSkeleton: React.FC<{ count?: number; variant?: 'row' | 'card' }> = ({ count = 5, variant = 'row' }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`animate-pulse ${variant === 'card' ? 'bg-white rounded-2xl p-4 border border-stone-200' : 'flex items-center gap-3 py-3'}`}>
        <div className="w-12 h-12 rounded-xl bg-stone-200 shrink-0" />
        <div className="flex-1 space-y-2"><div className="h-3 bg-stone-200 rounded w-1/2" /><div className="h-2.5 bg-stone-100 rounded w-1/3" /></div>
      </div>
    ))}
  </div>
);

export const InlineSpinner: React.FC<{ size?: 'sm' | 'md'; color?: string }> = ({ size = 'sm', color = 'text-white' }) => {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <svg className={`${s} ${color} animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
};