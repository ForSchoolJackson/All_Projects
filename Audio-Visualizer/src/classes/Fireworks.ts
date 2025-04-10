//mkae firework like shapes
export default class FireWork {
    centerX: number;
    centerY: number;
    add: number;
    n: number;
    divergence: number;
    c: number;
    radius: number;

    //construcor
    constructor(centerX: number, centerY: number, add: number) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.add = add
        this.n = 0;
        this.divergence = 137.1;
        this.c = 3;
        this.radius = 2;
    }
    // calculate degrees
    dtr(degrees: number) {
        return degrees * (Math.PI / 180);
    }
    //make the circles
    drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    //draw fireworks
    draw(ctx: CanvasRenderingContext2D) {

        for (let i = 0; i < this.n; i++) {
            let aFlower = i * this.dtr(137.1)
            let rFlower = 2 * Math.sqrt(i);

            //get X and Y
            let x = rFlower * Math.cos(aFlower) + this.centerX;
            let y = rFlower * Math.sin(aFlower) + this.centerY;

            //draw the circles
            let red = Math.round(255 * (1 - i / this.n));
            let color = `rgb(${red}, 10, 100)`;
            this.drawCircle(ctx, x, y, 1, color);
        }

    }
    //add more dots with music
    update(audioData: Uint8Array) {
        let add = 0
        for (let i = 0; i < audioData.length; i++) {
            add += audioData[i];
        }
        let average = add / (audioData.length + this.add);
        this.n = Math.floor(1000 * (average / 200) + 10);

    }
}

export { FireWork };