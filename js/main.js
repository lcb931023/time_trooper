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
	for(var i=0; i < 10; i++){
    bullets.push(new Bullet());
    bullets[i].position.x = (Math.random()*2000) + 1000;
    bullets[i].position.y = (Math.random()*500) + 30;
    stage.addChild(bullets[i]);
  }
	
	// Events
	stage.mousedown = stage.touchstart = function()
	{
		player.jump();
	}
	// Time manipulation
	timeMod = 1; // manipulate time
	KeyboardJS.on('shift', function(){ timeMod = 0.6; }, function(){ timeMod = 1; });
	
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
	// manipulate time
	var moddedTime = dt * timeMod;
	// update elements
	player.update( dt );
	for(var i=0; i < bullets.length; i++){
		bullets[i].update( moddedTime );
	}
	
	renderer.render(stage);
}