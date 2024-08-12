import standings_2022_yokohama from "../public/standings_2022_yokohama.json";
import standings_2023_domestic from "../public/standings_2023_domestic.json";
import standings_2023_yokohama from "../public/standings_2023_yokohama.json";
import standings_2023_asia from "../public/standings_2023_asia.json";
import standings_2024_domestic from "../public/standings_2024_domestic.json";

export const contest_data = [
    { id: "2022_yokohama", name: "ICPC 2022 Asia Yokohama Regional" },
    { id: "2023_domestic", name: "ICPC 2023 国内予選" },
    { id: "2023_yokohama", name: "ICPC 2023 Asia Yokohama Regional" },
    { id: "2023_asia", name: "The 2024 ICPC Asia Pacific Championship" },
    { id: "2024_domestic", name: "ICPC 2024 国内予選" },
];

export const json_data = {
    "2022_yokohama": standings_2022_yokohama,
    "2023_domestic": standings_2023_domestic,
    "2023_yokohama": standings_2023_yokohama,
    "2023_asia": standings_2023_asia,
    "2024_domestic": standings_2024_domestic,
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
                // [key: string]: { なぜかエラーになる
                //   Elapsed: number;
                //   Score: number;
                //   Penalty: number;
                // };
                [key: string]: any;
            }
        }[];
    };
};
