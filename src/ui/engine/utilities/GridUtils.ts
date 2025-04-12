/**
 * Converts grid coordinates to pixel coordinates.
 * Useful for rendering entities accurately on the screen.
 *
 * @param gridX - The grid X-coordinate.
 * @param gridY - The grid Y-coordinate.
 * @param gridSize - The size (in pixels) of a single grid cell.
 * @returns An object containing pixelX and pixelY, with the pixel position
 *          centered in the grid cell.
 */
export function gridToPixel(
  gridX: number,
  gridY: number,
  gridSize: number,
): { pixelX: number; pixelY: number } {
  return {
    pixelX: gridX * gridSize + gridSize / 2,
    pixelY: gridY * gridSize + gridSize / 2,
  };
}

/**
 * Converts pixel coordinates to grid coordinates.
 * Useful for translating pointer/click events to grid locations.
 *
 * @param pixelX - The X-coordinate in pixels.
 * @param pixelY - The Y-coordinate in pixels.
 * @param gridSize - The size (in pixels) of a single grid cell.
 * @returns An object containing gridX and gridY, where the grid coordinates
 *          are derived by flooring the pixel position over the grid cell size.
 */
export function pixelToGrid(
  pixelX: number,
  pixelY: number,
  gridSize: number,
): { gridX: number; gridY: number } {
  return {
    gridX: Math.floor(pixelX / gridSize),
    gridY: Math.floor(pixelY / gridSize),
  };
}
