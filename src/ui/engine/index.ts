import { WaypointManager } from './entities/waypoint/WaypointManager';
import { MovingEnemy } from './entities/enemy/MovingEnemy';

// Initialize the waypoint manager with default waypoints.
const waypointManager = new WaypointManager();

// Create a moving enemy using persisted properties (e.g., name, health)
// and the waypoints from the manager.
const enemy = new MovingEnemy(
  'Enemy1',
  100,
  waypointManager.getWaypoints(),
  0.2,
);

// Example game loop function:
export function gameLoop(delta: number) {
  enemy.update(delta);
  // Render the enemy using your chosen rendering system, e.g., Phaser or Canvas.
  console.log(`Enemy position: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
  // Request the next frame...
}

// For demonstration, simulate game loop updates:
setInterval(() => {
  gameLoop(16); // Assume ~16ms per frame (60 FPS)
}, 16);
