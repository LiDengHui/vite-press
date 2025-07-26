import { Shape } from '../interfaces/shape';

export class Circle implements Shape {
    private x: number;
    private y: number;
    private r: number;

    constructor(
        public startX: number,
        public startY: number,
        public color: string
    ) {
        this.x = startX;
        this.y = startY;
        this.r = 10;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * devicePixelRatio, this.y * devicePixelRatio, this.r * devicePixelRatio, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.stroke();
    }

    change(newX: number, newY: number) {
        this.r = Math.sqrt((newX - this.x) ** 2 + (newY - this.y) ** 2);
    }

    isInside(x: number, y: number) {
        return (x - this.x) ** 2 + (y - this.y) ** 2 <= this.r ** 2;
    }

    move(mx: number, my: number) {
        this.x += mx;
        this.y += my;
    }
}
