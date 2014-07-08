var Missile = function(x, y) {
  this.sprite = game.add.sprite(x, y, 'missile', 'missiles');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.setTo(1.5, -1.5);
  // this.sprite.scale.setTo(3,3);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.autoCull = true;  

  this.trackingTime = 0; 
  missiles.push(this); // add to global missiles array
};

Missile.prototype.launch = function(enemy) {
  this.enemy = enemy;
  this.trackingTime = 40; // divide by ~60 for seconds
  // this.sprite.rotation = game.physics.arcade.moveToObject(this.sprite, this.enemy.sprite, 400);
  this.sprite.rotation = game.physics.arcade.accelerateToObject(this.sprite, this.enemy.sprite, 800, 600, 600);
};


Missile.prototype.tick = function() {
  if(this.trackingTime > 0) {
    this.trackingTime--;
    if(this.enemy.sprite.exists) {
      this.sprite.rotation = game.physics.arcade.accelerateToObject(this.sprite, this.enemy.sprite, 5000, 600, 600);
    }
  }

  game.physics.arcade.overlap(this.sprite, enemySprites, function(self, enemy) {
    var explosionAnimation = explosions.getFirstExists(false);

    explosionAnimation.reset(self.x, self.y);
    explosionAnimation.play('kaboom', 30, false, true);

    self.exists = false;
    enemy.exists = false;
    
  });
};