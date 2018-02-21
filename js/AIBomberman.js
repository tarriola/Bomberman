// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function AIBlueBomberman(game, x, y, spritesheet, level) {
    this.leftAnimation = new Animation(spritesheet, 90, 0, 14, 22, 3, 0.30, 3, true, 3);
    this.downAnimation = new Animation(spritesheet, 0, 0, 14.7, 22, 3, 0.30, 3, true, 3);
    this.rightAnimation = new Animation(spritesheet, 131, 0, 14, 22, 3, 0.30, 3, true, 3);
    this.upAnimation = new Animation(spritesheet, 44, 0, 15.25, 22, 3, 0.30, 3, true, 3);
    this.deadAnimation = new Animation(AM.getAsset("./img/Bomberman_Exploit.png"),
                                          0, 0, 28, 30, 4, .2, 4, false, 3);

    this.leftA = new Animation(spritesheet, 90, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.downA = new Animation(spritesheet, 0, 0, 14.5, 22, 1, 0.30, 1, true, 3);
    this.rightA = new Animation(spritesheet, 131, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.upA = new Animation(spritesheet, 44, 0, 15.25, 22, 1, 0.30, 1, true, 3);

    this.directionArray = [this.upAnimation, this.downAnimation, this.leftAnimation, this.rightAnimation,
                          this.upA, this.downA, this.leftA, this.rightA];
    this.currentAnimation = this.downA;
    this.speed = 100;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, x, y);
    this.levelOne = level;

    this.path = [false, false, false, false, false, false, false, false, false, false, false, false];
    this.pathIndex = [];
    // this.index = Math.floor(Math.random() * 4);
    this.isdroppedAvailable = true;

    this.explodeX = this.x;
    this.explodeY = this.y;

    this.rand = 0;
    this.randomPath = -1

    this.hasNotArrivedToEscapeDestination = true;

    this.myBomb = {};
    this.ticks = 130;
    this.numEscapeRoutes = 0;

    this.powerUps = [false, false, false, false, false, false];
    this.powerTimers = [0, 0, 0, 0, 0, 0];
    this.bombs = [];
    this.isWalkingStart = true;
    this.randOneBlockDir = Math.floor(Math.random() * 4);

    this.walkingStartX = this.x;
    this.walkingStartY = this.y;

    this.ticktowalkoneblock = 0;

    this.continueCounter = 0;
    this.randGoal = Math.floor(Math.random() * 5);

    this.player = false;

    // this.isNotSkull = true;
    // this.isPowerup = false;
}

function bitmap_position(i) {
    return Math.floor(i/BLOCK_SIZE);
}

AIBlueBomberman.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

      // check for valid path
      this.checkEscapeRoute();
      // if there is no escape route,
      // then pick another block

      if((this.numEscapeRoutes > 0 && this.hasNearbyBrick() && this.isWalkingStart)
            || (this.hasNotArrivedToEscapeDestination && this.isWalkingStart)) {

        // drop the bomb
        if(this.isdroppedAvailable) {
          // find a random escape route
          this.rand = Math.floor(Math.random() * this.numEscapeRoutes);
          this.randomPath = this.pathIndex[this.rand];

          if(this.ticks == 130) {
            this.game.addBombEntity(new Bomb(this.game, tempx, tempy, this.game.clockTick));
            this.explodeX = this.x;
            this.explodeY = this.y;

            this.isdroppedAvailable = false;
            this.hasNotArrivedToEscapeDestination = true;

            this.ticks = 0;
          }
        }

        if(this.hasNotArrivedToEscapeDestination) {
          this.escape(this.randomPath, this.explodeX, this.explodeY);
        } else {
          this.currentAnimation = this.downA;
          this.ticktowalkoneblock = 0;
        }
        this.ticks++;
      } else {
        if(!this.hasNotArrivedToEscapeDestination) {
          if(this.ticktowalkoneblock >= 90 ) { // wait for bomb explosion
            this.walkOneBlock();
          } else {
            this.currentAnimation = this.downA;
          }
          this.ticktowalkoneblock++;
        }
      }
      this.removeEntities();
      // this.checkForNearByPowerUp();


}

