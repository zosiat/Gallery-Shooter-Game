//L11: ☄️ 1-D movement

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    scene: [Movement]
}

// Global variable to hold sprites
var my = {sprite: {}};

const game = new Phaser.Game(config);
