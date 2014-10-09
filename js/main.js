/*** Initial Method Called ***/
function init() {
	console.log("init() successfully called.");
	// Setup canvas
	var width = document.getElementById("game-canvas").width;
	var height = document.getElementById("game-canvas").height;
	stage = new PIXI.Stage(0xFF00CC);
	renderer = PIXI.autoDetectRenderer(
		width,
		height,
		document.getElementById("game-canvas")
	);
	
	/*** Start updating through draw loop ***/
	requestAnimationFrame(draw);

	// Setup elements
	player = new Player();
	player.position.x = 250;
	player.position.y = GAME_CONSTANTS.groundHeight;
	console.log(player);
	stage.addChild(player);
	
	// Setup Events
	stage.mousedown = stage.touchstart = function()
	{
		player.jump();
	}
}

// Use dt to update animation correctly 
var time;
var now;
var dt;
function draw() {
	requestAnimationFrame(draw);

	// update dt
	now = new Date().getTime();
	dt = now - (time||now); // in case first time
	time = now;
	// update elements
	player.update(dt);

	renderer.render(stage);
}