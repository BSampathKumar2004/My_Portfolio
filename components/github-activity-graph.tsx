"use client";

import { cloneElement, memo, useEffect, useMemo, useRef, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

type ThemeMode = "dark" | "light";

type GitHubActivityGraphProps = {
  theme: ThemeMode;
  username?: string;
};

type GitHubContributionPayload = {
  username: string;
  totalContributions: number;
  contributions: Activity[];
  fetchedAt: string;
};

const DEFAULT_USERNAME = "BSampathKumar2004";
const CLIENT_CACHE_TTL_MS = 10 * 60 * 1000;
const weekdayLabels: Array<"mon" | "wed" | "fri"> = ["mon", "wed", "fri"];
const activityTheme = {
  light: [
    "var(--activity-level-0)",
    "var(--activity-level-1)",
    "var(--activity-level-2)",
    "var(--activity-level-3)",
    "var(--activity-level-4)",
  ],
  dark: [
    "var(--activity-level-0)",
    "var(--activity-level-1)",
    "var(--activity-level-2)",
    "var(--activity-level-3)",
    "var(--activity-level-4)",
  ],
};

function getClientCacheKey(username: string) {
  return `github-contributions:${username}`;
}

function readCachedPayload(username: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(getClientCacheKey(username));

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as {
      cachedAt: number;
      payload: GitHubContributionPayload;
    };

    if (Date.now() - parsedValue.cachedAt > CLIENT_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(getClientCacheKey(username));
      return null;
    }

    return parsedValue.payload;
  } catch {
    return null;
  }
}

function writeCachedPayload(username: string, payload: GitHubContributionPayload) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      getClientCacheKey(username),
      JSON.stringify({ cachedAt: Date.now(), payload }),
    );
  } catch {
    // Ignore storage write failures and continue with in-memory state.
  }
}

function createLoadingSkeleton(): Activity[] {
  const today = new Date();
  const dates: Activity[] = [];

  for (let offset = 364; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    dates.push({
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    });
  }

  return dates;
}

