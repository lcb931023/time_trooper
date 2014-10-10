function ScrollingTile( pTextureURL, pSpeed ) {
	var texture = PIXI.Texture.fromImage( pTextureURL );
	PIXI.TilingSprite.call(this, texture, 960, 560);
	this.speed = pSpeed;
}

ScrollingTile.constructor = ScrollingTile;
ScrollingTile.prototype = Object.create(PIXI.TilingSprite.prototype);

ScrollingTile.prototype.update = function(pDt) {
	this.tilePosition.x += this.speed * pDt;
};