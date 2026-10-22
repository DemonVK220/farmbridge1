import React, { useState, useEffect, useRef } from 'react';
import { Clock, X, Trash2 } from 'lucide-react';
import { useSearchHistory } from '../utils/useSearchHistory';

interface Props {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  onSelect: (query: string) => void;
  onCommit: (query: string) => void;
}

export const SearchHistoryDropdown: React.FC<Props> = ({ inputRef, query, onSelect, onCommit }) => {
  const { history, add, remove, clear } = useSearchHistory();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const onFocus = () => { if (history.length > 0) setOpen(true); };
    const onBlur = () => setTimeout(() => setOpen(false), 150);
    input.addEventListener('focus', onFocus);
    input.addEventListener('blur', onBlur);
    return () => { input.removeEventListener('focus', onFocus); input.removeEventListener('blur', onBlur); };
  }, [inputRef, history.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter' && query.trim()) add(query); };
    const input = inputRef.current;
    if (!input) return;
    input.addEventListener('keydown', handler);
    return () => input.removeEventListener('keydown', handler);
  }, [inputRef, query, add]);

  if (!open || history.length === 0) return null;

  return (
    <div ref={containerRef} className="absolute top-full mt-1 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs max-w-lg">
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-stone-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Recent Searches</span>
        <button onMouseDown={(e) => { e.preventDefault(); clear(); }} className="text-[10px] text-stone-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer">
          <Trash2 className="w-3 h-3" />Clear
        </button>
      </div>
      <ul>
        {history.map((q) => (
          <li key={q}>
            <button onMouseDown={(e) => { e.preventDefault(); onSelect(q); add(q); setOpen(false); onCommit(q); }}
              className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-emerald-50 group cursor-pointer">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="flex-1 text-stone-800 truncate">{q}</span>
              <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); remove(q); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-stone-100 cursor-pointer" aria-label={`Remove ${q}`}>
                <X className="w-3 h-3 text-stone-500" />
              </button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};