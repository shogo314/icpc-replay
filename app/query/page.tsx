"use client";

import { useSearchParams } from "next/navigation";

export default function Query() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const team = searchParams.get("team");
  return (
    <>
      <div>contest: {contest}</div>
      <div>team: {team}</div>
    </>
  );
}
