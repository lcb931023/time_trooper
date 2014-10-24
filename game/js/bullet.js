function Bullet() {
	var texture = PIXI.Texture.fromImage("pics/bullet.png");
	PIXI.Sprite.call(this, texture);
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.dx = - (Math.random() * .2 + .4);
	this.position.x = (Math.random()*2000) + 1000;
  this.position.y = (Math.random() * (GAME_CONSTANTS.groundHeight - 30) ) + 30;
}

Bullet.constructor = Bullet;
Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.update = function(pDt) {
	this.position.x += this.dx * pDt;
	if(this.position.x < -30){
		this.respawn();
	}
};

Bullet.prototype.respawn = function() {
	this.position.x += 1000;
	this.position.y = (Math.random() * (GAME_CONSTANTS.groundHeight - 30) ) + 30;
}