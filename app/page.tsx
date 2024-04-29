export default function Home() {
  return (
    <div>
      <a href="/test">
        Test
      </a>
      <br />
      <a href="/chart">
        Chart
      </a>
      <br />
      <a href="/query?contest=standings_2023_domestic&team=KSS908111314">
        Query
      </a>
      <h1>JSON</h1>
      <ul>
        <li><a href="/standings_2023_domestic.json">ICPC 2023 国内予選</a></li>
        <li><a href="/standings_2023_yokohama.json">ICPC 2023 Asia Yokohama Regional</a></li>
      </ul>
    </div>
  );
}
