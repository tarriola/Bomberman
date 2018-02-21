////////////////////////////////////////////////////////////////////////////
// inheritance
function Bomberman(game, spritesheet, x, y, num) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.leftAnimation = new Animation(spritesheet, 90, 0, 14, 22, 3, 0.30, 3, true, 3);
    this.downAnimation = new Animation(spritesheet, 0, 0, 14.7, 22, 3, 0.30, 3, true, 3);
    this.rightAnimation = new Animation(spritesheet, 131, 0, 14, 22, 3, 0.30, 3, true, 3);
    this.upAnimation = new Animation(spritesheet, 44, 0, 15.25, 22, 3, 0.30, 3, true, 3);
    this.deadAnimation = new Animation(AM.getAsset("./img/Bomberman_Exploit.png"), 0, 0, 28, 30, 4, .2, 4, false, 3);

    this.leftA = new Animation(spritesheet, 90, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.downA = new Animation(spritesheet, 0, 0, 14.5, 22, 1, 0.30, 1, true, 3);
    this.rightA = new Animation(spritesheet, 131, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.upA = new Animation(spritesheet, 44, 0, 15.25, 22, 1, 0.30, 1, true, 3);

    this.currentAnimation = this.rightAnimation;
    this.lastDirection = "KeyS";
    this.speed = 100;
    this.bombs = 3;
    this.invincible = false;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 16 * 2;
    this.deadAnimationCounter = 0;
    Entity.call(this, game, x, y);
    this.barrier = [];
    this.powerUps = [false, false, false, false, false, false];
    this.powerTimers = [0, 0, 0, 0, 0, 0];
    this.bombs = [];
    this.player = true;
    this.which = num;
}

Bomberman.prototype.update = function (other) {
    Entity.prototype.update.call(this);

    this.loadPowerUps();
    var tempx = this.x;
    var tempy = this.y;
    //console.log(this.lastDirection);
    // console.log(this.game.clockTick * this.speed);
    if (this.which == 0) {
        if (this.game.chars["KeyA"]) {
              // console.log("inside A");
              this.currentAnimation = this.leftAnimation;
              this.x -= this.game.clockTick * this.speed;
              this.lastDirection = "KeyA";
          } else if (this.game.chars["KeyS"] ) {
              this.currentAnimation = this.downAnimation;
              this.y += this.game.clockTick * this.speed;
              this.lastDirection = "KeyS";
          } else if (this.game.chars["KeyD"] ) {
              this.currentAnimation = this.rightAnimation;
              this.x += this.game.clockTick * this.speed;
              this.lastDirection = "KeyD";
          } else if (this.game.chars["KeyW"]) {
              this.currentAnimation = this.upAnimation;
              this.y -= this.game.clockTick * this.speed;
              this.lastDirection = "KeyW";
          } else if (this.lastDirection === "KeyA") {
              this.currentAnimation = this.leftA;
          } else if (this.lastDirection === "KeyS") {
              this.currentAnimation = this.downA;
          } else if (this.lastDirection === "KeyD") {
              this.currentAnimation = this.rightA;
          } else if (this.lastDirection === "KeyW") {
              this.currentAnimation = this.upA;
          }

    } else {
        if (this.game.chars["ArrowLeft"]) {
              // console.log("inside A");
              this.currentAnimation = this.leftAnimation;
              this.x -= this.game.clockTick * this.speed;
              this.lastDirection = "KeyA";
          } else if (this.game.chars["ArrowDown"] ) {
              this.currentAnimation = this.downAnimation;
              this.y += this.game.clockTick * this.speed;
              this.lastDirection = "KeyS";
          } else if (this.game.chars["ArrowRight"] ) {
              this.currentAnimation = this.rightAnimation;
              this.x += this.game.clockTick * this.speed;
              this.lastDirection = "KeyD";
          } else if (this.game.chars["ArrowUp"]) {
              this.currentAnimation = this.upAnimation;
              this.y -= this.game.clockTick * this.speed;
              this.lastDirection = "KeyW";
          } else if (this.lastDirection === "KeyA") {
              this.currentAnimation = this.leftA;
          } else if (this.lastDirection === "KeyS") {
              this.currentAnimation = this.downA;
          } else if (this.lastDirection === "KeyD") {
              this.currentAnimation = this.rightA;
          } else if (this.lastDirection === "KeyW") {
              this.currentAnimation = this.upA;
          }

    }



      for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
          var ent = this.game.blockAndWallEntities[i];
          if (ent !== this && this.collide(ent)) {
            this.x = tempx;
            this.y = tempy;
              break;
          }
      }
      if (this.which == 0) {
          if(this.game.chars["Space"]) {
              var tempx = this.x + (this.width / 2);
              var tempy = this.y + (this.height / 2 );

              // Math.floor(x/50) * 50, Math.floor(y/50) * 50
              if (this.bombs.length == 0) {
                var bomb = new Bomb(this.game, tempx, tempy, this.game.clockTick, this.powerUps[4]);
                this.game.addBombEntity(bomb);
                this.bombs.push(bomb);
              } else if (this.powerUps[0]) {
                  var bomb = new Bomb(this.game, tempx, tempy, this.game.clockTick, this.powerUps[4]);
                  this.game.addBombEntity(bomb);
                  this.bombs.push(bomb);
              }
          }
      } else {
        if(this.game.chars["Enter"]) {
            var tempx = this.x + (this.width / 2);
            var tempy = this.y + (this.height / 2 );

            // Math.floor(x/50) * 50, Math.floor(y/50) * 50
            if (this.bombs.length == 0) {
              var bomb = new Bomb(this.game, tempx, tempy, this.game.clockTick, this.powerUps[4]);
              this.game.addBombEntity(bomb);
              this.bombs.push(bomb);
            } else if (this.powerUps[0]) {
                var bomb = new Bomb(this.game, tempx, tempy, this.game.clockTick, this.powerUps[4]);
                this.game.addBombEntity(bomb);
                this.bombs.push(bomb);
            }
        }
      }


      for (var i = this.bombs.length - 1;i >= 0; --i) {
          if (this.bombs[i].removeFromWorld) {
              this.bombs.splice(i, 1);
          }

      }

      for (var i = 0; i < this.game.bombEntities.length; i++) {
          var entity = this.game.bombEntities[i];
          if (!this.powerUps[3] && entity.isHarmful && this.collide(entity)) {
              this.removeFromWorld = true;
          }

      }

      for (var i = 0; i < this.game.enemyEntities.length; i++) {
          var entity = this.game.enemyEntities[i];
          if (this.collide(entity)) {
              this.removeFromWorld = true;          }
      }
      // if (this.game.mainEntities[1].removeFromWorld
      //     && this.game.mainEntities[2].removeFromWorld
      //     && this.game.mainEntities[3].removeFromWorld) {
      //     this.game.statusEntities.win = true;
      //
      // }

      // for (var i = 1; i < this.game.mainEntities.length; i++) {
      //     var entity = this.game.mainEntities[i];
      //     if (this != entity ) {
      //       console.log("Switch Win@");
      //         this.win = true;
      //     }
      // }

      if (this.game.mainEntities.length == 1) {
          this.game.statusEntities[0].win = true;
          console.log("I winn!!!!!!!!!!!!!!");
      }

}

