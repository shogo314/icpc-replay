"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Query() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const team = searchParams.get("team");
  return (
    <div>
      contest: {contest}<br />
      team: {team}
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
