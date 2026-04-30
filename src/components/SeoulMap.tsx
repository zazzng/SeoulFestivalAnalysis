import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import type { LatLngExpression, PathOptions } from "leaflet";
import * as L from "leaflet";
import { mapCategory } from "../utils/mapCategory";
import "./SeoulMap.css";

// Fix Leaflet default icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FeatureProperties {
  name: string;
  code: string;
  name_eng: string;
  base_year: string;
}

interface Feature {
  type: "Feature";
  properties: FeatureProperties;
  geometry: any;
}

export interface Borough {
  name: string;
  coords: LatLngExpression;
}

interface SeoulMapProps {
  boroughs: Borough[];
  onSelectBorough: (b: Borough) => void;
  compareList?: string[];
  events?: Record<string, any>[];
  filter?: string;
  boroughColorMap?: Record<string, string>;
}

const COLOR_MAP: Record<string, string> = {
  "All": "#90CAF9",
  "Performance & Entertainment": "#FF6B6B",
  "Festivals & Outdoor Culture": "#4CAF50",
  "Art / Culture Experience": "#FFD700",
};

const baseStyle: PathOptions = {
  color: "#333",
  weight: 1.5,
  fillColor: "#90CAF9",
  fillOpacity: 0.2,
};

const SeoulMap: React.FC<SeoulMapProps> = ({ boroughs: _boroughs, onSelectBorough, compareList = [], events = [], filter = "All", boroughColorMap = {} }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [_hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; details?: any } | null>(null);
  const [tooltipText, setTooltipText] = useState<string>("");
  const [boroughDetails, setBoroughDetails] = useState<Record<string, any>>({});
  const [geoJsonKey, setGeoJsonKey] = useState(0);
  const [boroughEventCounts, setBoroughEventCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/borough_details.json`)
      .then((res) => res.json())
      .then((data) => setBoroughDetails(data));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/seoul_manicipalities_geo_simple.geojson`)
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // Force GeoJSON to re-render when compareList or filter changes
  useEffect(() => {
    setGeoJsonKey((prev) => prev + 1);
  }, [compareList, filter]);

  // Calculate event counts per borough for the selected filter
  useEffect(() => {
    if (!events.length) {
      setBoroughEventCounts({});
      return;
    }

    const counts: Record<string, number> = {};
    let matchedCount = 0;
    
    events.forEach((ev) => {
      const borough = ev.borough;
      const rawClassification = ev.classification;
      const mappedClassification = mapCategory(rawClassification);
      
      // Only count events that match the current filter
      if (filter === "All" || mappedClassification === filter) {
        counts[borough] = (counts[borough] || 0) + 1;
        matchedCount++;
      }
    });
    
    console.log("Filter:", filter);
    console.log("Matched events:", matchedCount, "out of", events.length);
    console.log("Borough event counts:", counts);
    
    setBoroughEventCounts(counts);
  }, [events, filter]);

  // 👉 STYLE FUNCTION MUST BE INSIDE THE COMPONENT
  const getFeatureStyle = (feature: any): PathOptions => {
    const boroughName = feature?.properties?.name_eng;
    const isSelected = compareList.includes(boroughName);
    
    // Get base color from filter
    const baseColor = COLOR_MAP[filter] || COLOR_MAP["All"];
    
    // Calculate opacity based on event count in this borough
    const eventCount = boroughEventCounts[boroughName] || 0;
    const maxCount = Math.max(...Object.values(boroughEventCounts as Record<string, number>), 1);
    
    // Log for debugging
    if (boroughName === "Jung-gu") {
      console.log(`Jung-gu: filter="${filter}", eventCount=${eventCount}, maxCount=${maxCount}, boroughEventCounts keys:`, Object.keys(boroughEventCounts));
    }
    
    // Determine opacity: if there are events, scale; if no events, use minimum opacity
    let opacity: number;
    if (eventCount === 0) {
      opacity = 0.2; // Minimum opacity for boroughs with no events in this filter
    } else {
      opacity = 0.01 + (eventCount / maxCount) * 0.8; // Range from 0.4 to 0.9 for boroughs with events
    }
    
    // If selected, use borough's assigned color and full opacity
    if (isSelected) {
      opacity = 1.0;
    }

    return {
      ...baseStyle,
      fillColor: isSelected ? (boroughColorMap[boroughName] || baseColor) : baseColor,
      fillOpacity: opacity,
      weight: isSelected ? 2.5 : 1.5,
    };
  };

  const styleFeature = (feature: any): PathOptions => {
    return getFeatureStyle(feature);
  };

  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={11}
      scrollWheelZoom={false}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/positron_labels_under/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {geoData && (
        <GeoJSON
          key={geoJsonKey}
          data={geoData}
          style={styleFeature}
          onEachFeature={(feature, layer) => {
            const f = feature as Feature;
            const pathLayer = layer as any;

            pathLayer.on({
              click: () => {
                // Create a Borough object and call onSelectBorough to add to compare list
                const borough: Borough = {
                  name: f.properties.name_eng,
                  coords: [0, 0] as LatLngExpression
                };
                onSelectBorough(borough);
              },
              mouseover: (e: any) => {
                setHoveredFeature(f.properties.code);
                const details = boroughDetails[f.properties.name_eng] || {};
                setTooltipText(f.properties.name_eng);
                const mouseEvent = e.originalEvent;
                setTooltipPos({ 
                  x: mouseEvent.clientX, 
                  y: mouseEvent.clientY,
                  details: details
                } as any);
              },
              mouseout: () => {
                setHoveredFeature(null);
                setTooltipPos(null);
              },
              mousemove: (e: any) => {
                const details = boroughDetails[f.properties.name_eng] || {};
                const mouseEvent = e.originalEvent;
                setTooltipPos((_prev) => ({
                  x: mouseEvent.clientX, 
                  y: mouseEvent.clientY,
                  details: details
                } as any));
              },
            });
          }}
        />
      )}

      {/* Tooltip on hover */}
      {tooltipPos && (
        <div
          className="map-tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y + 10}px`,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div className="tooltip-title">{tooltipText}</div>
          {tooltipPos.details && (
            <>
              {tooltipPos.details.name && (
                <div className="tooltip-subtitle">{tooltipPos.details.name}</div>
              )}
              {tooltipPos.details.description && (
                <div className="tooltip-desc">{tooltipPos.details.description}</div>
              )}
              {tooltipPos.details.atmosphere && (
                <div className="tooltip-atmosphere">
                  <span className="label">Vibe:</span> {tooltipPos.details.atmosphere}
                </div>
              )}
              {tooltipPos.details.highlights && tooltipPos.details.highlights.length > 0 && (
                <div className="tooltip-highlights">
                  <span className="label">Must-see:</span> {tooltipPos.details.highlights.slice(0, 3).join(", ")}
                </div>
              )}
              {tooltipPos.details.attractions && (
                <div className="tooltip-attractions">
                  <span className="label">Activities:</span> {tooltipPos.details.attractions}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </MapContainer>
  );
};

export default SeoulMap;
