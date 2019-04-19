import {Level, LevelService} from "../level.service";
import {Cell, CellState} from "../objects/Cell";
import {NumberCell} from "../objects/NumberCell";
import Sprite = Phaser.GameObjects.Sprite;

export class Coords {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class LevelScene extends Phaser.Scene {
    private gridSize = 32;
    private offset = new Coords(16 + 35, 16);
    private level: Level;
    private levelState: Cell[][];
    // private finished: boolean;
    private colNumbers: NumberCell[];
    private rowNumbers: NumberCell[];
    private overviewShips: Sprite[][][];

    private dialogShown: boolean;
    private dialogButton: Phaser.GameObjects.Sprite;
    private dialogButtonText: Phaser.GameObjects.BitmapText;

    public constructor() {
        super({
            key: "LevelScene"
        });
    }

    public preload(): void {
    }

    public create(data): void {
        // init
        this.colNumbers = [];
        this.rowNumbers = [];
        this.levelState = [];
        this.overviewShips = [];
        // this.finished = false;
        this.dialogShown = false;
        console.log('fetching level for diff=', data.difficulty, 'level:', data.level);
        this.level = LevelService.getLevelData(data.difficulty, data.level);
        console.log('level create(), data:', data, 'level:', this.level);

        // buttons
        this.add.text(25, 30, '⇐', {font: '26px'}).setOrigin(0.5, 0.5).setTint(0x0).setInteractive().on('pointerdown', () => {
            if (!this.dialogShown) {
                this.showBackDialog();
            }
        });
        this.add.text(25, 60, '⤾', {font: '26px'}).setOrigin(0.5, 0.5).setTint(0x0).setInteractive().on('pointerdown', () => {
            if (!this.dialogShown) {
                this.showRestartDialog();
            }
        });

        // ship overview
        this.drawOverview();

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
    }

    private drawOverview() {
        // 1
        this.overviewShips.push([
            [this.add.sprite(485, 120, 'single').setScale(0.25, 0.25).setAlpha(0.15)],
            [this.add.sprite(515, 120, 'single').setScale(0.25, 0.25).setAlpha(0.15)],
            [this.add.sprite(545, 120, 'single').setScale(0.25, 0.25).setAlpha(0.15)],
            [this.add.sprite(575, 120, 'single').setScale(0.25, 0.25).setAlpha(0.15)],
        ]);

        // 2
        const twoShip1: Sprite[] = [];
        twoShip1.push(this.add.sprite(438, 90, 'right').setScale(0.25, 0.25).setAlpha(0.15));
        twoShip1.push(this.add.sprite(464, 90, 'left').setScale(0.25, 0.25).setAlpha(0.15));

        const twoShip2: Sprite[] = [];
        twoShip2.push(this.add.sprite(494, 90, 'right').setScale(0.25, 0.25).setAlpha(0.7));
        twoShip2.push(this.add.sprite(520, 90, 'left').setScale(0.25, 0.25).setAlpha(0.7));

        const twoShip3: Sprite[] = [];
        twoShip3.push(this.add.sprite(550, 90, 'right').setScale(0.25, 0.25).setAlpha(0.7));
        twoShip3.push(this.add.sprite(576, 90, 'left').setScale(0.25, 0.25).setAlpha(0.7));
        this.overviewShips.push([twoShip1, twoShip2, twoShip3]);

        // 3
        const threeShip1: Sprite[] = [];
        threeShip1.push(this.add.sprite(438, 60, 'right').setScale(0.25, 0.25).setAlpha(0.15));
        threeShip1.push(this.add.sprite(464, 60, 'block').setScale(0.25, 0.25).setAlpha(0.15));
        threeShip1.push(this.add.sprite(490, 60, 'left').setScale(0.25, 0.25).setAlpha(0.15));

        const threeShip2: Sprite[] = [];
        threeShip2.push(this.add.sprite(524, 60, 'right').setScale(0.25, 0.25).setAlpha(0.7));
        threeShip2.push(this.add.sprite(550, 60, 'block').setScale(0.25, 0.25).setAlpha(0.7));
        threeShip2.push(this.add.sprite(576, 60, 'left').setScale(0.25, 0.25).setAlpha(0.7));
        this.overviewShips.push([threeShip1, threeShip2]);

        // 4
        const fourShip: Sprite[] = [];
        fourShip.push(this.add.sprite(498, 30, 'right').setScale(0.25, 0.25).setAlpha(0.7));
        fourShip.push(this.add.sprite(524, 30, 'block').setScale(0.25, 0.25).setAlpha(0.7));
        fourShip.push(this.add.sprite(550, 30, 'block').setScale(0.25, 0.25).setAlpha(0.7));
        fourShip.push(this.add.sprite(576, 30, 'left').setScale(0.25, 0.25).setAlpha(0.7));
        this.overviewShips.push([fourShip]);
    }

    public isDialogShown(): boolean {
        return this.dialogShown;
    }

    public updateLevel(x: number, y: number): void {
        this.updateSurroundings(x, y);
        this.updateNumberTints();
        this.updateShipOverviewStatus();

        // check for winning
        if (this.isLevelFinished()) {
            // this.finished = true;
            LevelService.addSolvedLevel(this.level.difficulty, this.level.nr);
            this.showWinDialog();
        }
        /*
        if (this.finished || this.isLevelFinished()) {
            console.log('level solved!');
            if (!this.finished) {
                this.finish();
            }
            return;
        }*/
    }

