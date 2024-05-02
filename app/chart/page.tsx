"use client";
"use strict";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import standings_2023_domestic from "../../public/standings_2023_domestic.json";
import standings_2023_yokohama from "../../public/standings_2023_yokohama.json";
import standings_2023_asia from "../../public/standings_2023_asia.json";
type contest_str = "standings_2023_domestic" | "standings_2023_yokohama" | "standings_2023_asia";

const json_data = {
  standings_2023_domestic,
  standings_2023_yokohama,
  standings_2023_asia
} as {
  [key: string]: {
    ContestData: {
      UnitTime: string;
      Penalty: number;
      Duration: number;
      TaskInfo: string[];
    };
    StandingsData: {
      Rank: number;
      TotalResult: {
        Score: number;
        Penalty: number;
      };
      TeamName: string;
      University: string;
      TaskResults: {
        // [key: string]: { なぜかエラーになる
        //   Elapsed: number;
        //   Score: number;
        //   Penalty: number;
        // };
        [key: string]: any;
      }
    }[];
  };
};

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

function rank(contest: contest_str, id: number, time: number): number {
  var score: number = 0;
  var penalty: number = 0;
  var cnt = 0;
  for (const p in json_data[contest].StandingsData[id].TaskResults) {
    if (json_data[contest].StandingsData[id].TaskResults[p].Score > 0 && json_data[contest].StandingsData[id].TaskResults[p].Elapsed <= time) {
      score += json_data[contest].StandingsData[id].TaskResults[p].Score;
      penalty += json_data[contest].StandingsData[id].TaskResults[p].Elapsed;
      penalty += json_data[contest].StandingsData[id].TaskResults[p].Penalty * json_data[contest].ContestData.Penalty;
    }
  }
  for (let i = 0; i < json_data[contest].StandingsData.length; i++) {
    if (i == id) continue;
    var tmp_score: number = 0;
    var tmp_penalty: number = 0;
    for (const p in json_data[contest].StandingsData[i].TaskResults) {
      if (json_data[contest].StandingsData[i].TaskResults[p].Score > 0 && json_data[contest].StandingsData[i].TaskResults[p].Elapsed <= time) {
        tmp_score += json_data[contest].StandingsData[i].TaskResults[p].Score;
        tmp_penalty += json_data[contest].StandingsData[i].TaskResults[p].Elapsed;
        tmp_penalty += json_data[contest].StandingsData[i].TaskResults[p].Penalty * json_data[contest].ContestData.Penalty;
      }
    }
    if (tmp_score > score || (tmp_score == score && tmp_penalty < penalty)) {
      cnt++;
    }
  }
  return cnt + 1;
}

function Chart(contest: contest_str, team: string, id: number) {
  var labels: number[] = [];
  var data: number[] = [];
  for (let i = 0; i <= json_data[contest].ContestData.Duration; i++) {
    let r = rank(contest, id, i);
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
      },
      y: {
        reverse: true,
      },
    },
    plugins: {
      legend: {},
      title: {
        display: false,
        text: "グラフタイトル",
      },
      labels: {},
      tooltip: {},
    },
  };
  return (
    <div>
      <a href="/">
        Home
      </a><br />
      contest: {contest}<br />
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
    const getText = () => {
      let contest_input = document.getElementById("contest_input") as HTMLInputElement | null;
      let team_input = document.getElementById("team_input") as HTMLInputElement | null;
      if (contest_input == null) return;
      if (team_input == null) return;
      window.location.href = "/chart?contest=" + contest_input.value + "&team=" + team_input.value;
    };
    return (
      <div>
        <a href="/">
          Home
        </a><br />
        <div className="test_box">
          contest: <input type="text" id="contest_input" defaultValue="standings_2023_domestic" />&quot;standings_2023_domestic&quot; | &quot;standings_2023_yokohama&quot; | &quot;standings_2023_asia&quot;<br />
          team: <input type="text" id="team_input" defaultValue="KSS908111314" /><br />
          <button onClick={getText}>グラフを表示</button>
        </div>
      </div>
    );
  }
  if (contest == "standings_2023_domestic" || contest == "standings_2023_yokohama" || contest == "standings_2023_asia") {
  } else {
    return (
      <div>
        <a href="/">
          Home
        </a><br />
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
        <a href="/">
          Home
        </a><br />
        contest: {contest}<br />
        team: {team}<br />
        No such team exists.
      </div>
    );
  }
  return Chart(contest, team, id);
}

export default function Page() {
  return (
    <Suspense>
      <Query />
    </Suspense>
  );
}
