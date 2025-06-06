<!-- PackageItem.vue -->
<template>
    <a :href="link" target="_blank" class="package-item">
        <div class="item-content">
            <h3 class="item-title">{{ title }}</h3>
            <p class="item-description" :title="description">{{ description }}</p>
        </div>
    </a>
</template>

<script>
export default {
    props: {
        title: String,
        description: String,
        link: String,
    },
};
</script>

<style scoped>
.package-item {
    display: flex;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    border: 1px solid #eee;
    min-width: 200px;
    max-width: 100%;
    flex: 1;
}

.package-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    border-color: #42b983;
}

.item-content {
    flex: 1;
}

.item-title {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
    font-weight: 600;
}

.item-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
    color: #34495e;
    font-size: 1.05rem;
    margin-bottom: 20px;
    min-height: 3.2em; /* 两行的高度 */
}
</style>
