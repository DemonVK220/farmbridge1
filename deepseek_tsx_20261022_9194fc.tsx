import React from 'react';
import { LucideIcon, Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
  variant?: 'default' | 'compact';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package, title, description, actionLabel, onAction, secondaryAction, variant = 'default',
}) => {
  const isCompact = variant === 'compact';
  return (
    <div className={`bg-white rounded-3xl border border-stone-200 text-center ${isCompact ? 'p-8 space-y-2' : 'p-12 space-y-3 max-w-lg mx-auto'}`}>
      <div className={`${isCompact ? 'w-12 h-12' : 'w-16 h-16'} bg-stone-100 rounded-3xl flex items-center justify-center mx-auto text-stone-400`}>
        <Icon className={isCompact ? 'w-6 h-6' : 'w-8 h-8'} />
      </div>
      <h3 className={`font-bold text-stone-900 ${isCompact ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
        {actionLabel && onAction && (
          <button onClick={onAction} className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors">{actionLabel}</button>
        )}
        {secondaryAction && (
          <button onClick={secondaryAction.onClick} className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">{secondaryAction.label}</button>
        )}
      </div>
    </div>
  );
};