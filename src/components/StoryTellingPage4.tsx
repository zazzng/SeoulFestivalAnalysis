import { useEffect, useRef, useState } from "react";
import "./StoryTellingPage4.css";

const IMAGES = [
  ["/Winter.do.png", "/Winter4.do.png", "/Winter1.do.jpeg"],
  ["/Winter2.do.jpeg", "/Winter5.do.jpeg", "/Winter.do.jpeg"],
  ["/Winter3.do.jpeg", "/Winter2.do.jpeg", "/Winter4.do.png"],
];

export default function StoryTellingpage4() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [_firstSetVisible, setFirstSetVisible] = useState(false);
  const [secondSetVisible, setSecondSetVisible] = useState(false);
  const [thirdSetVisible, setThirdSetVisible] = useState(false);
  const firstBlockRef = useRef<HTMLDivElement | null>(null);
  const secondBlockRef = useRef<HTMLDivElement | null>(null);
  const thirdBlockRef = useRef<HTMLDivElement | null>(null);

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

      // Pop effect for third set images
      if (thirdBlockRef.current) {
        const images = thirdBlockRef.current.querySelectorAll("img");
        images.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const elementMid = rect.top + rect.height / 2;
          const distance = Math.abs(viewportMid - elementMid);

          const maxDistance = 300;
          const proximity = Math.max(1 - (distance / maxDistance), 0);

          if (proximity > 0.3) {
            img.classList.add("pop");
            setThirdSetVisible(true);
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
    <section ref={sectionRef} className="page4-section">

      <div className="divider" />

      <div className="season-block">
        <h2 className="page4-title">
          Winter · Stories Told Indoors
        </h2>

        <p className="season-text">
          Come to Seoul in winter, when the city slows and stories are told indoors.
Intimate performances, exhibitions, and cozy cafés invite quiet reflection.
Each space offers a chance to discover narratives shaped by introspection and warmth.
        </p>
      </div>

      {/* Second Image Set */}
      <div
        ref={secondBlockRef}
        className={`second-content-block ${secondSetVisible ? "visible" : ""}`}
      >
        <div className="page4-poster-row second-set">
          {IMAGES[1].map((poster, imgIdx) => (
            <img
              key={imgIdx}
              src={poster}
              alt="Winter event poster"
              className="pop-up-image"
              style={{ transitionDelay: `${imgIdx * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      {/* Third Image Set */}
      <div
        ref={thirdBlockRef}
        className={`second-content-block ${thirdSetVisible ? "visible" : ""}`}
      >
        <div className="page4-poster-row second-set">
          {IMAGES[2].map((poster, imgIdx) => (
            <img
              key={imgIdx}
              src={poster}
              alt="Winter event poster"
              className="pop-up-image"
              style={{ transitionDelay: `${imgIdx * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
