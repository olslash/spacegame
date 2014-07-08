var Enemy = function(sprite, x, y) {
  this.sprite = game.add.sprite(x, y, sprite, 'turrets');
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.setTo(0.75, 0.75);

  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  
  this.gunrange = 400; // gun range
  this.fireRate = 40; // divide by ~60 for time in seconds
  this.lastFire = 0;

  this.range = new Phaser.Circle(this.sprite.x, this.sprite.y, this.gunrange);


  this.state = 0; //'placing';
  this.sprite.autoCull = false;
  // this.sprite.inputEnabled = true;
  this.target = this.chooseTarget();
  enemySprites.push(this.sprite);
};

Enemy.prototype.chooseTarget = function() {
  // look at the combined number of turrets and collectors.
  // choose a random number from 0 -> that
  // if the number is > turrets, subtract turrets and use that index for collectors
  // 
  // spawning before anything is placed-- check for 0s

  function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  var canTargetCollectors = false;
  var canTargetTurrets = false;
  // if there are collectors, we can target collectors
  if(collectors.length > 0) { 
    canTargetCollectors = true; 
  }
  // same for turrets
  if(turrets.length > 0) { 
    canTargetTurrets = true;
  }

  var turretSelection, collectorSelection;

  // make a random selection from each category
  if(canTargetCollectors) {
    collectorSelection = randomIntFromInterval(0, collectors.length - 1);
  }
  if(canTargetTurrets) {
    turretSelection = randomIntFromInterval(0, turrets.length - 1);
  }

  // then choose one oh god this is horrible
  if(turretSelection !== undefined && collectorSelection !== undefined) {
    var choice = Math.round(Math.random());
    if (choice === 0) { return turrets[turretSelection]; }
    if (choice === 1) { return collectors[collectorSelection]; }
  } else if (turretSelection !== undefined) {
    return turrets[turretSelection];
  } else if (collectorSelection !== undefined) {
    return collectors[collectorSelection];
  } else {
    console.log('a bad thing happened');
  }
};

Enemy.prototype.launchMissile = function(target) {
  if(this.lastFire >= this.fireRate) {
    this.lastFire = 0;
    new EnemyMissile(this.sprite.x, this.sprite.y).launch(target);
  }
};

Enemy.prototype.tick = function() {
  if(this.sprite.exists) {
    // update the firing timer
    this.lastFire++;

    // update the range circle
    this.range.x = this.sprite.x;
    this.range.y = this.sprite.y;

    // accelerate towards this.target
    this.sprite.rotation = 
    game.physics.arcade.accelerateToObject(this.sprite, this.target.sprite, 50, 100, 100) 
    - (0.5 * Math.PI); // rotate 90 degrees to face.
    
    // fire missiles if in range AND i exist still
      if(this.target.sprite.exists === true) {
        if(this.range.contains(this.target.sprite.x, this.target.sprite.y)) {
          //try to launch
          this.launchMissile(this.target);
        }
      }
  }
};