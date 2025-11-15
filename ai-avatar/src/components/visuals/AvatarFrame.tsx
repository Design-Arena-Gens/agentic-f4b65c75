type AvatarFrameProps = {
  speaking: boolean;
  mood: "efficiency" | "discovery" | "tools" | "free";
};

const moodConfigs: Record<AvatarFrameProps["mood"], { glow: string; accent: string }> = {
  efficiency: {
    glow: "from-cyan-400/30 via-cyan-300/10 to-indigo-500/10",
    accent: "bg-cyan-300/60",
  },
  discovery: {
    glow: "from-violet-400/25 via-slate-400/10 to-indigo-500/15",
    accent: "bg-violet-300/60",
  },
  tools: {
    glow: "from-emerald-400/30 via-cyan-400/10 to-indigo-500/20",
    accent: "bg-emerald-300/60",
  },
  free: {
    glow: "from-blue-400/25 via-indigo-400/15 to-purple-500/20",
    accent: "bg-blue-300/60",
  },
};

export function AvatarFrame({ speaking, mood }: AvatarFrameProps) {
  const { glow, accent } = moodConfigs[mood];

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute inset-0 -z-10 blur-3xl transition-all duration-700 ${speaking ? "opacity-100" : "opacity-60"}`}>
        <div className={`h-full w-full rounded-[36px] bg-gradient-to-br ${glow}`} />
      </div>

      <div className="relative w-full overflow-hidden rounded-[36px] border border-white/15 bg-[rgba(9,12,28,0.72)] p-6 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />

        <div className="relative">
          <div className="absolute -left-6 top-10 hidden h-20 w-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:block">
            <div className={`avatar-spark ${accent}`} />
          </div>
          <div className="absolute -right-8 bottom-12 hidden h-24 w-24 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur lg:block">
            <div className={`avatar-spark ${accent}`} />
          </div>

          <div className="mx-auto flex max-w-xs flex-col items-center gap-6 pt-2">
            <div className="relative flex h-64 w-full items-center justify-center">
              <div className="avatar-halo" />
              <div className={`avatar-face ${speaking ? "avatar-speaking" : ""}`}>
                <div className="avatar-eye left-10" />
                <div className="avatar-eye right-10" />
                <div className={`avatar-mouth ${speaking ? "avatar-mouth-speaking" : ""}`} />
                <div className="avatar-visor" />
              </div>
            </div>

            <div className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-[0.35em] text-slate-300">
                  Virtual Host
                </span>
                <span className="text-lg font-semibold text-slate-50">
                  Axiom
                </span>
              </div>
              <div className="flex items-end gap-1">
                {Array.from({ length: 15 }).map((_, index) => (
                  <span
                    key={index}
                    className={`wave-bar ${speaking ? "wave-bar-active" : ""}`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
