/*** Initial Method Called ***/
function init() {
	console.log("init() successfully called.");
	// Setup canvas
	var width = document.getElementById("game-canvas").width;
	var height = document.getElementById("game-canvas").height;
	stage = new PIXI.Stage(0x18428B);
	renderer = PIXI.autoDetectRenderer(
		width,
		height,
		document.getElementById("game-canvas")
	);
	
	/*** Start updating through draw loop ***/
	requestAnimationFrame(draw);
    
    /** PARALLAX **/
     var farTexture = PIXI.Texture.fromImage("pics/bg-far.png");	
     far = new PIXI.TilingSprite(farTexture, 960, 560);
     far.position.x = 0;
     far.position.y = 0;
     far.tilePosition.x = 0;
     far.tilePosition.y = 20;
     stage.addChild(far);

     var midTexture = PIXI.Texture.fromImage("pics/bg-mid.png");
     mid = new PIXI.TilingSprite(midTexture, 960, 560);
     mid.position.x = 0;
     mid.position.y = 120;
     mid.tilePosition.x = 0;
     mid.tilePosition.y = 0;
     stage.addChild(mid);

	/** Setup elements **/
	player = new Player();
	player.position.x = 250;
	player.position.y = GAME_CONSTANTS.groundHeight;
	console.log(player);
	stage.addChild(player);
	
	bullets = [];
 	FIRE_RATE = 10; // [TODO]
	for(var i=0; i < GAME_CONSTANTS.bulletAmount; i++){
    bullets.push(new Bullet());
    stage.addChild(bullets[i]);
  }
	
	hitCounter = document.createElement('span');
	document.body.appendChild( hitCounter );
	hitCount = 0;
	hitCounter.innerHTML = hitCount + " hits!"
	hitCounter.style.position = 'fixed';
	hitCounter.style.top = '0px';
	
	/** Events **/
	// Jump
	KeyboardJS.on('spacebar', function() {
		player.jump();
		return false; // prevent default (scrolling)
	}, function() {
		console.log("up");
		player.jumpReleased();
	});
	stage.mousedown = stage.touchstart = function() { player.jump(); }
	stage.mouseup = stage.touchend = function() { player.jumpReleased(); }
	// Time manipulation
	timeMod = 1;
	slowMod = 0.5;
	fastMod = 2;
	KeyboardJS.on('shift', function(){ timeMod = fastMod; }, function(){ timeMod = 1; });
	KeyboardJS.on('ctrl', function(){ timeMod = slowMod; return false; }, function(){ timeMod = 1; return false; });
	
}

// Use dt to update animation correctly 
var time;
var now;
var dt;
function draw() {
	requestAnimationFrame(draw);

	// update dt
	now = new Date().getTime(); // ms
	dt = now - (time||now); // in case first time
	time = now;
	// manipulate time
	var moddedTime = dt * timeMod;
	// update elements
	player.update( dt );
	for(var i=0; i < bullets.length; i++){
		bullets[i].update( moddedTime );
		// Hit detection
		if (
			( Math.abs(bullets[i].position.x - player.position.x) < (bullets[i].width + player.width * 0.2) / 2 ) &&
			( Math.abs(bullets[i].position.y - (player.position.y - player.height/2 /*anchor*/)) < (bullets[i].height + player.height * 0.8) / 2 ) 
		) {
			bullets[i].respawn();
			hitCount ++;
			hitCounter.innerHTML = hitCount + " hits!"
		}
	}
    
     //parallax
    far.tilePosition.x += 0.4;
    mid.tilePosition.x -= 0.3 * dt;
	
	renderer.render(stage);
}