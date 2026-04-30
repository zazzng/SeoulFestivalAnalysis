import { useMemo } from "react";
import "./RadarCompare.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mapCategory } from "../utils/mapCategory";
import { createBoroughColorMap } from "../utils/colorMapping";

type Season = "Winter" | "Spring" | "Summer" | "Fall";
type RawEvent = Record<string, any>;

interface Props {
  boroughNames: string[];
  events: RawEvent[];
  filter: string | string[];
}

interface SeasonDatum {
  season: Season;
  [key: string]: number | string;
}

function getSeason(dateStr: string): Season | "IGNORE" {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  // Winter = Dec 2024 + Jan/Feb 2025
  if (month === 12 && year === 2024) return "Winter";
  if (year === 2025 && (month === 1 || month === 2)) return "Winter";

  // Other seasons = 2025 only
  if (year !== 2025) return "IGNORE";

  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Fall";

  return "IGNORE";
}

export default function RadarCompare({ boroughNames, events, filter }: Props) {
  const data = useMemo<SeasonDatum[]>(() => {
    let rows: SeasonDatum[] = [
      { season: "Winter" },
      { season: "Spring" },
      { season: "Summer" },
      { season: "Fall" },
    ];

    boroughNames.forEach((borough) => {
      const filtered = events.filter((ev) => {
        if (ev.borough !== borough) return false;
        
        const mapped = mapCategory(ev.classification);
        if (Array.isArray(filter)) {
          if (!filter.includes(mapped)) return false;
        } else {
          if (filter !== "All" && mapped !== filter) return false;
        }

        const season = getSeason(ev["start date"]);
        return season !== "IGNORE";
      });

      const counts: Record<Season, number> = {
        Winter: 0,
        Spring: 0,
        Summer: 0,
        Fall: 0,
      };

      filtered.forEach((ev) => {
        const season = getSeason(ev["start date"]);
        if (season !== "IGNORE") {
          counts[season] += 1;
        }
      });

      rows = rows.map((r) => {
        const season = r.season as Season;
        return {
          ...r,
          [borough]: counts[season],
        };
      });
    });

    return rows;
  }, [boroughNames, events, filter]);

  const boroughColorMap = createBoroughColorMap(boroughNames);

  return (
    <div style={{ width: "100%", height: "80vh", padding: "20px 0" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <YAxis type="category" dataKey="season" width={80} />

          <XAxis
            type="number"
            domain={[0, "auto"]}
            label={{
              value: "Event Count",
              position: "insideBottomRight",
              offset: 0,
            }}
          />

          <Tooltip />
          <Legend />

          {boroughNames.map((b) => (
            <Line
              key={b}
              type="monotone"
              dataKey={b}
              stroke={boroughColorMap[b]}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
