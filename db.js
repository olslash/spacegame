var DB = function() {
  this.fb = new Firebase('https://hackathon-td.firebaseio.com/');
};

// {name: '', score: ''}
DB.prototype.newHighScore = function(params) {
  this.fb.set({highscore: params});
};