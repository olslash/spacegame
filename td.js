var antialias = true;
var screenX = 1020, screenY = 600;
var worldX = 2048, worldY = 2048;

var collector_cost = 100;
var collector_rate = 0.05;
var turret_cost = 150;

var total_res = 100;
var resources = []; // all asteroids in the game world
var resourceSprites = []; // all asteroid sprites, for collision checking

var collectors = []; // all resource collectors placed in the game world
var collectorSprites = []; // all collector sprites, for collision checking enemy missiles


var turrets = []; // all turrets placed in the game world
var turretSprites = []; // all turret sprites, for collision checking enemy missiles

var missiles = []; // all missiles fired in the game world

var enemies = []; // all enemies placed in the game world
var enemySprites = []; // all enemy sprites, for collision checking

var time_between_enemy_waves = 3000;
var min_time_between_enemy_waves = 300;
var enemies_per_wave = 1;

var waveTimerSet = true; // do we currently have a setTimeout running for waves?
                         // set to false after player places first unit, to kick
                         // off enemy waves.
var firstPlacement = true;  // this boolean facilitates that

var player;

var game = new Phaser.Game(screenX, screenY, Phaser.AUTO, 'game', {
  preload: preload,
  create: create,
  update: update,
  render: render
}, false, antialias);

var baseSpriteScalingFactor = 3; // sprites are 8x8px-- scale them by this amount.

var background;
//PARTICLE EMITTERS
var back_emitter;
var fill_emitter;

//SPACE JUNK
var junk_thrower;

var mothership;

var mouseDown = false;
var mouseOverButton = false;

var createCollectorButton;
var createTurretButton;

//explosion pools
var explosions;
var explosions_enemy;



var signals = {
  mouseMarginLeft: new Phaser.Signal(),
  mouseMarginTop: new Phaser.Signal(),
  mouseMarginBottom: new Phaser.Signal(),
  mouseMarginRight: new  Phaser.Signal()
};

