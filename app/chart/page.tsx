"use client";
"use strict";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

  return (
    <div>
      <div className="mb-2">contest: {contest_name}</div>
      <Scatter data={data} options={options} />
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