Bomberman.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.removeFromWorld) {
        this.game.gameEnded = true;
        this.deadAnimation.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y - 5, 2);
        // this.deadAnimationCounter++;
        // if (this.deadAnimationCounter > 100) {
        //     // this.game.removeAll();
        // }
    } else {
        this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 2);
    }

    // if (this.win) {
    //   console.log("I Win@@@@!!!!!!!!!!!!!!!!!!!@");
    //   this.game.removeAll();
    //   this.ctx.drawImage(AM.getAsset("./img/gameover.jpg"), 0, 0, 480, 360, 0, 0, 850, 850);
    // }

}

Bomberman.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

Bomberman.prototype.loadPowerUps = function () {
    for (var i = 0; i < this.powerUps.length; i++) {
        switch (i) {
          case 0:       // multibomb
              if (this.powerUps[i] && this.powerTimers[i] > 0) {
                  // this.speed = 200;
                  this.powerTimers[i] -= 1;
                  // console.log("Help!!!!!!!!!");
              } else {
                  this.powerUps[i] = false;
              }
          break;
          case 1:       // boots
              if (this.powerUps[i] && this.powerTimers[i] > 0) {
                  this.speed = 200;
                  this.powerTimers[i] -= 1;
                  // console.log("Help!!!!!!!!!");
              } else {
                  this.speed = 100;
                  this.powerUps[i] = false;
              }
          break;
          case 2:       // skull
              if (this.powerUps[i]) {
                  this.removeFromWorld = true;
              }
              // this.removeFromWorld = true;
          break;
          case 3:       // vest
              if(this.powerUps[i] && this.powerTimers[i] > 0) {
                  this.powerTimers[i] -= 1;
              } else {
                  this.powerUps[i] = false;
              }
          break;
          case 4:       // fire
              if(this.powerUps[i] && this.powerTimers[i] > 0) {
                  this.powerTimers[i] -= 1;
              } else {
                  this.powerUps[i] = false;
              }
          break;
          case 5:       // kick
              if(this.powerUps[i] && this.powerTimers[i] > 0) {
                  this.powerTimers[i] -= 1;
              } else {
                  this.powerUps[i] = false;
              }
          break;
        }
    }
}

