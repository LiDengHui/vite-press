<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import pages from '../../pages.data.json'

function formatDay(ts: number) {
    if (!ts) return '无时间'
    const d = new Date(ts)
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

type PageItem = { title: string; url: string; lastUpdated: number }
const groupedByDate = pages.reduce<Record<string, PageItem[]>>((acc, page) => {
    const day = formatDay(page.lastUpdated)
    if (!acc[day]) acc[day] = []
    acc[day].push(page)
    return acc
}, {})

const sortedDates = Object.keys(groupedByDate).sort((a, b) => (a < b ? 1 : -1))

const visibleItems = ref(new Set<string>())

onMounted(() => {
    nextTick(() => {
        const items = document.querySelectorAll('.my-timeline-item')
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleItems.value.add(entry.target.getAttribute('data-date') || '')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1 }
        )
        items.forEach((el) => observer.observe(el))
    })
})
</script>

<template>
    <section class="my-timeline-container">
        <h2>文章时间轴</h2>
        <ul class="my-timeline">
            <li
                v-for="date in sortedDates"
                :key="date"
                class="my-timeline-item"
                :class="{ visible: visibleItems.has(date) }"
                :data-date="date"
            >
                <div class="my-timeline-left">
                    <div class="my-timeline-dot"></div>
                    <time class="my-timeline-date">{{ date }}</time>
                </div>
                <div class="my-timeline-right">
                    <ul class="my-article-list">
                        <li
                            v-for="post in groupedByDate[date]"
                            :key="post.url"
                            class="my-article-item"
                        >
                            <a :href="post.url" class="my-article-title">{{ post.title }}</a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.my-timeline-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem 2rem;
    background: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #1e293b;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

h2 {
    text-align: center;
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 2.5rem;
    color: #2563eb;
    letter-spacing: 1px;
}

/* 时间轴整体 */
.my-timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    border-left: 3px solid #2563eb;
}

/* 每个时间项，初始隐藏，动画时淡入右移 */
.my-timeline-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2.5rem;
    padding-left: 1rem;
    position: relative;
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.my-timeline-item.visible {
    opacity: 1;
    transform: translateX(0);
}

/* 左侧时间区，宽度加大 */
.my-timeline-left {
    width: 200px;
    position: relative;
    padding-left: 2.5rem;
    text-align: left;
    color: #2563eb;
    font-weight: 600;
    font-size: 1.2rem;
    flex-shrink: 0;
}

/* 时间点圆圈，改成发光环 */
.my-timeline-dot {
    position: absolute;
    left: 0;
    top: 6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #2563eb;
    box-shadow:
        0 0 6px 2px rgba(37, 99, 235, 0.6),
        0 0 10px 5px rgba(96, 165, 250, 0.4);
    border: 2.5px solid white;
    transition: box-shadow 0.3s ease;
}

.my-timeline-dot:hover {
    box-shadow:
        0 0 8px 3px rgba(37, 99, 235, 0.8),
        0 0 14px 7px rgba(96, 165, 250, 0.7);
}

/* 右侧文章列表 */
.my-timeline-right {
    flex: 1;
    padding-left: 2rem;
}

/* 文章列表（垂直列） */
.my-article-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

/* 单个文章项 */
.my-article-item {
    margin-bottom: 0.8rem;
}

/* 文章链接 */
.my-article-title {
    font-weight: 500;
    font-size: 1rem;
    color: #1e293b;
    text-decoration: none;
    transition: color 0.25s;
}

.my-article-title:hover {
    color: #2563eb;
    text-decoration: underline;
}
</style>
