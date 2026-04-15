import { useState, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Slither Wave',
    artist: 'Retro Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'Digital Pulse',
    artist: 'AI Architect',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export function useMusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
    } else {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) audioRef.current.play();
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return {
    currentTrack,
    isPlaying,
    progress,
    togglePlay,
    nextTrack,
    prevTrack,
    tracks: DUMMY_TRACKS,
  };
}
