import {LevelScene} from "./level.scene";

export class ChooseLevelScene extends Phaser.Scene {

    constructor() {
        super({
            key: "ChooseLevelScene"
        });
    }

    preload(): void {
    }

    create(data): void {
        // this.add.image(0, 0, 'intro').setOrigin(0, 0);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 6; j++) {
                const nr = i * 6 + j+1;


                this.add.sprite(j * 50+100, i * 50+100, 'clear').setOrigin(0.5, 0.5).setInteractive().on('pointerdown', () => {
                    this.scene.start('LevelScene', {difficulty: data.difficulty, level: nr});
                });
                this.add.text(j * 50+90, i * 50+100, nr.toString(), {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0);
            }
        }

        /*
                this.add.text(20, 20, '1', {font: '20px'}).setTint(0x0);
                var text2 = this.add.text(40, 20, '2').setTint(0xff0000);
                var text3 = this.add.text(60, 20, '3').setTint(0x0000ff);
        */
        // var text2 = this.add.text(100, 200, '3 Phaser Text with Tint', { font: '64px Arial' });
        // text2.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        /*
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 6; j++) {
                let x = 40 + j * 85;
                let y = 50 + i * 75;
                let n = i * 6 + j + 1;
                let buttonStart = this.add.sprite(x, y, 'dialog-button-menu-square').setInteractive();
                buttonStart.on('pointerdown', () => {
                    this.scene.start('LevelScene', {level: n + data.startLevel});
                });
                this.add.bitmapText(x, y, 'comic-font', n.toString(), 32).setOrigin(0.5, 0.5);
            }
        }
        */

        /*
        this.add.sprite(50, 340, 'square-clear').setOrigin(0.5, 0.5).setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainScene');
            });
        this.add.bitmapText(50, 340, 'comic-font', '<', 32).setOrigin(0.5, 0.5);
        */
    }

    update(time, delta): void {
    }
}
