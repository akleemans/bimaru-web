import {Difficulty} from "../level.service";

export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload(): void {
        // https://www.kleemans.ch/static/bimaru-web/
        let assetPath = 'assets/';

        // ui
        this.load.image('bg', assetPath + 'img/bg/bg.jpg');
        this.load.image('bimaru', assetPath + 'img/ui/bimaru.png');
        this.load.image('easy', assetPath + 'img/ui/easy.png');
        this.load.image('medium', assetPath + 'img/ui/medium.png');
        this.load.image('hard', assetPath + 'img/ui/hard.png');
        this.load.image('clear', assetPath + 'img/ui/clear.png');

        // grid parts
        this.load.image('empty', assetPath + 'img/grid/empty.png');
        this.load.image('water', assetPath + 'img/grid/water.png');
        this.load.image('general', assetPath + 'img/grid/general.png');
        this.load.image('block', assetPath + 'img/grid/block.png');
        this.load.image('down', assetPath + 'img/grid/down.png');
        this.load.image('left', assetPath + 'img/grid/left.png');
        this.load.image('right', assetPath + 'img/grid/right.png');
        this.load.image('single', assetPath + 'img/grid/single.png');
        this.load.image('up', assetPath + 'img/grid/up.png');

        // numbers
        this.load.image('num0', assetPath + 'img/numbers/num0.png');
        this.load.image('num1', assetPath + 'img/numbers/num1.png');
        this.load.image('num2', assetPath + 'img/numbers/num2.png');
        this.load.image('num3', assetPath + 'img/numbers/num3.png');
        this.load.image('num4', assetPath + 'img/numbers/num4.png');
        this.load.image('num5', assetPath + 'img/numbers/num5.png');
        this.load.image('num6', assetPath + 'img/numbers/num6.png');
        this.load.image('num7', assetPath + 'img/numbers/num7.png');
        this.load.image('num8', assetPath + 'img/numbers/num8.png');

        // font
        // this.load.bitmapFont('comic-font', assetPath + 'font/comic-queens.png', assetPath + 'font/comic-queens.fnt');

        // UI
        /*
        this.load.image('intro', assetPath + 'img/ui/intro.png');
        this.load.image('button-clear', assetPath + 'img/ui/button-clear.png');
        this.load.image('square-clear', assetPath + 'img/ui/square-clear.png');
        this.load.image('dialog', assetPath + 'img/ui/dialog.png');
        this.load.image('dialog-button', assetPath + 'img/ui/dialog-button.png');
        this.load.image('dialog-button-menu', assetPath + 'img/ui/dialog-button-menu.png');
        this.load.image('dialog-button-empty', assetPath + 'img/ui/dialog-button-empty.png');
        this.load.image('dialog-button-menu-square', assetPath + 'img/ui/dialog-button-menu-square.png');

        // font
        */
    }

    create(): void {
        // bg
        this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.add.image(256, 0, 'bg').setOrigin(0, 0);
        this.add.image(0, 256, 'bg').setOrigin(0, 0);
        this.add.image(256, 256, 'bg').setOrigin(0, 0);

        this.add.sprite(256, 80, 'bimaru').setScale(0.5);

        this.add.sprite(256, 180, 'easy').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.easy});
        });
        this.add.sprite(256, 260, 'medium').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.medium});
        });
        this.add.sprite(256, 340, 'hard').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.hard});
        });

        /*
        let fontSize = 34;
        this.add.bitmapText(256, 60, 'comic-font', 'sokoban Island', 44).setOrigin(0.5, 0.5);

        this.add.sprite(160, 180, 'dialog-button-menu').setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {startLevel: 0});
        });
        this.add.bitmapText(160, 180, 'comic-font', 'set 1', fontSize).setOrigin(0.5, 0.5);
        */
    }

    update(time, delta): void {
    }
}
