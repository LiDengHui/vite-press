<template>
    <div class="blog-item">
        <div class="image-container">
            <img :src="item.img" :alt="item.title" class="item-image" />
            <div class="image-overlay">
                <a :href="item.link" target="_blank" class="view-button">查看项目</a>
            </div>
        </div>
        <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-tags">
                <span v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="tag">{{ tag }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    item: {
        default: () => {
            return {
                title: '',
                img: '',
                description: '',
                link: '',
                tags: [],
            };
        },
    },
});
</script>
<style scoped>
.blog-item {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.4s ease;
    width: calc(33.333% - 30px);
    display: flex;
    flex-direction: column;
}

.blog-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.blog-item:hover .item-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.blog-item:hover .image-overlay {
    opacity: 1;
}

.view-button {
    background: white;
    color: #2c3e50;
    padding: 12px 28px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.view-button:hover {
    background: #3498db;
    color: white;
    transform: scale(1.05);
}

.item-content {
    padding: 25px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.item-title {
    font-size: 1.4rem;
    color: #2c3e50;
    margin-bottom: 12px;
}

.item-description {
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 20px;
    flex-grow: 1;
}

.item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag {
    background: #e1f5fe;
    color: #0288d1;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .blog-item {
        width: calc(50% - 20px);
    }
}

@media (max-width: 768px) {
    .blog-item {
        width: 100%;
        max-width: 500px;
    }

    h1 {
        font-size: 2.2rem;
    }
}
</style>
