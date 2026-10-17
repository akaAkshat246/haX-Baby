// Prefix Trie for fast early-web topic search and suggestion chips

class TrieNode {
  children = new Map<string, TrieNode>();
  isWord = false;
  meta?: any;
}

export class PrefixTrie {
  private root = new TrieNode();

  public insert(word: string, meta?: any): void {
    let curr = this.root;
    const clean = word.toLowerCase().trim();
    for (const char of clean) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isWord = true;
    curr.meta = meta;
  }

  public searchPrefix(prefix: string, maxResults = 8): { word: string; meta?: any }[] {
    let curr = this.root;
    const clean = prefix.toLowerCase().trim();

    for (const char of clean) {
      if (!curr.children.has(char)) {
        return [];
      }
      curr = curr.children.get(char)!;
    }

    const results: { word: string; meta?: any }[] = [];
    this.collect(curr, clean, results, maxResults);
    return results;
  }

  private collect(
    node: TrieNode,
    currentWord: string,
    results: { word: string; meta?: any }[],
    max: number
  ): void {
    if (results.length >= max) return;
    if (node.isWord) {
      results.push({ word: currentWord, meta: node.meta });
    }
    for (const [char, childNode] of node.children.entries()) {
      if (results.length >= max) break;
      this.collect(childNode, currentWord + char, results, max);
    }
  }
}
