import { marked } from 'marked';
import flashheadDeepDive from './flashhead-deep-dive.md?raw';
import howToPruneAttention from './how-to-prune-attention.md?raw';
import cosmosReason2Report from './cosmos-reason2-report.md?raw';

export interface CardFrontmatter {
  title: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  quote?: string;
  hook?: string;
  kind: 'blog' | 'award' | 'case-study' | 'deep-dive';
  sourceLabel?: string;
  ctaLabel?: string;
  keyPoints?: string[];
}

export interface CardContent {
  frontmatter: CardFrontmatter;
  body: string;
}

const cardRegistry: Record<string, string> = {
  'flashhead-deep-dive': flashheadDeepDive,
  'how-to-prune-attention': howToPruneAttention,
  'cosmos-reason2-report': cosmosReason2Report,
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
        // Handle array format: - "item 1", - "item 2"
        const items: string[] = [];
        let remaining = value.slice(1, -1);
        const dashMatch = remaining.match(/- "([^"]+)"/g);
        if (dashMatch) {
          dashMatch.forEach(m => {
            const itemMatch = m.match(/- "([^"]+)"/);
            if (itemMatch) items.push(itemMatch[1]);
          });
        }
        frontmatter[key] = items;
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

export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}