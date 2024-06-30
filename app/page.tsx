"use client";
"use strict";

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
  return (
    <main>
      <div>
        contest: <input type="text" id="contest_input" defaultValue="2023_domestic" />&quot;2023_domestic&quot; | &quot;2023_yokohama&quot; | &quot;2023_asia&quot;<br />
        team: <input type="text" id="team_input" defaultValue="KSS908111314" /><br />
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
