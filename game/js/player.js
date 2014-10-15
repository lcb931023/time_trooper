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
	this.JUMP_SPEED = -0.6;
	this.JUMP_TIMER_MAX = 150; //ms. For variable jump height
	// Properties
	this.state = PlayerState.IDLE;
	this.dY = 0;
	this.jumpTimer = this.JUMP_TIMER_MAX; // For variable jump height
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
	// always apply gravity when jumping
	this.dY += GAME_CONSTANTS.gravity * pDt;
	// if still hasn't released, keep accelerating
	if (this.jumpTimer < this.JUMP_TIMER_MAX) {
		this.jumpTimer += pDt;
		this.dY = this.JUMP_SPEED;
	}
	// update pos
	this.position.y += this.dY * pDt;
	// If landed, end jump
	if ( this.position.y >= GAME_CONSTANTS.groundHeight ) {
		this.position.y = GAME_CONSTANTS.groundHeight;
		this.dY = 0;
		this.state = PlayerState.IDLE;
	}
};

Player.prototype.jump = function() {
	if (this.state == PlayerState.IDLE) {
		// start timing how long user holds the jump button
		this.jumpTimer = 0;
		this.state = PlayerState.JUMP;
	}
};
Player.prototype.jumpReleased = function() {
	// Stop the timer, stop the upward acceleration
	this.jumpTimer = this.JUMP_TIMER_MAX;
};