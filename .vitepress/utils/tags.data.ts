import { createContentLoader } from 'vitepress';
import type { ContentData } from 'vitepress';

export interface TaggedPost {
    url: string;
    title: string;
    tags: string[];
    categories: string[];
    date: string;
}

function normalizeList(value: unknown): string[] {
    const list = Array.isArray(value) ? value : value == null ? [] : [value];

    return Array.from(new Set(list.map((item) => String(item).trim()).filter(Boolean)));
}

function formatDate(value: unknown): string {
    if (!value) {
        return '';
    }

    const date =
        value instanceof Date
            ? value
            : new Date(typeof value === 'number' ? value : String(value));

    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function toTaggedPost({ url, frontmatter }: ContentData): TaggedPost {
    return {
        url,
        title: String(frontmatter.title ?? url),
        tags: normalizeList(frontmatter.tags),
        categories: normalizeList(frontmatter.categories),
        date: formatDate(frontmatter.date)
    };
}

// VitePress 在运行时会替换此导出
export const data: TaggedPost[] = [];

export default createContentLoader('**/*.md', {
    transform(raw) {
        return raw
            .filter(({ url, frontmatter }) => {
                return url !== '/tags.html' && normalizeList(frontmatter.tags).length > 0;
            })
            .map(toTaggedPost)
            .sort((a, b) => {
                return b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN');
            });
    }
});
