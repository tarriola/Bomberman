const BLOCK_SIZE = 50;
const NUM_COLUMNS = 17;
const NUM_ROWS = 17;

const TILE_GROUND = 0;
const TILE_BLOCK = 1;
const TILE_WALL = 2;
const BOMB = 3;

/////// Level's setting /////////////
const URL_BLOCK = "./img/tile_brick1.png";
const URL_WALL = "./img/tile_wall3.png";
const URL_GROUND = "./img/tile_ground2.png";

const URL_BLOCK_LVL2 = "./img/tile_brick6.png";
const URL_WALL_LVL2 = "./img/tile_wall2.png";
const URL_GROUND_LVL2 = "./img/tile_ground8.png";

const URL_BLOCK_LVL3 = "./img/tile_brick9.png";
const URL_WALL_LVL3 = "./img/tile_wall9.png";
const URL_GROUND_LVL3 = "./img/tile_ground6.png";

var AM = new AssetManager();

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.reverse = false;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function PowerUp(game, x, y, num) {
    this.spriteSheet = AM.getAsset("./img/powerups.png");
    Entity.call(this, game, x, y);
    this.width = 48;
    this.height = 48;
    this.type = num;
    this.ctx = game.ctx;
}

PowerUp.prototype.update = function () {
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.mainEntities.length; i++) {
        var entity = this.game.mainEntities[i];
        if (this.collide(entity)) {
          switch (this.type) {
              // multibomb
              case 0:
                  // entity.bombs++;
                  entity.multibomb = true;
                  entity.powerUps[0] = true;
                  entity.powerTimers[0] = 300;
              break;
              // boots
              case 1:
                  // entity.speed += 50;
                  entity.boots = true;
                  entity.powerUps[1] = true;
                  entity.powerTimers[1] = 300;
              break;
              // skull
              case 2:
                  entity.removeFromWorld = true;
                  // entity.powerUps[2] = true;
              break;
              // vest
              case 3:
                  entity.vest = true;
                  entity.powerUps[3] = true;
                  entity.powerTimers[3] = 500;
              break;
              // fire
              case 4:
                  entity.fire = true;
                  entity.powerUps[4] = true;
                  entity.powerTimers[4] = 500;
              break;
              // kick
              case 5:
                  entity.kick = true;
                  entity.powerUps[5] = true;
                  entity.powerTimers[5] = 200
              break;
          }
          this.removeFromWorld = true
        }
    }
}

PowerUp.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    this.ctx.drawImage(this.spriteSheet, 16 * this.type, 0, 16, 16, this.x + 1, this.y + 1, 48, 48);
}

PowerUp.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

function GameState(game) {
    this.winAnimation = new Animation(AM.getAsset("./img/winning.png"), 0, 0, 1003, 752, 1, 1, 1, false, 1);
    this.loseAnimation = new Animation(AM.getAsset("./img/gameover.jpg"), 0, 0, 480, 360, 1, 1, 1, false, 2.5);
    this.ctx = game.ctx;
    this.menu = true;
    this.start = false;
    this.ended = false;
    this.win = false;
    this.twoPlayer = false;
    this.deadCount = 0;
    this.playerTotal = 1;
    Entity.call(this, game, 0, 0);
    this.levelCount = 1;

}

GameState.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log("hello hello");
    if (this.menu && this.start) {
        loadLevel(this.game, levelOne, 1, this.twoPlayer);
        this.menu = false;
    }

    if (this.start) {
        var length = this.game.mainEntities.length;
        for (var i = 0; i < length; i++) {
            var entity = this.game.mainEntities[i];
            if (entity.removeFromWorld && entity.deadAnimation.isDone()) {
                this.deadCount++;
                if (entity.player) {
                    this.deadCount = 3;
                    this.win = false;
                    break;
                }
            }


        }

        if (this.deadCount === 3) {
            if (!this.twoPlayer && !this.game.mainEntities[0].removeFromWorld) {
                this.win = true;
            }
            this.ended = true;
            this.deadCount = 0;
            this.game.removeAll();

        }

        if (this.ended && (this.winAnimation.isDone() || this.loseAnimation.isDone())) {
            // this.game.removeAll();
            this.ended = false;
            this.deadCount = 0;
            this.loseAnimation.elapsedTime = 0;
            this.winAnimation.elapsedTime = 0;
            if (this.win) {
                this.levelCount++
            }
            if (this.twoPlayer) {
                loadLevel(this.game, levelOne, 1, this.twoPlayer);
            } else {
                this.win = false;
                switch (this.levelCount) {
                  case 1:
                      loadLevel(this.game, levelOne, 1, false);
                  break;
                  case 2:
                      loadLevel(this.game, levelTwo, 2, false);
                  break;
                  case 3:
                      loadLevel(this.game, levelThree, 3, false);
                  break;
                  case 4:
                      this.levelCount = 1;
                      this.menu = true;
                      this.start = false;
                  break;
                }
            }
        }

    }
    if (this.menu) {
        if (this.game.clickX >= 400 && this.game.clickX <= 800 && this.game.clickY >= 400 && this.game.clickY <= 500) {
            console.log("cool story rect 1");
            this.start = true;
        } else if (this.game.clickX >= 400 && this.game.clickX <= 800 && this.game.clickY >= 600 && this.game.clickY <= 700) {
            console.log("cool story rect 2");
            this.start = true;
            this.twoPlayer = true;
        }
    }

}

