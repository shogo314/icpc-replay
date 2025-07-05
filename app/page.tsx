"use client";
"use strict";

import { useState, useEffect } from "react";
import { contest_data, json_data } from "./standings_data";
import Header from "./header";
import Footer from "./footer";
import Link from "next/link";
import Select from "react-select";

function Main() {
  const [selectedContest, setSelectedContest] = useState(contest_data[0].id);
  const [teamOptions, setTeamOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    const contestData = json_data[selectedContest];
    if (contestData) {
      const teams = contestData.StandingsData.map((team) => team.TeamName)
        .sort()
        .map((name) => ({ value: name, label: name }));
      setTeamOptions(teams);
      setSelectedTeams([teams[0].value]); // 最初のチームをデフォルトで選択
    }
  }, [selectedContest]);

  const handleContestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContest(e.target.value);
  };

  const handleTeamChange = (selected: any) => {
    const values = selected ? selected.map((opt: any) => opt.value) : [];
    setSelectedTeams(values);
  };

  const handleButtonClick = () => {
    const encodedContest = encodeURIComponent(selectedContest);
    const teamParams = selectedTeams
      .map((team) => `team=${encodeURIComponent(team)}`)
      .join("&");
    window.location.href = `/chart?contest=${encodedContest}&${teamParams}`;
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ICPC Replay</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select contest
          </label>
          <select
            value={selectedContest}
            onChange={handleContestChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            {contest_data.map((contest) => (
              <option key={contest.id} value={contest.id}>
                {contest.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select team(s)
          </label>
          <Select
            isMulti
            options={teamOptions}
            value={teamOptions.filter((opt) => selectedTeams.includes(opt.value))}
            onChange={handleTeamChange}
            className="text-left"
            classNamePrefix="react-select"
            placeholder="Search and select teams..."
          />
        </div>

        <div>
          <button
            onClick={handleButtonClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={selectedTeams.length === 0}
          >
            Show chart
          </button>
        </div>

        <div>
          <Link
            href="/json"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Browse JSON data
          </Link>
        </div>
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
