"use client";
"use strict";

import { contest_data } from "./standings_data";
import Header from "./header"
import Footer from "./footer";

function Main() {
  const getText = () => {
    let contest_input = document.getElementById("contest_input") as HTMLInputElement | null;
    let team_input = document.getElementById("team_input") as HTMLInputElement | null;
    if (contest_input == null) return;
    if (team_input == null) return;
    window.location.href = "/chart?contest=" + contest_input.value + "&team=" + team_input.value;
  };
  var contest_list: string[] = [];
  for (let i = contest_data.length - 1; i >= 0; i--) {
    contest_list.push("\"" + contest_data[i].id + "\"");
  }
  return (
    <main>
      <div>
        contest: <input type="text" id="contest_input" defaultValue="2024_domestic" />{contest_list.join(" | ")}<br />
        team: <input type="text" id="team_input" defaultValue="kotamanegi_marukajiri" /><br />
        <button onClick={getText}>グラフを表示</button>
      </div>
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
