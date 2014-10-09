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

	/** Setup elements **/
	player = new Player();
	player.position.x = 250;
	player.position.y = GAME_CONSTANTS.groundHeight;
	console.log(player);
	stage.addChild(player);
	
	bullets = [];
 	FIRE_RATE = 10; // [TODO]
	for(var i=0; i < 10; i++){
    bullets.push(new Bullet());
    stage.addChild(bullets[i]);
  }
	
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
	}
	
	renderer.render(stage);
}