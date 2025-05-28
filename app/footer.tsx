import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 text-sm text-gray-600">
      <p>
        <Link
          href="https://github.com/shogo314/icpc-replay"
          className="hover:text-blue-600 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </Link>
      </p>
      <p className="mt-2">
        © {new Date().getFullYear()} ICPC Replay by{" "}
        <Link
          href="https://github.com/shogo314"
          className="hover:text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          shogo314
        </Link>
      </p>
    </footer>
  );
}
