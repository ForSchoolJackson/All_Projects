"use strict";

const app = new PIXI.Application({
    width: 1000,
    height: 700
});

// Enable interaction
app.renderer.view.style.touchAction = 'auto';
app.renderer.view.style.userSelect = 'auto';
app.stage.interactive = true;

document.body.appendChild(app.view);

//game variables
let fullWidth = 0;
let fullHeight = 0;
let stage;

let titleGame;
let instructions;
let game;
let endGame;

let pointsLabel;
let healthLabel;
let hearts = [];
let finalPoints;

let background;
let ghost;

let candySound;
let lolySound;
let veggieSound;
let buttonSound;

let life = 3;
let points = 0;
let move = 0;
let level = 1;
let candies = [];

let interval = 1600
let amount = 20

// event listeners for key press
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyLetGo);



//pre load images
app.loader.
    add([
        "images/BackGround.png",
        "images/title.png",
        "images/ghostFront.png",
        "images/candy.png",
        "images/lolypop.png",
        "images/broccoli.png",
        "images/carrot.png",
        "images/heart.png"
    ]);

//load font
WebFont.load({
    google: {
        families: ['Pixelify Sans:500']
    },

});

//load game
//app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


//start of the game
function setup() {
    stage = app.stage;

    fullWidth = app.view.width;
    fullHeight = app.view.height;

    //title scene
    titleGame = new PIXI.Container();
    stage.addChild(titleGame);
    titleGame.visible = true;

    //istruciotns scene
    instructions = new PIXI.Container();
    stage.addChild(instructions);
    instructions.visible = false;

    //create main game scene
    game = new PIXI.Container();
    stage.addChild(game);
    game.visible = false;

    //create game end scene
    endGame = new PIXI.Container();
    stage.addChild(endGame);
    endGame.visible = false;

    //add text and buttons
    createText();

    //create ghost
    ghost = new Ghost();
    game.addChild(ghost);

    //load sounds
    candySound = new Howl({
        src: ['sounds/win.wav']
    });
    lolySound = new Howl({
        src: ['sounds/superWin.wav']
    });
    veggieSound = new Howl({
        src: ['sounds/lose.wav']
    });
    buttonSound = new Howl({
        src: ['sounds/button.wav']
    });


}

