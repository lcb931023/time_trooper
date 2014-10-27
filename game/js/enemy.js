function Enemy(pX, pY) {

  PIXI.Sprite.call(this, PIXI.Texture.fromImage("pics/normTurret.png"));
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.position.x = pX;
  this.position.y = pY;
  // Consts
  this.FIRE_RATE = 100; //ms
  this.ROTATE_AMT = -10; // Degree
  // Properties
  this.health = 10;
  this.fireTimer = 0;
  this.canShoot = false;
  this.shootDir = new PIXI.Point(-1, 0);
};

Enemy.constructor = Enemy;
Enemy.prototype = Object.create(PIXI.Sprite.prototype);

Enemy.prototype.update = function(pDt) {
  this.position.x += pDt * CONST.scrollingSpeed;
  this.updateFiring(pDt);
};

// Shooting frequency control
Enemy.prototype.updateFiring = function(pDt) {
  if (!this.canShoot) {
    this.fireTimer += pDt;
    if (this.fireTimer >= this.FIRE_RATE) {
      this.fireTimer = 0;
      this.canShoot = true;
      // Rotate the shoot direction. Spiral ftw
      this.shootDir = this.shootDir.rotate(0, 0, this.ROTATE_AMT, true);
    }
  }
};

Enemy.prototype.isOutOfBound = function(pMargin) {
  if (
    this.position.x < -pMargin ||
    this.position.y < -pMargin ||
    this.position.x > CONST.gameWidth + pMargin ||
    this.position.y > CONST.gameHeight + pMargin
  ) {
    return true;
  } else {
    return false;
  }
};
