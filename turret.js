// a Turret is a tower that defends from enemies
// STATES: 0: placing, 1: working
var Turret = function(sprite, x, y) {
  this.range = 500; // gun range

  this.sprite = game.add.sprite(x, y, sprite, 'turrets');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.setTo(0.15, 0.15);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  
  this.state = 0; //'placing';
  this.sprite.autoCull = false;
  this.sprite.inputEnabled = true;


  this.setInputDownListener(function() {
    // on click, during placing, unit is placed.

    this.sprite.events.onInputDown = null;

    this.state = 1; // transition to working state
    this.sprite.inputEnabled = false;
    this.sprite.body.immovable = true;

    this.gun = game.add.sprite(this.sprite.x, this.sprite.y, 'cannon', 'turrets');
    this.gun.anchor.setTo(0.5, 0.8);
    this.gun.scale.setTo(0.75, 0.75);

    this.range = new Phaser.Circle(this.sprite.x, this.sprite.y, this.range);

  });
};

Turret.prototype.tick = function() {
  if(this.state === 0) { //PLACING
    // move with the mouse
    this.sprite.x = game.input.worldX;
    this.sprite.y = game.input.worldY;
  } else if (this.state === 1) { //WORKING
    // which enemies are in my range?
    
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