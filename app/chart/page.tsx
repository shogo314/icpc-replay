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
  TooltipItem,
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

function rank_and_solved(contest: string, id: number, time: number): [number, string[]] {
  var score: number = 0;
  var penalty: number = 0;
  var cnt = 0;
  var solved: string[] = [];
  for (const p in json_data[contest].StandingsData[id].TaskResults) {
    let task: any = json_data[contest].StandingsData[id].TaskResults[p];
    if (task.Score > 0 && task.Elapsed <= time) {
      score += task.Score;
      penalty += task.Elapsed;
      penalty += task.Penalty * json_data[contest].ContestData.Penalty;
      if (task.Elapsed == time) {
        solved.push(p);
      }
    }
  }
  for (let i = 0; i < json_data[contest].StandingsData.length; i++) {
    if (i == id) continue;
    var tmp_score: number = 0;
    var tmp_penalty: number = 0;
    for (const p in json_data[contest].StandingsData[i].TaskResults) {
      let task: any = json_data[contest].StandingsData[i].TaskResults[p];
      if (task.Score > 0 && task.Elapsed <= time) {
        tmp_score += task.Score;
        tmp_penalty += task.Elapsed;
        tmp_penalty += task.Penalty * json_data[contest].ContestData.Penalty;
      }
    }
    if (tmp_score > score || (tmp_score == score && tmp_penalty < penalty)) {
      cnt++;
    }
  }
  return [cnt + 1, solved];
}

function Chart(contest: string, team: string, id: number) {
  const contest_name: string = (() => {
    for (let i = 0; i < contest_data.length; i++) {
      if (contest_data[i].id == contest) {
        return contest_data[i].name;
      }
    }
    return "";
  })();

  const labels: number[] = [];
  const ranks: number[] = [];
  const backgroundColors: string[] = [];
  const pointSizes: number[] = [];

  for (let i = 0; i <= json_data[contest].ContestData.Duration; i++) {
    let [r, solved] = rank_and_solved(contest, id, i);

    if (ranks.length >= 2 && ranks[ranks.length - 1] == r && ranks[ranks.length - 2] == r) {
      labels.pop();
      ranks.pop();
      backgroundColors.pop();
      pointSizes.pop();
    }

    // ラベルとデータ追加
    labels.push(i);
    ranks.push(r);

    // 解いたところは色とサイズを変える
    if (solved.length > 0) {
      backgroundColors.push("rgba(0, 200, 0, 0.8)");  // 濃い緑
      pointSizes.push(10);                            // 大きめのマーカー
    } else {
      backgroundColors.push("rgba(75,192,192,0.4)"); // 通常の色
      pointSizes.push(5);                             // 通常のサイズ
    }
  }

  const data = {
    labels,
    datasets: [{
      label: team,
      data: ranks,
      fill: false,
      backgroundColor: backgroundColors,
      borderColor: "rgba(75,192,192,1)",
      showLine: true,
      pointRadius: pointSizes,
      pointHoverRadius: pointSizes.map(s => s + 3), // ホバー時は少し大きく
    }],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: json_data[contest].ContestData.Duration,
        title: {
          display: true,
          text: "time (" + json_data[contest].ContestData.UnitTime + ")",
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
      legend: {},
      tooltip: {
        callbacks: {
          title: function (context: any) {
            const time = context[0]?.parsed.x;
            return `Time: ${time} (${json_data[contest].ContestData.UnitTime})`;
          },
          label: function (context: any) {
            const time = context.parsed.x;
            const teamLabel = context.dataset.label;
            const teamId = json_data[contest].StandingsData.findIndex((t: any) => t.TeamName === teamLabel);
            if (teamId === -1) return `Rank: ${context.parsed.y}`;

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
      contest: {contest_name}<br />
      team: {team}<br />
      university: {json_data[contest].StandingsData[id].University}<br />
      <Scatter data={data} options={options} />
    </div>
  );
}

function Query() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const team = searchParams.get("team");
  if (contest == null || team == null) {
    return (
      <div className="p-4 text-red-700">
        <p>Missing query parameters:</p>
        <p>Contest: {contest ?? "(not specified)"}</p>
        <p>Team: {team ?? "(not specified)"}</p>
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

  const id = json_data[contest].StandingsData.findIndex(t => t.TeamName === team);
  if (id === -1) {
    return (
      <div className="p-4 text-red-700">
        <p>Contest: {contest}</p>
        <p>Team: {team}</p>
        <p>No such team found.</p>
      </div>
    );
  }

  return Chart(contest, team, id);
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
