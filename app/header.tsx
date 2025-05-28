import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            ICPC Replay
          </Link>
        </h1>
      </div>
    </header>
  );
}
