import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const MusicController: React.FC<MusicControllerProps> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onToggle}
        type="button"
        title={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'bg-[#8a724d] text-white border-[#b89355] ring-4 ring-[#8a724d]/20 animate-pulse'
            : 'bg-white/90 text-stone-700 border-stone-300 hover:bg-white'
        }`}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-spin-slow" />
        ) : (
          <VolumeX className="w-5 h-5 text-stone-500" />
        )}
      </button>
    </div>
  );
};
