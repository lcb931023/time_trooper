/*** Player ***/
/* Player class uses a state machine to
 * determine what action it'll be animating / doing
 */

var PlayerState = {
	RUN1: 0,
	RUN2: 1,
	RUN3: 2,
	RUN4: 3,
	JUMP: 4,
	SLIDE: 5,
	HIT:6, // [TODO]
	ATTACK:7, // [TODO]
	// etc
};
// !important
// Make sure the order of frames match the order of player states
// fuck, there's gotta be a better way to do this. [TODO]
function Player() {
	var frames = [
		PIXI.Texture.fromFrame("avatar-run1.png"),
		PIXI.Texture.fromFrame("avatar-run2.png"),
		PIXI.Texture.fromFrame("avatar-run3.png"),
		PIXI.Texture.fromFrame("avatar-run4.png"),
		PIXI.Texture.fromFrame("avatar-jump.png"),
		PIXI.Texture.fromFrame("avatar-crouch.png")
	];
	PIXI.MovieClip.call(this, frames);
	
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	// Consts
	this.STEP_FREQ = 200; //ms
	this.AOE_RADIUS = 250;
	this.JUMP_SPEED = -0.6;
	this.JUMP_TIMER_MAX = 150; //ms. For variable jump height
    this.SLIDE_TIMER_MAX = 2000; //HOW LONG SLIDE FROM IDLE LASTS
    this.SLIDE_TIMER_FROM_JUMP_MAX = 500;//HOW LONG SLIDE FROM DROPPING WHILE IN JUMP LASTS
    this.AFTER_SLIDE_DELAY = 2000;
	this.DROP_SPEED = 0.006;
	this.dropping = false;
    this.doneSliding = false;
    this.goIntoSlide = false;
    this.slideFromJump = false;
	// Properties
	this.dY = 0;
	this.jumpTimer = this.JUMP_TIMER_MAX; // For variable jump height
	this.runTimer = 0; // For animating running cycle
    this.slideTimer = 0;
    this.afterSlideDelay = 0;
	this.state = PlayerState.RUN1;
	this.gotoAndStop(this.state);
};

Player.constructor = Player;
Player.prototype = Object.create(PIXI.MovieClip.prototype);

Player.prototype.update = function(pDt) {
  switch( this.state ) {
		case PlayerState.RUN1:
			this.createDelay(pDt);
			this.runTimer += pDt;
			if (this.runTimer >= this.STEP_FREQ)
			{
				this.runTimer = 0;
				this.state ++;
			}
			break;
		case PlayerState.RUN2:
		case PlayerState.RUN3:
			this.runTimer += pDt;
			if (this.runTimer >= this.STEP_FREQ)
			{
				this.runTimer = 0;
				this.state ++;
			}
			break;
		case PlayerState.RUN4:
			this.runTimer += pDt;
			if (this.runTimer >= this.STEP_FREQ)
			{
				this.runTimer = 0;
				this.state = PlayerState.RUN1;
			}
			break;		
		case PlayerState.JUMP: 
			this.updateJump(pDt);
			break;
    case PlayerState.SLIDE:
			this.updateSlide(pDt);
			break;
	}
	this.gotoAndStop(this.state);
};

Player.prototype.updateJump = function(pDt) {
	// always apply gravity when jumping
	this.dY += GAME_CONSTANTS.gravity * pDt;
	if (this.dropping) {
        this.dY += this.DROP_SPEED * pDt;
        this.goIntoSlide = true;
    }
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
		this.dropping = false;
		this.doneSliding = false;
		if(this.goIntoSlide == false){
				this.state = PlayerState.RUN1;
		} else {
				this.slideTimer = 0;
				this.slideFromJump = true;
				this.state = PlayerState.SLIDE;
				this.goIntoSlide = false;
		}
	}
};

Player.prototype.updateSlide = function(pDt) {
	
    // if still hasn't released, keep accelerating
	if (this.slideTimer < this.SLIDE_TIMER_MAX && this.doneSliding == false && this.slideFromJump == false) {
		this.slideTimer += pDt; 
	} else if (this.slideTimer < this.SLIDE_TIMER_FROM_JUMP_MAX && this.doneSliding == false && this.slideFromJump == true) {
		this.slideTimer += pDt; 
	} else {
        this.doneSliding = true;
        this.afterSlideDelay = 0;
        this.state = PlayerState.RUN1;
    }
};

Player.prototype.createDelay = function(pDt) {
    
    if(this.afterSlideDelay < this.AFTER_SLIDE_DELAY && this.doneSliding == true)
    {
            this.afterSlideDelay += pDt; 
    } else {
            this.doneSliding = false;
    }
};

Player.prototype.aoeContains = function (pPosition) {			
	if ( this.position.distance( pPosition ) < this.AOE_RADIUS ) return true;
	else return false;
};

/** Control **/

Player.prototype.up = function() {
	if (this.state <= PlayerState.RUN4) {
		// start timing how long user holds the jump button
		this.jumpTimer = 0;
		this.state = PlayerState.JUMP;
	}  else if (this.state == PlayerState.SLIDE) {
        this.doneSliding = true;
        // start timing how long user holds the jump button
		this.jumpTimer = 0;
		this.state = PlayerState.JUMP;
    }
};
Player.prototype.upReleased = function() {
	// Stop the timer, stop the upward acceleration
	this.jumpTimer = this.JUMP_TIMER_MAX;
};

 Player.prototype.down = function() {
	if (this.state == PlayerState.JUMP) {
		this.dropping = true;
	} else if (this.state == PlayerState.RUN4 && this.doneSliding == false) {
        this.slideFromJump = false;
        this.slideTimer = 0; 
        this.state = PlayerState.SLIDE;
	}
};


Player.prototype.downReleased = function() {

};