//create the text and buttons for the different stages of the game
function createText() {

    //background
    let background = new PIXI.Sprite.from("images/BackGround.png");
    background.width = fullWidth;
    background.height = fullHeight;
    game.addChild(background);

    //title
    let title = new PIXI.Sprite.from("images/title.png");
    title.width = 800;
    title.x = 90;
    title.y = 200;
    titleGame.addChild(title);

    //style for buttons
    let buttons = new PIXI.TextStyle({
        fontFamily: "Pixelify Sans",
        fill: "pink",
        fontSize: 48,
    })

    //style for text
    let texts = new PIXI.TextStyle({
        fontFamily: "Pixelify Sans",
        fill: "white",
        fontSize: 30,
    })

    //images
    let loly = new PIXI.Sprite.from("images/lolypop.png");
    loly.x = 70;
    loly.y = 220;
    loly.scale.set(2.0);
    titleGame.addChild(loly)

    let loly2 = new PIXI.Sprite.from("images/lolypop.png");
    loly2.x = 920;
    loly2.y = 430;
    loly2.scale.set(2.0);
    loly2.rotation = Math.PI;
    titleGame.addChild(loly2)

    let candi = new PIXI.Sprite.from("images/candy.png");
    candi.x = 950;
    candi.y = 400;
    candi.scale.set(1.0);
    candi.rotation = Math.PI / 1.9;
    titleGame.addChild(candi)

    let candi2 = new PIXI.Sprite.from("images/candy.png");
    candi2.x = 920;
    candi2.y = 460;
    candi2.scale.set(1.0);
    candi2.rotation = Math.PI / 1.1;
    titleGame.addChild(candi2)

    let candi3 = new PIXI.Sprite.from("images/candy.png");
    candi3.x = 80;
    candi3.y = 250;
    candi3.scale.set(1.0);
    candi3.rotation = Math.PI;
    titleGame.addChild(candi3)

    let candi4 = new PIXI.Sprite.from("images/candy.png");
    candi4.x = 100;
    candi4.y = 170;
    candi4.scale.set(1.0);
    candi4.rotation = Math.PI / 3.2;
    titleGame.addChild(candi4)


    //start button
    let startButton = new PIXI.Text("Start")
    startButton.style = buttons;
    startButton.anchor.set(0.5);
    startButton.x = fullWidth / 2;
    startButton.y = fullHeight - 270;
    startButton.interactive = true;
    startButton.on("pointertap", gameInfo)
    titleGame.addChild(startButton);

    //duplicate button and blur for the glow effect
    let glowButton = new PIXI.Text("Start");
    glowButton.style = buttons;
    glowButton.anchor.set(0.5);
    glowButton.x = fullWidth / 2;
    glowButton.y = fullHeight - 270;
    glowButton.filters = [new PIXI.filters.BlurFilter(15)];
    glowButton.visible = false;
    titleGame.addChild(glowButton);

    //interactivity
    startButton.on("pointerover", () => { glowButton.visible = true; })
    startButton.on("pointerout", () => { glowButton.visible = false; })

    //let text = "Hey there buddy. \nYou are doing a great job. \nKeep up the good work."

    let text = `Help the little ghost collect the candies that fall.

Use the left and right arrow keys to move.

Regular candies give you 100 points.

Special candies give you 500 points.

Vegetables cause you to lose a life.

Catch as many candies as you can before running out of lives.`;

    //instructions 
    let instructionsText = new PIXI.Text(text)
    instructionsText.style = texts
    instructionsText.anchor.set(0.5);
    instructionsText.x = fullWidth / 2;
    instructionsText.y = 320;
    instructions.addChild(instructionsText);

    //images for instructions
    let candy = new PIXI.Sprite.from("images/candy.png");
    candy.x = 580;
    candy.y = 260;
    candy.scale.set(1.4);
    instructions.addChild(candy)

    let loli = new PIXI.Sprite.from("images/lolypop.png");
    loli.x = 580;
    loli.y = 320;
    loli.scale.set(1.4);
    instructions.addChild(loli)

    let broc = new PIXI.Sprite.from("images/broccoli.png");
    broc.x = 580;
    broc.y = 390;
    broc.scale.set(1.4);
    instructions.addChild(broc)

    let carr = new PIXI.Sprite.from("images/carrot.png");
    carr.x = 650;
    carr.y = 390;
    carr.scale.set(1.4);
    instructions.addChild(carr)

    //antoher start button
    let startButton2 = new PIXI.Text("Start")
    startButton2.style = buttons;
    startButton2.anchor.set(0.5);
    startButton2.x = fullWidth / 2;
    startButton2.y = fullHeight - 100;
    startButton2.interactive = true;
    startButton2.on("pointertap", runGame)
    instructions.addChild(startButton2);

    //duplicate button and blur for the glow effect
    let glowButton2 = new PIXI.Text("Start");
    glowButton2.style = buttons;
    glowButton2.anchor.set(0.5);
    glowButton2.x = fullWidth / 2;
    glowButton2.y = fullHeight - 100;
    glowButton2.filters = [new PIXI.filters.BlurFilter(15)];
    glowButton2.visible = false;
    instructions.addChild(glowButton2);

    //interactivity
    startButton2.on("pointerover", () => { glowButton2.visible = true; })
    startButton2.on("pointerout", () => { glowButton2.visible = false; })

    //points label
    pointsLabel = new PIXI.Text();
    pointsLabel.style = texts
    pointsLabel.x = 10;
    pointsLabel.y = 10;
    game.addChild(pointsLabel)
    increasePoints(0);

    //health label
    healthLabel = new PIXI.Text("health:");
    healthLabel.style = texts
    healthLabel.x = 10;
    healthLabel.y = 40;
    game.addChild(healthLabel)
    decreaseLife(0);

    //hearts
    let space = 0;
    for (let h = 0; h < 3; h++) {
        let heart
        heart = new PIXI.Sprite.from("images/heart.png");
        heart.x = 190 + space;
        heart.y = 46;
        heart.scale.set(1.4);
        space -= 35;

        heart.removed = false;
        hearts.push(heart);
        game.addChild(heart)
    }

    //game over
    let gameOver = new PIXI.Text("GAME OVER");
    gameOver.style = {
        fontFamily: "Pixelify Sans",
        fill: "white",
        fontSize: 100,
    }
    gameOver.anchor.set(0.5);
    gameOver.x = fullWidth / 2;
    gameOver.y = fullHeight - 500;
    endGame.addChild(gameOver);


    //final points
    finalPoints = new PIXI.Text();
    finalPoints.style = {
        fontFamily: "Pixelify Sans",
        fill: "white",
        fontSize: 100,

    }
    finalPoints.anchor.set(0.5);
    finalPoints.x = fullWidth / 2;
    finalPoints.y = fullHeight - 350;
    endGame.addChild(finalPoints);


    //play again button
    let playAgain = new PIXI.Text("Play Again?")
    playAgain.style = buttons;
    playAgain.anchor.set(0.5);
    playAgain.x = fullWidth / 2;
    playAgain.y = fullHeight - 100;
    playAgain.interactive = true;
    playAgain.on("pointertap", () => { location.reload();})
    endGame.addChild(playAgain);

    //duplicate button and blur for the glow effect
    let glowButton3 = new PIXI.Text("Play Again?");
    glowButton3.style = buttons;
    glowButton3.anchor.set(0.5);
    glowButton3.x = fullWidth / 2;
    glowButton3.y = fullHeight - 100;
    glowButton3.filters = [new PIXI.filters.BlurFilter(15)];
    glowButton3.visible = false;
    endGame.addChild(glowButton3);

    //interactivity
    playAgain.on("pointerover", () => { glowButton3.visible = true; })
    playAgain.on("pointerout", () => { glowButton3.visible = false; })


}

