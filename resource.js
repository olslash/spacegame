// state: 0: has res, 1: dead

var Resource = function(x, y) {

  // create a random res amount
  var res = Math.floor(Math.random() * 400);
  this.res = res;

  this.text = game.add.text(x, y - 45, ''); // resource remaining label

  //  Center align
  this.text.anchor.set(0.5);
  this.text.align = 'center';

  //  Font style
  this.text.font = 'Arial';
  this.text.fontSize = 12;
  this.text.fontWeight = 'bold';

  //  Stroke color and thickness
  this.text.stroke = '#000000';
  this.text.strokeThickness = 6;
  this.text.fill = '#43d637';

  this.text.fixedToCamera = false;
  
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
  this.sprite.inputEnabled = true;

  this.setInputOverListener(function() {
    // console.log(this.text);
    // this.text.fontSize = 12;
    this.text.text = 'remaining: ' + Math.floor(this.res);
  });

  this.setInputOutListener(function() {
    // this.text.fontSize = 0;
    this.text.text = '';
  });

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

};

Resource.prototype.setInputOverListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputOver.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Resource over listener expected an action'); }
  }, this);
};

Resource.prototype.setInputOutListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputOut.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Resource over listener expected an action'); }
  }, this);
};