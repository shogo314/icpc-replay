"use client";
"use strict";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

import { contest_data, json_data } from "../standings_data";
import Header from "../header";
import Footer from "../footer";

import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type Plugin,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// 隣り合う系列が色覚多様性でも区別しやすいよう検証済みのカテゴリカルパレット
const SERIES_COLORS = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#6250d6", // violet
  "#e34948", // red
];

// 選択順に色を割り当てる。9 チーム目以降は色を再利用し、線種(破線)で区別する
function teamStyle(index: number): { color: string; dash: number[] } {
  const round = Math.floor(index / SERIES_COLORS.length);
  return {
    color: SERIES_COLORS[index % SERIES_COLORS.length],
    dash: round === 0 ? [] : round === 1 ? [6, 4] : [2, 3],
  };
}

// 正解した点の上に問題名のラベルを描く
const solvedLabelPlugin: Plugin<"scatter"> = {
  id: "solvedLabel",
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "600 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      const solvedList = (dataset as { solved?: string[][] }).solved ?? [];
      meta.data.forEach((point, i) => {
        const solved = solvedList[i];
        if (!solved || solved.length === 0) return;
        const text = solved.join(",");
        const w = ctx.measureText(text).width + 8;
        const h = 16;
        const x = point.x;
        const y = point.y - 16;
        ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
        ctx.strokeStyle = dataset.borderColor as string;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#1f2937";
        ctx.fillText(text, x, y);
      });
    });
    ctx.restore();
  },
};

function rank_and_solved(contest: string, id: number, time: number): [number, string[]] {
  let score = 0;
  let penalty = 0;
  const solved: string[] = [];

  for (const p in json_data[contest].StandingsData[id].TaskResults) {
    const task = json_data[contest].StandingsData[id].TaskResults[p];
    if (task.Score > 0 && task.Elapsed <= time) {
      score += task.Score;
      penalty += task.Elapsed;
      penalty += task.Penalty * json_data[contest].ContestData.Penalty;
      if (task.Elapsed === time) {
        solved.push(p);
      }
    }
  }

  let rank = 1;
  for (let i = 0; i < json_data[contest].StandingsData.length; i++) {
    if (i === id) continue;
    let tmpScore = 0;
    let tmpPenalty = 0;
    for (const p in json_data[contest].StandingsData[i].TaskResults) {
      const task = json_data[contest].StandingsData[i].TaskResults[p];
      if (task.Score > 0 && task.Elapsed <= time) {
        tmpScore += task.Score;
        tmpPenalty += task.Elapsed;
        tmpPenalty += task.Penalty * json_data[contest].ContestData.Penalty;
      }
    }
    if (tmpScore > score || (tmpScore === score && tmpPenalty < penalty)) {
      rank++;
    }
  }

  return [rank, solved];
}

