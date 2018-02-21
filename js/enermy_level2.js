// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Spaceship1(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.currentAnimation = new Animation(spritesheet, 0, 0, 35, 26, 6, 0.30, 6, true, .3);
    this.speed = 50;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, x, y);
    this.index = Math.floor(Math.random() * 4);
}

Spaceship1.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    this.move(this.index);
    for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
      var ent = this.game.blockAndWallEntities[i];
      if (ent !== this && this.collide(ent)) {
        this.x = tempx;
        this.y = tempy;
        this.index = Math.floor(Math.random() * 4);
        break;
      }
    }

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var ent = this.game.bombEntities[i];
        if (ent.isHarmful && this.collide(ent)) {
            this.removeFromWorld = true;
        }
    }

}

Spaceship1.prototype.move = function(index) {
  switch (this.index) {
    case 0:
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1:
      this.y += this.game.clockTick * this.speed;
      break;

    case 2:
      this.x -= this.game.clockTick * this.speed;
      break;

    case 3:
      this.x += this.game.clockTick * this.speed;
      break;
  }
}

Spaceship1.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    // this.clearBomb();

    Entity.prototype.draw.call(this);

}

Spaceship1.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}
////////////////////////////////////////////////////////////////////////////
// // inheritance
function Spaceship2(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.currentAnimation = new Animation(spritesheet, 0, 0, 35, 26, 6, 0.30, 6, true, .3);
    this.speed = 80;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, x, y);
    this.index = Math.floor(Math.random() * 4);
}

Spaceship2.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    this.move(this.index);
    for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
      var ent = this.game.blockAndWallEntities[i];
      if (ent !== this && this.collide(ent)) {
        this.x = tempx;
        this.y = tempy;
        this.index = Math.floor(Math.random() * 4);
        break;
      }
    }

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var ent = this.game.bombEntities[i];
        if (ent.isHarmful && this.collide(ent)) {
            this.removeFromWorld = true;
        }
    }

}

Spaceship2.prototype.move = function(index) {
  switch (this.index) {
    case 0:
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1:
      this.y += this.game.clockTick * this.speed;
      break;

    case 2:
      this.x -= this.game.clockTick * this.speed;
      break;

    case 3:
      this.x += this.game.clockTick * this.speed;
      break;
  }
}

Spaceship2.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    // this.clearBomb();

    Entity.prototype.draw.call(this);

}

Spaceship2.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}


// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Spaceship(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.currentAnimation = new Animation(spritesheet, 0, 0, 35, 26, 6, 0.30, 6, true, .3);
    this.speed = 120;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 20 * 2;
    Entity.call(this, game, x, y);
    this.index = Math.floor(Math.random() * 4);
}

Spaceship.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    this.move(this.index);
    for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
      var ent = this.game.blockAndWallEntities[i];
      if (ent !== this && this.collide(ent)) {
        this.x = tempx;
        this.y = tempy;
        this.index = Math.floor(Math.random() * 4);
        break;
      }
    }

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var ent = this.game.bombEntities[i];
        if (ent.isHarmful && this.collide(ent)) {
            this.removeFromWorld = true;
        }
    }

}

Spaceship.prototype.move = function(index) {
  switch (this.index) {
    case 0:
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1:
      this.y += this.game.clockTick * this.speed;
      break;

    case 2:
      this.x -= this.game.clockTick * this.speed;
      break;

    case 3:
      this.x += this.game.clockTick * this.speed;
      break;
  }
}

Spaceship.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    // this.clearBomb();

    Entity.prototype.draw.call(this);

}

Spaceship.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Rocket(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.rightAnimation = new Animation(spritesheet, 0, 0, 77, 34.6, 4, 0.30, 4, true, .3);
    this.leftAnimation = new Animation(spritesheet, 0, 138, 77, 34.6, 4, 0.30, 4, true, .3);
    this.directionArray = [this.leftAnimation, this.rightAnimation];

    this.index = Math.floor(Math.random() * 2);
    this.currentAnimation = this.directionArray[this.index];

    this.speed = 100;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, x, y);
}

Rocket.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    this.move(this.index);
    for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
      var ent = this.game.blockAndWallEntities[i];
      if (ent !== this && this.collide(ent)) {
        this.x = tempx;
        this.y = tempy;
        this.index = Math.floor(Math.random() * 2) + 2;
        break;
      }
    }

}

Rocket.prototype.move = function(index) {
  switch (this.index) {
    case 0:
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1:
      this.y += this.game.clockTick * this.speed;
      break;

    case 2:
      // console.log("inside left");
      this.x -= this.game.clockTick * this.speed;
      this.currentAnimation = this.directionArray[this.index -2];
      break;

    case 3:
    // console.log("inside right");
      this.x += this.game.clockTick * this.speed;
      this.currentAnimation = this.directionArray[this.index -2];
      break;
  }
}

Rocket.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, .7);
    Entity.prototype.draw.call(this);

}

Rocket.prototype.collide = function (other) {
  var result = false;
  tmpy = this.y - this.height / 5;
  tmpx = this.x + this.width / 4;

  if (tmpx < other.x + other.width && tmpx + this.width > other.x
      && tmpy < other.y + other.height && this.height + tmpy > other.y) {
          result = true;

  }
  return result;
}
