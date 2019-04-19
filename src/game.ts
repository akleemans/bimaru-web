/* tslint:disable-next-line:no-reference */
/// <reference path="./phaser.d.ts"/>

import 'phaser';
import {ChooseLevelScene} from './scenes/choose-level.scene';
import {LevelScene} from './scenes/level.scene';
import {MainScene} from './scenes/main.scene';

// main game configuration
const config: GameConfig = {
    width: 600, // 512
    height: 384,
    type: Phaser.WEBGL, // CANVAS | WEBGL
    backgroundColor: '#fff',
    parent: 'game',
    scene: [
        MainScene,
        ChooseLevelScene,
        LevelScene,
    ],
};

export class Game extends Phaser.Game {
    constructor(conf: GameConfig) {
        super(conf);
    }
}

// when the page is loaded, create our game instance
window.onload = () => {
    const game = new Game(config);
};
