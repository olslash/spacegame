// state: 0: has res, 1: dead

var Resource = function(x, y) {

  // create a random res amount
  var res = Math.floor(Math.random() * 400);
  this.res = res;
  
  if (this.res <= 200) {
    sprite = 'asteroid1';
  } else if (this.res <= 300) {
    sprite = 'asteroid2';
  } else if (this.res <= 350) {
    sprite = 'asteroid3';
  } else if (this.res <= 400) {
    sprite = 'asteroid4';  
  }

  this.sprite = game.add.sprite(x, y, sprite, 'resources');
  this.sprite.anchor.setTo(0.5, 0.5);
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.immovable = true;

  this.state = 0;
};

Resource.prototype.mineRes = function(amt) {
  if(this.state === 0) {
    if(this.res >= amt) {
      this.res -= amt;
      return amt;
    } else {
      amt = this.res;
      this.res = 0;
      this.state = 1;
      this.sprite.tint = 0x000000;
      return amt;
    }
  } else {
    return false;
  }
};

Resource.prototype.tick = function() {
  // if(this.state === 0) { // has resources

  // }
};