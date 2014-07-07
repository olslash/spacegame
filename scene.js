// BASIC SCENE
// ATMOSPHERIC PARTICLES

function setStage() {
  game.stage.backgroundColor = '#000000';
  background = game.add.tileSprite(0, 0, worldx * 2, worldy * 2, 'background');
  background.scale.setTo(0.5, 0.5);
  
  bgdec1 = game.add.sprite(-100, -200, 'hyperspace');
  bgdec1.scale.setTo(1.0, 0.4);
  bgdec1.alpha = 0.4;  
  bgdec1.fixedToCamera = true;  

  bgdec2 = game.add.sprite(-200, 0, 'hyperspace2');
  bgdec2.scale.setTo(1.0, 0.6);
  bgdec2.alpha = 0.4;
  bgdec2.fixedToCamera = true;
  

  back_emitter = game.add.emitter(game.world.width / 2, game.world.height / 2, 1000);

  back_emitter.makeParticles('star');
  back_emitter.maxParticleScale = 0.6;
  back_emitter.minParticleScale = 0.2;
  back_emitter.setYSpeed(0, 0);
  back_emitter.setXSpeed(10, 20);

  back_emitter.gravity = 0;
  back_emitter.width = game.world.width * 1.5;
  back_emitter.height = game.world.height * 1.5;
  back_emitter.minRotation = 0;
  back_emitter.maxRotation = 0;
  // back_emitter.maxParticleSpeed = 25;

  back_emitter.start(true, 180000, 20, 400);

  fill_emitter = game.add.emitter(-30, game.world.height / 2, 1000);

  fill_emitter.makeParticles('star');
  fill_emitter.maxParticleScale = 0.6;
  fill_emitter.minParticleScale = 0.2;
  fill_emitter.setYSpeed(0, 0);
  fill_emitter.setXSpeed(10, 20);

  fill_emitter.gravity = 0;
  fill_emitter.width = 5;
  fill_emitter.height = game.world.height * 1.5;
  fill_emitter.minRotation = 0;
  fill_emitter.maxRotation = 0;
  // fill_emitter.maxParticleSpeed = 25;

  fill_emitter.start(false, 180000, 1500, 1000);
}
  