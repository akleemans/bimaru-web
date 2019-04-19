/// <reference path="./phaser.d.ts"/>

import "phaser";
import {MainScene} from "./scenes/main.scene";
import {LevelScene} from "./scenes/level.scene";
import {ChooseLevelScene} from "./scenes/choose-level.scene";

// main game configuration
const config: GameConfig = {
    width: 600, // 512
    height: 384,
    type: Phaser.WEBGL, // CANVAS | WEBGL
    backgroundColor: '#fff',
    parent: "game",
    scene: [
        MainScene,
        ChooseLevelScene,
        LevelScene
    ]
};

// game class
export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.onload = () => {
    new Game(config);
};
