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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div
        style={{
          background: "#FFFFFF",
          color: "#14131C",
          padding: "10px 14px",
          border: "3px solid #14131C",
          borderRadius: "12px",
          boxShadow: "4px 4px 0 #14131C",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <strong style={{ display: "block", marginBottom: "4px", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.04em" }}>{label}</strong>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} style={{ color: entry.color, fontWeight: 700 }}>
            {entry.dataKey}: {entry.value}
          </div>
        ))}
      </div>
    );
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "8px" }}>
        {payload.map((entry: any) => (
          <span
            key={entry.value}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#14131C",
              background: "#FFFFFF",
              border: "3px solid #14131C",
              borderRadius: "999px",
              padding: "4px 10px",
              boxShadow: "3px 3px 0 #14131C",
            }}
          >
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: entry.color, display: "inline-block" }} />
            {entry.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "80vh", padding: "20px 0" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#14131C" strokeOpacity={0.15} />

          <YAxis
            type="category"
            dataKey="season"
            width={80}
            tick={{ fill: "#14131C", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
          />

          <XAxis
            type="number"
            domain={[0, "auto"]}
            tick={{ fill: "#14131C", fontFamily: "'Inter', sans-serif" }}
            label={{
              value: "Event Count",
              position: "insideBottomRight",
              offset: 0,
              fill: "#14131C",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

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