// Bomberman.prototype.dropBombPosition = function(bombArr) {
//   // var tmpx = this.x;
//   // var tmpy = this.y;
//   var tmpx = this.x + (this.width / 2);
//   var tmpy = this.y + (this.height / 2 );
//
//   console.log("inside drop bomb position");
//   for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
//     var ent = this.game.blockAndWallEntities[i];
//     if((tmpy >= ent.y) && (tmpy - 2* ent.height < ent.y) && (tmpx >= ent.x) && (tmpx- ent.width < ent.x) && ent.invincible) {
//         // up barrier
//         console.log("upper barrier exist");
//         bombArr[0] = false;
//     }
//
//     if((tmpy >= ent.y) && (tmpy - ent.height < ent.y) && (tmpx > ent.x) && (tmpx - 2 * ent.width < ent.x) && ent.invincible) {
//         console.log("left barrier exist");
//         bombArr[1] = false;
//     }
//
//     if((tmpy >= ent.y) && (tmpy - ent.height < ent.y) && (tmpx < ent.x) && (tmpx + ent.width >= ent.x) && ent.invincible) {
//         console.log(ent.invincible);
//         console.log("right barrier exist");
//         bombArr[2] = false;
//     }
//
//     if(tmpy < ent.y  && (tmpy + ent.height >= ent.y) && (tmpx >= ent.x) && (tmpx - ent.width < ent.x) && ent.invincible) {
//         console.log("down barrier exist");
//         bombArr[3] = false;
//     }
//   }
//
//   for(var i = 0; i < 4; i++) {
//     if(i == 0 && bombArr[i]) {
//        this.game.addBombEntity(new Bomb_Up(this.game, tmpx, tmpy));
//     }
//     if(i == 1 && bombArr[i]) {
//        this.game.addBombEntity(new Bomb_Left(this.game, tmpx, tmpy));
//     }
//     if(i == 2 && bombArr[i]) {
//        this.game.addBombEntity(new Bomb_Right(this.game, tmpx, tmpy));
//     }
//     if(i == 3 && bombArr[i]) {
//        this.game.addBombEntity(new Bomb_Down(this.game, tmpx, tmpy));
//
//     }
//
//   }
// }
