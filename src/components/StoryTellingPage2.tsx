import "./StoryTellingPage2.css";

const base = import.meta.env.BASE_URL;
const POSTERS = [
  `${base}SummerEvent.do.jpeg`,
  `${base}SummerEvent1.do.png`,
  `${base}SummerEvent2.do.jpeg`,
  `${base}SummerEvent3.do.jpeg`,
  `${base}SummerEvent4.do.jpeg`,
  `${base}SummerEvent5.do.jpeg`,
];

export default function StoryTellingPage2() {
  return (
    <section className="page2-wrapper">
      {/* LEFT TEXT */}
      <div className="text-block">
        <h1>
        Seoul in summer -<br />
          dazzles with<br />
         energy.
        </h1>

        <p className="subtitle">
          Every visit depends on the nights you explore - and the outdoor rhythm around you
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="visual-block">
        <div className="page2-season-header">
          <h2 className="page2-title">
            Summer · The City in Motion
          </h2>

          <div className="page2-season-divider" />

          <p className="page2-season-desc">
            Come to Seoul in summer, when the city comes alive after sunset. 
            As the days grow warmer, <em>outdoor</em> performances, night festivals, and youth-driven culture transform streets, riversides, and historic sites into vibrant stages.
            
          </p>
        </div>

        <div className="page2-poster-row">
          {POSTERS.map((poster, i) => (
            <img key={i} src={poster} alt="Summer event poster" />
          ))}
        </div>
      </div>
    </section>
  );
}
