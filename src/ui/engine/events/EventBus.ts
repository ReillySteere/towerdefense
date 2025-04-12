export type EventCallback = (payload?: any) => void;

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

  public subscribe(event: string, callback: EventCallback): void {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  public unsubscribe(event: string, callback: EventCallback): void {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event].filter(
      (cb) => cb !== callback,
    );
  }

  public publish(event: string, payload?: any): void {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach((callback) => callback(payload));
  }
}
