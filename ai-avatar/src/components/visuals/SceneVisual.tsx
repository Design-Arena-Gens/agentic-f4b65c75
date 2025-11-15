import type { ReactNode } from "react";

type SceneVisualProps = {
  variant: "efficiency" | "discovery" | "tools" | "free";
};

export function SceneVisual({ variant }: SceneVisualProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="ambient-grid" />
      <VisualLayer active={variant === "efficiency"}>
        <EfficiencyVisual />
      </VisualLayer>
      <VisualLayer active={variant === "discovery"}>
        <DiscoveryVisual />
      </VisualLayer>
      <VisualLayer active={variant === "tools"}>
        <ToolsVisual />
      </VisualLayer>
      <VisualLayer active={variant === "free"}>
        <FreeVisual />
      </VisualLayer>
    </div>
  );
}

function VisualLayer({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 px-2 transition-all duration-700 ${
        active ? "opacity-100 blur-0" : "opacity-0 blur-sm"
      }`}
    >
      {children}
    </div>
  );
}

function EfficiencyVisual() {
  return (
    <div className="relative h-full w-full">
      <div className="clock-node" style={{ top: "8%", left: "18%" }} />
      <div className="clock-node" style={{ top: "32%", right: "12%" }} />
      <div className="clock-node" style={{ bottom: "10%", left: "35%" }} />
      <div className="timeline-beam" />
    </div>
  );
}

function DiscoveryVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="ui-orbit" />
      <div className="ui-panel" style={{ transform: "translate(-120px, -40px)" }}>
        <span className="ui-glow" />
        <div className="ui-lines">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="ui-panel" style={{ transform: "translate(110px, -10px)" }}>
        <span className="ui-glow" />
        <div className="ui-lines dense">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="ui-panel" style={{ transform: "translate(-40px, 120px)" }}>
        <span className="ui-glow" />
        <div className="ui-graph">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function ToolsVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="number-ribbon">
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className="number-chip" style={{ animationDelay: `${num * 120}ms` }}>
            {num}
          </span>
        ))}
      </div>
      <div className="sparks-row">
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className="spark-line"
            style={{ animationDelay: `${index * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function FreeVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="hologram-base">
        <div className="hologram-card">
          <div className="hologram-grid">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="hologram-badge">Free Access</div>
        </div>
        <div className="hologram-glow" />
      </div>
    </div>
  );
}
