export type Handler = (...args: any[]) => void;
const handlers: Record<string, Handler[]> = {};

export function on(event: string, fn: Handler): () => void {
  handlers[event] = (handlers[event] || []).concat(fn);
  return () => {
    handlers[event] = handlers[event].filter((h) => h !== fn);
  };
}

export function emit(event: string, ...args: any[]): void {
  handlers[event]?.forEach((h) => h(...args));
}

export function deleteHandlers(): void {
  Object.keys(handlers).forEach((key) => {
    delete handlers[key];
  });
}
