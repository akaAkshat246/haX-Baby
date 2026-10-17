import { MinHeap } from "./minheap";

export type NetworkEdge = {
  to: string;
  weight: number;
  label?: string;
};

export type NetworkNode = {
  id: string;
  name: string;
  era: string;
  x: number;
  y: number;
  description: string;
  recoveredItem: string;
};

export type NetworkGraph = Record<string, NetworkEdge[]>;

export function findShortestPath(
  graph: NetworkGraph,
  startNode: string,
  endNode: string
): { path: string[]; distance: number } {
  if (startNode === endNode) {
    return { path: [startNode], distance: 0 };
  }

  const dist: Record<string, number> = { [startNode]: 0 };
  const prev: Record<string, string> = {};
  const heap = new MinHeap<string>();

  heap.push(0, startNode);

  while (heap.size > 0) {
    const current = heap.pop()!;
    if (current === endNode) break;

    const edges = graph[current] ?? [];
    for (const edge of edges) {
      const alt = dist[current] + edge.weight;
      if (alt < (dist[edge.to] ?? Infinity)) {
        dist[edge.to] = alt;
        prev[edge.to] = current;
        heap.push(alt, edge.to);
      }
    }
  }

  if (dist[endNode] === undefined || dist[endNode] === Infinity) {
    return { path: [], distance: Infinity };
  }

  const path: string[] = [endNode];
  let curr = endNode;
  while (curr !== startNode && prev[curr]) {
    curr = prev[curr];
    path.unshift(curr);
  }

  return { path, distance: dist[endNode] };
}
