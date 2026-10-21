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

// チーム名から安定した色を生成
function teamColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = (hash % 360 + 360) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

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

function Chart({ contest, teams }: { contest: string; teams: string[] }) {
  const contest_name = contest_data.find(c => c.id === contest)?.name ?? "";

  const datasets = teams.map(team => {
    const id = json_data[contest].StandingsData.findIndex(t => t.TeamName === team);
    if (id === -1) return null;

    const labels: number[] = [];
    const ranks: number[] = [];
    const backgroundColors: string[] = [];
    const pointSizes: number[] = [];

    const color = teamColor(team);
    let presolved = false;

    for (let i = 0; i <= json_data[contest].ContestData.Duration; i++) {
      const [r, solved] = rank_and_solved(contest, id, i);

      if (ranks.length >= 2 && ranks[ranks.length - 1] === r && ranks[ranks.length - 2] === r && !presolved) {
        labels.pop();
        ranks.pop();
        backgroundColors.pop();
        pointSizes.pop();
      }

      presolved = solved.length > 0;

      labels.push(i);
      ranks.push(r);
      backgroundColors.push(solved.length > 0 ? color.replace("50%", "60%") : color); // 明るさ変化
      pointSizes.push(solved.length > 0 ? 10 : 5);
    }

    return {
      label: team,
      data: labels.map((t, i) => ({ x: t, y: ranks[i] })),
      backgroundColor: backgroundColors,
      borderColor: color,
      pointRadius: pointSizes,
      pointHoverRadius: pointSizes.map(s => s + 3),
      showLine: true,
    };
  }).filter((ds): ds is NonNullable<typeof ds> => ds !== null);

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    .map(team => json_data[contest].StandingsData.find(t => t.TeamName === team))
    .filter((t): t is NonNullable<typeof t> => t !== undefined)
    .sort((a, b) => a.Rank - b.Rank);

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
          <Scatter data={data} options={options} />
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
              <th className="px-4 py-2 text-right">ペナルティ</th>
            </tr>
          </thead>
          <tbody>
            {selectedTeams.map(t => (
              <tr key={t.TeamName} className="border-t">
                <td className="px-4 py-2 text-right font-medium">{t.Rank}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: teamColor(t.TeamName) }}
                    />
                    {t.TeamName}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">{t.University}</td>
                <td className="px-4 py-2 text-right">{t.TotalResult.Score}</td>
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