function start() {
    titleGame.visible = true;
    instructions.visible = false;
    game.visible = false;
    endGame.visible = false;

    //reset the game
    life = 3;
    points = 0;
    move = 0;
    level = 1;
    candies = [];
    increasePoints(0)
    decreaseLife(0)

}

function gameInfo() {
    buttonSound.play();
    titleGame.visible = false;
    instructions.visible = true;

}

function runGame() {
    buttonSound.play();
    titleGame.visible = false;
    instructions.visible = false;
    game.visible = true;

    loadLevel()

    //start loaction
    ghost.x = 500;
    ghost.y = 600;

    //count how many candies are gone
    let goneCandies = 0;

    //ticker to continuosly update game regularly
    app.ticker.add((dt) => {
        //move ghost
        ghost.x += move * 6;
        // Keep ghost on screen
        let w2 = ghost.width / 2;
        ghost.x = clamp(ghost.x, 0 + w2, fullWidth - w2);

        //have stuff fall from sky
        for (let candy of candies) {
            candy.move(dt);

            //get rid of candies when off screen
            if (candy.y >= fullHeight + 50 && !candy.removed) {
                game.removeChild(candy);
                candy.removed = true
                goneCandies++;
                // console.log(goneCandies);
            }
        }

        //check for collision
        for (let candy of candies) {
            if (!candy.removed && intersect(ghost, candy)) {
                game.removeChild(candy);
                candy.removed = true
                goneCandies++;
                //console.log(goneCandies);

                // Check if candy is actually a veggie
                if (candy instanceof Veggie) {
                    decreaseLife(1);
                    veggieSound.play();

                } else if (candy instanceof Loly) {
                    increasePoints(500);
                    lolySound.play();

                } else {
                    increasePoints(100);
                    candySound.play();
                }

            }

        }

        //console.log(amount-5)

        //load next level
        //set array back to 0
        if (goneCandies >= amount - 5) {
            candies = [];
            goneCandies = 0;
            loadLevel();
        }

        //when game is over
        if (life <= 0) {
            end();
        }

    });



}

//load the level and create falling candies
function loadLevel() {
    createCandies(amount, interval);
    console.log('loaded ' + interval + " " + amount)

    //time between each falling object shortens
    if (interval >= 500) {
        interval -= 200
    } else { //prevents it from shortening too much
        interval = 400;
    }

    //amount of things falling grows
    if (amount <= 100) {
        amount += 5
    } else { //prevents it from being too much
        amount = 100;
    }

}

//end page of game
function end() {
    game.visible = false;
    endGame.visible = true;

    //clear out extra candies and vegetables
    candies.forEach(candy => game.removeChild(candy));
    candies = [];

    //show correct points
    finalPoints.text = points;
}

//when key is pressed
function keyDown(event) {
    if (event.key === 'ArrowLeft') {
        move = -1;
        ghost.direction = "left";
        updateGhost(ghost);
    } else if (event.key === 'ArrowRight') {
        move = 1;
        ghost.direction = "right";
        updateGhost(ghost);
    }
}

//when key is let go
function keyLetGo(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        move = 0;
        ghost.direction = "front";
        updateGhost(ghost);
    }
}

//point system
function increasePoints(value) {
    points += value;
    pointsLabel.text = "points: " + points;
}

//life system
function decreaseLife(value) {
    life -= value;
    life = parseInt(life);

    //get rid of heart 
    for (let heart of hearts) {
        if (!heart.removed) {
            heart.removed = true
            game.removeChild(heart)
            break;
        }

    }
}

function createCandies(number, interval) {
    let time = 0
    for (let c = 0; c < number; c++) {

        //make them not fall at same time
        setTimeout(() => {
            let candy;
            // 20% change of spawing vegetable
            if (randomInt(1, 5) == 1) {
                candy = new Veggie();

            } else if (randomInt(1, 10) == 1) {
                candy = new Loly();

            } else {
                candy = new Candy()
            }
            candy.x = getRandom(20, 980);
            candies.push(candy);
            game.addChild(candy);
        }, time);
        time += interval;

    }
}

//change ghost sprite
function updateGhost(ghost) {
    let image;
    //based on what direction it is in
    if (ghost.direction === "front") {
        image = "images/ghostFront.png";
    } else if (ghost.direction === "left") {
        image = "images/ghostLeft.png";
    } else if (ghost.direction === "right") {
        image = "images/ghostRight.png";
    }
    //had to use the PIXI.texture
    ghost.texture = PIXI.Texture.from(image);
}