//CLASSES

//ghost sprite
class Ghost extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        const ghosts = [
            "images/ghostFront.png",
            "images/ghostRight.png",
            "images/ghostLeft.png"
        ];
        super(app.loader.resources[ghosts[0]].texture)
        this.anchor.set(.5, .5);
        this.scale.set(0.6);
        this.x = x;
        this.y = y;
        this.direction = "front";

    }
}

//candies
class Candy extends PIXI.Sprite {
    constructor(x = -20, y = 0) {
        super(app.loader.resources["images/candy.png"].texture)
        this.anchor.set(.5, .5);
        this.scale.set(1.1);
        this.x = x;
        this.y = y;

        this.speed = 3;
        this.rotateSpd = 0.05;

    }

    move(dt = 1 / 60) {
        this.y += this.speed * dt
        this.rotation += this.rotateSpd * dt;
    }

}

//special candy
class Loly extends PIXI.Sprite {
    constructor(x = -20, y = 0) {
        super(app.loader.resources["images/lolypop.png"].texture)
        this.anchor.set(.5, .5);
        this.scale.set(1.1);
        this.x = x;
        this.y = y;

        this.speed = 5;
        this.rotateSpd = 0.07;

    }

    move(dt = 1 / 60) {
        this.y += this.speed * dt
        this.rotation += this.rotateSpd * dt;
    }

}

//vagatables
class Veggie extends PIXI.Sprite {
    constructor(x = -20, y = 0) {
        const veggie = [
            "images/carrot.png",
            "images/broccoli.png",
        ];
        const randomVeggie = veggie[randomInt(0, veggie.length - 1)]

        super(app.loader.resources[randomVeggie].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1.1);
        this.x = x;
        this.y = y;

        this.speed = 2;
        this.rotateSpd = -0.03;

    }

    move(dt = 1 / 60) {
        this.y += this.speed * dt
        this.rotation += this.rotateSpd * dt;
    }

}

