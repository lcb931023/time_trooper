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
var closeBlurEffect;
var farBlurEffect;
var backgroundBlurEffect;
var backgroundImage;

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
	// Setup canvas
	stage = new PIXI.Stage("black");

  //Create BLURS
  backgroundBlurEffect = new PIXI.BlurXFilter();
  closeBlurEffect = new PIXI.BlurXFilter();
  farBlurEffect = new PIXI.BlurXFilter();
  backgroundBlurEffect.blur = 0;
  closeBlurEffect.blur = 0;
  farBlurEffect.blur = 0;



  backgroundImage = new PIXI.Sprite(PIXI.Texture.fromImage("pics/background.png"));
  backgroundImage.filters = [backgroundBlurEffect];
  stage.addChild(backgroundImage);

	renderer = PIXI.autoDetectRenderer(
		CONST.gameWidth,
		CONST.gameHeight,
		document.getElementById("game-canvas")
	);

	level = new Level();

    /** PARALLAX **/
	far = new ScrollingTile("pics/bg-far.png", -0.04);
	far.position.x = 0;
	far.position.y = 0;
	far.tilePosition.x = 0;
	far.tilePosition.y = 0;
  far.filters = [farBlurEffect];
	stage.addChild(far);

    mid = new ScrollingTile("pics/bg-mid.png", CONST.scrollingSpeed);
    mid.position.x = 0;
    mid.position.y = 0;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 0;
    mid.filters = [closeBlurEffect];
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

        door = new Door("pics/door.png", CONST.scrollingSpeed);
        door.position.x = 480;
        door.position.y = 263;

        stage.addChild(door);

        //MAIN MENU SCREEN TEXT
        gameTitle = new PIXI.Text("Time Trooper", {font:"50px Fipps-Regular", fill:"black"});
        gameTitle.position.x = CONST.gameWidth / 2;
        gameTitle.position.y = CONST.gameHeight / 5;
        gameTitle.anchor.x = 0.5;
        gameTitle.anchor.y = 0.5;
        upText = new PIXI.Text("Up - Jump", {font:"16px Fipps-Regular", fill:"black"});
        upText.position.x = CONST.gameWidth / 3;
        upText.position.y = CONST.gameHeight / 2.5;
        upText.anchor.x = 0.5;
        upText.anchor.y = 0.5;
        downText = new PIXI.Text("Down - Crouch/Slide", {font:"16px Fipps-Regular", fill:"black"});
        downText.position.x = CONST.gameWidth / 3;
        downText.position.y = CONST.gameHeight / 2;
        downText.anchor.x = 0.5;
        downText.anchor.y = 0.5;
        leftText = new PIXI.Text("Left - Slow Down Time", {font:"16px Fipps-Regular", fill:"black"});
        leftText.position.x = CONST.gameWidth / 1.5;
        leftText.position.y = CONST.gameHeight / 2.5;
        leftText.anchor.x = 0.5;
        leftText.anchor.y = 0.5;
        rightText = new PIXI.Text("Right - Speed Up Time", {font:"16px Fipps-Regular", fill:"black"});
        rightText.position.x = CONST.gameWidth / 1.5;
        rightText.position.y = CONST.gameHeight / 2;
        rightText.anchor.x = 0.5;
        rightText.anchor.y = 0.5;

        //IN GAME TEXT
        playText = new PIXI.Text("Press [ENTER] to Start", {font:"35px Fipps-Regular", fill:"black"});
        playText.position.x = CONST.gameWidth / 2;
        playText.position.y = CONST.gameHeight / 1.5;
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

        //MAIN MENU SCREEN TEXT
        stage.addChild(gameTitle);
        stage.addChild(playText);
        stage.addChild(upText);
        stage.addChild(downText);
        stage.addChild(leftText);
        stage.addChild(rightText);

        //IN GAME TEXT
        stage.addChild(scoreText);
        stage.addChild(multiplyText);
        stage.addChild(highScoreText);
        stage.addChild(heart);
    }

	/** Setup elements **/
	player = new Player();
	player.position.x = 250;
	player.position.y = CONST.groundHeight;
	stage.addChild(player);

	playerBullets = [];

	enemies = [];
	enemyBullets = [];

	/** Events **/
	// Start Game
	KeyboardJS.on('enter', function() {
		if(gameNotStarted){
			gameNotStarted = false;
			playText.visible = false;
			gameTitle.visible = false;
      upText.visible = false;
      leftText.visible = false;
      rightText.visible = false;
      downText.visible = false;
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
	KeyboardJS.on('d, right', function(){ timeMod = fastMod; backgroundBlurEffect.blur = 2; farBlurEffect.blur = 7; closeBlurEffect.blur = 17; }, function(){ timeMod = 1; backgroundBlurEffect.blur = 0; farBlurEffect.blur = 0; closeBlurEffect.blur = 0; });
	KeyboardJS.on('a, left', function(){ timeMod = slowMod; return false; }, function(){ timeMod = 1; return false; });

	/*** Start updating through draw loop ***/
	requestAnimationFrame(draw);
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
		var moddedTime 		= dt * timeMod;
		var moddedTimeEnhanced = dt * timeMod * timeMod * 0.8; // The magical number! #sorrynotsorry
		// update elements
		player.update( dt );
		// Player Bullet spawning
		if (player.canShoot) {
			playerBullets.push( new Bullet( player.getGunPos().x, player.getGunPos().y,
																			CONST.playerBulletSpeed, 0, 0,
																			PIXI.Texture.fromImage("pics/playerBullet.png") ) );
			stage.addChild( playerBullets[playerBullets.length-1] );
			player.canShoot = false;
		}

		// Enemies spawning
		level.update( moddedTime );
		if (level.canSpawn) {
			enemies.push( new Enemy(CONST.gameWidth + 30, CONST.enemySpawnCeil + Math.random() * (CONST.enemySpawnBottom - CONST.enemySpawnCeil) ) );
			stage.addChild( enemies[enemies.length-1] );
			level.canSpawn = false;
		}

		// Update player's bullets
		// inverse for loop for splice bug prevention http://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
		for (var i=playerBullets.length-1; i>=0; i--){
			var remove = false;
			playerBullets[i].update(moddedTime);
			// collision with enemy turrets
			for (var j=0; j<enemies.length; j++){
				if (playerBullets[i].position.distance(enemies[j].position) < enemies[j].width) {
					remove = true;
					enemies[j].health --;
				}
			}
			// remove if out of bound
			if (playerBullets[i].isOutOfBound(30)) {
				remove = true;
			}

			if (remove) {
				stage.removeChild(playerBullets[i]);
				playerBullets.splice(i, 1);
			}
		}

		// Update Enemies: Shooting, boundary, and health
		for (var i=enemies.length-1; i>=0; i--) {
			var remove = false;
			enemies[i].update(moddedTime);
			// bullet spawning
			if (enemies[i].canShoot) {
				enemyBullets.push( new Bullet( enemies[i].position.x, enemies[i].position.y,
																				enemies[i].shootDir.x * CONST.enemyBulletSpeed,
																				enemies[i].shootDir.y * CONST.enemyBulletSpeed,
																				CONST.scrollingSpeed,
																				PIXI.Texture.fromImage("pics/bullet.png") ) );
				stage.addChild( enemyBullets[enemyBullets.length-1] );
				enemies[i].canShoot = false;
			}
			// boundary
			if (enemies[i].isOutOfBound(enemies[i].width)) remove = true;
			// health
			if (enemies[i].health <= 0) remove = true;
			// actually remove
			if (remove) {
				stage.removeChild(enemies[i]);
				enemies.splice(i, 1);
			}
		}

		// Update enemies bullet & check collision
		for (var i=enemyBullets.length-1; i>=0; i--) {
			var remove = false;
			// Area Time manipulation applied to bullets
			if (player.aoeContains(enemyBullets[i].position)) enemyBullets[i].update( moddedTimeEnhanced );
			else enemyBullets[i].update( moddedTime );
			// Hit Detection with player
			// [Hack] Hard coded solution to provide a feel-good collision with player
			if (
				( Math.abs(enemyBullets[i].position.x - player.position.x) < (enemyBullets[i].width + player.width * 0.2) / 2 ) &&
				( Math.abs(enemyBullets[i].position.y - (player.position.y - player.height/2 )) < (enemyBullets[i].height + player.height * 0.8) / 2 )
						) {
				remove = true;
				if(heart.currentFrame == 0){
					heart.gotoAndStop(1);
				}else if(heart.currentFrame == 1){
					heart.gotoAndStop(2);
				}else if(heart.currentFrame == 2){
					// Lose. Reset.
					heart.gotoAndStop(0);
					level.reset();
					score = 0;
				}
			}
			// remove if out of bound
			if (enemyBullets[i].isOutOfBound(30)) {
				remove = true;
			}

			if (remove) {
				stage.removeChild(enemyBullets[i]);
				enemyBullets.splice(i, 1);
			}

		}

		//parallax
		far.update(moddedTime);
		mid.update(moddedTime);
		if (door != null) {
			door.update(moddedTime);
			if (door.position.x < -CONST.gameWidth) {
				stage.removeChild(door);
				door = null;
			}
		}

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
