"use client";
"use strict";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import standings_2023_domestic from "../../public/standings_2023_domestic.json";
import standings_2023_yokohama from "../../public/standings_2023_yokohama.json"

const json_data = {
  standings_2023_domestic,
  standings_2023_yokohama
}

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function rank(contest: "standings_2023_domestic" | "standings_2023_yokohama", id: number, time: number): number {
  return json_data[contest].StandingsData[id].Rank;
}

function Query() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const team = searchParams.get("team");
  if (contest == null || team == null) {
    return (
      <div>
        contest: {contest}<br />
        team: {team}
      </div>
    );
  }
  if (contest == "standings_2023_domestic") {
  } else if (contest == "standings_2023_yokohama") {
  } else {
    return (
      <div>
        contest: {contest}<br />
        No such contest exists.
      </div>
    );
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {},
      title: {
        display: true,
        text: "グラフタイトル",
      },
      labels: {},
      tooltip: {},
    },
  };
  const len: number = json_data[contest].StandingsData.length;
  var f: boolean = true;
  var id: number = -1;
  for (let i = 0; i < len; i++) {
    if (json_data[contest].StandingsData[i].TeamName == team) {
      f = false;
      id = i;
    }
  }
  if (f) {
    return (
      <div>
        contest: {contest}<br />
        team: {team}<br />
        No such team exists.
      </div>
    );
  }
  var labels: number[] = [];
  var data: number[] = [];
  var tmp = {
    labels,
    datasets: [{
      label: team,
      data,
      fill: false,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      tension: 0.1,
    }]
  };
  for (let i = 0; i < 10; i++) {
    tmp.labels.push(i);
    tmp.datasets[0].data.push(rank(contest, id, i));
  }
  return (
    <div>
      contest: {contest}<br />
      team: {team}<br />
      <Line data={tmp} options={options} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Query />
    </Suspense>
  );
}
