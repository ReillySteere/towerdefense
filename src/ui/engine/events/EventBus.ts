export type EventCallback = (payload?: any) => void;

type EventType = 'debugError' | 'obstaclesUpdated';

export type DebugErrorEvent = {
  message: string;
  source: string;
};

export type ObstacleUpdatedEvent = {
  obstacles: Set<string>;
};

export type EventPayload = DebugErrorEvent | ObstacleUpdatedEvent;
export class EventBus {
  private static instance: EventBus;
  private subscribers: { [event: string]: EventCallback[] } = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!this.instance) {
      this.instance = new EventBus();
    }
    return this.instance;
  }

  public subscribe(event: EventType, callback: EventCallback): void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  public unsubscribe(event: EventType, callback: EventCallback): void {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event].filter(
      (cb) => cb !== callback,
    );
  }

  public publish(event: EventType, payload: EventPayload): void {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach((callback) => callback(payload));
  }
}
