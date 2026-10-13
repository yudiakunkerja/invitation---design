import React, { useEffect, useRef } from 'react';
import { MusicConfig } from '../../types/wedding';
import { extractYouTubeId } from '../../utils/youtubeAudio';
import { romanticAudio } from '../../utils/audio';

interface BackgroundAudioPlayerProps {
  isPlaying: boolean;
  music?: MusicConfig;
}

/**
 * Invisible background audio player supporting:
 * 1. Direct YouTube link (audio-only via hidden background embed iframe)
 * 2. Direct MP3/audio URL
 * 3. Web Audio ambient romantic synthesizer (fallback)
 * Note: There is NO visible speaker button, it automatically plays when invitation is opened.
 */
export const BackgroundAudioPlayer: React.FC<BackgroundAudioPlayerProps> = ({
  isPlaying,
  music,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicType = music?.type || 'youtube';
  const youtubeId = music?.youtubeUrl ? extractYouTubeId(music.youtubeUrl) : null;
  const directAudioUrl = music?.audioUrl;

  useEffect(() => {
    if (!isPlaying) {
      // Pause all players
      romanticAudio.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Play according to selected mode
    if (musicType === 'youtube' && youtubeId) {
      // YouTube iframe will autoplay automatically when rendered
      romanticAudio.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else if (musicType === 'audioUrl' && directAudioUrl) {
      romanticAudio.pause();
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      // Fallback to delicate acoustic synthesizer
      romanticAudio.play();
    }

    return () => {
      romanticAudio.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, musicType, youtubeId, directAudioUrl]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: -200,
        right: -200,
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {/* 1. YouTube Audio Embed (Plays only sound, visually hidden) */}
      {isPlaying && musicType === 'youtube' && Boolean(youtubeId?.trim()) && (
        <iframe
          title="Background YouTube Audio"
          width="200"
          height="200"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId!.trim()}?autoplay=1&loop=1&playlist=${youtubeId!.trim()}&controls=0&disablekb=1&fs=0&playsinline=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      )}

      {/* 2. Direct Audio File */}
      {musicType === 'audioUrl' && Boolean(directAudioUrl?.trim()) && (
        <audio
          ref={audioRef}
          src={directAudioUrl!.trim()}
          loop
          preload="auto"
        />
      )}
    </div>
  );
};
