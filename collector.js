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

  this.setInputDownListener(function() {
    // on click, during placing, unit is placed.
    this.sprite.events.onInputDown = null;

    this.state = 1; // transition to working state
    this.sprite.inputEnabled = false;
    this.sprite.body.immovable = true;

    this.range.exists = false;
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
    game.physics.arcade.overlap(this.range, resourceSprites, function(){
      this.range.tint = 0x00ff00;
    }, null, this); 

    // draw lines between me and asteroids in range
    for(var i = resourceSprites.length - 1; i >= 0; i--) {
      var resX = resourceSprites[i].x;
      var resY = resourceSprites[i].y;
      // console.log(line);
      // var line = new Phaser.Line(this.sprite.x, this.sprite.y, resX, resY);
    }

  } else if (this.state === 1) { //WORKING

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
// game.physics.arcade.overlap(enemy1.base, tower1.radius, function(){
//     console.log('overlap!');
//   }, null, this);

// overlap(object1, object2, overlapCallback, processCallback, callbackContext) → {boolean}

// Checks for overlaps between two game objects. The objects can be Sprites, Groups or Emitters. You can perform Sprite vs. Sprite, Sprite vs. Group and Group vs. Group overlap checks. Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results. The second parameter can be an array of objects, of differing types.

// during placement, on each tick, we need to check overlap between this tower, the objects in the resources array,
// any other towers, and any relays.

// collector needs a state machine for 
// 1: placing
// // physics enabled. checking overlaps as described above.
// 2: working
// // physics disabled. collecting from res in range.