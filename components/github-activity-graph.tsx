const weekdays = ["Mon", "Wed", "Fri"];

function getActivityLevel(week: number, day: number) {
  const wave = Math.sin(week * 0.58 + day * 0.92);
  const drift = Math.cos(week * 0.21 - day * 0.6);
  return Math.max(0, Math.min(4, Math.round(((wave + drift + 2) / 4) * 4)));
}

const levels = [0, 1, 2, 3, 4];

export function GitHubActivityGraph() {
  const weeks = 28;

  return (
    <div className="glass-panel radius-panel overflow-hidden p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground-strong)]">
            GitHub Activity Graph
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[color:var(--foreground-soft)]">
            A GitHub-style contribution heatmap used here as a portfolio snapshot of
            engineering consistency and shipping cadence.
          </p>
        </div>
        <div className="theme-pill hidden rounded-full px-3 py-1 text-xs sm:block">
          28-week snapshot
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="mb-3 grid grid-cols-[auto_repeat(28,minmax(0,1fr))] gap-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            <div />
            {Array.from({ length: weeks }, (_, week) => (
              <span key={`month-${week}`} className={week % 4 === 0 ? "opacity-100" : "opacity-0"}>
                {week === 0 ? "Sep" : week === 4 ? "Oct" : week === 8 ? "Nov" : week === 12 ? "Dec" : week === 16 ? "Jan" : week === 20 ? "Feb" : week === 24 ? "Mar" : " "}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[auto_repeat(28,minmax(0,1fr))] gap-2">
            {Array.from({ length: 7 }, (_, day) => (
              <div key={`row-${day}`} className="contents">
                <div className="flex items-center pr-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {weekdays.includes(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day])
                    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
                    : ""}
                </div>
                {Array.from({ length: weeks }, (_, week) => {
                  const level = getActivityLevel(week, day);

                  return (
                    <div
                      key={`${week}-${day}`}
                      className="radius-grid-cell aspect-square border"
                      style={{
                        borderColor: "var(--activity-border)",
                        backgroundColor: `var(--activity-level-${level})`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Low to high contribution intensity
        </p>
        <div className="flex items-center gap-2">
          {levels.map((level) => (
            <span
              key={level}
              className="radius-grid-cell h-3 w-3 border"
              style={{
                borderColor: "var(--activity-border)",
                backgroundColor: `var(--activity-level-${level})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
