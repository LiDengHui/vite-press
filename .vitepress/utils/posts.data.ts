import fs from 'node:fs';
import path from 'node:path';

type PageItem = {
    title: string;
    url: string;
    lastUpdated: number;
};

const blogRoot = path.resolve(__dirname, '../../blog');

function collectMarkdownFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return collectMarkdownFiles(fullPath);
        }

        return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : [];
    });
}

function stripQuotes(value: string) {
    return value.replace(/^['"]|['"]$/g, '').trim();
}

function stripFrontmatter(source: string) {
    return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function resolveTitle(source: string, relativePath: string) {
    const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatterTitle = frontmatterMatch?.[1].match(/^\s*title\s*:\s*(.+)\s*$/m)?.[1];
    if (frontmatterTitle) {
        return stripQuotes(frontmatterTitle);
    }

    const headingTitle = stripFrontmatter(source).match(/^\s*#\s+(.+?)\s*$/m)?.[1];
    if (headingTitle) {
        return headingTitle.trim();
    }

    const basename = path.basename(relativePath, '.md');
    if (basename !== 'index') {
        return basename;
    }

    const parentDir = path.basename(path.dirname(relativePath));
    return parentDir === '.' ? 'Home' : parentDir;
}

function toPageUrl(relativePath: string) {
    return relativePath.split(path.sep).join('/').replace(/\.md$/, '.html');
}

const postDataLoader = {
    watch: ['**/*.md'],
    async load() {
        const pages = collectMarkdownFiles(blogRoot).map((filePath) => {
            const source = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(blogRoot, filePath);

            return {
                title: resolveTitle(source, relativePath),
                url: toPageUrl(relativePath),
                lastUpdated: fs.statSync(filePath).mtimeMs
            } satisfies PageItem;
        });

        const dedupedPages = Array.from(
            pages
                .reduce((map, page) => {
                    const existing = map.get(page.url);
                    if (!existing || page.lastUpdated >= existing.lastUpdated) {
                        map.set(page.url, page);
                    }
                    return map;
                }, new Map<string, PageItem>())
                .values()
        );

        return dedupedPages.sort((a, b) => {
            const value = b.lastUpdated - a.lastUpdated;
            if (value === 0) {
                return b.title.localeCompare(a.title);
            }
            return value;
        });
    }
};

// VitePress 在运行时会替换此导出
export const data: PageItem[] = [];

export default postDataLoader;
