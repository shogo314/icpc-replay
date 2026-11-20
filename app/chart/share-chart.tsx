import { useEffect, useState, type RefObject } from "react";
import { Chart } from "chart.js";

type Props = {
  chartRef: RefObject<Chart<"scatter"> | null>;
  contest: string;
  title: string;
  rankSummary: string;
};

function chartImage({ chartRef, contest, title }: Props): File {
  const chart = chartRef.current;
  if (!chart) throw new Error("グラフを読み込み中です。");
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 675;

  const options = chart.config.options;
  const exported = new Chart<"scatter">(canvas, {
    type: "scatter",
    data: {
      datasets: chart.data.datasets.map((dataset, index) => ({
        ...dataset,
        hidden: !chart.isDatasetVisible(index),
      })),
    },
    options: {
      ...options,
      responsive: false,
      devicePixelRatio: 1,
      animation: false,
      events: [],
      plugins: {
        ...options?.plugins,
        title: { display: true, text: title, font: { size: 22 }, color: "#1f2937" },
      },
    },
    plugins: [
      ...(chart.config.plugins ?? []),
      {
        id: "exportBackground",
        beforeDraw({ ctx, width, height }) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        },
      },
    ],
  });
  let bytes: string;
  try {
    // 共有メニューをクリック操作中に開けるよう、PNGを同期的に用意する。
    bytes = atob(canvas.toDataURL("image/png").split(",")[1]);
  } finally {
    exported.destroy();
  }
  return new File([Uint8Array.from(bytes, c => c.charCodeAt(0))], `icpc-replay-${contest}.png`, { type: "image/png" });
}

const buttonStyle = "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50";

export default function ShareChart(props: Props) {
  const [native, setNative] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState(false);
  const [chartUrl, setChartUrl] = useState("");
  const postText = `${props.title}\n${props.rankSummary}\n\n#ICPCReplay\n${chartUrl}`;
  const intent = chartUrl ? `https://twitter.com/intent/tweet?${new URLSearchParams({ text: postText })}` : "";

  useEffect(() => {
    const probe = new File([], "chart.png", { type: "image/png" });
    setNative(window.matchMedia("(pointer: coarse)").matches && !!navigator.canShare?.({ files: [probe] }));
    setChartUrl(window.location.href);
  }, []);

  async function share() {
    setBusy(true);
    setMessage("");
    setFallback(false);
    try {
      const file = chartImage(props);
      if (native && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: postText });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": file })]);
        setMessage("画像をコピーしました。投稿画面が開かなかった場合は「Xの投稿画面を開く」を押してください。");
        window.open(intent, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("画像を共有できませんでした。PNGを保存してXの投稿画面に添付してください。");
      setFallback(true);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    try {
      const file = chartImage(props);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 60000);
    } catch {
      setMessage("画像を保存できませんでした。グラフを再読み込みしてお試しください。");
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <button className={buttonStyle} onClick={share} disabled={busy || !intent} aria-describedby="chart-share-help">
          {native ? "グラフ画像を共有" : "画像をコピーしてXを開く"}
        </button>
        {fallback && <button className="text-sm underline" onClick={download}>PNGを保存</button>}
        {message && <a className="text-sm underline" href={intent} target="_blank" rel="noreferrer">Xの投稿画面を開く</a>}
      </div>
      <p id="chart-share-help" className="text-sm text-gray-700">
        {native
          ? "共有メニューでXを選びます。投稿画面でグラフ画像と本文を確認してからポストしてください。"
          : "Xの投稿欄に画像を貼り付けます（WindowsはCtrl+V、Macは⌘V、スマホは投稿欄を長押しして「ペースト」）。画像を確認してからポストしてください。"}
        {" "}本文には大会名・各チームの初正解以降の瞬間最高順位・#ICPCReplay・このグラフのURLを用意しています。
      </p>
      <p role="status" className="text-sm text-gray-700">{message}</p>
    </div>
  );
}
