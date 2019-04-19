import {LevelScene} from "./level.scene";
import {MainScene} from "./main.scene";
import {LevelService} from "../level.service";

export class ChooseLevelScene extends Phaser.Scene {

    constructor() {
        super({
            key: "ChooseLevelScene"
        });
    }

    preload(): void {
    }

    create(data): void {
        // bg
        this.add.image(0, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(256, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(512, 0, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(0, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(256, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);
        this.add.image(512, 256, 'bg').setOrigin(0, 0).setAlpha(0.3);

        // level numbers
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 6; j++) {
                const nr = i * 6 + j + 1;

                let tint;
                if (nr <= LevelService.getMaxAvailableLevel(data.difficulty)) {
                    console.log(nr, 'would be available!');
                    let sprite;
                    if (LevelService.getSolvedLevels(data.difficulty).indexOf(nr) !== -1) {
                        sprite = this.add.sprite(j * 50 + 100, i * 50 + 100, 'rectangle_green').setOrigin(0.5, 0.5).setInteractive();
                    } else {
                        sprite = this.add.sprite(j * 50 + 100, i * 50 + 100, 'rectangle').setOrigin(0.5, 0.5).setInteractive();
                    }
                    sprite.on('pointerdown', () => {
                        this.scene.start('LevelScene', {difficulty: data.difficulty, level: nr});
                    });
                    tint = 0x0;
                } else {
                    this.add.sprite(j * 50 + 100, i * 50 + 100, 'rectangle').setOrigin(0.5, 0.5).setInteractive();
                    console.log(nr, 'would NOT be av.!');
                    tint = 0x999999;
                }
                this.add.text(j * 50 + 100, i * 50 + 100, nr.toString(), {font: '24px'}).setOrigin(0.5, 0.5).setTint(tint);
            }
        }

        // back button
        this.add.text(40, 50, '⇐', {font: '32px'}).setOrigin(0.5, 0.5).setTint(0x0).setInteractive().on('pointerdown', () => {
            this.scene.start('MainScene');
        });
    }

    update(time, delta): void {
    }
}
