var mouseEdgeMarginX = 300;
var mouseEdgeMarginY = 200;

function checkPointerAtScreenEdge() {
  // fire events when mouse pointer is within a margin of edge
  // -- for camera movement.
  var pointerX = game.input.activePointer.screenX;
  var pointerY = game.input.activePointer.screenY;
  var depthIntoMargin = 0;

  //horizontal
  if (pointerX < mouseEdgeMarginX) {
    // pointer is within margin of left edge
    depthIntoMargin = mouseEdgeMarginX - pointerX;
    signals.mouseMarginLeft.dispatch(depthIntoMargin);
  } else if (pointerX > screenX - mouseEdgeMarginX) {
    //pointer is within margin of right edge
    depthIntoMargin = pointerX - (screenX - mouseEdgeMarginX);
    signals.mouseMarginRight.dispatch(depthIntoMargin);
  }

  //vertical
  if (pointerY < mouseEdgeMarginY) {
    depthIntoMargin = mouseEdgeMarginY - pointerY;
    signals.mouseMarginTop.dispatch(depthIntoMargin);
  } else if (pointerY > screenY - mouseEdgeMarginY) {
    depthIntoMargin = pointerY - (screenY - mouseEdgeMarginY);
    signals.mouseMarginBottom.dispatch(depthIntoMargin);
  }
}

var moveCamera = {
  multiplier: 0.1,
  left: function(depth) {
    game.camera.x -= moveCamera.multiplier * depth;
  },
  right: function(depth) {
    game.camera.x += moveCamera.multiplier * depth;
  },
  up: function(depth) {
    game.camera.y -= moveCamera.multiplier * depth;
  },
  down: function(depth) {
    game.camera.y += moveCamera.multiplier * depth;
  },
};

function centerCameraOnSprite(sprite) {
  game.add.tween(game.camera).to( 
  { x: sprite.x - (game.camera.width / 2), 
    y: sprite.y - (game.camera.height / 2) }, 
    750, Phaser.Easing.Quadratic.InOut, true);
}

function goFull() {
  game.scale.startFullScreen(false); // false: don't antialias
}
