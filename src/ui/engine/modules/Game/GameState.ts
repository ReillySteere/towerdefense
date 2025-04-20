/**
 * GameState – a singleton that holds the authoritative runtime state shared
 * between the Phaser game loop and the React HUD overlay.
 *
 *  - money  : player currency (starts at 15)
 *  - lives  : player lives / base health (starts at 50)
 *  - wave   : current wave index (starts at 1)
 *  - score  : optional score accumulator (starts at 0)
 *
 */

export interface GameStateSnapshot {
  money: number;
  lives: number;
  wave: number;
  score: number;
}

/**
 * Listener signature for state‑change subscriptions.
 */
export type GameStateListener = (snapshot: GameStateSnapshot) => void;

export class GameState {
  // ---- singleton plumbing ----
  private static instance: GameState | null = null;

  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  private _money = 15;
  private _lives = 50;
  private _wave = 0;
  private _score = 0;

  // ---- listeners ----
  private listeners: Set<GameStateListener> = new Set();

  private constructor() {}

  get money(): number {
    return this._money;
  }
  get lives(): number {
    return this._lives;
  }
  get wave(): number {
    return this._wave;
  }
  get score(): number {
    return this._score;
  }

  /**
   * Register a listener that will be called after *any* state change.
   * Returns an `unsubscribe` function.
   */
  public subscribe(listener: GameStateListener): () => void {
    this.listeners.add(listener);
    // immediately emit initial snapshot so UI can render synchronously
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  // ---- mutators ----

  /** Add `delta` money (can be negative via spendMoney helper). */
  public addMoney(delta: number): void {
    this._money = Math.max(0, this._money + delta);
    this.emit();
  }

  /** Deduct cost; returns `true` if successful or `false` if insufficient funds. */
  public spendMoney(cost: number): boolean {
    if (this._money < cost) return false;
    this._money -= cost;
    this.emit();
    return true;
  }

  public addScore(delta: number): void {
    this._score = Math.max(0, this._score + delta);
    this.emit();
  }

  public incrementWave(): void {
    this._wave += 1;
    this.emit();
  }

  public decrementLives(amount = 1): void {
    this._lives = Math.max(0, this._lives - amount);
    this.emit();
  }

  /** Reset state to its original defaults (useful for restarting). */
  public reset(): void {
    this._money = 15;
    this._lives = 50;
    this._wave = 0;
    this._score = 0;
    this.emit();
  }

  // ---- helpers ----
  private emit(): void {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  private snapshot(): GameStateSnapshot {
    return {
      money: this._money,
      lives: this._lives,
      wave: this._wave,
      score: this._score,
    } as const;
  }
}

export const gameState = GameState.getInstance();
