import { Check } from "lucide-react";

type Props = {
  current: number; // 1-based
  total: number;
  labels: string[];
};

export default function StepIndicator({ current, total, labels }: Props) {
  return (
    <div className="mb-8">
      {/* Mobile: compact progress bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            Step {current} of {total} — {labels[current - 1]}
          </p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            {Math.round((current / total) * 100)}%
          </p>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${(current / total) * 100}%`, backgroundColor: "#C8102E" }}
          />
        </div>
      </div>

      {/* Desktop: full step circles */}
      <div className="hidden md:flex items-start justify-between gap-1">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < current;
          const active = stepNum === current;

          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-2 relative">
              {/* Connector line (left side) */}
              {i > 0 && (
                <div
                  className="absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 z-0"
                  style={{ backgroundColor: done || active ? "#C8102E" : "#E2E8F0" }}
                />
              )}

              {/* Circle */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all"
                style={{
                  backgroundColor: done || active ? "#C8102E" : "#E2E8F0",
                  color: done || active ? "white" : "#94A3B8",
                }}
              >
                {done ? <Check size={14} strokeWidth={3} /> : stepNum}
              </div>

              {/* Label */}
              <p
                className="text-[10px] font-semibold text-center leading-tight px-1"
                style={{ color: active ? "#C8102E" : done ? "#1B3A6B" : "#94A3B8" }}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
