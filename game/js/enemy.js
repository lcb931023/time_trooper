function Enemy() {
  var texture = PIXI.Texture.fromImage("pics/normTurret.png");
  PIXI.Sprite.call(this, texture);

  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  // Consts
  this.FIRE_RATE = 50; //ms
  // Properties
  this.state = EnemyState.RUN1;
  this.fireTimer = 0;
  this.canShoot = false;

};

Enemy.constructor = Enemy;
Enemy.prototype = Object.create(PIXI.Sprite.prototype);

Enemy.prototype.update = function(pDt) {
  
  this.updateFiring(pDt);
};

// Shooting frequency control
Enemy.prototype.updateFiring = function(pDt) {
  if (!this.canShoot) {
    this.fireTimer += pDt;
    if (this.fireTimer >= this.FIRE_RATE) {
      this.fireTimer = 0;
      this.canShoot = true;
    }
  }
};
