<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';
import { data as posts, type TaggedPost } from '../../utils/tags.data';

function readTagFromLocation() {
    if (typeof window === 'undefined') {
        return '';
    }

    return new URLSearchParams(window.location.search).get('tag') ?? '';
}

const selectedTag = ref('');
const search = ref('');

const tagGroups = computed(() => {
    const groups = new Map<string, TaggedPost[]>();

    for (const post of posts) {
        for (const tag of post.tags) {
            if (!groups.has(tag)) {
                groups.set(tag, []);
            }
            groups.get(tag)!.push(post);
        }
    }

    return Array.from(groups, ([tag, items]) => ({ tag, items })).sort((a, b) => {
        return b.items.length - a.items.length || a.tag.localeCompare(b.tag, 'zh-CN');
    });
});

const filteredTags = computed(() => {
    const keyword = search.value.trim().toLowerCase();
    if (!keyword) {
        return tagGroups.value;
    }

    return tagGroups.value.filter(({ tag }) => tag.toLowerCase().includes(keyword));
});

const activeGroup = computed(() => {
    return tagGroups.value.find(({ tag }) => tag === selectedTag.value);
});

const articles = computed(() => activeGroup.value?.items ?? []);

function selectTag(tag: string) {
    selectedTag.value = tag;
    search.value = tag;

    if (typeof window === 'undefined') {
        return;
    }

    const url = new URL(window.location.href);
    if (tag) {
        url.searchParams.set('tag', tag);
    } else {
        url.searchParams.delete('tag');
    }

    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncFromUrl() {
    selectedTag.value = readTagFromLocation();
    search.value = selectedTag.value;
}

onMounted(() => {
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', syncFromUrl);
});
</script>

<template>
    <section class="tag-index">
        <header class="tag-index-header">
            <h1>标签</h1>
            <p>{{ posts.length }} 篇文章，{{ tagGroups.length }} 个标签</p>
        </header>

        <div class="tag-index-toolbar">
            <input v-model="search" type="search" placeholder="搜索标签" aria-label="搜索标签" />
            <button v-if="selectedTag" type="button" class="tag-clear" @click="selectTag('')">
                清除筛选
            </button>
        </div>

        <div class="tag-cloud">
            <button
                v-for="{ tag, items } in filteredTags"
                :key="tag"
                type="button"
                class="tag-chip"
                :class="{ active: selectedTag === tag }"
                :aria-pressed="selectedTag === tag"
                @click="selectTag(tag)"
            >
                {{ tag }}
                <span>{{ items.length }}</span>
            </button>

            <p v-if="!filteredTags.length" class="tag-empty">没有匹配的标签</p>
        </div>

        <div class="tag-results">
            <template v-if="activeGroup">
                <h2>
                    {{ activeGroup.tag }}
                    <span>{{ articles.length }} 篇</span>
                </h2>
                <ul>
                    <li v-for="post in articles" :key="post.url">
                        <a :href="withBase(post.url)">{{ post.title }}</a>
                        <time v-if="post.date">{{ post.date }}</time>
                    </li>
                </ul>
            </template>

            <p v-else-if="selectedTag" class="tag-empty">
                没有找到标签「{{ selectedTag }}」。
            </p>
            <p v-else class="tag-hint">点击上方标签查看相关文章。</p>
        </div>
    </section>
</template>

<style scoped>
.tag-index {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 24px 64px;
}

.tag-index-header h1 {
    margin: 0 0 8px;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--vp-c-text-1);
}

.tag-index-header p {
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 0.9375rem;
}

.tag-index-toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    margin: 24px 0 20px;
}

.tag-index-toolbar input {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 0.9375rem;
    outline: none;
}

.tag-index-toolbar input:focus {
    border-color: var(--vp-c-brand-1);
}

.tag-clear {
    flex-shrink: 0;
    padding: 7px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    cursor: pointer;
}

.tag-clear:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
}

.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 999px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    line-height: 1.4;
    cursor: pointer;
    transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.tag-chip span {
    color: var(--vp-c-text-3);
    font-size: 0.75rem;
}

.tag-chip:hover,
.tag-chip.active {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}

.tag-chip.active span,
.tag-chip:hover span {
    color: var(--vp-c-brand-1);
}

.tag-results {
    padding-top: 24px;
}

.tag-results h2 {
    margin: 0 0 16px;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.tag-results h2 span {
    margin-left: 8px;
    color: var(--vp-c-text-3);
    font-size: 0.875rem;
    font-weight: 400;
}

.tag-results ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.tag-results li {
    display: flex;
    gap: 16px;
    align-items: baseline;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--vp-c-divider);
}

.tag-results a {
    color: var(--vp-c-text-1);
    font-size: 0.9375rem;
    text-decoration: none;
}

.tag-results a:hover {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
}

.tag-results time {
    flex-shrink: 0;
    color: var(--vp-c-text-3);
    font-size: 0.8125rem;
}

.tag-empty,
.tag-hint {
    margin: 16px 0 0;
    color: var(--vp-c-text-2);
    font-size: 0.9375rem;
}

@media (max-width: 640px) {
    .tag-index {
        padding: 24px 16px 48px;
    }

    .tag-index-header h1 {
        font-size: 1.6rem;
    }

    .tag-index-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .tag-clear {
        align-self: flex-start;
    }

    .tag-results li {
        flex-direction: column;
        gap: 4px;
    }
}
</style>
