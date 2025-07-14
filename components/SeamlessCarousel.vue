<template>
    <div ref="carouselContainer" class="carousel-container" @mouseenter="pause" @mouseleave="resume">
        <div class="carousel-track" :style="trackStyle">
            <div
                v-for="(item, index) in _items"
                :key="index"
                class="carousel-item"
                :style="{ width: itemWidth + 'px' }"
            >
                <img :src="item.image" :alt="item.title" class="carousel-image" />
                <div class="carousel-caption">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </div>
            </div>
        </div>

        <!-- 导航箭头 -->
        <button class="carousel-arrow prev" @click="prev">&lt;</button>
        <button class="carousel-arrow next" @click="next">&gt;</button>

        <!-- 指示器 -->
        <div class="carousel-indicators">
            <span
                v-for="(item, index) in items"
                :key="index"
                :class="{ active: currentIndex - 1 === index }"
                @click="goTo(index)"
            ></span>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },

    interval: {
        type: Number,
        default: 3000
    },
    autoplay: {
        type: Boolean,
        default: true
    }
});
const carouselContainer = ref(null);
const currentIndex = ref(0);
const itemWidth = ref(0);
const timer = ref(null);
const transitionEnabled = ref(true);

// 计算属性
const _items = computed(() => {
    if (props.items.length === 0) return [];
    const first = props.items[0];
    const last = props.items[props.items.length - 1];
    return [last, ...props.items, first];
});

const trackStyle = computed(() => ({
    transform: `translateX(${-currentIndex.value * itemWidth.value}px)`,
    transition: transitionEnabled.value ? 'transform 0.5s ease' : 'none'
}));

function initCarousel() {
    if (carouselContainer.value) {
        itemWidth.value = carouselContainer.value.offsetWidth;
    }
    if (props.items.length > 1) {
        currentIndex.value = 1;
    }
}

function startAutoPlay() {
    clearTimer();
    timer.value = setInterval(() => {
        next();
    }, props.interval);
}

function clearTimer() {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
}

function pause() {
    clearTimer();
}

function resume() {
    if (props.autoplay) {
        startAutoPlay();
    }
}

function next() {
    transitionEnabled.value = true;
    currentIndex.value++;

    if (currentIndex.value >= _items.value.length - 1) {
        setTimeout(() => {
            transitionEnabled.value = false;
            currentIndex.value = 1;
        }, 500);
    }
}

function prev() {
    transitionEnabled.value = true;
    currentIndex.value--;

    if (currentIndex.value <= 0) {
        setTimeout(() => {
            transitionEnabled.value = false;
            currentIndex.value = _items.value.length - 2;
        }, 500);
    }
}

function goTo(index) {
    currentIndex.value = index + 1;
}

// 生命周期钩子
onMounted(() => {
    initCarousel();
    if (props.autoplay) {
        startAutoPlay();
    }
    window.addEventListener('resize', initCarousel);
});

onBeforeUnmount(() => {
    clearTimer();
    window.removeEventListener('resize', initCarousel);
});
</script>

<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    margin: 0 auto;
}

.carousel-track {
    display: flex;
    height: 100%;
}

.carousel-item {
    flex-shrink: 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.carousel-image {
    margin: auto;
    height: auto;
    display: block;
}

.carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    display: none;
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    filter: blur(10px);
    color: white;
    border: none;
    padding: 20px;
    cursor: pointer;
    z-index: 10;
    height: 100%;
}



.carousel-arrow.prev {
    left: 0;
}

.carousel-arrow.next {
    right: 0;
}

.carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.carousel-indicators span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
}

.carousel-indicators span.active {
    background: white;
}
</style>
