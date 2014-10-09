function Player() {
	var texture = PIXI.Texture.fromImage("pics/player.png");
	PIXI.Sprite.call(this, texture);
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
}

Player.constructor = Player;
Player.prototype = Object.create(PIXI.Sprite.prototype);

Player.prototype.update = function(pDt) {
  this.rotation += 0.01 * pDt;
};
 