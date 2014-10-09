/*** Player ***/
/* Player class uses a state machine to
 * determine what action it'll be animating / doing
 */

var PlayerState = {
	IDLE: 0,
	JUMP: 1,
	HIT:2,
	ATTACK:3,
	// etc
};

function Player() {
	var texture = PIXI.Texture.fromImage("pics/avatar-idle.png");
	PIXI.Sprite.call(this, texture);
	
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	
	// Consts
	this.MAX_SPEED = 500;
	this.ACCELERATION = 1500;
	this.DRAG = 600;
	this.JUMP_SPEED = -1.2;
	// Properties
	this.state = PlayerState.IDLE;
	this.dY = 0;
};

Player.constructor = Player;
Player.prototype = Object.create(PIXI.Sprite.prototype);

Player.prototype.update = function(pDt) {
  switch( this.state ) {
		case PlayerState.IDLE: {
			// Do something... or not
			break;
		}
		case PlayerState.JUMP: {
			this.updateJump(pDt);
			break;
		}
	}
};

Player.prototype.updateJump = function(pDt) {
	// If landed, end jump
	this.dY += GAME_CONSTANTS.gravity * pDt;
	this.position.y += this.dY * pDt;
	if ( this.position.y >= GAME_CONSTANTS.groundHeight ) {
		this.position.y = GAME_CONSTANTS.groundHeight;
		this.dY = 0;
		this.state = PlayerState.IDLE;
	}
};

Player.prototype.jump = function() {
	if (this.state == PlayerState.IDLE) {
		this.dY = this.JUMP_SPEED;
		this.state = PlayerState.JUMP;
	}
};