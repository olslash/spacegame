// a collector is a tower that harvests resources.
// STATES: 0: placing, 1: working
var Collector = function(sprite, x, y) {
  this.sprite = game.add.sprite(x, y, sprite, 'collectors');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.setTo(3, 3);
  this.rangeScale = 1; // collector can get at resources if:
                    //a) it is within <radius> of that resource
                    //b) it is within <radius> of another collector, or a relay
  this.radius = this.rangeScale * 250; // the sprite is 250px, so we have a range in pixels now. 
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  
  this.state = 0; //'placing';
  this.sprite.autoCull = false;
  this.sprite.inputEnabled = true;

  this.range = game.add.sprite(x, y, 'radius', 'collectors');
  this.range.anchor.setTo(0.5, 0.5);
  this.range.scale.setTo(this.rangeScale, this.rangeScale);

  game.physics.enable(this.range, Phaser.Physics.ARCADE);
  this.range.body.immovable = true;
  this.range.tint = 0x00ff00;
  this.validPosition = false;

  this.setInputDownListener(function() {
    // on click, during placing, unit is placed.
    if(!this.validPosition) {
      // if I'm not in a valid placement zone
      console.log('cant place');
    } else {
      this.sprite.events.onInputDown = null;

      this.state = 1; // transition to working state
      this.sprite.inputEnabled = false;
      this.sprite.body.immovable = true;
      this.range.exists = false;  
    }
    
  });
};

Collector.prototype.tick = function() {
  if(this.state === 0) { //PLACING
    // move with the mouse
    this.sprite.x = game.input.worldX;
    this.sprite.y = game.input.worldY;

    this.range.x = game.input.worldX;
    this.range.y = game.input.worldY;

    // if i'm being placed, i should be checking for asteroids in range.
    this.range.tint = 0xff0000;
    this.validPosition = false; 
    game.physics.arcade.overlap(this.range, resourceSprites, function(){
      this.validPosition = true;
      this.range.tint = 0x00ff00;
    }, null, this); 

  } else if (this.state === 1) { //WORKING
    // find the closest resource in state 0, within this.radius.
    // 
    // call mineRes on it, and update the player's resources.
    // 
    // I AM HERE. 
  
    for(var i = resources.length - 1; i >= 0; i--) {
      if(resources[i].state === 0 
        && game.physics.arcade.distanceBetween(this.sprite, resources[i].sprite) <= this.radius) {
        // console.log(resources[i]);
        player.addRes(resources[i].mineRes(collector_rate));
        // console.log('mining from', resources[i]);
      }
      game.physics.arcade.distanceBetween(this.sprite, resources[0].sprite);
    }
  }
};

Collector.prototype.setInputDownListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputDown.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Collector down listener expected an action'); }
    
  }, this);
};