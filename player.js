var Player = function() {
  this.res = 300; // player starts with 300 res

  this.resCount = game.add.text(200, 50, 'RESOURCES:');

  //  Center align
  this.resCount.anchor.set(0.5, 0.5);
  // this.resCount.align = 'left';

  //  Font style
  this.resCount.font = 'Arial';
  this.resCount.fontSize = 24;
  this.resCount.fontWeight = 'bold';

  //  Stroke color and thickness
  this.resCount.stroke = '#000000';
  this.resCount.strokeThickness = 6;
  this.resCount.fill = '#43d637';

  this.resCount.fixedToCamera = true;
};

Player.prototype.addRes = function(amt) {
  this.res += amt;
};

Player.prototype.spendRes = function(amt) {
  if(this.res >= amt) {
    this.res -= amt;
    return true;
  } else {
    return false;
  }
};

Player.prototype.checkRes = function() {
  return this.res;
};

Player.prototype.tick = function() {
  this.resCount.text = 'RESOURCES: ' + Math.floor(this.checkRes());
};