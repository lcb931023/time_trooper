function Bullet() {
	var texture = PIXI.Texture.fromImage("pics/bullet.png");
	PIXI.Sprite.call(this, texture);
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
  this.rotation = Math.PI;
}

Bullet.constructor = Bullet;
Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.update = function(pDt) {
	this.position.x -= (Math.random() * .2 + .2) * pDt;
	if(this.position.x < -30){
		this.position.x = 1000;
	}
};