GameState.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    if (this.ended) {
        if (this.win) {
          this.winAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
        } else {
          // console.log("im Here");

          this.loseAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 2);
        }
    } else if (this.menu) {
          this.ctx.drawImage(AM.getAsset("./img/StartGame.png"), 0, 0, 850, 850);
          // this.ctx.strokeStyle = "red";
          this.ctx.fillStyle="#F0F8FF";
          this.ctx.fillRect(400, 400, 400, 100);
          this.ctx.fillRect(400, 600, 400, 100);

          this.ctx.drawImage(AM.getAsset("./img/SinglePlayer.png"), 400, 400, 400, 100);
          this.ctx.drawImage(AM.getAsset("./img/DoublePlayer.png"), 400, 600, 400, 100);


    }
}

AM.queueDownload("./img/gameover.jpg");
AM.queueDownload("./img/winning.png");
AM.queueDownload("./img/StartGame.png");
AM.queueDownload("./img/DoublePlayer.png");
AM.queueDownload("./img/SinglePlayer.png");

AM.queueDownload("./img/tile_brick1.png");
AM.queueDownload("./img/tile_brick2.png");
AM.queueDownload("./img/tile_brick3.png");
AM.queueDownload("./img/tile_brick4.png");
AM.queueDownload("./img/tile_brick5.png");
AM.queueDownload("./img/tile_brick6.png");
AM.queueDownload("./img/tile_brick7.png");
AM.queueDownload("./img/tile_brick8.png");
AM.queueDownload("./img/tile_brick9.png");


AM.queueDownload("./img/tile_ground1.png");
AM.queueDownload("./img/tile_ground2.png");
AM.queueDownload("./img/tile_ground3.png");
AM.queueDownload("./img/tile_ground4.png");
AM.queueDownload("./img/tile_ground5.png");
AM.queueDownload("./img/tile_ground6.png");
AM.queueDownload("./img/tile_ground7.png");
AM.queueDownload("./img/tile_ground8.png");
AM.queueDownload("./img/tile_ground9.png");


AM.queueDownload("./img/tile_wall1.png");
AM.queueDownload("./img/tile_wall2.png");
AM.queueDownload("./img/tile_wall3.png");
AM.queueDownload("./img/tile_wall4.png");
AM.queueDownload("./img/tile_wall5.png");
AM.queueDownload("./img/tile_wall6.png");
AM.queueDownload("./img/tile_wall7.png");
AM.queueDownload("./img/tile_wall8.png");
AM.queueDownload("./img/tile_wall9.png");

AM.queueDownload("./img/Bomberman_Exploit.png");
AM.queueDownload("./img/finalexplosion.png");
AM.queueDownload("./img/bomb1.png");
AM.queueDownload("./img/flame.png");
AM.queueDownload("./img/white_bomberman.gif");
AM.queueDownload("./img/blue_bomberman.gif");
AM.queueDownload("./img/red_bomberman.gif");
AM.queueDownload("./img/black_bomberman.gif");

AM.queueDownload("./img/powerups.png");
AM.queueDownload("./img/bombs.gif");
AM.queueDownload("./img/explosion.gif");
AM.queueDownload("./img/Explode_Left.png");
AM.queueDownload("./img/Explode_Up.png");
AM.queueDownload("./img/Explode_Right.png");
AM.queueDownload("./img/Explode_Down.png");

