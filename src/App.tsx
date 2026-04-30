import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import SeasonBoroughBubbleChart from "./components/SeasonBoroughBubbleChart";
import './App.css';
import "leaflet/dist/leaflet.css";
import MapPanels from "./components/MapPanels";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import StoryTellingPage1 from "./components/StoryTellingPage1";
import StoryTellingPage2 from "./components/StoryTellingPage2";
import StoryTellingPage3 from "./components/StoryTellingPage3";
import StoryTellingPage4 from "./components/StoryTellingPage4";
import EndingPage from "./components/EndingPage";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | string[]>("All");
  const wrapperRef = useRef(null);


  // Load JSON
  useEffect(() => {
    async function load() {
      const res = await fetch(`${import.meta.env.BASE_URL}data/seoul.events.json`);
      const data = await res.json();
      setEvents(data);
    }
    load();
  }, []);

  // ----- SECTION 1: GRAPHIC -----
  const graphicRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: graphicRef,
    offset: ["start start", "end end"]
  });

  // 1. Convert scroll progress → zoom range
  const rawZoom = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.75]
  );

  // 2. Add smooth easing to the zoom value
  useSpring(rawZoom, {
    stiffness: 10,
    damping: 5,
    mass: 0.2,
  });


  const { scrollYProgress: caption } = useScroll({
    target: graphicRef,
    offset: ["start start", "50% start"]
  });
  const captionOpacity = useTransform(caption, [0, 1], [1, 0]);


  return (
    <div className="graphic-wrapper" ref={wrapperRef}>
      <div className="graphic" ref={graphicRef}>
        <div className="graphic-header">KAIST - Industrial Design</div>

        <motion.img 
          src="/seoulCity1.jpg"
          className="graphic-image"
        />

        <div className="graphic-overlay" />

        <motion.div 
          className="caption-box"
          style={{ opacity: captionOpacity }}
        >
          <h1>Your Perfect Seoul Trip Depends On Timing</h1>
          <p className="graphic-author">by Thi H.G Nguyen</p>
        </motion.div>

        <div className="graphic-footer">Fall 2025 - ID 418 Data Analysis for Designer</div>
      </div>

      {/* SCROLLY SECTIONS */}
      <section id="scrolly">
        <div className="step" data-step="5">
          <h2>Seasonal Event Distribution</h2>
          <h3>Seoul may surprise you with just how many events it hosts throughout the year.
With festivals, performances, and cultural experiences happening across every season and borough, it’s easy to feel overwhelmed at first.
This view helps you slow down and explore Seoul by borough, revealing when each area comes alive and which seasons best match your travel vibe, so you can choose the right time and place to enjoy the events you love most.</h3>
          
          {/* Filter Panel */}
          <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <h4 style={{ marginBottom: "10px", color: "#1a1a1a" }}>Type of Event</h4>

            <label style={{ marginRight: "20px", cursor: "pointer", color: "#1a1a1a" }}>
              <input
                type="checkbox"
                checked={filter === "All"}
                onChange={() => setFilter("All")}
                style={{ marginRight: "8px" }}
              />
              All
            </label>
            
            <label style={{ marginRight: "20px", cursor: "pointer", color: "#FF6B6B", fontWeight: "bold" }}>
              <input
                type="checkbox"
                checked={Array.isArray(filter) ? filter.includes("Performance & Entertainment") : false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    const newList = Array.isArray(filter) ? [...filter, "Performance & Entertainment"] : ["Performance & Entertainment"];
                    setFilter(newList);
                  } else {
                    if (Array.isArray(filter)) {
                      const newList = filter.filter((x) => x !== "Performance & Entertainment");
                      setFilter(newList.length === 0 ? "All" : newList);
                    }
                  }
                }}
                style={{ marginRight: "8px" }}
              />
              Performance & Entertainment
            </label>
            
            <label style={{ marginRight: "20px", cursor: "pointer", color: "#4CAF50", fontWeight: "bold" }}>
              <input
                type="checkbox"
                checked={Array.isArray(filter) ? filter.includes("Festivals & Outdoor Culture") : false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    const newList = Array.isArray(filter) ? [...filter, "Festivals & Outdoor Culture"] : ["Festivals & Outdoor Culture"];
                    setFilter(newList);
                  } else {
                    if (Array.isArray(filter)) {
                      const newList = filter.filter((x) => x !== "Festivals & Outdoor Culture");
                      setFilter(newList.length === 0 ? "All" : newList);
                    }
                  }
                }}
                style={{ marginRight: "8px" }}
              />
              Festivals & Outdoor Culture
            </label>
            
            <label style={{ cursor: "pointer", color: "#FFD700", fontWeight: "bold" }}>
              <input
                type="checkbox"
                checked={Array.isArray(filter) ? filter.includes("Art / Culture Experience") : false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    const newList = Array.isArray(filter) ? [...filter, "Art / Culture Experience"] : ["Art / Culture Experience"];
                    setFilter(newList);
                  } else {
                    if (Array.isArray(filter)) {
                      const newList = filter.filter((x) => x !== "Art / Culture Experience");
                      setFilter(newList.length === 0 ? "All" : newList);
                    }
                  }
                }}
                style={{ marginRight: "8px" }}
              />
              Art / Culture Experience
            </label>
          </div>

          <SeasonBoroughBubbleChart 
            events={events}
            filter={filter}
          />
        </div>
      </section>


      <div className="step" data-step="3">
          <h2>Explore by Borough</h2>
          <h3>Still not sure where to go?
Pick a few boroughs to compare and see how their seasons stack up — the patterns will help you spot the places that fit your travel mood best.</h3>
          <MapPanels 
            compareList={compareList} 
            setCompareList={setCompareList} 
            events={events} 
            filter={filter} 
            setFilter={setFilter} 
          />
        </div>


        <div className="step" data-step="2">
          <StoryTellingPage1 />
        </div>

        <div className="step" data-step="2">
          <StoryTellingPage2 />
        </div>

        <div className="step" data-step="4">
          <StoryTellingPage3 />
        </div>

        <div className="step" data-step="6">
          <StoryTellingPage4 />
        </div>

        <div className="step" data-step="7">
          <EndingPage />
        </div>

    </div>

    
  );
}

export default App;
