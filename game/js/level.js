/*
handles level progression & enemy spawning
*/
function Level(){
  this.timer = 0;
  this.enemySpawnTimer = 0;
  this.current = 1;
  this.spawnInterval = 3000;
  this.canSpawn = false;
};

Level.prototype.update = function(pDt) {
  this.timer += pDt;
  if (this.timer < CONST.lvlDur_1) {
    this.current = 1;
    this.spawnInterval = 3000;
  } else if (this.timer < CONST.lvlDur_1 + CONST.lvlDur_2) {
    this.current = 2;
    this.spawnInterval = 2500;
  } else if (this.timer < CONST.lvlDur_1 + CONST.lvlDur_2 + CONST.lvlDur_3) {
    this.current = 3;
    this.spawnInterval = 1500;
  }

  if (!this.canSpawn) this.enemySpawnTimer += pDt;
  if (this.enemySpawnTimer > this.spawnInterval) {
    this.canSpawn = true;
    this.enemySpawnTimer = 0;
  }
};

Level.prototype.reset = function() {
  this.timer = 0;
  this.enemySpawnTimer = 0;
};