    private updateNumberTints() {
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
            this.rowNumbers[i].updateColor(shipCountX);
            this.colNumbers[i].updateColor(shipCountY);
        }
    }

    private updateShipOverviewStatus() {
        const counts = [0, 0, 0, 0];
        for (let i = 0; i < this.level.size; i++) {
            for (let j = 0; j < this.level.size; j++) {
                const cellState = this.getCellState(i, j);
                // singles
                if (cellState === CellState.SINGLE) {
                    counts[0] += 1;
                }

                // 2-ships
                if (cellState === CellState.RIGHT && this.getCellState(i, j + 1) == CellState.LEFT ||
                    cellState === CellState.DOWN && this.getCellState(i + 1, j) == CellState.UP) {
                    counts[1] += 1;
                }

                // 3-ships
                if (cellState === CellState.RIGHT && this.getCellState(i, j + 1) == CellState.BLOCK && this.getCellState(i, j + 2) == CellState.LEFT ||
                    cellState === CellState.DOWN && this.getCellState(i, j + 1) == CellState.BLOCK && this.getCellState(i + 2, j) == CellState.UP) {
                    counts[2] += 1;
                }

                // 4-ships
                if (cellState === CellState.RIGHT && this.getCellState(i, j + 1) == CellState.BLOCK && this.getCellState(i, j + 2) == CellState.BLOCK && this.getCellState(i, j + 3) == CellState.LEFT ||
                    cellState === CellState.DOWN && this.getCellState(i, j + 1) == CellState.BLOCK && this.getCellState(i, j + 2) == CellState.BLOCK && this.getCellState(i + 3, j) == CellState.UP) {
                    counts[3] += 1;
                }

            }
        }

        // singles
        for (let i = 0; i < 4; i++) {
            let colorCount = 0;
            this.overviewShips[i].forEach((cells) => {
                if (colorCount <= counts[i]) {
                    this.drawDark(cells);
                    colorCount += 1;
                } else {
                    this.drawLight(cells);
                }
            });
        }
    }

    private drawDark = (cells: Sprite[]) => {
        cells.forEach(cell => {
            cell.setAlpha(0.7);
        });
    };

    private drawLight = (cells: Sprite[]) => {
        cells.forEach(cell => {
            cell.setAlpha(0.15);
        });
    };

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

    public showRestartDialog(): void {
        this.dialogShown = true;
        let dialogGroup = this.add.group();
        dialogGroup.add(this.add.image(300, 192, 'dialog').setScale(1.5, 1.5));

        let yesButton = this.add.sprite(220, 230, 'dialog');
        yesButton.setOrigin(0.5, 0.5).setScale(0.4, 0.4).setInteractive().on('pointerdown', () => {
            this.scene.start('LevelScene', {difficulty: this.level.difficulty, level: this.level.nr});
        });
        dialogGroup.add(this.add.text(220, 230, 'Yes', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(yesButton);

        let noButton = this.add.sprite(380, 230, 'dialog');
        noButton.setOrigin(0.5, 0.5).setScale(0.4, 0.4).setInteractive().on('pointerdown', () => {
            this.dialogShown = false;
            dialogGroup.destroy(true);
        });
        dialogGroup.add(this.add.text(380, 230, 'No', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(noButton);

        dialogGroup.add(this.add.text(300, 150, 'Do you really', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(this.add.text(300, 180, 'want to restart?', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
    }

    public showWinDialog(): void {
        this.dialogShown = true;
        let dialogGroup = this.add.group();
        dialogGroup.add(this.add.image(300, 192, 'dialog').setScale(1.5, 1.5));

        let okButton = this.add.sprite(300, 230, 'dialog');
        okButton.setOrigin(0.5, 0.5).setScale(0.4, 0.4).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: this.level.difficulty});
        });
        dialogGroup.add(this.add.text(300, 230, 'OK', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(okButton);
        dialogGroup.add(this.add.text(300, 165, 'Congratulations, you won!', {font: '22px'}).setOrigin(0.5, 0.5).setTint(0x0));
    }

    public showBackDialog(): void {
        this.dialogShown = true;
        let dialogGroup = this.add.group();
        dialogGroup.add(this.add.image(300, 192, 'dialog').setScale(1.5, 1.5));

        let yesButton = this.add.sprite(220, 230, 'dialog');
        yesButton.setOrigin(0.5, 0.5).setScale(0.4, 0.4).setInteractive().on('pointerdown', () => {
            this.scene.start('ChooseLevelScene', {difficulty: this.level.difficulty});
        });
        dialogGroup.add(this.add.text(220, 230, 'Yes', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(yesButton);

        let noButton = this.add.sprite(380, 230, 'dialog');
        noButton.setOrigin(0.5, 0.5).setScale(0.4, 0.4).setInteractive().on('pointerdown', () => {
            this.dialogShown = false;
            dialogGroup.destroy(true);
        });
        dialogGroup.add(this.add.text(380, 230, 'No', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(noButton);

        dialogGroup.add(this.add.text(300, 150, 'Do you really want', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
        dialogGroup.add(this.add.text(300, 180, 'to quit this level?', {font: '24px'}).setOrigin(0.5, 0.5).setTint(0x0));
    }
}
