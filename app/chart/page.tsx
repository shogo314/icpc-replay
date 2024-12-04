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
  var labels: number[] = [];
  var data: number[] = [];
  for (let i = 0; i <= json_data[contest].ContestData.Duration; i++) {
    let [r, solved] = rank_and_solved(contest, id, i);
    if (data.length >= 2 && data[data.length - 1] == r && data[data.length - 2] == r) {
      labels.pop();
      data.pop();
    }
    labels.push(i);
    data.push(r);
  }
  const tmp = {
    labels,
    datasets: [{
      label: team,
      data,
      fill: false,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      showLine: true,
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
      tooltip: {},
    },
  };
  return (
    <div>
      contest: {contest_name}<br />
      team: {team}<br />
      university: {json_data[contest].StandingsData[id].University}<br />
      <Scatter data={tmp} options={options} />
    </div>
  );
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
  if ((() => {
    for (let i = 0; i < contest_data.length; i++) {
      if (contest_data[i].id == contest) {
        return false;
      }
    }
    return true;
  })()) {
    return (
      <div>
        contest: {contest}<br />
        No such contest exists.
      </div>
    );
  }
  const len: number = json_data[contest].StandingsData.length;
  var id: number = -1;
  for (let i = 0; i < len; i++) {
    if (json_data[contest].StandingsData[i].TeamName == team) {
      id = i;
      break;
    }
  }
  if (id == -1) {
    return (
      <div>
        contest: {contest}<br />
        team: {team}<br />
        No such team exists.
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