function ProblemSet({ contest, results }: { contest: string; results: { [key: string]: any } }) {
  const unit = json_data[contest].ContestData.UnitTime;
  return (
    <div className="flex flex-wrap gap-1">
      {json_data[contest].ContestData.TaskInfo.map(p => {
        const r = results[p];
        const solved = r && r.Score > 0;
        const attempted = r && !solved && r.Penalty > 0;
        // 色は ICPC 公式速報サイト (icpcsec) の順位表に合わせる
        const cls = solved
          ? "bg-[#64dd17] text-black border-[#64dd17]"
          : attempted
            ? "bg-[#ff5252] text-black border-[#ff5252]"
            : "bg-white text-gray-400 border-gray-200";
        const title = solved
          ? `${p}: ${r.Elapsed} ${unit}` + (r.Penalty > 0 ? ` (誤答 ${r.Penalty})` : "")
          : attempted
            ? `${p}: 未正解 (誤答 ${r.Penalty})`
            : `${p}: 未提出`;
        return (
          <span
            key={p}
            title={title}
            className={`inline-flex w-6 h-6 items-center justify-center rounded border text-xs font-semibold ${cls}`}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
}

function Chart({ contest, teams }: { contest: string; teams: string[] }) {
  const contest_name = contest_data.find(c => c.id === contest)?.name ?? "";

  const datasets = teams.map((team, index) => {
    const id = json_data[contest].StandingsData.findIndex(t => t.TeamName === team);
    if (id === -1) return null;

    const labels: number[] = [];
    const ranks: number[] = [];
    const solvedAt: string[][] = [];

    const { color, dash } = teamStyle(index);
    let presolved = false;

    for (let i = 0; i <= json_data[contest].ContestData.Duration; i++) {
      const [r, solved] = rank_and_solved(contest, id, i);

      if (ranks.length >= 2 && ranks[ranks.length - 1] === r && ranks[ranks.length - 2] === r && !presolved) {
        labels.pop();
        ranks.pop();
        solvedAt.pop();
      }

      presolved = solved.length > 0;

      labels.push(i);
      ranks.push(r);
      solvedAt.push(solved);
    }

    const pointSizes = solvedAt.map(s => (s.length > 0 ? 6 : 0));

    return {
      label: team,
      data: labels.map((t, i) => ({ x: t, y: ranks[i] })),
      solved: solvedAt,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      borderDash: dash,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: pointSizes,
      pointHoverRadius: pointSizes.map(s => s + 2),
      pointHitRadius: 8,
      showLine: true,
    };
  }).filter((ds): ds is NonNullable<typeof ds> => ds !== null);

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24 } },
    scales: {
      x: {
        min: 0,
        max: json_data[contest].ContestData.Duration,
        title: {
          display: true,
          text: `time (${json_data[contest].ContestData.UnitTime})`,
        },
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: "rank",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const time = context[0]?.parsed.x;
            return `Time: ${time} (${json_data[contest].ContestData.UnitTime})`;
          },
          label: (context: any) => {
            const time = context.parsed.x;
            const teamLabel = context.dataset.label;
            const teamId = json_data[contest].StandingsData.findIndex(t => t.TeamName === teamLabel);
            const [, solved] = rank_and_solved(contest, teamId, time);
            const solvedStr = solved.length > 0 ? `Solved: ${solved.join(", ")}` : "No problems solved at this time";
            return `Rank: ${context.parsed.y}, ${solvedStr}`;
          },
        },
      },
    },
  };

  const contestInfo = json_data[contest].ContestData;
  const teamCount = json_data[contest].StandingsData.length;
  const selectedTeams = teams
    .map((team, index) => ({
      team: json_data[contest].StandingsData.find(t => t.TeamName === team),
      style: teamStyle(index),
    }))
    .filter((t): t is { team: NonNullable<typeof t.team>; style: typeof t.style } => t.team !== undefined)
    .sort((a, b) => a.team.Rank - b.team.Rank);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-white border rounded-lg shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-800">{contest_name}</h2>
          <Link href="/" className="text-sm">
            ← 選択に戻る
          </Link>
        </div>
        <dl className="mt-3 flex flex-wrap gap-2 text-sm">
          {[
            ["時間", `${contestInfo.Duration} ${contestInfo.UnitTime}`],
            ["問題数", `${contestInfo.TaskInfo.length}`],
            ["参加チーム", `${teamCount}`],
            ["ペナルティ", `${contestInfo.Penalty} ${contestInfo.UnitTime}`],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-1 rounded-full bg-gray-100 px-3 py-1">
              <dt className="text-gray-500">{k}</dt>
              <dd className="font-medium text-gray-800">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white border rounded-lg shadow-sm p-4">
        <div className="relative h-[60vh] min-h-[320px] max-h-[560px]">
          <Scatter data={data} options={options} plugins={[solvedLabelPlugin]} />
        </div>
      </section>

      <section className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-right">最終順位</th>
              <th className="px-4 py-2 text-left">チーム</th>
              <th className="px-4 py-2 text-left">所属</th>
              <th className="px-4 py-2 text-right">正解数</th>
              <th className="px-4 py-2 text-left">問題</th>
              <th className="px-4 py-2 text-right">ペナルティ</th>
            </tr>
          </thead>
          <tbody>
            {selectedTeams.map(({ team: t, style }) => (
              <tr key={t.TeamName} className="border-t">
                <td className="px-4 py-2 text-right font-medium">{t.Rank}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-2">
                    <svg width="20" height="8" className="shrink-0" aria-hidden="true">
                      <line
                        x1="1" y1="4" x2="19" y2="4"
                        stroke={style.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={style.dash.join(" ")}
                      />
                    </svg>
                    {t.TeamName}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">{t.University}</td>
                <td className="px-4 py-2 text-right font-medium">{t.TotalResult.Score}</td>
                <td className="px-4 py-2">
                  <ProblemSet contest={contest} results={t.TaskResults} />
                </td>
                <td className="px-4 py-2 text-right">{t.TotalResult.Penalty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Query() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const teams = searchParams.getAll("team").map(t => t.trim()).filter(t => t.length > 0);

  if (!contest || teams.length === 0) {
    return (
      <div className="p-4 text-red-700">
        <p>Missing query parameters:</p>
        <p>contest: {contest ?? "(not specified)"}</p>
        <p>teams: {teams.length > 0 ? teams.join(", ") : "(not specified)"}</p>
      </div>
    );
  }

  if (!contest_data.some(c => c.id === contest)) {
    return (
      <div className="p-4 text-red-700">
        <p>Contest: {contest}</p>
        <p>No such contest found.</p>
      </div>
    );
  }

  const missingTeams = teams.filter(team => (
    json_data[contest].StandingsData.findIndex(t => t.TeamName === team) === -1
  ));

  if (missingTeams.length > 0) {
    return (
      <div className="p-4 text-red-700">
        <p>Invalid team name(s):</p>
        {missingTeams.map(t => <p key={t}>- {t}</p>)}
      </div>
    );
  }

  return <Chart contest={contest} teams={teams} />;
}

function Main() {
  return (
    <main>
      <Suspense>
        <Query />
      </Suspense>
    </main>
  );
}

export default function Page() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