function preload() {
  game.load.image('background', 'assets/blackbg.png');
  game.load.image('hyperspace', 'assets/starsector/hyperspace1.png');
  game.load.image('hyperspace2', 'assets/starsector/hyperspace2.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('menu_bubble', 'assets/menu_bubble.png');

  game.load.image('beacon', 'assets/nav_buoy.png');
  game.load.image('enemy', 'assets/fighter_heavy_escort_strike.png');

  game.load.image('turret', 'assets/station_small_base.png');
  game.load.image('cannon', 'assets/autopulse_laser_hardpoint_base.png');
  game.load.image('missile', 'assets/missile_harpoon.png');

  game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
  game.load.spritesheet('kaboom_enemy', 'assets/explosion_enemy.png', 64, 64, 23);


  game.load.image('mothership', 'assets/station_small_full_c.png');
  game.load.image('radius', 'assets/radius.png');

  game.load.image('asteroid1', 'assets/asteroids/asteroid1.png');
  game.load.image('asteroid2', 'assets/asteroids/asteroid2.png');
  game.load.image('asteroid3', 'assets/asteroids/asteroid3.png');
  game.load.image('asteroid4', 'assets/asteroids/asteroid4.png');

  game.load.image('debris_lrg0', 'assets/debris/debris_lrg0.png');  
  game.load.image('debris_lrg1', 'assets/debris/debris_lrg1.png');  
  game.load.image('debris_med0', 'assets/debris/debris_med0.png');  
  game.load.image('debris_med1', 'assets/debris/debris_med1.png');  
  game.load.image('debris_med2', 'assets/debris/debris_med2.png');  
  game.load.image('debris_sml0', 'assets/debris/debris_sml1.png');  
  game.load.image('debris_sml1', 'assets/debris/debris_sml1.png');  
  game.load.image('debris_sml2', 'assets/debris/debris_sml2.png');  
  game.load.image('debris_sml3', 'assets/debris/debris_sml3.png');  
}

function create() {
  game.world.setBounds(0, 0, worldX, worldY);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  setStage();

  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;


  // ADD PLAYER OBJECT
  player = new Player();


  // ADD PLAYER BASE
  mothership = game.add.sprite(worldX/2, worldY/2, 'mothership', 'mothership');
  mothership.anchor.set(0.5, 0.5);
  mothership.scale.setTo(1, 1);
  mothership.inputEnabled = true;
  mothership.events.onInputDown.add(goFull);
  centerCameraOnSprite(mothership);

  // ADD MENUS
  var centerCamera = new Button('menu_bubble',  100, screenY - 50, function() {
    centerCameraOnSprite(mothership);
  },'CENTER CAMERA');

  createCollectorButton = new Button('menu_bubble', screenX - 100, screenY - 50, function() {
    if(player.spendRes(collector_cost)) {
      collectors.push(new Collector('beacon', 0, 0));
    } 
    
  },'COLLECTOR (' + collector_cost + ')');

  createTurretButton = new Button('menu_bubble', screenX - 250, screenY - 50, function() {
    if(player.spendRes(turret_cost)) {
      turrets.push(new Turret('turret', 0, 0));
    } 
  },'TURRET (' + turret_cost + ')');

  // THROW IN SOME RESOURCES
  for (var i = total_res; i >= 0; i--) {
    var randX = Math.floor(Math.random() * worldX);
    var randY = Math.floor(Math.random() * worldY);
    var radiusAroundMothership = 300;
    if (randX > worldX / 2 - radiusAroundMothership 
      && randX < worldX / 2 + radiusAroundMothership
      && randY > worldY / 2 - radiusAroundMothership 
      && randY < worldY / 2 + radiusAroundMothership) {
      i++;
    } else {
      var res = new Resource(randX, randY);
      resources.push(res);
      resourceSprites.push(res.sprite);
    }
  }

  // hack in a mouse-down boolean
  game.input.onDown.add(function() {
    mouseDown = true;
  }, this);

  game.input.onUp.add(function() {
    mouseDown = false;
  }, this);

//  Explosion pool -- http://examples.phaser.io/_site/view_full.html?d=games&f=tanks.js&t=tanks
   explosions = game.add.group();

   for (var i = 0; i < 10; i++)
   {
       var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
       explosionAnimation.anchor.setTo(0.5, 0.5);
       explosionAnimation.scale.setTo(4, 4);
       explosionAnimation.animations.add('kaboom');
   }

   explosions_enemy = game.add.group();

   for (var i = 0; i < 10; i++)
   {
       var explosionAnimation = explosions_enemy.create(0, 0, 'kaboom_enemy', [0], false);
       explosionAnimation.anchor.setTo(0.5, 0.5);
       explosionAnimation.scale.setTo(4, 4);
       explosionAnimation.animations.add('kaboom_enemy');
   }


  // set up listeners for mouse events to handle camera control
  signals.mouseMarginLeft.add(moveCamera.left);
  signals.mouseMarginRight.add(moveCamera.right);
  signals.mouseMarginTop.add(moveCamera.up);
  signals.mouseMarginBottom.add(moveCamera.down);






  // TESTING DANGERZONE








}

function update() {
  if(mouseDown && !mouseOverButton) { checkPointerAtScreenEdge(); } // check mouse for camera movement

  // wait until player places a unit before kicking off enemy waves
  if(firstPlacement) {
    if(collectors.length > 0 || turrets.length > 0) {
      firstPlacement = false;
      waveTimerSet = false;
    }
  }

  // slowly increase the spawn rate of enemies
  if(!firstPlacement && time_between_enemy_waves > min_time_between_enemy_waves) {
    time_between_enemy_waves -= 0.02;
    // console.log(time_between_enemy_waves);
  }

  // update every resource (only for visual effect)
  for (var i = resources.length - 1; i >= 0; i--) {
    resources[i].tick();
  }


  // update every collector-
  for(var i = collectors.length - 1; i >= 0; i--) {
    collectors[i].tick();
  }

  // update every turret-
  for(var i = turrets.length - 1; i >= 0; i--) {
    turrets[i].tick();
  }

  // update the player/hud
  player.tick();

  // update buttons based on current resources
  if(player.checkRes() >= collector_cost && createCollectorButton.sprite.exists === false) {
    createCollectorButton.show();
  } else if (player.checkRes() < collector_cost && createCollectorButton.sprite.exists === true) {
    createCollectorButton.hide();
  }

  if(player.checkRes() >= turret_cost && createTurretButton.sprite.exists === false) {
    createTurretButton.show();
  } else if (player.checkRes() < turret_cost && createTurretButton.sprite.exists === true) {
    createTurretButton.hide();
  }

  // spawn enemy waves
  if(!waveTimerSet) {
    waveTimerSet = true;
    window.setTimeout(function() {
      for(var i = enemies_per_wave - 1; i >= 0; i--) {
        // generate an off-screen position
        // pick whether to spawn off an x or yedge
        var x, y;
        var vertOrHoriz = Math.round(Math.random());
        if(vertOrHoriz === 0) {
          // vertical
          // x is anywhere
          x = Math.random() * worldX;
          //y is either off the top or off the bottom, depending on the random
          // -100 is off the top because up is negative on the y axis.
          y = Math.round(Math.random()) > 0 ? -worldY - 100 : 100;

        } else if (vertOrHoriz === 1) {
          // horizontal
          // y is anywhere
          y = Math.random() * worldX;
          //y is either off the top or off the bottom, depending on the random
          x = Math.round(Math.random()) > 0 ? worldX + 100 : -100;
        }

        enemies.push(new Enemy('enemy', x, y));
        // console.log('spawning an enemy');
        waveTimerSet = false;
      }
    }, time_between_enemy_waves);
  }

  // update every enemy
  for(var i = enemies.length - 1; i >=0; i--) {
    enemies[i].tick();
  }

  // update every missile (enemy tracking)
  for (var i = missiles.length - 1; i >= 0; i--) {
    missiles[i].tick();
  }
  
  // rotate the mothership
  mothership.rotation = game.math.wrapAngle(mothership.rotation + 0.001, true);

  // toss out some spacejunk
  junk_thrower.tick();
}

function render() {
  for (var i = turrets.length - 1; i >= 0; i--) {
    turrets[i].debug();
  }

  for (var i = collectors.length - 1; i >= 0; i--) {
    collectors[i].debug();
  }


  // game.debug.cameraInfo(game.camera, 32, 32);
  // game.debug.pointer(game.input.activePointer);
}