export function mapCategory(raw: string): string {
  if (!raw) return "Other";
  const r = raw.toLowerCase();

  // Performance & Entertainment
  // Includes: Classic, Concert, Dancing, Musical/opera, Theater, Korean traditional music, Solo/recital
  if (
    r.includes("classic") ||
    r.includes("concert") ||
    r.includes("dancing") ||
    r.includes("musical") ||
    r.includes("opera") ||
    r.includes("theater") ||
    r.includes("recital") ||
    r.includes("korean traditional") ||
    r.includes("solo")
  ) {
    return "Performance & Entertainment";
  }

  // Festivals & Outdoor Culture
  // Includes: Festival-culture/arts, Festival-other, Festival-nature/landscape, Festival-tradition/history, Festival-citizen harmony
  if (r.includes("festival")) {
    return "Festivals & Outdoor Culture";
  }

  // Art / Culture Experience
  // Includes: Education/experience, Exhibition/art, Movie
  if (
    r.includes("education") ||
    r.includes("experience") ||
    r.includes("exhibition") ||
    r.includes("art") ||
    r.includes("movie") ||
    r.includes("film")
  ) {
    return "Art / Culture Experience";
  }

  return "Other";
}
