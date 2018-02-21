window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

// function createButton(context, func){
//     var button = document.createElement("input");
//     button.type = "button";
//     button.value = "im a button";
//     button.onclick = func;
//     context.appendChild(button);
// }
//
// window.onload = function(){
//     createButton(document.body, function(){
//         highlight(this.parentNode.childNodes[1]);
//     });
// }

function GameEngine() {
    this.chars = [];
    this.statusEntities = [];
    this.backgroundEntities = [];
    this.powerUpEntities = [];
    this.blockAndWallEntities = [];
    this.bombEntities = [];
    this.enemyEntities = [];
    this.mainEntities = [];
    this.clickX = 0;
    this.clickY = 0;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.pressEnter = false;
    this.gamewin = false;
    this.gameEnded = false;
    this.count = 0;

}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        var rect = that.ctx.canvas.getBoundingClientRect();
        that.clickX = e.clientX - rect.left;
        that.clickY = e.clientY - rect.top;

        console.log(e);
        console.log("Left Click Event - X,Y " + that.clickX + ", " + that.clickY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {

      that.chars[e.code] = true;
      console.log(e.code);
      e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        that.chars[e.code] = false;
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.addBackgroundEntity = function (entity) {
    this.backgroundEntities.push(entity);
}

GameEngine.prototype.addPowerUpEntity = function (entity) {
    this.powerUpEntities.push(entity);
}

GameEngine.prototype.addBlockAndWallEntity = function (entity) {
    this.blockAndWallEntities.push(entity);
}

GameEngine.prototype.addBombEntity = function (entity) {
    this.bombEntities.push(entity);
}

GameEngine.prototype.addMainEntity = function (entity) {
    this.mainEntities.push(entity);
}

GameEngine.prototype.addEnemyEntity = function (entity) {
    this.enemyEntities.push(entity);
}

GameEngine.prototype.addStatusEntity = function (entity) {
    this.statusEntities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();



    for (var i = 0; i < this.backgroundEntities.length; i++) {
        this.backgroundEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.powerUpEntities.length; i++) {
        this.powerUpEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.blockAndWallEntities.length; i++) {
        this.blockAndWallEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.bombEntities.length; i++) {
        this.bombEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.mainEntities.length; i++) {
        this.mainEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.enemyEntities.length; i++) {
        this.enemyEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.statusEntities.length; i++) {
        this.statusEntities[i].draw(this.ctx);
    }

    // if (this.gameEnded && this.count == 75) {
    //   if (this.gameWin) {
    //     console.log("Drawing Win");
    //     this.ctx.drawImage(AM.getAsset("./img/winning.png"), 0, 0, 850, 850);
    //   } else {
    //     this.ctx.drawImage(AM.getAsset("./img/gameover.jpg"),
    //       0, 0, 480, 360, 0, 0, 850, 850);
    //   }
    //
    // }

    // this.ctx.restore();

}

GameEngine.prototype.update = function () {
    // var entitiesCount = this.entities.length;

    // for (var i = 0; i < entitiesCount; i++) {
    //     var entity = this.entities[i];
    //
    //     entity.update();
    // }
    var entitiesCount = this.powerUpEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.powerUpEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.blockAndWallEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.blockAndWallEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.bombEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.bombEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.mainEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.mainEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.enemyEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.enemyEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.statusEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.statusEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.powerUpEntities.length - 1; i >= 0; --i) {
        if (this.powerUpEntities[i].removeFromWorld) {
            this.powerUpEntities.splice(i, 1);
        }
    }

    for (var i = this.blockAndWallEntities.length - 1; i >= 0; --i) {
        if (this.blockAndWallEntities[i].removeFromWorld) {
            this.blockAndWallEntities.splice(i, 1);
        }
    }

    for (var i = this.bombEntities.length - 1; i >= 0; --i) {
        if (this.bombEntities[i].removeFromWorld) {
            this.bombEntities.splice(i, 1);
        }
    }

    for (var i = this.enemyEntities.length - 1; i >= 0; --i) {
        if (this.enemyEntities[i].removeFromWorld) {
            this.enemyEntities.splice(i, 1);
        }
    }

    for (var i = this.mainEntities.length - 1; i >= 0; --i) {
        var entity = this.mainEntities[i];
        if (entity.removeFromWorld && entity.deadAnimation.isDone()) {
            this.mainEntities.splice(i, 1);
        }
    }

    // for (var i = 0; i < this.mainEntities.length; i++) {
    //     if (this.mainEntities[i].win) {
    //       this.removeAll();
    //       this.ctx.drawImage(AM.getAsset("./img/winning.png"),
    //         0, 0, 480, 360, 0, 0, 850, 850);
    //         break;
    //     }
    //
    // }

    // if (this.gameWin) {
    //   this.ctx.drawImage(AM.getAsset("./img/winning.png"),
    //     0, 0, 480, 360, 0, 0, 850, 850);
    // }
    // if (this.gameEnded) {
    //     if (this.count == 75) {
    //       this.removeAll();
    //     } else {
    //       this.count++;
    //     }
    // }

}

GameEngine.prototype.removeAll = function() {
    this.chars = [];
    this.backgroundEntities = [];
    this.powerUpEntities = [];
    this.blockAndWallEntities = [];
    this.bombEntities = [];
    this.enemyEntities = [];
    this.mainEntities = [];
    // setInterval(alertFunc, 4000);
}

function alertFunc() {
    location.reload();
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.clickX = 0;
    this.clickY = 0;

}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

// window.requestAnimFrame = (function () {
//     return window.requestAnimationFrame ||
//             window.webkitRequestAnimationFrame ||
//             window.mozRequestAnimationFrame ||
//             window.oRequestAnimationFrame ||
//             window.msRequestAnimationFrame ||
//             function (/* function */ callback, /* DOMElement */ element) {
//                 window.setTimeout(callback, 1000 / 60);
//             };
// })();
//
// function GameEngine() {
//     this.chars = [];
//     this.entities = [];
//     this.backgroundEntities = [];
//     this.powerUpEntities = [];
//     this.blockAndWallEntities = [];
//     this.bombEntities = [];
//     this.enemyEntities = [];
//     this.mainEntities = [];
//     this.ctx = null;
//     this.surfaceWidth = null;
//     this.surfaceHeight = null;
//     this.gameEnded = false;
// }
//
// GameEngine.prototype.init = function (ctx) {
//     this.ctx = ctx;
//     this.surfaceWidth = this.ctx.canvas.width;
//     this.surfaceHeight = this.ctx.canvas.height;
//     this.timer = new Timer();
//     this.startInput();
//     console.log('game initialized');
// }
//
// GameEngine.prototype.start = function () {
//     console.log("starting game");
//     var that = this;
//     (function gameLoop() {
//         that.loop();
//         requestAnimFrame(gameLoop, that.ctx.canvas);
//     })();
// }
//
// GameEngine.prototype.startInput = function () {
//     console.log('Starting input');
//
//     var getXandY = function (e) {
//         var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
//         var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
//
//         if (x < 1024) {
//             x = Math.floor(x / 32);
//             y = Math.floor(y / 32);
//         }
//
//         return { x: x, y: y };
//     }
//
//     var that = this;
//
//     this.ctx.canvas.addEventListener("keydown", function (e) {
//       // if (e.code === "KeyA") {
//       //     that.a = true;
//       // } else if (e.code === "KeyS") {
//       //     that.s = true;
//       // } else if (e.code === "KeyD") {
//       //     that.d = true;
//       // } else if (e.code === "KeyW") {
//       //     that.w = true;
//       // }
//
//       that.chars[e.code] = true;
//       // console.log(that.chars);
//       //console.log(e);
//     //  console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
//
//       e.preventDefault();
//         //console.log(e);
//         // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
//     }, false);
//
//     this.ctx.canvas.addEventListener("keypress", function (e) {
//         // if (e.code === "KeyA") {
//         //     that.a = true;
//         // } else if (e.code === "KeyS") {
//         //     that.s = true;
//         // } else if (e.code === "KeyD") {
//         //     that.d = true;
//         // } else if (e.code === "KeyW") {
//         //     that.w = true;
//         // }
//         //
//         // that.chars[e.code] = true;
//         // console.log(that.chars);
//         // console.log(e);
//         // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
//         //
//         // e.preventDefault();
//     }, false);
//
//     this.ctx.canvas.addEventListener("keyup", function (e) {
//         that.chars[e.code] = false;
//         // console.log(that.chars);
//         //console.log(e);
//       //  console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
//     }, false);
//
//     console.log('Input started');
// }
//
// GameEngine.prototype.addEntity = function (entity) {
//     console.log('added entity');
//     this.entities.push(entity);
// }
//
// GameEngine.prototype.addBackgroundEntity = function (entity) {
//     this.backgroundEntities.push(entity);
// }
//
// GameEngine.prototype.addPowerUpEntity = function (entity) {
//     this.powerUpEntities.push(entity);
// }
//
// GameEngine.prototype.addBlockAndWallEntity = function (entity) {
//     this.blockAndWallEntities.push(entity);
// }
//
// GameEngine.prototype.addBombEntity = function (entity) {
//     this.bombEntities.push(entity);
// }
//
// GameEngine.prototype.addMainEntity = function (entity) {
//     this.mainEntities.push(entity);
// }
//
// GameEngine.prototype.addEnemyEntity = function (entity) {
//     this.enemyEntities.push(entity);
// }
//
// GameEngine.prototype.draw = function () {
//     this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
//     this.ctx.save();
//     // for (var i = 0; i < this.entities.length; i++) {
//     //     this.entities[i].draw(this.ctx);
//     // }
//     // this.backgroundEntity.draw(this.ctx);
//
//     for (var i = 0; i < this.backgroundEntities.length; i++) {
//         this.backgroundEntities[i].draw(this.ctx);
//     }
//
//     for (var i = 0; i < this.powerUpEntities.length; i++) {
//         this.powerUpEntities[i].draw(this.ctx);
//     }
//
//     for (var i = 0; i < this.blockAndWallEntities.length; i++) {
//         this.blockAndWallEntities[i].draw(this.ctx);
//     }
//
//     for (var i = 0; i < this.bombEntities.length; i++) {
//         this.bombEntities[i].draw(this.ctx);
//     }
//
//     for (var i = 0; i < this.mainEntities.length; i++) {
//         this.mainEntities[i].draw(this.ctx);
//     }
//
//     for (var i = 0; i < this.enemyEntities.length; i++) {
//         this.enemyEntities[i].draw(this.ctx);
//     }
//
//     // this.ctx.restore();
// }
//
// GameEngine.prototype.update = function () {
//     if (!this.gameEnded) {
//         var entitiesCount = this.powerUpEntities.length;
//         for (var i = 0; i < entitiesCount; i++) {
//             var entity = this.powerUpEntities[i];
//             if (!entity.removeFromWorld) {
//                 entity.update();
//             }
//         }
//
//         entitiesCount = this.blockAndWallEntities.length;
//         for (var i = 0; i < entitiesCount; i++) {
//             var entity = this.blockAndWallEntities[i];
//             if (!entity.removeFromWorld) {
//                 entity.update();
//             }
//         }
//
//         entitiesCount = this.bombEntities.length;
//         for (var i = 0; i < entitiesCount; i++) {
//             var entity = this.bombEntities[i];
//             if (!entity.removeFromWorld) {
//                 entity.update();
//             }
//         }
//
//         entitiesCount = this.mainEntities.length;
//         for (var i = 0; i < entitiesCount; i++) {
//             var entity = this.mainEntities[i];
//             if (!entity.removeFromWorld) {
//                 entity.update();
//             }
//         }
//
//         entitiesCount = this.enemyEntities.length;
//         for (var i = 0; i < entitiesCount; i++) {
//             var entity = this.enemyEntities[i];
//             if (!entity.removeFromWorld) {
//                 entity.update();
//             }
//         }
//
//         for (var i = this.powerUpEntities.length - 1; i >= 0; --i) {
//             if (this.powerUpEntities[i].removeFromWorld) {
//                 this.powerUpEntities.splice(i, 1);
//             }
//         }
//
//         for (var i = this.blockAndWallEntities.length - 1; i >= 0; --i) {
//             if (this.blockAndWallEntities[i].removeFromWorld) {
//                 this.blockAndWallEntities.splice(i, 1);
//             }
//         }
//
//         for (var i = this.bombEntities.length - 1; i >= 0; --i) {
//             if (this.bombEntities[i].removeFromWorld) {
//                 this.bombEntities.splice(i, 1);
//             }
//         }
//
//         for (var i = this.enemyEntities.length - 1; i >= 0; --i) {
//             if (this.enemyEntities[i].removeFromWorld) {
//                 this.enemyEntities.splice(i, 1);
//             }
//         }
//
//         for (var i = this.mainEntities.length - 1; i >= 0; --i) {
//             if (this.mainEntities[i].removeFromWorld) {
//                 if (i == 0) {
//                   this.gameEnded = true;
//                 }
//                 this.mainEntities.splice(i, 1);
//             }
//         }
//
//         // if (this.gameEnded) {
//         //   this.removeAll();
//         // }
//     }
// }
//
// GameEngine.prototype.removeAll = function() {
//     this.chars = [];
//     this.entities = [];
//     this.backgroundEntities = [];
//     this.powerUpEntities = [];
//     this.blockAndWallEntities = [];
//     this.bombEntities = [];
//     this.enemyEntities = [];
//     this.mainEntities = [];
//     //this.timer = new Timer();
//     this.addBackgroundEntity(new Background(this));
//     //this.addMainEntity(new Bomberman(this, AM.getAsset("./img/white_bomberman.gif")));
//     //this.addEnemyEntity(new Fireguy(this, AM.getAsset("./img/fireguy.png")));
//     //this.addEnemyEntity(new Dude(this, AM.getAsset("./img/dude.png  ")));
// }
//
// GameEngine.prototype.loop = function () {
//     this.clockTick = this.timer.tick();
//     this.update();
//     this.draw();
//
// }
//
// function Timer() {
//     this.gameTime = 0;
//     this.maxStep = 0.05;
//     this.wallLastTimestamp = 0;
// }
//
// Timer.prototype.tick = function () {
//     var wallCurrent = Date.now();
//     var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
//     this.wallLastTimestamp = wallCurrent;
//
//     var gameDelta = Math.min(wallDelta, this.maxStep);
//     this.gameTime += gameDelta;
//     return gameDelta;
// }
//
// function Entity(game, x, y) {
//     this.game = game;
//     this.x = x;
//     this.y = y;
//     this.removeFromWorld = false;
// }
//
// Entity.prototype.update = function () {
// }
//
// Entity.prototype.draw = function (ctx) {
//     if (this.game.showOutlines && this.radius) {
//         this.game.ctx.beginPath();
//         this.game.ctx.strokeStyle = "green";
//         this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//         this.game.ctx.stroke();
//         this.game.ctx.closePath();
//     }
// }
//
// Entity.prototype.rotateAndCache = function (image, angle) {
//     var offscreenCanvas = document.createElement('canvas');
//     var size = Math.max(image.width, image.height);
//     offscreenCanvas.width = size;
//     offscreenCanvas.height = size;
//     var offscreenCtx = offscreenCanvas.getContext('2d');
//     offscreenCtx.save();
//     offscreenCtx.translate(size / 2, size / 2);
//     offscreenCtx.rotate(angle);
//     offscreenCtx.translate(0, 0);
//     offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
//     offscreenCtx.restore();
//     //offscreenCtx.strokeStyle = "red";
//     //offscreenCtx.strokeRect(0,0,size,size);
//     return offscreenCanvas;
// }
