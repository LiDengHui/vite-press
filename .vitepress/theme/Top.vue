<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showButton = ref(false)

const checkScroll = () => {
    showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', checkScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
    <transition name="fade">
        <button
            v-if="showButton"
            class="back-to-top"
            @click="scrollToTop"
            aria-label="回到顶部"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    </transition>
</template>

<style scoped>
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--vp-c-brand);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 100;
}

.back-to-top:hover {
    color:var(--vp-button-alt-hover-text);
    background-color: var(--vp-button-alt-hover-bg);
    transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>