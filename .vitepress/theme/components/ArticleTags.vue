<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

const { frontmatter } = useData();

const tags = computed(() => {
    const value = frontmatter.value.tags;
    const list = Array.isArray(value) ? value : value == null ? [] : [value];

    return Array.from(new Set(list.map((tag) => String(tag).trim()).filter(Boolean)));
});

function tagLink(tag: string) {
    return withBase(`/tags.html?tag=${encodeURIComponent(tag)}`);
}
</script>

<template>
    <div v-if="tags.length" class="article-tags">
        <span class="article-tags-label">标签</span>
        <a v-for="tag in tags" :key="tag" class="article-tag" :href="tagLink(tag)">
            {{ tag }}
        </a>
    </div>
</template>

<style scoped>
.article-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.article-tags-label {
    width: 100%;
    margin-bottom: 2px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.article-tag {
    display: inline-flex;
    align-items: center;
    padding: 1px 8px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 999px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    line-height: 1.6;
    text-decoration: none;
    transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.article-tag:hover {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}
</style>
