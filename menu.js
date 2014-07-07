var Button = function(sprite, x, y, action, text, show) {
  if (show === undefined) { show = true; }
	this.sprite = game.add.sprite(x, y, sprite, 'buttons');

  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.inputEnabled = true;
  this.sprite.fixedToCamera = true;
  
  this.sprite.scale.setTo(0, 0); // menu starts hidden and small
  this.sprite.exists = false;

  this._tweenSpeed = 200;
  if(show) { this.show(); }

  this.text = game.add.text(x, y, text);

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

  this.text.fixedToCamera = true;

  this.setInputDownListener(action);
  
  this.setInputOverListener(function(){
    game.add.tween(this.sprite.scale).to({x: 1.05, y: 1.05}, 50, Phaser.Easing.Quartic.In, true);
    mouseOverButton = true;
  }); 
  this.setInputOutListener(function(){
    game.add.tween(this.sprite.scale).to({x: 1.0, y: 1.0}, 50, Phaser.Easing.Quartic.Out, true);
    mouseOverButton = false;
  }); 

};

Button.prototype.setPosition = function(x, y) {
  if(Array.isArray(x)) {
    this.x = x[0];
    this.y = x[1];
  } else {
    this.x = x;
    this.y = y;
  }

  this.sprite.x = this.x;
  this.sprite.y = this.y;  
};

Button.prototype.setInputDownListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputDown.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Button down listener expected an action'); }
    
  }, this);
};

Button.prototype.setInputUpListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputUp.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Button up listener expected an action'); }
  }, this);
};

Button.prototype.setInputOverListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputOver.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Button over listener expected an action'); }
  }, this);
};

Button.prototype.setInputOutListener = function(action) {
  var passedArgs = [].slice.call(arguments, 1);
  this.sprite.events.onInputOut.add(function(){
    if(typeof action === 'function') {
      action.apply(this);
    } else { throw new Error('Button over listener expected an action'); }
  }, this);
};

Button.prototype.show = function() {
  this.sprite.exists = true;
  this.sprite.bringToTop();
  var tween = game.add.tween(this.sprite.scale).to({x: 1, y: 1}, this._tweenSpeed, Phaser.Easing.Quartic.In, true);

  tween.onComplete.add(function() {
    
  }, this);
};

Button.prototype.hide = function() {
  var tween = game.add.tween(this.sprite.scale).to({x: 0, y: 0}, this._tweenSpeed, Phaser.Easing.Quartic.Out, true);
  tween.onComplete.add(function() {
    this.sprite.exists = false;
  }, this);
};

Button.prototype.toggle = function() {
  if(this.sprite.exists) { this.hide(); } else { this.show(); }
};