AIBlueBomberman.prototype.walkingIntoSkull = function(bRow, bCol, option) {
  var isSkull = false;

    for (var i = 0; i < this.game.powerUpEntities.length; i++) {
        var entity = this.game.powerUpEntities[i];
        var pCol = Math.floor(entity.x / BLOCK_SIZE);
        var pRow = Math.floor(entity.y / BLOCK_SIZE);
        if(entity.type == 2) { // is a skull

          switch(option){
            case 0: // p on top
              if((bCol == pCol) && (bRow -1 == pRow)) {
                isSkull = true;
              }
              break;

            case 1: // p below
              if((bCol == pCol) && (bRow +1 == pRow)) { // is a skull
                isSkull = true;
              }
              break;

            case 2: // p at left
              if((bCol -1 == pCol) && (bRow == pRow)) { // is a skull
                isSkull = true;
              }
              break;

            case 3: // p at right
              if((bCol +1 == pCol) && (bRow == pRow)) { // is a skull
                isSkull = true;
              }
              break;
          }
        }
    }

    return isSkull;
}



AIBlueBomberman.prototype.checkEscapeRoute = function() {
    var bCol = Math.floor(this.x / BLOCK_SIZE);
    var bRow = Math.floor(this.y / BLOCK_SIZE);

    // check for immediate corners
    if(this.levelOne[bRow -1][bCol] == 0
        && !this.walkingIntoSkull(bRow, bCol, 0)) { // up empty
        // // console.log("up empty");
        if(this.levelOne[bRow -1][bCol-1] == 0
          && !this.walkingIntoSkull(bRow -1, bCol, 2)) { // up-left empty
          this.path[0] = true;
        }
        if(this.levelOne[bRow -1][bCol+1] == 0
          && !this.walkingIntoSkull(bRow -1, bCol, 3)) { // up-right empty
          this.path[1] = true;
        }
        if(bRow -1 != 0 && this.levelOne[bRow -2][bCol] == 0
          && !this.walkingIntoSkull(bRow-1, bCol, 0)) { // up-up empty
          this.path[2] = true;
        }
    }

    if(this.levelOne[bRow +1][bCol] == 0
      && !this.walkingIntoSkull(bRow, bCol, 1)) { // down empty
        // // console.log("down empty");
        if(this.levelOne[bRow +1][bCol -1] == 0
          && !this.walkingIntoSkull(bRow +1, bCol, 2)) { // down-left empty
          this.path[3] = true;
        }
        if(this.levelOne[bRow +1][bCol +1] == 0
          && !this.walkingIntoSkull(bRow +1, bCol, 3)) { // down-right empty
          this.path[4] = true;
        }
        if(bRow +1 != NUM_ROWS -1 && this.levelOne[bRow +2][bCol] == 0
          && !this.walkingIntoSkull(bRow +1, bCol, 1)) { // down-down empty
          this.path[5] = true;
        }
    }

    if(this.levelOne[bRow][bCol -1] == 0
      && !this.walkingIntoSkull(bRow, bCol, 2)) { // left empty
        // // console.log("left empty");
        if(this.levelOne[bRow -1][bCol -1] == 0
          && !this.walkingIntoSkull(bRow, bCol -1, 0)) { // left-up empty
          this.path[6] = true;
        }
        if(this.levelOne[bRow +1][bCol -1] == 0
          && !this.walkingIntoSkull(bRow, bCol -1, 1)) { // left-down empty
          this.path[7] = true;
        }
        if(bCol-1 != 0 && this.levelOne[bRow][bCol -2] == 0
          && !this.walkingIntoSkull(bRow, bCol -1, 2)) { // left-left empty
          this.path[8] = true;
        }
    }

    if(this.levelOne[bRow][bCol +1] == 0
      && !this.walkingIntoSkull(bRow, bCol, 3)) { // right empty
        // // console.log("right empty");
        if(this.levelOne[bRow -1][bCol +1] == 0
          && !this.walkingIntoSkull(bRow, bCol +1, 0)) { // right-up empty
          this.path[9] = true;
        }

        if(this.levelOne[bRow +1][bCol +1] == 0
          && !this.walkingIntoSkull(bRow, bCol +1, 1)) { // right-down empty
          this.path[10] = true;
        }

        if(bCol +1 != NUM_COLUMNS -1 && this.levelOne[bRow][bCol +2] == 0
          && !this.walkingIntoSkull(bRow, bCol +1, 3)) { // right-right empty
          this.path[11] = true;
        }
    }

    this.numEscapeRoutes = 0;
    for(var i = 0; i < 12; i++) {
      if(this.path[i]) {
        this.pathIndex[this.numEscapeRoutes] = i;
        this.numEscapeRoutes++;
      }
    }
    this.path = [false, false, false, false, false, false, false, false, false, false, false, false];
}