AM.queueDownload("./img/fireguy.png");
AM.queueDownload("./img/dude.png");
AM.queueDownload("./img/monster.png");
AM.queueDownload("./img/spaceship.png");
AM.queueDownload("./img/spaceship1.png");
AM.queueDownload("./img/spaceship2.png");
AM.queueDownload("./img/rocket.png");


function loadLevel(gameEngine, oldLevel, stage, twoPlayer) {
    document.getElementById("current_level").innerHTML = ("Current Level : " + stage);
    var level = [[]]
    for (var i = 0; i < oldLevel.length; i++)
        level[i] = oldLevel[i].slice();



    gameEngine.addBackgroundEntity(new Background(gameEngine, level));
    gameEngine.addMainEntity(new Bomberman(gameEngine, AM.getAsset("./img/white_bomberman.gif"), 53, 53, 0));
    // gameEngine.addMainEntity(new Bomberman(gameEngine, AM.getAsset("./img/white_bomberman.gif"), 0));
    if (twoPlayer) {
        document.getElementById("mode").innerHTML = ("Mode : Two Player");
        document.getElementById("levels").innerHTML = ("Total Levels : 1");
        gameEngine.addMainEntity(new Bomberman(gameEngine, AM.getAsset("./img/blue_bomberman.gif"), 710, 753, 1));
    } else {
        document.getElementById("mode").innerHTML = ("Mode : Single Player");
        document.getElementById("levels").innerHTML = ("Total Levels : 3");
        gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 710, 753, AM.getAsset("./img/blue_bomberman.gif"), level));
    }
    gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 110, 753, AM.getAsset("./img/black_bomberman.gif"), level));
    gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 710, 53, AM.getAsset("./img/red_bomberman.gif"), level));
        // gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 100, 53, AM.getAsset("./img/blue_bomberman.gif"), level));
        // gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 150, 53, AM.getAsset("./img/black_bomberman.gif"), level));
        // gameEngine.addMainEntity(new AIBlueBomberman(gameEngine, 50, 103, AM.getAsset("./img/red_bomberman.gif"), level));

    switch (stage) {
        case 1:

            gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 360, 350));
            //gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png")));
            gameEngine.addEnemyEntity(new Dude(gameEngine, AM.getAsset("./img/dude.png"), 360, 350));
        break;
        case 2:
            gameEngine.addEnemyEntity(new Spaceship(gameEngine, AM.getAsset("./img/spaceship.png"), 160, 350));
            gameEngine.addEnemyEntity(new Spaceship1(gameEngine, AM.getAsset("./img/spaceship1.png"), 650, 350));
            gameEngine.addEnemyEntity(new Spaceship2(gameEngine, AM.getAsset("./img/spaceship2.png"), 350, 650));
            gameEngine.addEnemyEntity(new Spaceship2(gameEngine, AM.getAsset("./img/spaceship2.png"), 350, 150));
            // gameEngine.addEnemyEntity(new Rocket(gameEngine, AM.getAsset("./img/rocket.png"), 400, 350));
            // gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 360, 350));
            // //gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png")));
            // gameEngine.addEnemyEntity(new Dude(gameEngine, AM.getAsset("./img/dude.png"), 360, 350));
        break;
        case 3:
            gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 210, 400));
            gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 410, 200));
            gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 410, 600));
            gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png"), 610, 400));
            //gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png")));
            gameEngine.addEnemyEntity(new Dude(gameEngine, AM.getAsset("./img/dude.png"), 410, 200));
            gameEngine.addEnemyEntity(new Dude(gameEngine, AM.getAsset("./img/dude.png"), 410, 600));

        break;
    }


  ////////// enermy from level 1 ///////////////
    // gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png")));
      //gameEngine.addEnemyEntity(new Fireguy(gameEngine, AM.getAsset("./img/fireguy.png")));
    // gameEngine.addEnemyEntity(new Dude(gameEngine, AM.getAsset("./img/dude.png")));
      // gameEngine.addEnemyEntity(new Monster(gameEngine, AM.getAsset("./img/monster.png")));

      ////////// enermy from level 2 ///////////////


}

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine));
    // gameEngine.addEntity(new Bomberman(gameEngine, AM.getAsset("./img/black_bomberman.gif")));
    gameEngine.addStatusEntity(new GameState(gameEngine));

    // loadLevel(gameEngine, levelOne, 1);


    console.log("All Done!");
});
