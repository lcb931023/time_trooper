/* pDx, pDy: Bullet's intended movement directions
 * pScrollX: Game Scrolling applied to Bullets
 */
function Door( pTexture, pSpeed ) {
	PIXI.Sprite.call(this, PIXI.Texture.fromImage( pTexture ), 960, 397);

	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
    this.speed = pSpeed;
}

Door.constructor = Door;
Door.prototype = Object.create(PIXI.Sprite.prototype);

Door.prototype.update = function(pDt) {
	this.position.x += this.speed * pDt;
};

// Takes in a lil' margin to the size of screen,
// so the dissappearance would look convincing
/*
Door.prototype.isOutOfBound = function(pMargin) {
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
*/