AIBlueBomberman.prototype.walkOneBlock = function() {
    if(this.isWalkingStart) {
      var bCol = Math.floor(this.x / BLOCK_SIZE);
      var bRow = Math.floor(this.y / BLOCK_SIZE);

      // if the same direction is not valid, choose a diff direction
      while(this.walkingIntoSkull(bRow, bCol, this.randOneBlockDir)
          || !this.isSameDirectionValid()) {

        this.selectRandomAvailableDirection();
      }

      if(this.continueCounter >= this.randGoal) {
        this.selectRandomAvailableDirection();
        this.continueCounter = 0;
        this.randGoal = Math.floor(Math.random() * 5);

      }

      if(!this.walkingIntoSkull(bRow, bCol, this.randOneBlockDir)) {
        this.isWalkingStart = false;
        this.walkingStartX = this.x;
        this.walkingStartY = this.y;
      }
      this.continueCounter++;

    } else { // is currently walking
      this.walking(this.randOneBlockDir, this.walkingStartX, this.walkingStartY);
    }
}

AIBlueBomberman.prototype.isSameDirectionValid = function() {
    var result = false;
    var bCol = Math.floor(this.x / BLOCK_SIZE);
    var bRow = Math.floor(this.y / BLOCK_SIZE);

    switch (this.randOneBlockDir) {
      case 0: // up
        if(this.levelOne[bRow -1][bCol] == TILE_GROUND) { // up
            result = true;
        }
        break;
      case 1: // down
        if (this.levelOne[bRow +1][bCol] == TILE_GROUND) { // down
            result = true;
        }
        break;
      case 2: // left
        if (this.levelOne[bRow][bCol -1] == TILE_GROUND) { // left
            result = true;
        }
        break;
      case 3: // right
        if (this.levelOne[bRow][bCol +1] == TILE_GROUND) { // right
            result = true;
        }
        break;
    }
    return result;
}


AIBlueBomberman.prototype.walking = function(direction, startX, startY) {
    switch (direction) {
      case 0:
          if(this.y > startY - 50) { // up
            this.walk(0);
          } else {
            this.isWalkingStart = true;
          }
        break;
      case 1:
          if(this.y < startY + 50) { // down
            this.walk(1);
          } else {
            this.isWalkingStart = true;
          }

        break;
      case 2:
          if(this.x > startX - 50) { // left
            this.walk(2);
          } else {
            this.isWalkingStart = true;
          }
        break;
      case 3:
          if(this.x < startX + 50) { // right
            this.walk(3);
          } else {
            this.isWalkingStart = true;
          }
        break;

    }

}

AIBlueBomberman.prototype.selectRandomAvailableDirection = function() {
  var validOneBlock = [false, false, false, false]; // reinitialize
  var validBlockIndex = [];
  var bCol = Math.floor(this.x / BLOCK_SIZE);
  var bRow = Math.floor(this.y / BLOCK_SIZE);
  // console.log(this.levelOne[bRow -1][bCol] );
  if(this.levelOne[bRow -1][bCol] == TILE_GROUND) { // up
    validOneBlock[0] = true;
  }
  if (this.levelOne[bRow +1][bCol] == TILE_GROUND) { // down
    validOneBlock[1] = true;
  }

  if (this.levelOne[bRow][bCol -1] == TILE_GROUND) { // left
    validOneBlock[2] = true;
  }

  if (this.levelOne[bRow][bCol +1] == TILE_GROUND) { // right
    validOneBlock[3] = true;
  }

  var dirCount = 0;
  for(var i = 0; i < 4; i++) {
    if(validOneBlock[i]) {
      validBlockIndex[dirCount] = i;
      dirCount++;
    }
  }

  var randIndex = Math.floor(Math.random() * dirCount);
  this.randOneBlockDir = validBlockIndex[randIndex];
}


AIBlueBomberman.prototype.hasNearbyBrick = function() {
  var result = false;
  var bCol = Math.floor(this.x / BLOCK_SIZE);
  var bRow = Math.floor(this.y / BLOCK_SIZE);

  if((this.levelOne[bRow -1][bCol] == TILE_BLOCK)
      || (this.levelOne[bRow +1][bCol] == TILE_BLOCK)
      || (this.levelOne[bRow][bCol -1] == TILE_BLOCK)
      || (this.levelOne[bRow][bCol +1] == TILE_BLOCK)) {
          result = true;
  }

  return result;
}

