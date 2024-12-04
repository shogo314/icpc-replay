import { contest_data } from "../standings_data";
export default function Home() {
  return (
    <div>
      <h1>JSON</h1>
      <div>
        {
          (function () {
            const list = [];
            for (let i = 0; i < contest_data.length; i++) {
              list.push(<li><a href={"/json/standings_" + contest_data[i].id + ".json"}>{contest_data[i].name}</a></li>);
            }
            return <ul>{list}</ul>;
          }())
        }
      </div>
    </div>
  );
}
