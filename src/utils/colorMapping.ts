/**
 * Consistent color palette for boroughs
 * Each borough gets a unique, distinguishable color
 */
export const BOROUGH_COLOR_PALETTE = [
  "#1976d2", // Blue
  "#ff8a4c", // Orange
  "#4CAF50", // Green
  "#FFD700", // Gold
  "#FF6B6B", // Red
  "#8B4789", // Purple
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
  "#FF69B4", // Hot Pink
  "#20B2AA", // Light Sea Green
  "#FF8C00", // Dark Orange
  "#7B68EE", // Medium Slate Blue
  "#DC143C", // Crimson
  "#48D1CC", // Medium Turquoise
  "#FF4500", // Orange Red
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
