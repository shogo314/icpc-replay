"use client";
"use strict";

import { useState, useEffect } from "react";
import { contest_data, json_data } from "./standings_data";
import Header from "./header";
import Footer from "./footer";

function Main() {
  const [selectedContest, setSelectedContest] = useState(contest_data[0].id); // 初期値は最初のコンテスト
  const [teamOptions, setTeamOptions] = useState<string[]>([]); // 動的なTeam選択肢
  const [selectedTeam, setSelectedTeam] = useState(""); // 選択中のTeam

  // Contestが変更されたときにTeamリストを更新
  useEffect(() => {
    const contestData = json_data[selectedContest];
    if (contestData) {
      const teams = contestData.StandingsData.map((team) => team.TeamName).sort(); // チーム名リストを抽出
      setTeamOptions(teams);
      setSelectedTeam(teams[0]); // 最初のチームをデフォルト選択
    }
  }, [selectedContest]);

  const handleContestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContest(e.target.value);
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
  };

  const handleButtonClick = () => {
    window.location.href = `/chart?contest=${selectedContest}&team=${selectedTeam}`;
  };

  return (
    <main>
      <div>
        <label>
          Contest:
          <select value={selectedContest} onChange={handleContestChange}>
            {contest_data.map((contest) => (
              <option key={contest.id} value={contest.id}>
                {contest.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Team:
          <select value={selectedTeam} onChange={handleTeamChange}>
            {teamOptions.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button onClick={handleButtonClick}>グラフを表示</button>
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
