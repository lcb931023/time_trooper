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

	var playerPicture = PIXI.Texture.fromImage("pics/player.png");

	player = new PIXI.Sprite(playerPicture, 100);
	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	player.position.x = width/2;
	player.position.y = height/2;
	stage.addChild(player);


	/*** Render what was just instantiated ***/
	draw();
}

function draw() {
	renderer.render(stage);
	requestAnimationFrame(draw);
}