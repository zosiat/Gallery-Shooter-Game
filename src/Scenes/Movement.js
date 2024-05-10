
class Movement extends Phaser.Scene {
 
    constructor(){

        super("sceneName");
        
        this.my = {sprite: {}};

        //Create constants for the character location
        this.bodyX = 300;
        this.bodyY = 350;

        this.myScore = 0;  
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
        my.sprite.enemy = this.add.sprite(this.bodyX, this.bodyY, "bunnySprites", "flyMan_fly.png");
        my.sprite.enemy.setScale(0.5);
        my.sprite.enemy.scorePoints = 1;

        //projectile array
        this.projectiles = [];

        //adding score
        //my.text.score = this.add.bitmapText(580, 0, "HeartFont", "Score " + this.myScore);

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

        //shooting projectiles
        if (this.spaceKey.isDown) {
            let projectile = this.add.sprite(my.sprite.character.x, my.sprite.character.y - 50, "bunnySprites", "carrot.png");
            //rotating carrots
            projectile.setRotation(Phaser.Math.DegToRad(225));
            projectile.setScale(0.75);
            
            //adding projectiles
            this.projectiles.push(projectile);
        }
    
        //deleting off screen projectiles
        this.projectiles = this.projectiles.filter((projectile) => {
            if (projectile.y < 0 || projectile.y > game.config.height || !projectile.active) {
                projectile.destroy();
                return false;
            }
            return true;
        });
    
        //collision check
        this.projectiles.forEach((projectile) => {
            if (my.sprite.enemy && my.sprite.enemy.active && this.collides(projectile, my.sprite.enemy)) {
                console.log("Collision detected!");
                //destroying projectile and enemy after collision
                projectile.destroy();
                my.sprite.enemy.destroy();
                
                //core update
                this.myScore += 1;
                this.scoreText.setText("Score: " + this.myScore);
                
            } else {
                //moving projectile
                projectile.y -= 5;
            }
        });
    }
}