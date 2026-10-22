import React from 'react';
import { IndianRupee } from 'lucide-react';

interface CurrencyProps {
  amount: number | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  unit?: string;
  showZeroAsFree?: boolean;
}

export const Currency: React.FC<CurrencyProps> = ({
  amount,
  size = 'md',
  className = '',
  unit,
  showZeroAsFree = false,
}) => {
  const numAmount = Number(amount);
  if (showZeroAsFree && numAmount === 0) {
    return (
      <span className={`font-bold inline-flex items-center ${className}`}>
        Free (<RupeeSymbol size={11} />0)
      </span>
    );
  }

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 22,
    '2xl': 26,
  };

  return (
    <span className={`inline-flex items-center font-bold tracking-tight ${className}`}>
      <IndianRupee size={iconSizes[size]} className="shrink-0 inline-block mr-0.5 stroke-[2.5]" />
      <span>{typeof amount === 'number' ? amount.toLocaleString() : amount}</span>
      {unit && <span className="font-normal text-xs text-stone-500 ml-0.5">/{unit}</span>}
    </span>
  );
};

export const RupeeSymbol: React.FC<{ size?: number; className?: string }> = ({
  size = 12,
  className = 'inline-block -mt-0.5 shrink-0 stroke-[2.5]',
}) => <IndianRupee size={size} className={className} />;
