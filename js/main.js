/*** Initial Method Called ***/
function init() {
	console.log("init() successfully called.");
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

	player = new Player();
	player.position.x = 250;
	player.position.y = 400;
	stage.addChild(player);

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