import Link from 'next/link'
export default function Header() {
  return (
    <header>
      <h1>
        <Link style={{ textDecoration: "none", color: "inherit" }} href="/">
          ICPC Replay
        </Link>
      </h1>
    </header>
  )
}
