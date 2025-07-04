import standings_2022_yokohama from "../public/json/standings_2022_yokohama.json";
import standings_2023_domestic from "../public/json/standings_2023_domestic.json";
import standings_2023_seoul from "../public/json/standings_2023_seoul.json";
import standings_2023_jakarta from "../public/json/standings_2023_jakarta.json";
import standings_2023_yokohama from "../public/json/standings_2023_yokohama.json";
import standings_2024_asia_pacific from "../public/json/standings_2024_asia_pacific.json";
import standings_2024_domestic from "../public/json/standings_2024_domestic.json";
import standings_2024_taichung from "../public/json/standings_2024_taichung.json";
import standings_2024_seoul from "../public/json/standings_2024_seoul.json";
import standings_2024_jakarta from "../public/json/standings_2024_jakarta.json";
import standings_2024_yokohama from "../public/json/standings_2024_yokohama.json";
import standings_2025_asia_pacific from "../public/json/standings_2025_asia_pacific.json";
import standings_2025_domestic from "../public/json/standings_2025_domestic.json";

export const contest_data = [
    { id: "2025_domestic", name: "ICPC 2025 日本 国内予選" },
    { id: "2025_asia_pacific", name: "The 2025 ICPC Asia Pacific Championship" },
    { id: "2024_yokohama", name: "ICPC 2024 Asia Yokohama Regional" },
    { id: "2024_jakarta", name: "ICPC 2024 Asia Jakarta Regional" },
    { id: "2024_seoul", name: "ICPC 2024 Asia Seoul Regional" },
    { id: "2024_taichung", name: "ICPC 2024 Asia Taichung Regional" },
    { id: "2024_domestic", name: "ICPC 2024 日本 国内予選" },
    { id: "2024_asia_pacific", name: "The 2024 ICPC Asia Pacific Championship" },
    { id: "2023_yokohama", name: "ICPC 2023 Asia Yokohama Regional" },
    { id: "2023_jakarta", name: "ICPC 2023 Asia Jakarta Regional" },
    { id: "2023_seoul", name: "ICPC 2023 Asia Seoul Regional" },
    { id: "2023_domestic", name: "ICPC 2023 日本 国内予選" },
    { id: "2022_yokohama", name: "ICPC 2022 Asia Yokohama Regional" },
];

export const json_data = {
    "2022_yokohama": standings_2022_yokohama,
    "2023_domestic": standings_2023_domestic,
    "2023_seoul": standings_2023_seoul,
    "2023_jakarta": standings_2023_jakarta,
    "2023_yokohama": standings_2023_yokohama,
    "2024_asia_pacific": standings_2024_asia_pacific,
    "2024_domestic": standings_2024_domestic,
    "2024_taichung": standings_2024_taichung,
    "2024_seoul": standings_2024_seoul,
    "2024_jakarta": standings_2024_jakarta,
    "2024_yokohama": standings_2024_yokohama,
    "2025_asia_pacific": standings_2025_asia_pacific,
    "2025_domestic": standings_2025_domestic,
} as {
    [key: string]: {
        ContestData: {
            UnitTime: string;
            Penalty: number;
            Duration: number;
            TaskInfo: string[];
        };
        StandingsData: {
            Rank: number;
            TotalResult: {
                Score: number;
                Penalty: number;
            };
            TeamName: string;
            University: string;
            TaskResults: {
                // なぜかエラーになる
                // [key: string]: {
                //   Elapsed: number;
                //   Score: number;
                //   Penalty: number;
                // };
                [key: string]: any;
            }
        }[];
    };
};
