// 定义 Shape 接口
export interface Shape {
    // 绘制
    draw(ctx: CanvasRenderingContext2D): void;
    // 改变
    change(newX: number, newY: number): void;
    // 判断是否包含点
    isInside(x: number, y: number): boolean;
    // 移动
    move(x: number, y: number): void;
}