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
};