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
	this.FIRE_RATE = 50; //ms
	this.STEP_FREQ = 200; //ms
	this.AOE_RADIUS = 250; //px
	this.JUMP_SPEED = -0.6;
	this.JUMP_TIMER_MAX = 150; //ms. For variable jump height
	this.DROP_SPEED = 0.006;
	this.dropping = false;
    this.downIsPressed = true;
	// Properties
	this.dY = 0;
	this.jumpTimer = this.JUMP_TIMER_MAX; // For variable jump height
	this.runTimer = 0; // For animating running cycle
	this.state = PlayerState.RUN1;
	this.gotoAndStop(this.state);
	// For firing
	this.fireTimer = 0;
	this.canShoot = false;
	this.gunPosX = 34;
	this.gunPosY = -68;
	this.gunPosSlideX = 19;
	this.gunPosSlideY = -40;

};

Player.constructor = Player;
Player.prototype = Object.create(PIXI.MovieClip.prototype);

Player.prototype.update = function(pDt) {
  switch( this.state ) {
		case PlayerState.RUN1:
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
	}
    
    if(this.downIsPressed == false && this.state == PlayerState.SLIDE){
        this.state = PlayerState.RUN1;
        this.downIsPressed = true;
    }
    
	this.updateFiring(pDt);
	this.gotoAndStop(this.state);
};

Player.prototype.updateJump = function(pDt) {
	// always apply gravity when jumping
	this.dY += GAME_CONSTANTS.gravity * pDt;
	if (this.dropping) {
        this.dY += this.DROP_SPEED * pDt;
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
        
        if(this.dropping == false){
				this.state = PlayerState.RUN1;
		} else {
				this.state = PlayerState.SLIDE;
		}
        
		this.dropping = false;
	}
    
    if(Player.prototype.down() == true){
        console.log("HELLO");
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
	
     this.downIsPressed = true;
     
    if (this.state == PlayerState.JUMP) {
		this.dropping = true;
	} else {
        this.state = PlayerState.SLIDE;
	}
};


Player.prototype.downReleased = function() {
    
    this.downIsPressed = false;
    
    if(this.state != PlayerState.JUMP){
        this.state = PlayerState.RUN1;
    }
};

// Shooting frequency control
Player.prototype.updateFiring = function(pDt) {
	if (!this.canShoot) {
		this.fireTimer += pDt;
		if (this.fireTimer >= this.FIRE_RATE) {
			this.fireTimer = 0;
			this.canShoot = true;
		}
	}
};

Player.prototype.getGunPos = function() {
	var tX, tY;
	tX = this.position.x;
	tY = this.position.y;
	if (this.state == PlayerState.SLIDE) {
		tX += this.gunPosSlideX;
		tY += this.gunPosSlideY;
	} else {
		tX += this.gunPosX;
		tY += this.gunPosY;
	}

	return { x:tX, y:tY }
}
