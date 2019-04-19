import {Difficulty} from '../model/difficulty';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
        });
    }

    public preload(): void {
        // https://www.kleemans.ch/static/bimaru-web/
        const assetPath = 'assets/';

        // ui
        this.load.image('bg', assetPath + 'img/ui/bg.jpg');
        this.load.image('bimaru', assetPath + 'img/ui/bimaru.png');
        this.load.image('easy', assetPath + 'img/ui/easy.png');
        this.load.image('medium', assetPath + 'img/ui/medium.png');
        this.load.image('hard', assetPath + 'img/ui/hard.png');
        this.load.image('rectangle', assetPath + 'img/ui/rectangle.png');
        this.load.image('rectangle_green', assetPath + 'img/ui/rectangle_green.png');
        this.load.image('dialog', assetPath + 'img/ui/dialog.png');

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
    }

    public create(): void {
        // bg
        this.add.image(0, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(256, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(512, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(0, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(256, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(512, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);

        this.add.sprite(300, 80, 'bimaru').setScale(0.5);

        this.add.sprite(300, 180, 'easy').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.easy});
        });
        this.add.sprite(300, 260, 'medium').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.medium});
        });
        this.add.sprite(300, 340, 'hard').setScale(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: Difficulty.hard});
        });
    }
}
