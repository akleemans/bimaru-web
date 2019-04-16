import {Level, LevelService} from "../level.service";
import {Cell, CellState} from "../objects/Cell";
import {NumberCell} from "../objects/NumberCell";

export class Coords {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class LevelScene extends Phaser.Scene {
    gridSize = 32;
    private offset = new Coords(16, 16);

    private level: Level;
    private levelState: Cell[][] = [];
    private finished: boolean;
    private colNumbers: NumberCell[] = [];
    private rowNumbers: NumberCell[] = [];

    private dialogShown: boolean;
    private dialogButton: Phaser.GameObjects.Sprite;
    private dialogButtonText: Phaser.GameObjects.BitmapText;

    constructor() {
        super({
            key: "LevelScene"
        });
    }

    preload(): void {
    }

    create(data): void {
        this.finished = false;
        this.dialogShown = false;
        console.log('fetching level for diff=', data.difficulty, 'level:', data.level);
        this.level = LevelService.getLevelData(data.difficulty, data.level);
        console.log('level create(), data:', data, 'level:', this.level);

        // grid lines
        for (let i = 0; i < this.level.size + 1; i++) {
            const lineStyle = {width: 0.5, color: 0x000000, alpha: 1.0};
            // vertical
            let x = this.offset.x + i * this.gridSize;
            let y = this.offset.y;
            let yEnd = this.offset.y + this.level.size * this.gridSize;
            let graphics = this.add.graphics({lineStyle, x: 0, y: 0})
                .strokeLineShape(new Phaser.Geom.Line(x, y, x, yEnd));

            // horizontal
            x = this.offset.x;
            y = this.offset.y + i * this.gridSize;
            let xEnd = this.offset.x + this.level.size * this.gridSize;
            this.add.graphics({lineStyle, x: 0, y: 0})
                .strokeLineShape(new Phaser.Geom.Line(x, y, xEnd, y));
        }

        // initialize grid
        for (let i = 0; i < this.level.size; i++) {
            this.levelState.push([]);
            for (let j = 0; j < this.level.size; j++) {

                let c = this.level.baseGrid[i][j];
                let x = this.offset.x + (j + 0.5) * this.gridSize;
                let y = this.offset.y + (i + 0.5) * this.gridSize;
                const state = Cell.getCellState(c);
                const fixed = (state !== CellState.EMPTY);
                const cell = new Cell(this, j, i, x, y, state, fixed, this.level.size);
                this.levelState[i].push(cell);
            }
        }

        // initialize grid numbers
        // initialize grid
        for (let i = 0; i < this.level.size; i++) {
            // vertical
            let c = this.level.baseGrid[this.level.size][i];
            let x = this.offset.x + (i + 0.5) * this.gridSize;
            let y = this.offset.y + (this.level.size + 0.5) * this.gridSize;
            let num = new NumberCell(this, x, y, Number.parseInt(c), this.level.size);
            this.colNumbers.push(num);

            // horizontal
            c = this.level.baseGrid[i][this.level.size];
            x = this.offset.x + (this.level.size + 0.5) * this.gridSize;
            y = this.offset.y + (i + 0.5) * this.gridSize;
            num = new NumberCell(this, x, y, Number.parseInt(c), this.level.size);
            this.rowNumbers.push(num);
        }

        // update number colours & ship overview
        this.updateLevel(0, 0);

        // TODO add reset button
        // TODO add ship overview
        // TODO add tint to numbers, according to line state
        // TODO add "win" detection

        /*
        this.backgroundGroup = this.physics.add.group();

        // HUD
        this.dialogButton = this.add.sprite(460, 40, 'dialog-button');
        this.dialogButton.setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.showDialog();
            });
        this.dialogButtonText = this.add.bitmapText(460, 40, 'comic-font', 'pause', 18).setOrigin(0.5, 0.5);
        */
    }

    public updateLevel(x: number, y: number): void {
        this.updateSurroundings(x, y);
        this.updateNumberTints();
        this.updateShipOverviewStatus();

        // check for winning
        if (this.finished || this.isLevelFinished()) {
            console.log('level solved!');
            if (!this.finished) {
                this.finish();
            }
            return;
        }
    }

    private updateNumberTints() {
        // horizontal
        for (let i = 0; i < this.level.size; i++) {
            let shipCountX = 0, shipCountY = 0;
            for (let j = 0; j < this.level.size; j++) {
                if (Cell.isShip(this.levelState[i][j].state)) {
                    shipCountX += 1
                }
                if (Cell.isShip(this.levelState[j][i].state)) {
                    shipCountY += 1
                }
            }
            // TODO
            this.rowNumbers[i].updateColor(shipCountX);
            this.colNumbers[i].updateColor(shipCountY);
        }


        // vertical
    }

    private updateShipOverviewStatus() {
        // TODO
    }

