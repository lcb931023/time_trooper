/* pDx, pDy: Bullet's intended movement directions
 * pScrollX: Game Scrolling applied to Bullets
 */
function Bullet( pDx, pDy, pScrollX ) {
	var texture = PIXI.Texture.fromImage("pics/bullet.png");
	PIXI.Sprite.call(this, texture);
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.dx = pDx + pScrollX;
	this.dy = pDy;
	this.position.x = (Math.random()*2000) + 1000;
  this.position.y = (Math.random() * (GAME_CONSTANTS.groundHeight - 30) ) + 30;
}

Bullet.constructor = Bullet;
Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.update = function(pDt) {
	this.position.x += this.dx * pDt;
	this.position.y += this.dy * pDt;
	if(this.position.x < -30){
		this.respawn();
	}
};

Bullet.prototype.respawn = function() {
	this.position.x += 1000;
	this.position.y = (Math.random() * (GAME_CONSTANTS.groundHeight - 30) ) + 30;
}