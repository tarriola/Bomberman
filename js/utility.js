function Wall(game, x, y, wall) {
  this.tile_wall = wall;
    Entity.call(this, game, x, y);
    this.ctx = game.ctx;
    this.width = 50;
    this.height = 50;
    this.invincible = true;
}

Wall.prototype.update = function () {
}

Wall.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.tile_wall, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Block(game, x, y, level, block) {
    this.tile_block = block;
    Entity.call(this, game, x, y);
    this.ctx = game.ctx;
    this.width = 50;
    this.height = 50;
    this.invincible = false;
    this.levelOne = level;
}

Block.prototype.update = function () {
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var entity = this.game.bombEntities[i];
        if (this.collide(entity)) {
          var col = this.x / BLOCK_SIZE;
          var row = this.y / BLOCK_SIZE;
          this.levelOne[row][col] = 0;
          // console.log("row is: " + row + " col is: " + col);
          this.removeFromWorld = true
        }
    }

}

Block.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.tile_block, this.x, this.y);
    Entity.prototype.draw.call(this);
}
Block.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

function Background(game, level, stage) {
    if (stage == 1) {
      this.tile_wall = AM.getAsset(URL_WALL);
      this.tile_grounds = AM.getAsset(URL_GROUND);
      this.tile_block = AM.getAsset(URL_BLOCK);
    } else if (stage == 2) {
      this.tile_wall = AM.getAsset(URL_WALL_LVL2);
      this.tile_grounds = AM.getAsset(URL_GROUND_LVL2);
      this.tile_block = AM.getAsset(URL_BLOCK_LVL2);
    } else {
      this.tile_wall = AM.getAsset(URL_WALL_LVL3);
      this.tile_grounds = AM.getAsset(URL_GROUND_LVL3);
      this.tile_block = AM.getAsset(URL_BLOCK_LVL3);
    }

    this.level = level;

    this.x = 0;
    this.y = 0;
    // this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.loadMap(stage, this.tile_wall, this.tile_block);
};

function bitmap_position(i) {
    return Math.floor(i/BLOCK_SIZE);
}

// Convert from bitmap coordinates to pixel coordinates
function pixel_position(i) {
    return i*BLOCK_SIZE;
}

Background.prototype.loadMap = function (stage, wall, block) {
    for (var i = 0; i < NUM_ROWS; i++) {
        for (var j = 0; j < NUM_COLUMNS; j++) {
            // if(i == 0 || j == 0 || i == 16 || j == 16) {
            //     this.game.addBlockAndWallEntity(new Wall(this.game, pixel_position(i),pixel_position(j)));
            //
            // } else
            if(this.level[i][j] == TILE_WALL) {                   // column , row
                this.game.addBlockAndWallEntity(new Wall(this.game, pixel_position(j),pixel_position(i), wall));

            } else if(this.level[i][j] == TILE_BLOCK) {
                var num = Math.floor(Math.random() * 20);
                if (num < 5) {
                    this.game.addPowerUpEntity(new PowerUp(this.game, pixel_position(j), pixel_position(i), num));
                }
                // this.game.addPowerUpEntity(new PowerUp(this.game, pixel_position(i), pixel_position(j), 5));
                this.game.addBlockAndWallEntity(new Block(this.game, pixel_position(j),pixel_position(i), this.level, block));

            }
        }
    }
}

Background.prototype.draw = function () {
  for (var i = 0; i < NUM_ROWS; i++) {
      for (var j = 0; j < NUM_COLUMNS; j++) {
            this.ctx.drawImage(this.tile_grounds, pixel_position(i), pixel_position(j));
      }
  }
};

Background.prototype.update = function () {
};
