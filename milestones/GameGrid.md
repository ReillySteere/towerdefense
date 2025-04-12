# Milestone 1: Grid API and Utilities

This milestone introduces an enhanced grid management system and a dedicated utility module to convert between grid and pixel coordinates. The goal is to centralize grid state, obstacle management, and provide a clean separation between game logic (which uses discrete grid coordinates) and the rendering/input layers (which operate in pixel space).

---

## Overview

The project logic now relies on grid coordinates for movement, collision, and pathfinding. Our newly designed `GameGrid` module handles all occupancy and obstacle management. Meanwhile, the `GridUtils` module provides helper functions to convert between grid coordinates and pixel coordinates. This keeps our game logic simple and decoupled from presentation details.

---

## Modules

### GameGrid

- **Purpose:**  
  Manages grid state and provides an API to check cell occupancy, update occupancy, and retrieve obstacles.
- **Key Features:**
  - **Cell Occupancy:**  
    `isCellOccupied(x, y)` returns whether a cell is occupied.
  - **Update Occupancy:**  
    `setCellOccupancy(x, y, occupied)` updates the cell state.
  - **Boundary Check:**  
    `isCellInBounds(x, y)` verifies whether given coordinates are within the grid.
  - **Obstacle Reporting:**  
    `getObstacles()` retrieves all obstacles as a set of "x,y" string keys.
  - **Grid Reset:**  
    `clear()` resets the grid to an all-unoccupied state.

### GridUtils

- **Purpose:**  
  Provides utility functions to bridge the gap between grid space (used by the game logic) and pixel space (used by the rendering system and input handling).

- **Key Functions:**
  - **gridToPixel:** Converts grid coordinates to the corresponding pixel positions (centers objects within cells).
  - **pixelToGrid:** Converts pixel coordinates (from user inputs) to grid coordinates (used in game logic).

---

## Validation

The following steps can be taken to validate Milestone 1:

1. **Unit Testing:**

   - Test the `GameGrid` functions:
     - Ensure `isCellOccupied` accurately reflects the occupancy status after calls to `setCellOccupancy`.
     - Check that `getObstacles` returns the correct set after updating multiple cells.
     - Verify `isCellInBounds` works for edge and out-of-bound coordinates.
   - For `GridUtils`, confirm that given known grid coordinates, the conversion functions return the correct pixel coordinates and vice versa.

2. **Integration Testing:**
   - Use the new API in components such as `TowerManager` and `EnemyManager` to ensure they obtain correct obstacle information.
   - Validate that, when interacting with the rendering system, grid-to-pixel conversions allow objects to be drawn in the correct locations.

---

## How to Use

1. **Importing Modules:**

   - Import `GameGrid` from `src/core/GameGrid.ts` for managing grid occupancy.
   - Import `gridToPixel` and `pixelToGrid` from `src/utilities/GridUtils.ts` for coordinate conversion.

2. **Example Usage:**

   ```typescript
   import { GameGrid } from './core/GameGrid';
   import { pixelToGrid, gridToPixel } from './utilities/GridUtils';

   // Create a game grid with 40 columns and 30 rows.
   const grid = new GameGrid(40, 30);

   // Set a cell as occupied.
   grid.setCellOccupancy(5, 10, true);

   // Check if a cell is free.
   if (!grid.isCellOccupied(5, 10)) {
     // Place a tower or perform an action.
   }

   // Convert pixel coordinates to grid.
   const { gridX, gridY } = pixelToGrid(210, 150, 20);

   // Convert grid coordinates back to pixel center.
   const { pixelX, pixelY } = gridToPixel(gridX, gridY, 20);
   ```
