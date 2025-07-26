<template>
    <div class="canvas-container">
        <div class="control-panel">
            <div class="shape-selector">
                <div class="shape-option" @click="shapeType = 'circle'">
                    <div class="shape-preview" :class="{ active: shapeType === 'circle' }">
                        <i class="fas fa-circle"></i>
                    </div>
                    <span class="shape-label">圆形</span>
                </div>

                <div class="shape-option" @click="shapeType = 'rectangle'">
                    <div class="shape-preview" :class="{ active: shapeType === 'rectangle' }">
                        <i class="fas fa-square"></i>
                    </div>
                    <span class="shape-label">长方形</span>
                </div>
            </div>

            <div class="color-picker-container">
                <div class="color-label">选择颜色</div>
                <input type="color" class="color-picker" v-model="color" />
            </div>
        </div>

        <div class="canvas-wrapper">
            <canvas ref="canvasRef"></canvas>
            <div class="tooltip">当前形状: {{ shapeType === 'circle' ? '圆形' : '长方形' }}</div>
            <div class="instructions">
                <p><i class="fas fa-info-circle"></i> 提示: 点击空白区域添加新图形，点击已有图形并拖动可移动位置</p>
            </div>
        </div>

        <div class="stats">
            <div class="stat-item">
                <i class="fas fa-shapes"></i>
                <span>图形数量: {{ shapes.length }}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-palette"></i>
                <span
                    >当前颜色: <span :style="{ color: color }">{{ color }}</span></span
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Shape } from './interfaces/shape';
import { Circle } from './impl/circle';
import { Rectangle } from './impl/rectangle';

const color = ref('#00ff00');
const shapeType = ref('circle');
const canvasRef = ref<HTMLCanvasElement>(null);

const shapes = ref<Shape[]>([]);

function getShape(x: number, y: number) {
    for (const shape of shapes.value) {
        if (shape.isInside(x, y)) {
            return shape;
        }
    }
    return null;
}

function getShapeType(x: number, y: number) {
    switch (shapeType.value) {
        case 'circle':
            return new Circle(x, y, color.value);
        case 'rectangle':
            return new Rectangle(x, y, color.value);
    }
}

onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        const ctx = canvas.getContext('2d');

        canvas.onmousedown = (e: MouseEvent) => {
            const sx = e.offsetX;
            const sy = e.offsetY;
            const shape = getShape(sx, sy);
            if (shape) {
                const handleMouseMove = (e: MouseEvent) => {
                    shape.move(e.movementX, e.movementY);
                };
                const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            } else {
                const shape = getShapeType(sx, sy);
                shapes.value.push(shape);
                const rect = canvas.getBoundingClientRect();

                const handleMouseMove = (e: MouseEvent) => {
                    const vx = e.clientX - rect.left;
                    const vy = e.clientY - rect.top;
                    shape.change(vx, vy);
                };
                const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const animation = () => {
            const canvas = canvasRef.value;
            if (canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                shapes.value.forEach((shape) => {
                    shape.draw(ctx);
                });
            }
            requestAnimationFrame(animation);
        };
        animation();
    }
});
</script>
<style lang="scss" scoped>
.canvas-container {
    background: linear-gradient(135deg, #cbf1b8, #46cae8);
    border-radius: 20px;
    padding: 30px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: 20px 0;
}

.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
}

.shape-selector {
    display: flex;
    gap: 25px;
}

.shape-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.shape-option:hover {
    transform: translateY(-5px);
}

.shape-preview {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
    margin-bottom: 10px;
    border: 2px solid transparent;
}

.shape-preview.active {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.shape-preview i {
    font-size: 2.5rem;
    color: white;
}

.shape-label {
    color: white;
    font-weight: 500;
    font-size: 1.1rem;
}

.color-picker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.color-label {
    color: white;
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.color-picker {
    width: 80px;
    height: 80px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background: none;
    padding: 5px;
    transition: transform 0.3s ease;
}

.color-picker:hover {
    transform: scale(1.1);
}

.color-picker::-webkit-color-swatch {
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.canvas-wrapper {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    overflow: hidden;
    height: 500px;
    position: relative;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
}

canvas {
    width: 100%;
    height: 100%;
    display: block;
    background: rgba(0, 0, 0, 0.15);
    cursor: crosshair;
}

.instructions {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    padding: 15px;
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    font-size: 0.95rem;
    backdrop-filter: blur(5px);
}

.instructions i {
    color: #00ff00;
    margin-right: 8px;
}

.tooltip {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    padding: 10px 15px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    backdrop-filter: blur(5px);
}

@media (max-width: 768px) {
    .control-panel {
        flex-direction: column;
    }

    .shape-selector {
        width: 100%;
        justify-content: center;
    }

    h1 {
        font-size: 2.2rem;
    }

    .subtitle {
        font-size: 1rem;
    }
}

.stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    color: white;
    font-size: 1.1rem;
}

.stat-item {
    background: rgba(0, 0, 0, 0.2);
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
}

.stat-item i {
    margin-right: 10px;
    color: #00ccff;
}
</style>
