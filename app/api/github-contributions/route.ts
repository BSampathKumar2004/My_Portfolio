import { NextRequest, NextResponse } from "next/server";

const DEFAULT_USERNAME = "BSampathKumar2004";
const GITHUB_CONTRIBUTIONS_URL = "https://github.com/users";
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const FETCH_REVALIDATE_SECONDS = 1800;

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GitHubContributionPayload = {
  username: string;
  totalContributions: number;
  contributions: ContributionDay[];
  fetchedAt: string;
};

const contributionCellPattern =
  /<td(?=[^>]*class="[^"]*ContributionCalendar-day[^"]*")(?=[^>]*data-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*data-level="([0-4])")[^>]*><\/td>\s*<tool-tip[^>]*>([\s\S]*?)<\/tool-tip>/g;

function parseContributionCount(tooltip: string) {
  const normalizedTooltip = tooltip.replace(/\s+/g, " ").trim();

  if (normalizedTooltip.startsWith("No contributions")) {
    return 0;
  }

  const countMatch = normalizedTooltip.match(/(\d+)\s+contributions?/i);
  return countMatch ? Number(countMatch[1]) : 0;
}

function parseContributionData(html: string): GitHubContributionPayload["contributions"] {
  const contributions: ContributionDay[] = [];

  for (const match of html.matchAll(contributionCellPattern)) {
    const [, date, level, tooltip] = match;

    if (!date || !level || !tooltip) {
      continue;
    }

    contributions.push({
      date,
      count: parseContributionCount(tooltip),
      level: Number(level) as ContributionDay["level"],
    });
  }

  return contributions;
}

function parseTotalContributions(html: string) {
  const totalMatch = html.match(
    /<h2[^>]*id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s*contributions?/i,
  );

  return totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;
}

async function fetchGitHubContributions(username: string) {
  const response = await fetch(`${GITHUB_CONTRIBUTIONS_URL}/${username}/contributions`, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "bandaru-sampath-portfolio",
    },
    next: { revalidate: FETCH_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub contributions fetch failed with status ${response.status}`);
  }

  const html = await response.text();
  const contributions = parseContributionData(html);

  if (contributions.length === 0) {
    throw new Error("GitHub contributions markup could not be parsed.");
  }

  return {
    totalContributions: parseTotalContributions(html),
    contributions,
  };
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? DEFAULT_USERNAME;

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "Invalid GitHub username." }, { status: 400 });
  }

  try {
    const data = await fetchGitHubContributions(username);

    return NextResponse.json(
      {
        username,
        totalContributions: data.totalContributions,
        contributions: data.contributions,
        fetchedAt: new Date().toISOString(),
      } satisfies GitHubContributionPayload,
      {
        headers: {
          "Cache-Control": `public, s-maxage=${FETCH_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch (error) {
    console.error("Failed to load GitHub contributions", error);

    return NextResponse.json(
      { error: "Unable to load live GitHub activity right now." },
      { status: 502 },
    );
  }
}
