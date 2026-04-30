import { useEffect, useRef, useState } from "react";
import "./StoryTellingPage1.css";

const base = import.meta.env.BASE_URL;
const IMAGES = [
  [`${base}SpringEvent.do.png`, `${base}SpringEvent1.do.jpeg`, `${base}SpringEvent2.do.png`],
  [`${base}SpringEvent3.do.jpeg`, `${base}SPringEvent4.do.jpeg`, `${base}SpringEvent5.do.jpeg`],
  [`${base}SpringEvent.do.png`, `${base}SpringEvent1.do.jpeg`, `${base}SpringEvent2.do.png`],
];

export default function StoryTellingPage1() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [firstSetVisible, setFirstSetVisible] = useState(false);
  const [secondSetVisible, setSecondSetVisible] = useState(false);
  const firstBlockRef = useRef<HTMLDivElement | null>(null);
  const secondBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let lastTime = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastTime < 50) return; // Throttle to 20fps for Safari compatibility
      lastTime = now;

      const viewportMid = window.innerHeight / 2;

      // Pop effect for first set images
      if (firstBlockRef.current) {
        const firstImages = firstBlockRef.current.querySelectorAll("img");
        firstImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const elementMid = rect.top + rect.height / 2;
          const distance = Math.abs(viewportMid - elementMid);

          const maxDistance = 300;
          const proximity = Math.max(1 - (distance / maxDistance), 0);

          if (proximity > 0.3) {
            img.classList.add("pop");
            setFirstSetVisible(true);
          } else {
            img.classList.remove("pop");
          }
        });
      }

      // Pop effect for second set images
      if (secondBlockRef.current) {
        const images = secondBlockRef.current.querySelectorAll("img");
        images.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const elementMid = rect.top + rect.height / 2;
          const distance = Math.abs(viewportMid - elementMid);

          // Calculate opacity and scale based on distance
          const maxDistance = 300;
          const proximity = Math.max(1 - (distance / maxDistance), 0);
          
          if (proximity > 0.3) {
            img.classList.add("pop");
            setSecondSetVisible(true);
          } else {
            img.classList.remove("pop");
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <section ref={sectionRef} className="page1-section">
      <div className="intro-block">
        <h1 className="intro-title">
          Your perfect Seoul trip isn't random.
        </h1>

        <p className="intro-sub">
          It's shaped by <strong>when you arrive</strong>— <br />
          and the <strong>season you step into</strong>.
        </p>
      </div>

      <div className="divider" />

      <div className="season-block">
        <h2 className="page1-title">
          Spring · The City in Bloom
        </h2>

        <p className="season-text">
          As the weather softens, Seoul turns inward.
          Musicals, theater performances, and intimate cultural
          events take center stage, setting a calm,
          <em> expressive</em> rhythm across the city.
        </p>
      </div>

      {/* First Image Set */}
      <div
        ref={firstBlockRef}
        className={`second-content-block ${firstSetVisible ? "visible" : ""}`}
      >
        <div className="page1-poster-row second-set">
          {IMAGES[0].map((poster, imgIdx) => (
            <img
              key={imgIdx}
              src={poster}
              alt="Spring event poster"
              className="pop-up-image"
              style={{ transitionDelay: `${imgIdx * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      {/* Second Image Set */}
      <div 
        ref={secondBlockRef}
        className={`second-content-block ${secondSetVisible ? "visible" : ""}`}
      >
        <div className="page1-poster-row second-set">
          {IMAGES[1].map((poster, imgIdx) => (
            <img 
              key={imgIdx} 
              src={poster} 
              alt="Summer event poster"
              className="pop-up-image"
              style={{ transitionDelay: `${imgIdx * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
