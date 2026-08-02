/**
 * Consistent color palette for boroughs
 * Each borough gets a unique, distinguishable color
 */
export const BOROUGH_COLOR_PALETTE = [
  "#2A46E0", // Cobalt
  "#FF6B35", // Orange
  "#2FBF8F", // Mint
  "#F6B93C", // Warm Yellow
  "#1C31A8", // Deep Cobalt
  "#FFA35C", // Light Orange
  "#1F9E73", // Deep Mint
  "#D89A1F", // Amber
  "#6C8CFF", // Light Cobalt
  "#7EE0C0", // Light Mint
  "#6A4C93", // Muted Violet
  "#D6455D", // Berry Red
  "#1C7C8C", // Muted Teal
  "#FFD873", // Pale Gold
  "#B23A2E", // Burnt Rust
];

/**
 * Maps borough names to their assigned colors
 * Colors are assigned consistently based on borough order
 */
export function getColorForBorough(
  boroughName: string,
  boroughList: string[]
): string {
  const index = boroughList.indexOf(boroughName);
  if (index === -1) return BOROUGH_COLOR_PALETTE[0]; // Default to first color
  return BOROUGH_COLOR_PALETTE[index % BOROUGH_COLOR_PALETTE.length];
}

/**
 * Creates a color map object for all boroughs
 */
export function createBoroughColorMap(
  boroughNames: string[]
): Record<string, string> {
  const colorMap: Record<string, string> = {};
  boroughNames.forEach((borough, index) => {
    colorMap[borough] = BOROUGH_COLOR_PALETTE[index % BOROUGH_COLOR_PALETTE.length];
  });
  return colorMap;
}
