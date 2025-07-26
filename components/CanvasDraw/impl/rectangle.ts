import {Shape} from "../interfaces/shape";
export class Rectangle implements Shape {
    public endX: number;
    public endY: number;

    constructor(
        public startX: number,
        public startY: number,
        public color: string
    ) {
        this.startX = startX;
        this.startY = startY;
        this.color = color;
        this.endX = startX + 20;
        this.endY = startY + 20;
    }

    get minX() {
        return Math.min(this.startX, this.endX);
    }

    get minY() {
        return Math.min(this.startY, this.endY);
    }

    get maxX() {
        return Math.max(this.startX, this.endX);
    }

    get maxY() {
        return Math.max(this.startY, this.endY);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.minX * devicePixelRatio,
            this.minY * devicePixelRatio,
            (this.maxX - this.minX) * devicePixelRatio,
            (this.maxY - this.minY) * devicePixelRatio
        );

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.strokeRect(
            this.minX * devicePixelRatio,
            this.minY * devicePixelRatio,
            (this.maxX - this.minX) * devicePixelRatio,
            (this.maxY - this.minY) * devicePixelRatio
        );
    }

    change(newX: number, newY: number) {
        this.endX = newX;
        this.endY = newY;
    }

    isInside(x: number, y: number) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    }

    move(x: number, y: number) {
        this.startX += x;
        this.endX += x;
        this.startY += y;
        this.endY += y;
    }
}
