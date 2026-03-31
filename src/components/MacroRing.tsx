interface MacroRingProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

export const MacroRing = ({ label, value, max, color, unit = "g" }: MacroRingProps) => {
  const pct = Math.min((value / max) * 100, 100);
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
