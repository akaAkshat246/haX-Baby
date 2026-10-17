// Deque Sequence Buffer for Konami Code & Multi-Tap Detection

export class SequenceBuffer<T> {
  private buffer: T[] = [];
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  public push(item: T): void {
    this.buffer.push(item);
    if (this.buffer.length > this.capacity) {
      this.buffer.shift();
    }
  }

  public matches(pattern: T[], equalityFn: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
    if (this.buffer.length < pattern.length) return false;
    const offset = this.buffer.length - pattern.length;
    for (let i = 0; i < pattern.length; i++) {
      if (!equalityFn(this.buffer[offset + i], pattern[i])) {
        return false;
      }
    }
    return true;
  }

  public clear(): void {
    this.buffer = [];
  }
}
