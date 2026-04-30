import React, { useEffect, useMemo, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import { mapCategory } from "../utils/mapCategory";
import "./SeasonBoroughBubbleChart.css";

type RawEvent = Record<string, any>;

// Color palette for categories
const CATEGORY_COLORS: Record<string, string> = {
  "Performance & Entertainment": "#FF6B6B",
  "Festivals & Outdoor Culture": "#4CAF50",
  "Art / Culture Experience": "#FFD700",
  "All": "#90CAF9",
};

const logValue = (v: number): number => Math.log10(v + 1);

// Convert month (1–12) → season, with special handling for December 2024
const getSeason = (month: number, year: number): "Winter" | "Spring" | "Summer" | "Fall" => {
  if (month === 12 && year === 2024) return "Winter"; // special rule

  if ([12, 1, 2].includes(month)) return "Winter";
  if ([3, 4, 5].includes(month)) return "Spring";
  if ([6, 7, 8].includes(month)) return "Summer";
  return "Fall";
};

const getMonthYear = (dateStr: string): { month: number, year: number } => {
  if (!dateStr) return { month: 0, year: 0 };
  const first = dateStr.split("~")[0];
  const [yearStr, monthStr] = first.split("-");
  return {
    month: parseInt(monthStr, 10),
    year: parseInt(yearStr, 10)
  };
};

interface RadarChartProps {
  events?: RawEvent[];
  filter?: string | string[];
}

const RadarChartWithAverage: React.FC<RadarChartProps> = ({ events: propsEvents, filter = "All" }) => {
  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);
  const [boroughs, setBoroughs] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      let dataToUse: RawEvent[] = [];
      
      // If events provided via props, use them
      if (propsEvents && propsEvents.length > 0) {
        dataToUse = propsEvents;
      } else {
        // Otherwise fetch from JSON
        const res = await fetch(`${import.meta.env.BASE_URL}data/seoul.events.json`);
        dataToUse = await res.json();
      }
      
      setRawEvents(dataToUse);

      // Count events per borough (apply filter)
      const boroughCounts: Record<string, number> = {};
      dataToUse.forEach((ev: RawEvent) => {
        const b = ev.borough?.trim();
        if (!b) return;
        
        // Apply event type filter
        const mapped = mapCategory(ev.classification);
        if (Array.isArray(filter)) {
          if (!filter.includes(mapped)) return;
        } else {
          if (filter !== "All" && mapped !== filter) return;
        }
        
        boroughCounts[b] = (boroughCounts[b] || 0) + 1;
      });

      // Sort by event count (highest to lowest)
      const sortedBoroughs = Object.keys(boroughCounts).sort(
        (a, b) => boroughCounts[b] - boroughCounts[a]
      );

      setBoroughs(sortedBoroughs);
    }
    load();
  }, [propsEvents, filter]);

  const chartData = useMemo(() => {
    if (!rawEvents.length || !boroughs.length) return [];

    // Determine render mode
    const isAllMode = filter === "All";

    const seasonLabels: Array<"Winter" | "Spring" | "Summer" | "Fall"> = ["Winter", "Spring", "Summer", "Fall"];

    if (isAllMode) {
      // MODE 1: "All" selected - combine all categories into single dataset
      const boroughSeason: Record<string, Record<string, number>> = {};

      rawEvents.forEach(ev => {
        const b = ev.borough;
        if (!b) return;

        const { month, year } = getMonthYear(ev["Date/Time"]);
        if (!month || !year) return;

        const season = getSeason(month, year);

        if (!boroughSeason[b]) {
          boroughSeason[b] = { Winter: 0, Spring: 0, Summer: 0, Fall: 0 };
        }

        boroughSeason[b][season] += 1;
      });

      return seasonLabels.map(season => {
        const row: any = { season };
        boroughs.forEach(b => {
          const raw = boroughSeason[b]?.[season] ?? 0;
          row[b] = logValue(raw);
        });
        return row;
      });
    } else {
      // MODE 2 & 3: Single or multiple specific categories - separate by category
      const boroughSeasonCategory: Record<string, Record<string, Record<string, number>>> = {};

      rawEvents.forEach(ev => {
        const b = ev.borough;
        if (!b) return;

        const mapped = mapCategory(ev.classification);
        if (Array.isArray(filter)) {
          if (!filter.includes(mapped)) return;
        } else {
          if (filter !== "All" && mapped !== filter) return;
        }

        const { month, year } = getMonthYear(ev["Date/Time"]);
        if (!month || !year) return;

        const season = getSeason(month, year);

        if (!boroughSeasonCategory[b]) {
          boroughSeasonCategory[b] = {};
        }
        if (!boroughSeasonCategory[b][season]) {
          boroughSeasonCategory[b][season] = {};
        }

        boroughSeasonCategory[b][season][mapped] = (boroughSeasonCategory[b][season][mapped] || 0) + 1;
      });

      return seasonLabels.map(season => {
        const row: any = { season };
        boroughs.forEach(b => {
          if (Array.isArray(filter)) {
            filter.forEach(category => {
              const key = `${b}_${category}`;
              const raw = boroughSeasonCategory[b]?.[season]?.[category] ?? 0;
              row[key] = logValue(raw);
            });
          }
        });
        return row;
      });
    }
  }, [rawEvents, boroughs, filter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const borough = payload[0].dataKey;
    const rawValue = data[borough];

    return (
      <div style={{ background: "white", color: "#1a1a1a", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <strong style={{ display: "block", marginBottom: "4px" }}>{label}</strong>
        <div>{borough}: {typeof rawValue === "number" ? rawValue.toFixed(2) : rawValue}</div>
      </div>
    );
  };

  const maxValue = useMemo(() => {
    if (!chartData.length) return 1;

    let m = 0;
    chartData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== "season") m = Math.max(m, row[key]);
      });
    });

    return m;
  }, [chartData]);


  // ===== RENDER (MODE-AWARE) =====
  const isAllMode = filter === "All";
  const selectedCategories = Array.isArray(filter) ? filter : [];

  return (
    <div className="w-full grid grid-flow-row auto-cols-max grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-1">
      {boroughs.map((b) => (
        <div
          key={b}
          className="w-[250px] p-8 rounded flex flex-col items-center justify-center"
        >
          <h3 className="text-center text-[1.3rem] font-semibold mb-0 text-white">{b}</h3>

          <RadarChart
            key={`radar-${b}`}
            width={240}
            height={240}
            cx={115}
            cy={140}
            outerRadius={80}
            data={chartData}
          >
            <PolarGrid stroke="#ddd" />
            <PolarAngleAxis dataKey="season" style={{ fontSize: "12px" }} />
            <PolarRadiusAxis 
              domain={[0, Math.ceil(maxValue)]} 
              tickCount={3}
              style={{ fontSize: "1px", fill: "#ffffff" }} 
            />
            
            {isAllMode ? (
              // MODE 1: All - single unified radar
              <Radar
                key={`radar-${b}-all`}
                name="All Categories"
                dataKey={b}
                stroke="#90CAF9"
                fill="#90CAF9"
                fillOpacity={0.6}
              />
            ) : (
              // MODE 2 & 3: Single or multiple categories - separate layers per category
              selectedCategories.map((category) => (
                <Radar
                  key={`radar-${b}-${category}`}
                  name={category}
                  dataKey={`${b}_${category}`}
                  stroke={CATEGORY_COLORS[category] || "#999"}
                  fill={CATEGORY_COLORS[category] || "#999"}
                  fillOpacity={0.3}
                />
              ))
            )}
            
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>

        </div>
      ))}
    </div>
  );
};


export default RadarChartWithAverage;