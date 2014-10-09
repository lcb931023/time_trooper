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

	// Setup elements
	player = new Player();
	player.position.x = 250;
	player.position.y = GAME_CONSTANTS.groundHeight;
	console.log(player);
	stage.addChild(player);
	
	bullets = [];
 	FIRE_RATE = 10; // [TODO]
	for(var i=0; i < 15; i++){
    bullets.push(new Bullet());
    bullets[i].position.x = (Math.random()*2000) + 1000;
    bullets[i].position.y = (Math.random()*500) + 30;
    stage.addChild(bullets[i]);
  }
	
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
var timeMod = 1; // manipulate time
function draw() {
	requestAnimationFrame(draw);

	// update dt
	now = new Date().getTime();
	dt = now - (time||now); // in case first time
	time = now;
	// manipulate time
	var moddedTime = dt * timeMod;
	// update elements
	player.update( moddedTime );
	for(var i=0; i < bullets.length; i++){
		bullets[i].update( moddedTime );
	}
	
	renderer.render(stage);
}