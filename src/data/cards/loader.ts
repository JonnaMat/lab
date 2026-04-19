import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import flashheadDeepDive from './flashhead-deep-dive.md?raw';
import howToPruneAttention from './how-to-prune-attention.md?raw';
import cosmosReason2Report from './cosmos-reason2-report.md?raw';
import crossEntropyLoss from './cross-entropy-loss.md?raw';

export interface CardFrontmatter {
  title: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  quote?: string;
  hook?: string;
  link?: string;
  kind: 'blog' | 'award' | 'case-study' | 'deep-dive';
  sourceLabel?: string;
  ctaLabel?: string;
  keyPoints?: string[];
  related?: string[];
}

export interface CardContent {
  frontmatter: CardFrontmatter;
  body: string;
}

const cardRegistry: Record<string, string> = {
  'flashhead-deep-dive': flashheadDeepDive,
  'how-to-prune-attention': howToPruneAttention,
  'cosmos-reason2-report': cosmosReason2Report,
  'cross-entropy-loss': crossEntropyLoss,
};

export function loadCard(slug: string): CardContent | null {
  const raw = cardRegistry[slug];
  if (!raw) return null;
  
  // Parse frontmatter
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatterText = frontmatterMatch[1];
  const frontmatter: Record<string, unknown> = {};
  
  frontmatterText.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (value.startsWith('"') && value.endsWith('"')) {
        frontmatter[key] = value.slice(1, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Handle array format: either inline ["item1", "item2"] or multiline
        const inner = value.slice(1, -1).trim();
        if (inner.startsWith('-')) {
          // Multiline format with dashes
          const items: string[] = [];
          const dashMatch = inner.match(/- "([^"]+)"/g);
          if (dashMatch) {
            dashMatch.forEach(m => {
              const itemMatch = m.match(/- "([^"]+)"/);
              if (itemMatch) items.push(itemMatch[1]);
            });
          }
          frontmatter[key] = items;
        } else {
          // Inline format ["item1", "item2"]
          const items = inner.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
          frontmatter[key] = items;
        }
      } else {
        frontmatter[key] = value.trim();
      }
    }
  });
  
  const body = raw.slice(raw.indexOf('---', 3) + 3).trim();
  
  return {
    frontmatter: frontmatter as unknown as CardFrontmatter,
    body,
  };
}

function processLatex(markdown: string): string {
  let result = markdown;
  
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `\\[${tex}\\]`;
    }
  });
  
  result = result.replace(/\$\$([^$]+)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `$$${tex}$$`;
    }
  });
  
  result = result.replace(/\\\(([^)]+)\\\)/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `\\(${tex}\\)`;
    }
  });
  
  result = result.replace(/\$([^$\n]+)\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `$${tex}$`;
    }
  });
  
  return result;
}

export function parseMarkdown(markdown: string): string {
  const processed = processLatex(markdown);
  return marked.parse(processed, { async: false }) as string;
}