// occasionally spawn stuff offscreen (leftish side) and throw it across the view
// to create great beauty

var SpaceJunk = function(rate) {
  this.spriteOptions = ['debris_lrg0',
    'debris_lrg1',
    'debris_med0',
    'debris_med1',
    'debris_med2',
    'debris_sml0',
    'debris_sml1',
    'debris_sml2',
    'debris_sml3'
  ];

  this.rate = rate;
  this.lastFire = 0; 
};

SpaceJunk.prototype.throwJunk = function() {
  var x = -10;
  var y = Math.random() * worldY;

  var junk = this.getRandomJunkSprite();
  junk.x = x;
  junk.y = y;

  junk.anchor.setTo(0.5, 0.5);
  junk.scale.setTo(1, 1);
  game.physics.enable(junk, Phaser.Physics.ARCADE);

  game.physics.arcade.accelerateToXY(junk, Math.random() * worldX, Math.random() * worldY, Math.random() * 600 + 200, 400, 400);
  // this.sprite.autoCull = true;  

};

SpaceJunk.prototype.getRandomJunkSprite = function() {
  var sprite = this.spriteOptions[Math.floor(Math.random() * this.spriteOptions.length)];

  return game.add.sprite(-100, -100, sprite, 'spaceJunk');
};

SpaceJunk.prototype.tick = function() {
  this.lastFire++;

  if(this.lastFire >= this.rate) {
     this.lastFire = 0;
     this.throwJunk();
  }

};