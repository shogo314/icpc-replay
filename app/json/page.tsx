import { contest_data } from "../standings_data";

export default function JsonPage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">JSON Data</h1>
      <ul className="list-disc list-inside space-y-2">
        {contest_data.map((contest) => (
          <li key={contest.id}>
            <a
              href={`/json/standings_${contest.id}.json`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contest.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
