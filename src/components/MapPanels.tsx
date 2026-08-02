import React, { useEffect, useState, useMemo } from "react";
import SeoulMap from "./SeoulMap";
import type { Borough } from "./SeoulMap";
import RadarCompare from "./RadarCompare";
import { createBoroughColorMap } from "../utils/colorMapping";
import "./MapPanels.css";

type RawEvent = Record<string, any>;

// Same category -> chip modifier mapping used by the hero filter panel in App.css
const CHIP_CLASS: Record<string, string> = {
  All: "filter-chip--all",
  "Performance & Entertainment": "filter-chip--performance",
  "Festivals & Outdoor Culture": "filter-chip--festivals",
  "Art / Culture Experience": "filter-chip--art",
};

interface MapPanelsProps {
  compareList: string[];
  setCompareList: (list: string[]) => void;
  events: RawEvent[];
  filter: string | string[]; // important: filter can be string or string[]
  setFilter: (filter: string | string[]) => void;
}

const MapPanels: React.FC<MapPanelsProps> = ({
  compareList,
  setCompareList,
  events,
  filter,
  setFilter
}) => {
  const [classifications, setClassifications] = useState<string[]>([]);

  // Load fixed classifications
  useEffect(() => {
    if (!events.length) return;

    const fixedCategories = [
      "All",
      "Performance & Entertainment",
      "Festivals & Outdoor Culture",
      "Art / Culture Experience",
    ];

    setClassifications(fixedCategories);
  }, [events]);

  // Compute borough center points
  const boroughPoints: Borough[] = useMemo(() => {
    const map: Record<string, { sumLat: number; sumLng: number; count: number }> = {};

    events.forEach((ev) => {
      const name = ev["borough"];
      const lat = Number(ev["Latitude (X coordinate)"]);
      const lng = Number(ev["Longitude (Y coordinate)"]);
      if (!name || isNaN(lat) || isNaN(lng)) return;

      if (!map[name]) map[name] = { sumLat: 0, sumLng: 0, count: 0 };
      map[name].sumLat += lat;
      map[name].sumLng += lng;
      map[name].count += 1;
    });

    return Object.entries(map).map(([name, v]) => ({
      name,
      coords: [v.sumLat / v.count, v.sumLng / v.count],
    })) as Borough[];
  }, [events]);

  // Create color map for selected boroughs
  const boroughColorMap = useMemo(
    () => createBoroughColorMap(compareList),
    [compareList]
  );

  // Select or deselect borough (max 4)
  const handleSelectBorough = (borough: Borough) => {
    if (compareList.includes(borough.name)) {
      setCompareList(compareList.filter((name) => name !== borough.name));
    } else {
      if (compareList.length < 4) {
        setCompareList([...compareList, borough.name]);
      }
    }
  };

  const handleDeselect = (boroughName: string) => {
    setCompareList(compareList.filter((b) => b !== boroughName));
  };

  return (
    <div className="panels-root">
      {/* LEFT SIDE */}
      <div className="left-section">
        <div className="filter-panel">
          <h3 className="filter-panel-title">Type of Event</h3>

          {/* All checkbox */}
          <label className={`filter-chip ${CHIP_CLASS.All} ${filter === "All" ? "is-active" : ""}`}>
            <input
              type="checkbox"
              checked={filter === "All"}
              onChange={() => setFilter("All")}
            />
            All
          </label>

          {/* Category checkboxes */}
          {classifications
            .filter((c) => c !== "All")
            .map((c) => (
              <label key={c} className={`filter-chip ${CHIP_CLASS[c] ?? ""} ${Array.isArray(filter) && filter.includes(c) ? "is-active" : ""}`}>
                <input
                  type="checkbox"
                  checked={Array.isArray(filter) ? filter.includes(c) : false}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    if (checked) {
                      // Add category
                      const newList = Array.isArray(filter) ? [...filter, c] : [c];
                      setFilter(newList);
                    } else {
                      // Remove category
                      if (Array.isArray(filter)) {
                        const newList = filter.filter((x) => x !== c);
                        setFilter(newList.length === 0 ? "All" : newList);
                      }
                    }
                  }}
                />
                {c}
              </label>
            ))}
        </div>

        {/* Map Area */}
        <div className="left-map">
          <SeoulMap
            boroughs={boroughPoints}
            onSelectBorough={handleSelectBorough}
            compareList={compareList}
            events={events}
            filter={typeof filter === "string" ? filter : "All"}
            boroughColorMap={boroughColorMap}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-sidebar">
        <div className="selected-panel">
          <h4>Selected for Compare</h4>

          {compareList.length === 0 && (
            <p className="empty">None selected yet</p>
          )}

          {compareList.map((b) => (
            <div
              key={b}
              className="compare-item"
              style={{ backgroundColor: boroughColorMap[b], color: "#fff" }}
              onClick={() => handleDeselect(b)}
              title="Click to deselect"
            >
              {b}
              <span className="remove-icon">✕</span>
            </div>
          ))}

          <button className="btn-reset" onClick={() => setCompareList([])}>
            Reset
          </button>
        </div>

        <div className="radar-panel">
          {compareList.length === 0 ? (
            <p className="empty">Select boroughs to compare</p>
          ) : (
            <RadarCompare
              boroughNames={compareList}
              events={events}
              filter={filter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPanels;
