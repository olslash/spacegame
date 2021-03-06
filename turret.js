// a Turret is a tower that defends from enemies
// STATES: 0: placing, 1: working
var Turret = function(sprite, x, y) {
  this.gunrange = 800; // gun range
  this.fireRate = 40; // divide by ~60 for time in seconds
  this.lastFire = 0;

  this.sprite = game.add.sprite(x, y, sprite, 'turrets');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.setTo(0.15, 0.15);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  
  this.state = 0; //'placing';
  this.sprite.inputEnabled = true;

  turretSprites.push(this.sprite);

  this.setInputDownListener(function() {
    // on click, during placing, unit is placed.

    this.sprite.events.onInputDown = null;

    this.state = 1; // transition to working state
    this.sprite.inputEnabled = false;
    this.sprite.body.immovable = true;

    this.gun = game.add.sprite(this.sprite.x, this.sprite.y, 'cannon', 'turrets');
    this.gun.anchor.setTo(0.5, 0.8);
    this.gun.scale.setTo(0.75, 0.75);

    // this.gun.exists = false;

    this.range = new Phaser.Circle(this.sprite.x, this.sprite.y, this.gunrange);
  });
};

Turret.prototype.launchMissile = function(target) {
  if(this.lastFire >= this.fireRate) {
    this.lastFire = 0;
    new Missile(this.sprite.x, this.sprite.y).launch(target);
  }
};


Turret.prototype.tick = function() {
  if(this.state === 0) { //PLACING
    // move with the mouse
    this.sprite.x = game.input.worldX;
    this.sprite.y = game.input.worldY;
  } else if (this.state === 1) { //WORKING
    this.lastFire++; // fire rate
    // which enemies are in my range?
    for(var i = enemies.length - 1; i >= 0; i--) {
      if(enemies[i].sprite.exists === true) {
        if(this.range.contains(enemies[i].sprite.x, enemies[i].sprite.y)) {
          // turn the gun towards that enemy
          // TODO: why does the gun point at a different enemy than I fire at?
          // choose ONE enemy and only use it
          var gunAngle = game.physics.arcade.angleBetween(this.sprite, enemies[i].sprite);
          this.gun.rotation = gunAngle + (0.5 * Math.PI); // 90 degree offset
          this.launchMissile(enemies[i]);
          break;
        }
      }
    }
  }
};

Turret.prototype.setInputDownListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputDown.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Turret down listener expected an action'); }
    
  }, this);
};

Turret.prototype.debug = function() {
  game.debug.geom(this.range, 0xffffff, false);
};