
class Movement extends Phaser.Scene {
 
    constructor(){

        super("pathMaker");
        
        this.my = {sprite: {}};

        //constants for the character location
        this.bodyX = 300;
        this.bodyY = 350;

        this.myScore = 0;  

        //projectile array
        this.projectiles = [];

        //enemy array
        this.enemies = [];

        //bullet timings 
        this.fireDelay = 200;
        this.lastFired = 0;


    }

    preload() {

        this.load.setPath("./assets/");
        
        //loading assets
        this.load.image("background", "backgroundColorDesert.png");
        this.load.atlasXML("bunnySprites", "spritesheet_jumper.png", "spritesheet_jumper.xml");
        //this.load.bitmapFont('HeartFont',"HeartFont_0.png","HeartFont_1.png","HeartFont.fnt");
    }

    collides(sprite1, sprite2) {
        if (Math.abs(sprite1.x - sprite2.x) > (sprite1.displayWidth / 2 + sprite2.displayWidth / 2)) return false;
        if (Math.abs(sprite1.y - sprite2.y) > (sprite1.displayHeight / 2 + sprite2.displayHeight / 2)) return false;
        return true;
    }

    create() {

        let my = this.my;

        //can't have more than 10 projectiles at one time
        this.maxProjectiles = 10;

        //background image
        this.add.image(500, 290,'background');

        //enemy path coordinates
        this.enemyPath = [
            20, 20,
            100, 50,
            300, 200, 
        ];

        //keys
        this.aKey = this.input.keyboard.addKey('A');
        this.dKey = this.input.keyboard.addKey('D');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escKey = this.input.keyboard.addKey('ESC');
        this.sKey = this.input.keyboard.addKey('S');

        //character
        my.sprite.character = this.add.sprite(this.bodyX + 100, this.bodyY + 350, "bunnySprites", "bunny1_ready.png");
        my.sprite.character.setScale(0.75);

        //enemies
       // my.sprite.enemy = this.add.sprite(this.bodyX, this.bodyY, "bunnySprites", "flyMan_fly.png");
        //my.sprite.enemy.setScale(0.5);
        //my.sprite.enemy.visible = false;
        //my.sprite.enemy.scorePoints = 1;

        //score text
        this.scoreText = this.add.text(game.config.width - 120, 5, "Score: " + this.myScore, {
            fontFamily: 'Times, serif',
            fontSize: 30,
        });
    }

    update() {
        let my = this.my;

        //move left (while staying in bounds)
        if (this.aKey.isDown) {
            if (my.sprite.character.x > (my.sprite.character.displayWidth/2)) {
                my.sprite.character.x -= 5;
            }
        }

        //move right (while staying in bounds)
        if (this.dKey.isDown) {
            if (my.sprite.character.x < game.config.width - (my.sprite.character.displayWidth/2)) {
                my.sprite.character.x += 5;
            }
        }

        //s to start (spawn enemies)
        if (this.sKey.isDown && this.enemies.length < 5) {
            this.spawnEnemies(5 - this.enemies.length);
        }

        //shooting projectiles (with a delay!)
        if (this.spaceKey.isDown&& this.time.now - this.lastFired > this.fireDelay) {
            let projectile = this.add.sprite(my.sprite.character.x, my.sprite.character.y - 50, "bunnySprites", "carrot.png");
            //rotating carrots
            projectile.setRotation(Phaser.Math.DegToRad(225));
            projectile.setScale(0.75);
            
            //adding projectiles
            this.projectiles.push(projectile);

            this.lastFired = this.time.now;
        }
    
        //deleting off screen projectiles
        this.projectiles = this.projectiles.filter((projectile) => {
            if (projectile.y < 0 || projectile.y > game.config.height || !projectile.active) {
                projectile.destroy();
                console.log("Projectile destroyed!");
                return false;
            }
            return true;
        });
    
        //collision check
        this.projectiles.forEach((projectile) => {
            this.enemies.forEach((enemy) => {
                if (enemy && enemy.active && this.collides(projectile, enemy)) {
                    console.log("Collision detected!");
                    // Destroying projectile and enemy after collision
                    projectile.destroy();
                    enemy.destroy();
                    
                    // Core update
                    this.myScore += 1;
                    this.scoreText.setText("Score: " + this.myScore);
                }
            });
        
            // Moving projectile
            projectile.y -= 5;
        });
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {

            //creating random start positions
            const x = Phaser.Math.Between(100, 900);
            const y = Phaser.Math.Between(100, 500); 
    
            const enemy = this.add.sprite(x, y, "bunnySprites", "flyMan_fly.png");
            enemy.setScale(0.5);
            this.enemies.push(enemy);
        }
    
    }
}