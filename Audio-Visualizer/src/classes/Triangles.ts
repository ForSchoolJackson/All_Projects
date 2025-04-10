//traingle class
class Triangle {
    x: number;
    y: number;
    add: number;
    rotate: number;

    //constructor
    constructor(x: number, y: number, add: number) {
        this.x = x;
        this.y = y;
        this.add = add;
        this.rotate = 0;
    }
    drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
        //make height based on the size
        //baied on pythogroean theroem
        let height = Math.sqrt(2 / 3) * size;

        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y - height / 2);
        ctx.lineTo(x + size / 2, y + height / 2);
        ctx.lineTo(x - size / 2, y + height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    //draw the triangles
    draw(ctx: CanvasRenderingContext2D) {
        let color = "rgb(180, 10, 100)"
        //tranlsate and rotate triangle
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate)
        this.drawTriangle(ctx, 0, 0, this.add, color)
        ctx.restore();

    }
    //rotate triangles with music
    update(audioData: Uint8Array) {
        let speed = 0.1;
        let audioRotate = audioData[0] / 255 * speed;
        this.rotate += audioRotate;

        // this.rotate += speed;

    }

}

export { Triangle };