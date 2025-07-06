<template>
    <div class="carousel-container" @mouseenter="pause" @mouseleave="resume">
        <div class="carousel-track" :style="trackStyle">
            <!-- 实际项目中将这部分替换为你的轮播项 -->
            <div
                v-for="(item, index) in items"
                :key="index"
                class="carousel-item"
                :style="{ width: itemWidth + 'px' }"
            >
                <img :src="item.image" :alt="item.title" class="carousel-image">
                <div class="carousel-caption">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </div>
            </div>
        </div>

        <!-- 导航箭头 -->
        <button class="carousel-arrow prev" @click="prev">
            &lt;
        </button>
        <button class="carousel-arrow next" @click="next">
            &gt;
        </button>

        <!-- 指示器 -->
        <div class="carousel-indicators">
      <span
          v-for="(item, index) in items"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="goTo(index)"
      ></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
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
    },
    data() {
        return {
            currentIndex: 0,
            itemWidth: 0,
            timer: null,
            transitionEnabled: true
        }
    },
    computed: {
        trackStyle() {
            return {
                transform: `translateX(${-this.currentIndex * this.itemWidth}px)`,
                transition: this.transitionEnabled ? 'transform 0.5s ease' : 'none'
            }
        }
    },
    mounted() {
        this.initCarousel()
        if (this.autoplay) {
            this.startAutoPlay()
        }
    },
    beforeUnmount() {
        this.clearTimer()
    },
    methods: {
        initCarousel() {
            // 获取轮播容器的宽度作为单个项目的宽度
            const container = this.$el.querySelector('.carousel-container')
            this.itemWidth = container ? container.offsetWidth : 0

            // 克隆第一个和最后一个项目以实现无缝循环
            // 实际项目中你可能需要根据数据结构调整
            if (this.items.length > 1) {
                this.items.push({ ...this.items[0] })
                this.items.unshift({ ...this.items[this.items.length - 2] })
                this.currentIndex = 1
            }
        },
        startAutoPlay() {
            this.clearTimer()
            this.timer = setInterval(() => {
                this.next()
            }, this.interval)
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        pause() {
            this.clearTimer()
        },
        resume() {
            if (this.autoplay) {
                this.startAutoPlay()
            }
        },
        next() {
            this.transitionEnabled = true
            this.currentIndex++

            // 检查是否到达克隆的最后一个项目
            if (this.currentIndex >= this.items.length - 1) {
                setTimeout(() => {
                    this.transitionEnabled = false
                    this.currentIndex = 1
                }, 500)
            }
        },
        prev() {
            this.transitionEnabled = true
            this.currentIndex--

            // 检查是否到达克隆的第一个项目
            if (this.currentIndex <= 0) {
                setTimeout(() => {
                    this.transitionEnabled = false
                    this.currentIndex = this.items.length - 2
                }, 500)
            }
        },
        goTo(index) {
            // 调整索引，因为我们在数组前后各添加了一个克隆项
            this.currentIndex = index + 1
        }
    }
}
</script>

<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
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
}

.carousel-image {
    width: 100%;
    height: auto;
    display: block;
}

.carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 10;
}

.carousel-arrow.prev {
    left: 10px;
}

.carousel-arrow.next {
    right: 10px;
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