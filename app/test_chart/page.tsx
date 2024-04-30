// yarn add chart.js react-chartjs-2
"use client";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    scales,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function LineChart() {
    const options = {
        responsive: true,
        plugins: {
            legend: {},
            title: {
                display: true,
                text: "グラフタイトル",
            },
            labels: {},
            tooltip: {},
        },
    };
    var labels: number[] = [];
    var data: number[] = [];
    var tmp = {
        labels,
        datasets: [{
            label: "First Dataset",
            data,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
        }]
    };
    for (let i = 0; i < 10; i++) {
        tmp.labels.push(i);
        if (i < 5) {
            tmp.datasets[0].data.push(i * i);
        } else {
            tmp.datasets[0].data.push(30 - i);
        }
    }
    return <Line data={tmp} options={options} />;
};

export default function Chart() {
    return (<div>
        <a href="/">
            Home
        </a>
        <br />
        {LineChart()}
    </div>);
}
