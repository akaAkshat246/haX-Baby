// Binary Min-Heap Priority Queue for Shortest-Path & Packet Scheduling

export class MinHeap<T> {
  private data: { key: number; value: T }[] = [];

  public get size(): number {
    return this.data.length;
  }

  public push(key: number, value: T): void {
    const d = this.data;
    d.push({ key, value });
    let idx = d.length - 1;

    while (idx > 0) {
      const parent = (idx - 1) >> 1;
      if (d[parent].key <= d[idx].key) break;
      [d[parent], d[idx]] = [d[idx], d[parent]];
      idx = parent;
    }
  }

  public pop(): T | undefined {
    const d = this.data;
    if (!d.length) return undefined;
    const top = d[0].value;
    const last = d.pop()!;

    if (d.length > 0) {
      d[0] = last;
      let idx = 0;
      const len = d.length;

      while (true) {
        const left = 2 * idx + 1;
        const right = left + 1;
        let smallest = idx;

        if (left < len && d[left].key < d[smallest].key) smallest = left;
        if (right < len && d[right].key < d[smallest].key) smallest = right;

        if (smallest === idx) break;
        [d[idx], d[smallest]] = [d[smallest], d[idx]];
        idx = smallest;
      }
    }

    return top;
  }

  public peek(): T | undefined {
    return this.data[0]?.value;
  }

  public clear(): void {
    this.data = [];
  }
}
