"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AvatarFrame } from "./visuals/AvatarFrame";
import { SceneVisual } from "./visuals/SceneVisual";

type Segment = {
  id: string;
  text: string;
  duration: number;
  visual: "efficiency" | "discovery" | "tools" | "free";
};

const segments: Segment[] = [
  {
    id: "hours",
    text: "People are saving HOURS every week using new free AI tools…",
    duration: 5400,
    visual: "efficiency",
  },
  {
    id: "unknown",
    text: "but most people still don’t know they exist.",
    duration: 3800,
    visual: "discovery",
  },
  {
    id: "tools",
    text: "Today, I’ll show you 5 powerful AI tools that can boost your productivity instantly",
    duration: 6200,
    visual: "tools",
  },
  {
    id: "free",
    text: "— and every one of them is completely free.",
    duration: 4200,
    visual: "free",
  },
];

const totalDuration = segments.reduce((acc, segment) => acc + segment.duration, 0);

export function Experience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const script = useMemo(
    () => segments.map((segment) => segment.text).join(" "),
    []
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const resetPlayback = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clearTimers();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current = null;
    }
    startTimeRef.current = null;
  }, [clearTimers]);

  const scheduleSegments = useCallback(() => {
    let cumulative = 0;
    segments.forEach((segment, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setCurrentSegmentIndex(index);
        }, cumulative)
      );
      cumulative += segment.duration;
    });

    timersRef.current.push(
      window.setTimeout(() => {
        setIsPlaying(false);
      }, cumulative)
    );
  }, []);

  const handlePlay = useCallback(() => {
    resetPlayback();
    setElapsedMs(0);
    setCurrentSegmentIndex(0);
    startTimeRef.current = performance.now();
    setIsPlaying(true);
  }, [resetPlayback]);

  useEffect(() => {
    return () => {
      resetPlayback();
    };
  }, [resetPlayback]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const animate = () => {
      if (startTimeRef.current !== null) {
        setElapsedMs(performance.now() - startTimeRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    scheduleSegments();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.lang = "en-US";
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearTimers();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, scheduleSegments, script, clearTimers]);

  const currentSegment = segments[currentSegmentIndex];
  const progress = Math.min(elapsedMs / totalDuration, 1);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#050712] via-[#06091a] to-[#03030b] px-6 py-16 text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,167,255,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(111,76,255,0.18),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(48,212,161,0.16),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.04)_100%)] mix-blend-screen" />
      </div>

      <main className="relative z-10 flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-4 text-center lg:text-left">
          <span className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium uppercase tracking-[0.3em] text-slate-200/80 backdrop-blur lg:mx-0">
            AI Productivity Briefing
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl lg:text-6xl">
            Cinematic AI Avatar Showcase
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 lg:mx-0">
            Watch a confident AI guide narrate the story while cinematic B-roll
            reacts to every beat of the script.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(14,28,75,0.9)] backdrop-blur-xl">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
            <SceneVisual variant={currentSegment.visual} />
            <div className="relative z-10 mx-auto max-w-md">
              <AvatarFrame speaking={isPlaying} mood={currentSegment.visual} />
            </div>
          </section>

          <section className="flex h-full flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium tracking-tight text-slate-100">
                Narration Timeline
              </h2>
              <span className="text-sm uppercase tracking-[0.2em] text-slate-300/70">
                {Math.round(progress * 100)}% synced
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 transition-all duration-500"
                style={{ width: `${Math.max(progress * 100, isPlaying ? 2 : 0)}%` }}
              />
            </div>

            <div className="flex flex-col gap-4">
              {segments.map((segment, index) => {
                const isActive = index === currentSegmentIndex;
                return (
                  <div
                    key={segment.id}
                    className={`rounded-2xl border px-5 py-4 transition-all duration-500 ${
                      isActive
                        ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_12px_40px_rgba(56,189,248,0.18)]"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`text-sm font-medium uppercase tracking-[0.3em] ${
                          isActive ? "text-cyan-200" : "text-slate-400"
                        }`}
                      >
                        Scene {index + 1}
                      </span>
                      <span className="text-xs text-slate-400/80">
                        {(segment.duration / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <p
                      className={`mt-3 text-base leading-relaxed ${
                        isActive ? "text-slate-50" : "text-slate-300/80"
                      }`}
                    >
                      {segment.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button
                type="button"
                onClick={handlePlay}
                disabled={isPlaying}
                className={`group flex items-center justify-center gap-3 rounded-full border border-cyan-400/60 px-6 py-3 text-base font-medium uppercase tracking-[0.3em] transition-all duration-300 ${
                  isPlaying
                    ? "cursor-not-allowed bg-cyan-500/30 text-cyan-100 opacity-80"
                    : "bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-violet-500/30 text-slate-100 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_20px_40px_rgba(59,130,246,0.25)]"
                }`}
              >
                {isPlaying ? "Narration Playing" : "Play Experience"}
              </button>
              <p className="text-xs leading-relaxed text-slate-400/80">
                Tip: enable audio for the full effect. Browser speech synthesis may
                require an initial user interaction before playback.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
