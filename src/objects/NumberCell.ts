import {LevelScene} from "../scenes/level.scene";

export class NumberCell extends Phaser.GameObjects.Text {
    private currentScene: LevelScene;
    public num: number;

    constructor(scene: LevelScene, x: number, y: number, num: number, levelSize: number) {
        super(scene, x, y, num.toString(), {font: '24px'});
        this.setOrigin(0.5, 0.5);
        this.setTint(0x0);
        this.num = num;
        this.currentScene = scene;
        this.currentScene.add.existing(this);
    }

    public updateColor(shipCount: number) {
        // console.log('updating color: num:', this.num, 'shipCount:', shipCount);
        this.clearTint();
        if (shipCount < this.num) {
            // incomplete: blue
            this.setTint(0x0000ff);
        } else if (shipCount > this.num) {
            // invalid: red
            this.setTint(0xff0000);
        } else {
            // complete: black
            this.setTint(0x0);
        }
    }
}
