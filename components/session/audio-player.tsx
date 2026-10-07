"use client";

import { useCallback, useEffect, useRef } from "react";

const RATES = [0.75, 1, 1.25] as const;

type Props = {
  src: string;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
};

export function AudioPlayer({
  src,
  playbackRate,
  onPlaybackRateChange,
  onTimeUpdate,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={(event) => {
          const el = event.currentTarget;
          onTimeUpdate(el.currentTime, el.duration || 0);
        }}
        onLoadedMetadata={(event) => {
          const el = event.currentTarget;
          onTimeUpdate(el.currentTime, el.duration || 0);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          재생 / 일시정지
        </button>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          속도
          <select
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            value={playbackRate}
            onChange={(event) =>
              onPlaybackRateChange(Number(event.target.value))
            }
          >
            {RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
