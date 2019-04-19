import {Difficulty} from './model/difficulty';

export class Level {
    public nr: number;
    public difficulty: number;
    public size: number;
    public baseGrid: string[];
    public puzzleGrid: string[];
    public solutionGrid: string[];

    constructor(nr: number, difficulty: Difficulty, size: number, baseGrid: string[], solutionGrid: string[]) {
        this.nr = nr;
        this.difficulty = difficulty;
        this.size = size;
        this.baseGrid = baseGrid;
        // deep copy for puzzleGrid
        this.puzzleGrid = JSON.parse(JSON.stringify(baseGrid));
        this.solutionGrid = solutionGrid;
    }
}
