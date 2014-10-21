function ScrollingTile( pTextureURL, pSpeed ) {
	PIXI.TilingSprite.call(this, PIXI.Texture.fromImage( pTextureURL ), 960, 560);
	this.speed = pSpeed;
}

ScrollingTile.constructor = ScrollingTile;
ScrollingTile.prototype = Object.create(PIXI.TilingSprite.prototype);

ScrollingTile.prototype.update = function(pDt) {
	this.tilePosition.x += this.speed * pDt;
};