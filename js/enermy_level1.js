// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Monster(game, spritesheet) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

  this.currentAnimation = new Animation(spritesheet, 0, 0, 27, 28, 3, 0.30, 3, true, 1);
  this.deadAnimation = new Animation(spritesheet, 0, 0, 27, 28, 3, 0.30, 3, false, 1);

    this.speed = 1;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, 155, 215);
    this.index = Math.floor(Math.random() * 2);
}

Monster.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var ent = this.game.bombEntities[i];
        if ( ent.isHarmful && this.collide(ent)) {
            this.removeFromWorld = true;
            this.currentAnimation = this.deadAnimation;
        }
    }
}

Monster.prototype.draw = function () {
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.7);
    Entity.prototype.draw.call(this);
}

Monster.prototype.collide = function (other) {
    var result = false;
    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Dude(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

  this.currentAnimation = new Animation(spritesheet, 3, 0, 25.8, 62, 9, 0.30, 9, true, 1);
  this.deadAnimation = new Animation(spritesheet, 3, 0, 25.8, 62, 9, 0.05, 9, false, 1);
    this.speed = 100;
    this.ctx = game.ctx;
    this.width = 26;
    this.height = 60;
    Entity.call(this, game, x, y);
    this.index = Math.floor(Math.random() * 2);
}

Dude.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempx = this.x;
    var tempy = this.y;

    this.move(this.index);
    for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
      var ent = this.game.blockAndWallEntities[i];
      if (ent !== this && this.collide(ent)) {
        this.x = tempx;
        this.y = tempy;
        this.index = Math.floor(Math.random() * 2);
        break;
      }
    }

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var ent = this.game.bombEntities[i];
        if ( ent.isHarmful && this.collide(ent)) {
            this.removeFromWorld = true;
            this.currentAnimation = this.deadAnimation;
        }
    }

}

Dude.prototype.move = function(index) {
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

Dude.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    // this.clearBomb();

    Entity.prototype.draw.call(this);

}

Dude.prototype.collide = function (other) {
    var result = false;
    // var tmpy = this.y + this.height * 3 / 4;
    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}
// ////////////////////////////////////////////////////////////////////////////
// // inheritance
function Fireguy(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

  this.leftAnimation = new Animation(spritesheet, 0, 0, 26.2, 45, 4, 0.30, 4, true, 3);
  this.downAnimation = new Animation(spritesheet, 106.5, 0, 26.2, 45, 4, 0.30, 4, true, 3);
  this.rightAnimation = new Animation(spritesheet, 319.5, 0, 26.2, 45, 4, 0.30, 4, true, 3);
  this.upAnimation = new Animation(spritesheet, 213, 0, 26.2, 45, 3, 0.30, 3, true, 3);

  this.directionArray = [this.upAnimation, this.downAnimation, this.leftAnimation, this.rightAnimation];

  this.index = Math.floor(Math.random() * 2);
  this.currentAnimation = this.directionArray[this.index];
    this.speed = 100;
    this.ctx = game.ctx;
    this.width = 15 * 2;
    this.height = 22 * 2;
    Entity.call(this, game, x, y);

}

Fireguy.prototype.update = function (other) {
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

Fireguy.prototype.move = function(index) {
  switch (this.index) {
    case 0:
      this.currentAnimation = this.upAnimation;
      this.y -= this.game.clockTick * this.speed;
      break;

    case 1:
      this.currentAnimation = this.downAnimation;
      this.y += this.game.clockTick * this.speed;
      break;

    case 2:
      this.currentAnimation = this.leftAnimation;
      this.x -= this.game.clockTick * this.speed;
      break;

    case 3:
      this.currentAnimation = this.rightAnimation;
      this.x += this.game.clockTick * this.speed;
      break;
  }
}

Fireguy.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
    // this.clearBomb();

    Entity.prototype.draw.call(this);

}

Fireguy.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}
