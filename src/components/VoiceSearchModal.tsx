import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search, X, Volume2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { language } = useLanguage();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  useEffect(() => {
    let recognition: any = null;

    if (isOpen) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSupportError(
          'Browser speech recognition is not supported in this browser window. You can type your query in the fallback field below.'
        );
        return;
      }

      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        // Set speech language according to app language selection
        if (language === 'ta') {
          recognition.lang = 'ta-IN';
        } else if (language === 'hi') {
          recognition.lang = 'hi-IN';
        } else {
          recognition.lang = 'en-IN';
        }

        recognition.onstart = () => {
          setIsListening(true);
          setSupportError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSupportError('Microphone permission was denied. Please allow microphone access or use typed search.');
          } else {
            setSupportError(`Speech detection: ${event.error}. You can type your query below.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition failed to start:', err);
        setSupportError('Could not initialize speech recognition. Use typed search.');
      }
    } else {
      setTranscript('');
      setIsListening(false);
      setSupportError(null);
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {}
      }
    };
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleApplySearch = () => {
    if (transcript.trim()) {
      onSearch(transcript.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          aria-label="Close Voice Search"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          )}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8" />}
          </div>
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-1">
          {isListening ? 'Listening in ' + (language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English') + '...' : 'Voice Search'}
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Say what produce, variety, or village you are looking for (e.g. &ldquo;Nashik onions&rdquo;, &ldquo;Organic tomatoes&rdquo;, or &ldquo;Dharmapuri&rdquo;)
        </p>

        {supportError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{supportError}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Spoken words will appear here (or type manually)..."
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplySearch();
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplySearch}
              disabled={!transcript.trim()}
              className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Produce</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
