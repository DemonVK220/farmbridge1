import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SaveButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline';
  className?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ productId, size = 'md', variant = 'floating', className = '' }) => {
  const { isSaved, toggleSaveProduct } = useApp();
  const saved = isSaved(productId);
  const iconSize = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }[size];
  const padding = { sm: 'p-1.5', md: 'p-2', lg: 'p-2.5' }[size];

  return (
    <button type="button"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleSaveProduct(productId); }}
      className={`${variant === 'floating' ? 'absolute top-3 right-3 bg-white/95 hover:bg-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200'} ${padding} rounded-xl transition-all hover:scale-110 cursor-pointer ${className}`}
      aria-label={saved ? 'Remove from saved' : 'Save to favourites'} aria-pressed={saved}
      title={saved ? 'Saved — click to remove' : 'Save for later'}>
      <Heart className={`${iconSize} ${saved ? 'text-red-500 fill-red-500' : 'text-stone-600'}`} />
    </button>
  );
};