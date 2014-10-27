var gameNotStarted = true;
var gameTitle;
var playText;
var scoreText;
var multiplyText;
var highScoreText;
var score = 0;
var highScore = 0;
var heart;
var heartFrames = [];

/*** Pre-init ***/
function load() {
	var assetsToLoader = [ "pics/avatar.json","pics/heart.json" ];
	// create a new loader
	loader = new PIXI.AssetLoader(assetsToLoader);
	// use callback
	loader.onComplete = init;
	//begin load
	loader.load();
}
/*** Initialize Game ***/
function init() {
	//console.log("init() successfully called.");
	// Setup canvas
	stage = new PIXI.Stage("black");
    stage.addChild( new PIXI.Sprite(PIXI.Texture.fromImage("pics/background.png")));

	renderer = PIXI.autoDetectRenderer(
		GAME_CONSTANTS.gameWidth,
		GAME_CONSTANTS.gameHeight,
		document.getElementById("game-canvas")
	);

	/*** Start updating through draw loop ***/
	requestAnimationFrame(draw);

    /** PARALLAX **/
	far = new ScrollingTile("pics/bg-far.png", -0.04);
	far.position.x = 0;
	far.position.y = 0;
	far.tilePosition.x = 0;
	far.tilePosition.y = 0;
	stage.addChild(far);

    mid = new ScrollingTile("pics/bg-mid.png", -0.1);
    mid.position.x = 0;
    mid.position.y = 0;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    stage.addChild(mid);

    /** HEART **/
    for(var i=0; i < 3; i++){
        var heartTextures = PIXI.Texture.fromFrame("heart" + (i+1) + ".png");
        heartFrames.push(heartTextures);
    }

    //GAME MENU && ALL TEXT
    if(gameNotStarted == true){
        heart = new PIXI.MovieClip(heartFrames);
        heart.position.x = 450;
        heart.position.y = 30;
        heart.visible = false;
        heart.gotoAndStop(0);
        
        door = new Door("pics/door.png", -0.1);
        door.position.x = 480;
        door.position.y = 263;
        door.anchor.x = 0.5;
        door.anchor.y = 0.5;
        
        stage.addChild(door);
        

        gameTitle = new PIXI.Text("Time Trooper", {font:"50px Fipps-Regular", fill:"black"});
        gameTitle.position.x = GAME_CONSTANTS.gameWidth / 2;
        gameTitle.position.y = GAME_CONSTANTS.gameHeight / 5;
        gameTitle.anchor.x = 0.5;
        gameTitle.anchor.y = 0.5;
        playText = new PIXI.Text("Press [ENTER] to Start", {font:"35px Fipps-Regular", fill:"green"});
        playText.position.x = GAME_CONSTANTS.gameWidth / 2;
        playText.position.y = GAME_CONSTANTS.gameHeight / 1.5;
        playText.anchor.x = 0.5;
        playText.anchor.y = 0.5;
        scoreText = new PIXI.Text("Distance : " + score, {font:"15px Fipps-Regular", fill:"black"});
        scoreText.position.x = 30;
        scoreText.position.y = 0;
        scoreText.visible = false;
        multiplyText = new PIXI.Text("Multiplier : " , {font:"15px Fipps-Regular", fill:"black"});
        multiplyText.position.x = 30;
        multiplyText.position.y = 20;
        multiplyText.visible = false;
        highScoreText = new PIXI.Text("High Score : " + highScore, {font:"15px Fipps-Regular", fill:"black"});
        highScoreText.position.x = 700;
        highScoreText.position.y = 10;
        highScoreText.visible = false;

        stage.addChild(gameTitle);
        stage.addChild(playText);
        stage.addChild(scoreText);
        stage.addChild(multiplyText);
        stage.addChild(highScoreText);
        stage.addChild(heart);
    }

	/** Setup elements **/
	player = new Player();
	player.position.x = 250;
	player.position.y = GAME_CONSTANTS.groundHeight;
	stage.addChild(player);

	playerBullets = [];

	/** Events **/
	// Start Game
	KeyboardJS.on('enter', function() {
		if(gameNotStarted){
			gameNotStarted = false;
			playText.visible = false;
			gameTitle.visible = false;
			scoreText.visible = true;
			multiplyText.visible = true;
			highScoreText.visible = true;
            heart.visible = true;
		}
	});
	// Jump
	KeyboardJS.on('w, up', function() {
		player.up();
		return false; // prevent default (scrolling)
	}, function() {
		player.upReleased();
	});
	KeyboardJS.on('s, down', function() {
		player.down();
		return false; // prevent default (scrolling)
	}, function() {
		player.downReleased();
	});
	stage.mousedown = stage.touchstart = function() { player.up(); }
	stage.mouseup = stage.touchend = function() { player.upReleased(); }
	// Time manipulation
	timeMod = 1;
	slowMod = 0.7;
	fastMod = 1.5;
	KeyboardJS.on('d, right', function(){ timeMod = fastMod; }, function(){ timeMod = 1; });
	KeyboardJS.on('a, left', function(){ timeMod = slowMod; return false; }, function(){ timeMod = 1; return false; });

}

