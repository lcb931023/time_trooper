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
	this.AOE_RADIUS = 150;
	this.JUMP_SPEED = -0.6;
	this.JUMP_TIMER_MAX = 150; //ms. For variable jump height
    this.SLIDE_TIMER_MAX = 2000; //ms. how long slide lasts
    this.AFTER_SLIDE_DELAY = 2000;
	this.DROP_SPEED = 0.006;
	this.dropping = false;
    this.doneSliding = false;
    this.goIntoSlide = false;
	// Properties
	this.dY = 0;
	this.jumpTimer = this.JUMP_TIMER_MAX; // For variable jump height
    this.slideTimer = 0;
    this.afterSlideDelay = 0;
	
	this.state = PlayerState.IDLE;
	this.gotoAndStop(PlayerState.IDLE);
};

Player.constructor = Player;
Player.prototype = Object.create(PIXI.MovieClip.prototype);

Player.prototype.update = function(pDt) {
  switch( this.state ) {
		case PlayerState.IDLE: {
            this.createDelay(pDt);
			break;
		}
		case PlayerState.JUMP: {
			this.updateJump(pDt);
			break;
		}
          
        case PlayerState.SLIDE: {
			this.updateSlide(pDt);
			break;
		}
	}
    
    
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
            this.state = PlayerState.IDLE;
		    this.gotoAndStop(PlayerState.IDLE);
        } else {
            this.slideTimer = 0;
            this.state = PlayerState.SLIDE;
		    this.gotoAndStop(PlayerState.SLIDE);
            this.goIntoSlide = false;
        }
	}
};

Player.prototype.updateSlide = function(pDt) {
	
    // if still hasn't released, keep accelerating
	if (this.slideTimer < this.SLIDE_TIMER_MAX && this.doneSliding == false) {
		this.slideTimer += pDt; 
	} else {
        this.doneSliding = true;
        this.afterSlideDelay = 0;
        this.state = PlayerState.IDLE;
		this.gotoAndStop(PlayerState.IDLE);
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
	if (this.state == PlayerState.IDLE) {
		// start timing how long user holds the jump button
		this.jumpTimer = 0;
		this.state = PlayerState.JUMP;
		this.gotoAndStop(PlayerState.JUMP);
	}  else if (this.state == PlayerState.SLIDE) {
        this.doneSliding = true;
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
	if (this.state == PlayerState.JUMP) {
		this.dropping = true;
	} else if (this.state == PlayerState.IDLE && this.doneSliding == false) {
        this.slideTimer = 0; 
        this.state = PlayerState.SLIDE;
		this.gotoAndStop(PlayerState.SLIDE);
	}
};


Player.prototype.downReleased = function() {

};