AIBlueBomberman.prototype.reinit = function() {
  this.isdroppedAvailable = true;
  this.hasNotArrivedToEscapeDestination = false;
  this.path = [false, false, false, false, false, false, false, false, false, false, false, false];
  this.pathIndex = [];

}

AIBlueBomberman.prototype.escape = function(randomPath, explodeX, explodeY) {

  switch(randomPath) {
    case 0: // up-left empty

        if(this.y > explodeY - 50){ // up
          this.walk(0);
        } else if(this.x > explodeX - 50){ // left
          this.walk(2);
        } else {
          this.reinit();
        }
        break;

    case 1: // up-right empty
        if(this.y > explodeY - 50) { // up
          this.walk(0);
        } else if(this.x < explodeX + 50){ // right
          this.walk(3);
        } else {
          this.reinit();
        }
        break;

    case 2: // up-up empty
        if(this.y > explodeY - 2* 50) { // up-up
          this.walk(0);
        } else {
          this.reinit();
        }
        break;

    case 3: // down-left empty
        if(this.y < explodeY + 50) { // down
          this.walk(1);
        } else if(this.x > explodeX - 50){ // left
          this.walk(2);
        } else {
          this.reinit();
        }
        break;

    case 4: // down-right empty
        if(this.y < explodeY + 50) { // down
          this.walk(1);
        } else if(this.x < explodeX + 50){ // right
          this.walk(3);
        } else {
          this.reinit();
        }

        break;

    case 5: // down-down empty
        if(this.y < explodeY + 2 * 50) { // down-down
          this.walk(1);
        } else {
          this.reinit();
        }
        break;

    case 6: // left-up empty
        if(this.x > explodeX - 50) { // left
          this.walk(2);
        } else if(this.y > explodeY - 50){ // up
          this.walk(0);
        } else {
          this.reinit();
        }

        break;

    case 7: // left-down empty
        if(this.x > explodeX - 50) { // left
          this.walk(2);
        } else if(this.y < explodeY + 50){ // down
          this.walk(1);
        } else {
          this.reinit();
        }

        break;

    case 8: // left-left empty
        if(this.x > explodeX - 2*50) { // left - left
          this.walk(2);
        } else {
          this.reinit();
        }
        break;

    case 9: // right-up empty
        if(this.x < explodeX + 50) { // right
          this.walk(3);
        } else if(this.y > explodeY - 50){ // up
          this.walk(0);
        } else {
          this.reinit();

        }
        break;

    case 10: // right-down empty
        if(this.x < explodeX + 50) { // right
          this.walk(3);
        } else if(this.y < explodeY + 50){ // down
          this.walk(1);
        } else {
          this.reinit();

        }
        break;

    case 11: // right-right empty
        if(this.x < explodeX + 50 *2) { // right- right
          this.walk(3);
        } else {
          this.reinit();
        }
        break;
  }

  var counter = 1200;
  while(counter >0) {
    counter--;
  }
}

AIBlueBomberman.prototype.walk = function(index) {

  var tempx = this.x;
  var tempy = this.y;


  switch (index) {
    case 0: // up
      this.currentAnimation = this.upAnimation;
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1: // down
      this.currentAnimation = this.downAnimation;
      this.y += this.game.clockTick * this.speed;
      break;

    case 2: // left
      this.currentAnimation = this.leftAnimation;
      this.x -= this.game.clockTick * this.speed;
      break;

    case 3: // right
      this.currentAnimation = this.rightAnimation;
      this.x += this.game.clockTick * this.speed;
      break;

  }

  // collision detection
  for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
    var ent = this.game.blockAndWallEntities[i];
    if (ent !== this && this.collide(ent, this.x, this.y)) {
      this.x = tempx;
      this.y = tempy;
      index = Math.floor(Math.random() * 4);
      break;
    }
  }

}


AIBlueBomberman.prototype.removeEntities = function() {
  for (var i = 0; i < this.game.bombEntities.length; i++) {
      var entity = this.game.bombEntities[i];
      if (entity.isHarmful && this.collide(entity)) {
          this.removeFromWorld = true;
      }
  }

  for (var i = 0; i < this.game.enemyEntities.length; i++) {
      var entity = this.game.enemyEntities[i];
      if (this.collide(entity)) {
          this.removeFromWorld = true;
      }
  }
}

AIBlueBomberman.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;
    }
    return result;
}

AIBlueBomberman.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.removeFromWorld) {
        this.deadAnimation.drawFrame(this.game.clockTick, this.ctx, this.x - 10, this.y - 5, 2);

    } else {
        this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 2);
    }
}