// Use dt to update animation correctly
var time;
var now;
var dt;
function draw() {
	requestAnimationFrame(draw);

	if(gameNotStarted == false){
    // update dt
		now = Date.now(); // ms
		dt = now - (time||now); // in case first time
		time = now;
		// manipulate time
		var moddedTime = dt * timeMod;
    var moddedTimeSqr = dt * timeMod * timeMod;
		// update elements
		player.update( dt );
		// Shoot
		if (player.canShoot) {
			playerBullets.push( new Bullet( player.getGunPos().x, player.getGunPos().y,
																			GAME_CONSTANTS.playerBulletSpeed, 0, 0,
																			PIXI.Texture.fromImage("pics/playerBullet.png") ) );
			stage.addChild( playerBullets[playerBullets.length-1] );
			player.canShoot = false;
		}

		// Update player's bullets
		for (var i=0; i<playerBullets.length; i++){
			playerBullets[i].update(moddedTime);
			// remove if out of bound
			if (playerBullets[i].isOutOfBound(30)) {
				stage.removeChild(playerBullets[i]);
				playerBullets.splice(i, 1);
			}
			// [TODO] collision with enemy turrets
		}

/*
		for(var i=0; i < bullets.length; i++){
			// Area Time manipulation applied to bullets
			if (player.aoeContains(bullets[i].position)) bullets[i].update( moddedTimeSqr );
			else bullets[i].update( moddedTime );
			// Hit detection. [TODO] This looks ugly. Refactor
			if (
				( Math.abs(bullets[i].position.x - player.position.x) < (bullets[i].width + player.width * 0.2) / 2 ) &&
				( Math.abs(bullets[i].position.y - (player.position.y - player.height/2 )) < (bullets[i].height + player.height * 0.8) / 2 )
            ) {
				bullets[i].respawn();
                console.log(heart.currentFrame);
                if(heart.currentFrame == 0){
                    heart.gotoAndStop(1);
                }else if(heart.currentFrame == 1){
                    heart.gotoAndStop(2);
                }else if(heart.currentFrame == 2){
                    heart.gotoAndStop(0);
                    score = 0;
                }

                scoreText.setText("Distance : " + score);
                multiplyText.setText("Multiplier : " + timeMod);
			}
		}
		*/

		//parallax
		far.update(moddedTime);
		mid.update(moddedTime);
        door.update(moddedTime);

		score += moddedTime / 10000;
		score = Math.ceil(score);
		scoreText.setText("Distance : " + score);
		multiplyText.setText("Multiplier : " + timeMod);

		if(score >= highScore){
			highScore = score;
			highScoreText.setText("High Score : " + highScore);
		}

	}

	renderer.render(stage);
}
