import Sprite = Phaser.GameObjects.Sprite;
import {LevelScene} from '../scenes/level.scene';
import {CellState} from './cell-state';

export class Cell extends Sprite {
    public static isShip(state: CellState) {
        return state !== CellState.EMPTY && state !== CellState.WATER;
    }

    public static getCellState(c: string) {
        if (c === '.') {
            return CellState.EMPTY;
        } else if (c === 'w') {
            return CellState.WATER;
        } else if (c === 's') {
            return CellState.SINGLE;
        } else if (c === 'b') {
            return CellState.BLOCK;
        } else if (c === 'u') {
            return CellState.UP;
        } else if (c === 'd') {
            return CellState.DOWN;
        } else if (c === 'l') {
            return CellState.LEFT;
        } else if (c === 'r') {
            return CellState.RIGHT;
        }
    }

    private currentScene: LevelScene;
    private posX: number;
    private posY: number;
    private fixed: boolean;
    private state: CellState;

    public constructor(scene: LevelScene, posX: number, posY: number, xGrid: number, yGrid: number,
                       state: CellState, fixed: boolean) {
        super(scene, xGrid, yGrid, state);
        this.posX = posX;
        this.posY = posY;
        this.currentScene = scene;
        this.currentScene.add.existing(this);
        this.fixed = fixed;
        this.state = state;
        this.setScale(0.3, 0.3);
        this.setInteractive();
        this.on('pointerdown', this.tap);
    }

    public tap(): void {
        if (this.fixed || this.currentScene.isDialogShown()) {
            return;
        }
        if (this.state === CellState.EMPTY) {
            this.state = CellState.WATER;
        } else if (this.state === CellState.WATER) {
            this.state = CellState.GENERAL;
        } else {
            this.state = CellState.EMPTY;
        }

        this.currentScene.updateLevel(this.posX, this.posY);
        this.setTexture(this.state);
    }

    public setState(newState: CellState) {
        if (!this.fixed) {
            this.state = newState;
            this.setTexture(this.state);
        }
    }

    public getStateChar(): string {
        return this.state.charAt(0);
    }

    public getState(): CellState {
        return this.state;
    }
}
