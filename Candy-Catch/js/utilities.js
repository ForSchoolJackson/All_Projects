

// used to keep things on screen
function clamp(val, min, max) {
    return val < min ? min : (val > max ? max : val);
}

//get random number
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

//for collision using PIXI. rectangles
function intersect(a, b) {
    //get bounds colser to the center of the ghost
    var ab = {
        x: a.x -20,   
        y: a.y +10, 
        width: a.width  *0.50 ,       
        height: a.height * 0.30      
    };

    //used to visualize hitbox and put it on the bag of sprite
    var intersectionGraphics = new PIXI.Graphics();
    intersectionGraphics.lineStyle(2, 0xFF0000); 
    intersectionGraphics.drawRect(ab.x, ab.y, ab.width, ab.height);
  //  game.addChild(intersectionGraphics);


    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;

}

//get random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;

}