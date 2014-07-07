var antialias = false;
var screenX = 1020, screenY = 600;
var worldX = 2048, worldY = 2048;

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

var mothership;

var mouseDown = false;

var signals = {
  mouseMarginLeft: new Phaser.Signal(),
  mouseMarginTop: new Phaser.Signal(),
  mouseMarginBottom: new Phaser.Signal(),
  mouseMarginRight: new Phaser.Signal()
};

function preload() {
  game.load.image('background', 'assets/blackbg.png');
  game.load.image('hyperspace', 'assets/starsector/hyperspace1.png');
  game.load.image('hyperspace2', 'assets/starsector/hyperspace2.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('menu_bubble', 'assets/menu_bubble.png');

  game.load.image('beacon', 'assets/beacon.png');
  game.load.image('turret', 'assets/turret.png');
  game.load.image('mothership', 'assets/mothership.png');
}

function create() {
  game.world.setBounds(0, 0, worldX, worldY);

  setStage();

  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  // ADD PLAYER BASE
  mothership = game.add.sprite(worldX/2, worldY/2, 'mothership', 'mothership');
  mothership.anchor.set(0.5, 0.5);
  mothership.scale.setTo(0.5, 0.5);
  centerCameraOnSprite(mothership);

  // ADD MENUS
  var centerCamera = new Button('menu_bubble', screenX - 100, screenY - 50, function() {
    centerCameraOnSprite(mothership);
  },'CENTER CAMERA', true);


  // hack in a mouse-down boolean
  game.input.onDown.add(function() {
    mouseDown = true;
  }, this);

  game.input.onUp.add(function() {
    mouseDown = false;
  }, this);

  // set up listeners for mouse events to handle camera control
  signals.mouseMarginLeft.add(moveCamera.left);
  signals.mouseMarginRight.add(moveCamera.right);
  signals.mouseMarginTop.add(moveCamera.up);
  signals.mouseMarginBottom.add(moveCamera.down);
}

function update() {
  if(mouseDown) { checkPointerAtScreenEdge(); } // check mouse for camera movement
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
  // game.debug.pointer(game.input.activePointer);
}