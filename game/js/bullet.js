/* pDx, pDy: Bullet's intended movement directions
 * pScrollX: Game Scrolling applied to Bullets
 */
function Bullet( pX, pY, pDx, pDy, pScrollX, pTexture ) {
	PIXI.Sprite.call(this, pTexture);

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.dx = pDx + pScrollX;
	this.dy = pDy;
	this.position.x = pX;
	this.position.y = pY;
}

Bullet.constructor = Bullet;
Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.update = function(pDt) {
	// Apply velocity
	this.position.x += this.dx * pDt;
	this.position.y += this.dy * pDt;
};

// Takes in a lil' margin to the size of screen,
// so the dissappearance would look convincing
Bullet.prototype.isOutOfBound = function(pMargin) {
	if (
		this.position.x < -pMargin ||
		this.position.y < -pMargin ||
		this.position.x > GAME_CONSTANTS.gameWidth + pMargin ||
		this.position.y > GAME_CONSTANTS.gameHeight + pMargin
	) {
		return true;
	} else {
		return false;
	}
};