    private updateSurroundings(x: number, y: number) {
        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                const state = this.getCellState(i, j);
                // console.log('checking surroundings for i, j = ', i, j, 'state:', state);
                if (state !== CellState.EMPTY && state !== CellState.WATER) {
                    // definitely some kind of ship, let's see which kind
                    const cell = this.levelState[i][j];
                    cell.setState(this.getShipState(i, j));
                }
            }
        }
    }

    private getCellState(i: number, j: number) {
        if (i < 0 || j < 0 || i >= this.level.size || j >= this.level.size) {
            return CellState.WATER;
        } else {
            return this.levelState[i][j].state;
        }
    }

    private getShipState(i: number, j: number): CellState {
        let newState: CellState = CellState.GENERAL;
        // single
        if (this.getCellState(i + 1, j) === CellState.WATER && this.getCellState(i - 1, j) === CellState.WATER && this.getCellState(i, j + 1) === CellState.WATER && this.getCellState(i, j - 1) === CellState.WATER) {
            newState = CellState.SINGLE;
        }
        // block in between two other ships
        else if (Cell.isShip(this.getCellState(i - 1, j)) && Cell.isShip(this.getCellState(i + 1, j)) ||
            Cell.isShip(this.getCellState(i, j - 1)) && Cell.isShip(this.getCellState(i, j + 1))) {
            newState = CellState.BLOCK;
        }
        // up, down, left, right
        else if (
            Cell.isShip(this.getCellState(i, j - 1)) && this.getCellState(i, j + 1) === CellState.WATER) {
            newState = CellState.LEFT;
        } else if (Cell.isShip(this.getCellState(i, j + 1)) && this.getCellState(i, j - 1) === CellState.WATER) {
            newState = CellState.RIGHT;
        } else if (Cell.isShip(this.getCellState(i - 1, j)) && this.getCellState(i + 1, j) === CellState.WATER) {
            newState = CellState.UP;
        } else if (Cell.isShip(this.getCellState(i + 1, j)) && this.getCellState(i - 1, j) === CellState.WATER) {
            newState = CellState.DOWN;
        }
        // console.log('calculated new ship form:', newState);
        return newState;
    }

    update(time: number, delta: number): void {
    }


    isLevelFinished(): boolean {
        // TODO
        let solved = true;
        for (let i = 0; i < this.level.size; i++) {
            for (let j = 0; j < this.level.size; j++) {
                if (this.levelState[i][j].getStateChar() !== this.level.solutionGrid[i][j]) {
                    solved = false;
                    break;
                }
            }
            if (!solved) {
                break;
            }
        }
        return solved;
    }

    /*
        showDialog() {
            this.dialogShown = true;
            this.dialogButton.setVisible(false);
            this.dialogButtonText.setVisible(false);

            let dialogGroup = this.add.group();
            dialogGroup.add(this.add.image(256, 192, 'dialog'));

            let headerText = this.finished ? 'you won!' : 'pause';
            dialogGroup.add(this.add.bitmapText(256, 140, 'comic-font', headerText, 34).setOrigin(0.5, 0.5));

            let levelText = "Level: " + LevelScene.getSetLevel(this.levelNr);
            let movesText = "Number of moves: " + this.player.getMoves();
            dialogGroup.add(this.add.bitmapText(60, 190, 'comic-font', levelText, 20).setOrigin(0, 0.5));
            dialogGroup.add(this.add.bitmapText(60, 220, 'comic-font', movesText, 20).setOrigin(0, 0.5));

            // actions ----------

            // cancel
            let cancelButton = this.add.sprite(460, 100, 'dialog-button-empty');
            cancelButton.setOrigin(0.5, 0.5).setInteractive()
                .on('pointerdown', () => {
                    this.dialogShown = false;
                    dialogGroup.destroy(true);
                    this.dialogButton.setVisible(true);
                    this.dialogButtonText.setVisible(true);
                });
            dialogGroup.add(cancelButton);

            // menu
            dialogGroup.add(this.add.bitmapText(90, 280, 'comic-font', "menu", 20).setOrigin(0.5, 0.5));
            let menuButton = this.add.sprite(90, 280, 'dialog-button-empty');
            menuButton.setOrigin(0.5, 0.5).setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('MainScene');
                });
            dialogGroup.add(menuButton);

            // replay
            dialogGroup.add(this.add.bitmapText(195, 280, 'comic-font', "retry", 20).setOrigin(0.5, 0.5));
            let replayButton = this.add.sprite(195, 280, 'dialog-button-empty');
            replayButton.setOrigin(0.5, 0.5).setInteractive()
                .on('pointerdown', () => {
                    this.scene.restart({level: this.levelNr});
                });
            dialogGroup.add(replayButton);

            // prev
            dialogGroup.add(this.add.bitmapText(300, 280, 'comic-font', "prev", 20).setOrigin(0.5, 0.5));
            let previousButton = this.add.sprite(300, 280, 'dialog-button-empty');
            previousButton.setOrigin(0.5, 0.5).setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('LevelScene', {level: Math.max(1, this.levelNr - 1)});
                });
            dialogGroup.add(previousButton);

            // next
            dialogGroup.add(this.add.bitmapText(405, 280, 'comic-font', "next", 20).setOrigin(0.5, 0.5));
            let nextButton = this.add.sprite(405, 280, 'dialog-button-empty');
            nextButton.setOrigin(0.5, 0.5).setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('LevelScene', {level: Math.min(96, this.levelNr + 1)});
                });
            dialogGroup.add(nextButton);
        }
        */

    finish() {
        console.log('finish()');
        this.finished = true;
        // this.showDialog();
    }
}
