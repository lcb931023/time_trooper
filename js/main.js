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

	player = new Player();
	player.position.x = width/2;
	player.position.y = height/2;
	stage.addChild(player);


	/*** Start updating through draw loop ***/
	draw();
}

function draw() {
	renderer.render(stage);
	requestAnimationFrame(draw);
}