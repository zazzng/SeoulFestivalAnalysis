import "./StoryTellingPage3.css";

const POSTERS = [
  "/Fall.do.png",
  "/Fall1.do.png",
  "/Fall2.do.jpeg",
    "/Fall3.do.png",
    "/Fall4.do.jpeg",
    "/Fall5.do.jpeg",
];

export default function StoryTellingPage3() {
  return (
    <section className="page3-wrapper">
      {/* LEFT TEXT */}
      <div className="text-block">
        <h1>
        You might <br />
          love Fall<br />
         energy.
        </h1>

        <p className="subtitle">
          Every journey in fall unfolds among amber streets—and the crisp breeze that stirs the city.
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="visual-block">
        <div className="page3-season-header">
          <h2 className="page3-title">
            Fall · The Cultural Peak
          </h2>

          <div className="page3-season-divider" />

          <p className="page3-season-desc">
            Come to Seoul in Fall, the cultural peak of the year.
This is the season of reflection and depth, when art, music, and performance fill the city.
Stroll through galleries, theaters, and leafy streets to experience the heart of Seoul’s creative spirit.
            
          </p>
        </div>

        <div className="page3-poster-row">
          {POSTERS.map((poster, i) => (
            <img key={i} src={poster} alt="Fall event poster" />
          ))}
        </div>
      </div>
    </section>
  );
}
