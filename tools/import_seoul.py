"""保存済みのSeoul順位表を変換し、Replayに登録する。"""

import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, default=2026)
    parser.add_argument("--source", type=Path, default=Path.home() / "icpc_standings")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    contest_id = f"{args.year}_seoul"
    metadata = root / "app" / "standings_data.tsx"
    text = metadata.read_text(encoding="utf-8")
    import_line = f'import standings_{contest_id} from "../public/json/standings_{contest_id}.json";'
    contest_line = (
        f'    {{ id: "{contest_id}", name: "ICPC {args.year} Asia Seoul Regional", '
        f'season: "{args.year}–{args.year + 1}" }},'
    )
    data_line = f'    "{contest_id}": standings_{contest_id},'
    if import_line not in text:
        text = import_line + "\n" + text
    if f'id: "{contest_id}"' not in text:
        text = text.replace("export const contest_data = [\n", "export const contest_data = [\n" + contest_line + "\n", 1)
    if f'"{contest_id}":' not in text:
        text = text.replace("export const json_data = {\n", "export const json_data = {\n" + data_line + "\n", 1)
    if not all(line in text for line in [import_line, contest_line, data_line]):
        parser.error("大会一覧の形式を確認してください。ファイルは更新していません。")

    # 変換に成功するまで、公開データと大会一覧を変更しない。
    with tempfile.TemporaryDirectory() as temporary:
        output = Path(temporary) / "standings.json"
        subprocess.run(
            [sys.executable, str(args.source.resolve() / "seoul.py"), "--year", str(args.year), "--output", str(output)],
            check=True,
        )
        content = output.read_text(encoding="utf-8")
        data = json.loads(content)
        if not data["StandingsData"]:
            parser.error("順位表が空です。ファイルは更新していません。")
        (root / "public" / "json" / f"standings_{contest_id}.json").write_text(content, encoding="utf-8")
        metadata.write_text(text, encoding="utf-8")
    print(f"{contest_id}: {len(data['StandingsData'])}チームを取り込みました。")


if __name__ == "__main__":
    main()
