export type EventPayloads = {
  poke: { x: number; y: number };
  wake: void;
  glitch: void;
  secret: void;
  noteAdded: { name: string; item: string; message: string; era: string };
  sceneChange: string;
  lullabyStep: number;
  openWindow: string;
  closeWindow: string;
};

type Handler<T> = (payload: T) => void;

export function createEventBus<E extends Record<string, any>>() {
  const listeners = new Map<keyof E, Set<Handler<any>>>();

  return {
    on<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler);
      return () => {
        listeners.get(event)?.delete(handler);
      };
    },
    emit<K extends keyof E>(event: K, payload: E[K]): void {
      listeners.get(event)?.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`Error in event listener for ${String(event)}:`, err);
        }
      });
    },
  };
}

export const bus = createEventBus<EventPayloads>();