export const GitHubActivityGraph = memo(function GitHubActivityGraph({
  theme,
  username = DEFAULT_USERNAME,
}: GitHubActivityGraphProps) {
  const calendarFrameRef = useRef<HTMLDivElement>(null);
  const calendarMeasureRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GitHubContributionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [calendarScale, setCalendarScale] = useState(1);
  const [calendarHeight, setCalendarHeight] = useState<number | null>(null);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );
  const loadingSkeleton = useMemo(() => createLoadingSkeleton(), []);
  const tooltipConfig = useMemo(
    () => ({
      activity: {
        text: (activity: Activity) => {
          const formattedDate = dateFormatter.format(new Date(`${activity.date}T00:00:00`));
          const contributionLabel =
            activity.count === 1 ? "1 contribution" : `${activity.count} contributions`;

          return `${formattedDate} · ${contributionLabel}`;
        },
        offset: 10,
        hoverRestMs: 60,
        withArrow: true,
        transitionStyles: {
          duration: 140,
          initial: { opacity: 0, transform: "translateY(6px) scale(0.98)" },
          open: { opacity: 1, transform: "translateY(0) scale(1)" },
          close: { opacity: 0, transform: "translateY(4px) scale(0.98)" },
          common: {
            zIndex: 70,
            boxShadow: "0 18px 48px rgba(2, 8, 23, 0.18)",
          },
        },
      },
      colorLegend: {
        text: (level: number) =>
          [
            "No contributions",
            "Low contribution intensity",
            "Steady contribution intensity",
            "High contribution intensity",
            "Very high contribution intensity",
          ][level] ?? "Contribution intensity",
        offset: 10,
        hoverRestMs: 60,
        withArrow: true,
        transitionStyles: {
          duration: 120,
          initial: { opacity: 0, transform: "translateY(4px)" },
          open: { opacity: 1, transform: "translateY(0)" },
          close: { opacity: 0, transform: "translateY(2px)" },
        },
      },
    }),
    [dateFormatter],
  );

  useEffect(() => {
    const cachedPayload = readCachedPayload(username);

    if (cachedPayload) {
      setData(cachedPayload);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadContributions = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `/api/github-contributions?username=${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to fetch live GitHub activity.");
        }

        const payload = (await response.json()) as GitHubContributionPayload;
        setData(payload);
        writeCachedPayload(username, payload);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to fetch live GitHub activity.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadContributions();

    return () => {
      controller.abort();
    };
  }, [username]);

  useEffect(() => {
    const frame = calendarFrameRef.current;
    const measure = calendarMeasureRef.current;

    if (!frame || !measure) {
      return;
    }

    let frameId = 0;

    const syncCalendarSize = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        const availableWidth = frame.clientWidth;
        const naturalWidth = measure.scrollWidth;
        const naturalHeight = measure.scrollHeight;
        const nextScale =
          availableWidth > 0 && naturalWidth > 0
            ? Math.min(1, availableWidth / naturalWidth)
            : 1;

        setCalendarScale((currentScale) =>
          Math.abs(currentScale - nextScale) < 0.01 ? currentScale : nextScale,
        );
        setCalendarHeight((currentHeight) => {
          const nextHeight = Math.round(naturalHeight * nextScale);

          if (currentHeight !== null && Math.abs(currentHeight - nextHeight) < 1) {
            return currentHeight;
          }

          return nextHeight;
        });
      });
    };

    const observer = new ResizeObserver(syncCalendarSize);
    observer.observe(frame);
    observer.observe(measure);
    syncCalendarSize();

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [data, isLoading, theme]);

  return (
    <div className="glass-panel radius-panel overflow-hidden p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground-strong)]">
            GitHub Activity Graph
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[color:var(--foreground-soft)]">
            A live GitHub contribution heatmap powered by your public profile activity,
            designed to stay visually aligned with the portfolio.
          </p>
        </div>
        <div className="theme-pill hidden rounded-full px-3 py-1 text-xs sm:block">
          Live GitHub feed
        </div>
      </div>

      <div ref={calendarFrameRef} className="mt-8 overflow-hidden">
        <div style={calendarHeight ? { height: `${calendarHeight}px` } : undefined}>
          <div
            style={{
              transform: `scale(${calendarScale})`,
              transformOrigin: "top left",
            }}
          >
            <div ref={calendarMeasureRef} className="w-max">
              <ActivityCalendar
                data={data?.contributions ?? loadingSkeleton}
                loading={isLoading}
                colorScheme={theme}
                theme={activityTheme}
                blockMargin={4}
                blockRadius={4}
                blockSize={12}
                fontSize={12}
                showWeekdayLabels={weekdayLabels}
                weekStart={0}
                labels={{
                  totalCount: "{{count}} contributions in the last year",
                  legend: {
                    less: "Less",
                    more: "More",
                  },
                }}
                tooltips={tooltipConfig}
                style={{
                  color: "var(--muted)",
                }}
                renderBlock={(block, activity) =>
                  cloneElement(block, {
                    stroke: "var(--activity-border)",
                    strokeWidth: 1,
                    className: [
                      block.props.className,
                      "transition-opacity duration-200",
                    ]
                      .filter(Boolean)
                      .join(" "),
                    "aria-label": `${activity.count} contributions on ${activity.date}`,
                  })
                }
                renderColorLegend={(block) =>
                  cloneElement(block, {
                    stroke: "var(--activity-border)",
                    strokeWidth: 1,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
          {errorMessage
            ? "GitHub activity is temporarily unavailable"
            : data
              ? `${data.totalContributions} contributions synced from GitHub`
              : "Syncing latest GitHub activity"}
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)] transition-opacity duration-300 hover:opacity-75"
        >
          View profile
        </a>
      </div>
    </div>
  );
});
