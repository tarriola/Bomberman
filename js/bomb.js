function Bomb(game, x, y, tick, blast) {
    this.spritesheet = AM.getAsset("./img/bomb1.png");
    // this.spritesheet = AM.getAsset("./img/explosion.gif");
    // this.explosionCenter = new Animation(this.spritesheet, 35, 35, 18, 17, 1, 1, 1, false, 2);
    // this.explosionLeft = new Animation(this.spritesheet, 2, 38, 15, 13, 1, 1, 1, false, 2);
    // this.explosionUp = new Animation(this.spritesheet, 38, 2, 14, 15, 1, 1, 1, false, 2);
    // this.explosionRight = new Animation(this.spritesheet, 71, 38, 16, 14, 1, 1, 1, false, 2);
    // this.explosionDown = new Animation(this.spritesheet, 38, 72, 15, 15, 1, 1, 1, false, 2);
    // this.explosionVert = new Animation(this.spritesheet, 36, 18, 14, 18, 1, 1, 1, false, 2);
    // this.explosionHorz = new Animation(this.spritesheet, 18, 38, 18, 14, 1, 1, 1, false, 2);
    this.ctx = game.ctx;
    this.currentTime = 0;
    this.bombTime = 1.5;
    this.explosionTime = 1.75;
    // this.explosionTime = 5;

    this.totalTime = 2;
    this.explosionRadius = 50;
    this.isHarmful = false;
    this.left = true;
    this.up = true;
    this.right = true;
    this.down = true;
    this.speed = 50;
    this.kicked = false;
    this.direction = "right";
        // Entity.call(this, game, x, y);
    Entity.call(this, game, Math.floor(x/50) * 50, Math.floor(y/50) * 50);

    this.width = 50;
    this.height = 50;
    this.bigBlast = blast;
}

Bomb.prototype.update = function () {
    Entity.prototype.update.call(this);
    this.currentTime += this.game.clockTick;

    if (this.currentTime >= this.bombTime) {
        // center
        this.game.addBombEntity(new Explosion(this.game, this.x, this.y));

        var bombs = [true, true, true, true];

        var leftExp = new Explosion(this.game, this.x - this.explosionRadius, this.y);
        var upExp = new Explosion(this.game, this.x, this.y - this.explosionRadius);
        var rightExp = new Explosion(this.game, this.x + this.explosionRadius, this.y);
        var downExp = new Explosion(this.game, this.x, this.y + this.explosionRadius);

        for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
            var entity = this.game.blockAndWallEntities[i];
            if (entity.invincible && leftExp.collide(entity)) {            // left
                bombs[0] = false;
            } else if (entity.invincible && upExp.collide(entity)) {       // Up
                bombs[1] = false;
            } else if (entity.invincible && rightExp.collide(entity)) {    // Right
                bombs[2] = false;
            } else if (entity.invincible && downExp.collide(entity)) {     // Down
                bombs[3] = false;
            }
        }

        if (bombs[0]) {
            this.game.addBombEntity(leftExp);
        }
        if (bombs[1]) {
            this.game.addBombEntity(upExp);
        }
        if (bombs[2]) {
            this.game.addBombEntity(rightExp);
        }
        if (bombs[3]) {
            this.game.addBombEntity(downExp);
        }

        if (this.bigBlast) {
            this.increaseBlast(bombs);
        }

        this.removeFromWorld = true;
    }
}

Bomb.prototype.increaseBlast = function (bombs) {
    var leftExp = new Explosion(this.game, this.x - (this.explosionRadius * 2), this.y);
    var upExp = new Explosion(this.game, this.x, this.y - (this.explosionRadius * 2));
    var rightExp = new Explosion(this.game, this.x + (this.explosionRadius * 2), this.y);
    var downExp = new Explosion(this.game, this.x, this.y + (this.explosionRadius * 2));

    if (bombs[0]) {
        this.game.addBombEntity(leftExp);
    }
    if (bombs[1]) {
        this.game.addBombEntity(upExp);
    }
    if (bombs[2]) {
        this.game.addBombEntity(rightExp);
    }
    if (bombs[3]) {
        this.game.addBombEntity(downExp);
    }
}


Bomb.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    this.ctx.drawImage(this.spritesheet, this.x, this.y, 50, 50);
}

Bomb.prototype.collide = function (other) {
    var result = false;
    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;
    }
    return result;
}

function Explosion(game, x, y) {
    this.spritesheet = AM.getAsset("./img/finalexplosion.png");
    this.animation = new Animation(this.spritesheet, 143, 0, 36, 39, 6, .10, 6, false, 3);
    this.width = 50;
    this.height = 50;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);
    this.isHarmful = true;
}

Explosion.prototype.update = function () {
    Entity.prototype.update.call(this);
    if (this.animation.isDone()) {
        this.removeFromWorld = true;
    }
}

Explosion.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
    // console.log("Drawing!!!!!!!!!!!!!!!!");
}

Explosion.prototype.collide = function (other) {
    var result = false;
    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;
    }
    return result;
}
