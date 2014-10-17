/*** Player ***/
/* Player class uses a state machine to
 * determine what action it'll be animating / doing
 */

var PlayerState = {
	IDLE: 0,
	JUMP: 1,
	SLIDE: 2,
	HIT:3,
	ATTACK:4,
	// etc
};
// !important
// Make sure the order of frames match the order of player states
// fuck, tehre's gotta be a better way to do this. [TODO]
function Player() {
	var frames = [
		PIXI.Texture.fromFrame("avatar-idle.png"),
		PIXI.Texture.fromFrame("avatar-jump.png"),
		PIXI.Texture.fromFrame("avatar-crouch.png")
	];
	PIXI.MovieClip.call(this, frames);
	
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	// Consts
	this.JUMP_SPEED = -0.6;
	this.JUMP_TIMER_MAX = 150; //ms. For variable jump height
	// Properties
	this.dY = 0;
	this.jumpTimer = this.JUMP_TIMER_MAX; // For variable jump height
	
	this.state = PlayerState.IDLE;
	this.gotoAndStop(PlayerState.IDLE);
};

Player.constructor = Player;
Player.prototype = Object.create(PIXI.MovieClip.prototype);

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
		this.gotoAndStop(PlayerState.IDLE);
	}
};

Player.prototype.up = function() {
	if (this.state == PlayerState.IDLE) {
		// start timing how long user holds the jump button
		this.jumpTimer = 0;
		this.state = PlayerState.JUMP;
		this.gotoAndStop(PlayerState.JUMP);
	}
};
Player.prototype.upReleased = function() {
	// Stop the timer, stop the upward acceleration
	this.jumpTimer = this.JUMP_TIMER_MAX;
};

Player.prototype.down = function() {
	console.log("Slide");
	if (this.state == PlayerState.JUMP) {
		
	} else if (this.state == PlayerState.IDLE) {
		this.state = PlayerState.SLIDE;
		this.gotoAndStop(PlayerState.SLIDE);
	}
};
Player.prototype.downReleased = function() {
	console.log("SlideReleased");
	if (this.state == PlayerState.SLIDE) {
		this.state = PlayerState.IDLE;
		this.gotoAndStop(PlayerState.IDLE);
	}
};