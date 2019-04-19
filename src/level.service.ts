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

export enum Difficulty {
    easy,
    medium,
    hard
}

export class LevelService {

    public static solvedLevels = {};

    public static init() {
        LevelService.solvedLevels[Difficulty.easy] = [];
        LevelService.solvedLevels[Difficulty.medium] = [];
        LevelService.solvedLevels[Difficulty.hard] = [];
    }

    public static getMaxAvailableLevel(difficulty: Difficulty): number {
        return Math.min(this.solvedLevels[difficulty].length + 3, 32);
    }

    public static getSolvedLevels(difficulty: Difficulty): number[] {
        return this.solvedLevels[difficulty];
    }

    public static addSolvedLevel(difficulty: Difficulty, level: number): void {
        if (this.solvedLevels[difficulty].indexOf(level) === -1) {
            this.solvedLevels[difficulty].push(level);
        }
    }

    public static getLevelData(difficulty: Difficulty, nr: number): Level {
        let offset = difficulty === Difficulty.easy ? 0 : (difficulty === Difficulty.medium ? 32 : 64);
        let rawLevels = [
            '.....................................d.....s.....................b...........u......................31220304051231213250|wwwwwwwwwddwwwwwwwwbuwswwwwwwuwwwwwwwdwwwwwswwwuwwwwwwwdwwwwwwwwwbwdwswwwwwuwuwwrbblwwwwwswwwwwwwwww31220304051231213250',
            '..............................l.........b.......................3151241350132315|wrlwrlwswwwwwwwwwwdwwwwwwwbwwrlwdwuwwwwwbwwwwswsuwwwwwwwwwrbblws3151241350132315',
            '.....................r...s...................................r......................................42422202111130402081|swwwwwwwwwwwwwwwwswwwrlwwswwwwwwwwwwwwwwswrblwwwwwwwwwwwwwwwwrlwwwwwwwwwwwwwwwwwdwrbblwrbluwwwwwwwww42422202111130402081',
            '...................................s..............d.....w........................405012404211124333|wwswwwdwwwwwwwwbwwwwwwwwuwwwwwwwwwwsdwdwwwwwwbwuwwdwwdbwwwwuwwbuwdwwwwwuwwuwswsww405012404211124333',
            '.........s..................................................b...1421341431070414|wwwwrlwswswwwwwwwwwwwwwwrblwrbblwwwwwwwwwrlwwswdwwwwwwwuwswrblww1421341431070414',
            '.......b......................................................................................r.....41513121204350200402|wwdwwwrblwdwbwdwwwwwuwuwuwswswwwwwwwwwwwswswwwwwwwwwwwwwwwwwwwwwwwwwwwrbblwwwwwwwwwwwwwwwwwwwwrlwwww41513121204350200402',
            'w.........................d...........................w.........5040506033321332|wwswdwdwdwwwbwbwuwwwuwbwwwdwwwuwwwuwwwwwdwwwdwswbwswuwwwuwwwwwsw5040506033321332',
            '..w...............................................d.................................................21414040401262251001|wwwwswwwwwwwwwwwdwdwwrbblwbwbwwwwwwwuwuwwwdwdwwwwwdwuwuwswswuwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwswwwwwww21414040401262251001',
            '.........................................r............................................w.............52301133201040207033|swwwwwwwwwwwwwwwwwwwswwwwwrblwwwwwwwwwwwwrlwwwwwwwwwwwwwwwwwrblwwrbblwwwwwwwwwwwdwswswwwwwuwwwwwrlww52301133201040207033',
            '....................................b...........................2023322624141305|wwwdwwwdswwuwswbwwwwwwwbswswdwwuwwwwbwwwwwwwuwrlwwwwwwwwwwrlwrbl2023322624141305',
            '................d............w.............................................r.....314123123413310215|rblwwswwwwwwwwwwdwdwswwwwuwuwwwrlwwwwwswwwwwwwwwwwwwwwwwswwwwwdwwwwwwwwbwwwrbblwu314123123413310215',
            '...............................d...............s....................................................02332302236034320110|wwrbblwwrlwwwwwwwwwwwwwwwwwrblwdwrblwwwwwuwwwwwswswwwswswwwwwwwwwwwwwwwwdwwwwwwwwwuwwwwwwwwwwwwwwwww02332302236034320110',
            '.................................................................................231514121402211307|rlwswswwwwwwwwwwwwwwwdwswwwwswbwwwwwwwwbwwwwwwwwuwwwwwwwwwwrblwwwwwwwwwwrblwrlwrl231514121402211307',
            '....................w.r.........................................3133241331410614|wwwrblwwdwwwwwwwuwswwwrlwwwwswwwwwwwwwwwrbblwdwswwwwwbwwwwrlwuws3133241331410614',
            '................................................b..........................d........................61021402405221214120|dwwrblwdwwbwwwwwwuwwuwwwwswwwwwwwwwwwwdwswwwwwwwbwwwwwwwwwbwrlwswwwwuwwwwwwdwwwwswwwwuwwwwwwwwwwwwww61021402405221214120',
            '................................w.........................l..............d..........................40222212140162332111|wwwwwwwwwwwwwwwwwwwddwwwrbblwbbwwwwwwwwuuwdwswwwwwwwuwwwwrlwswwwwswwwwwwwdwwwwwwwwwuwwwwwwwwwwwwwwws40222212140162332111',
            '...........................w......................................b..............214130261501423032|swswwwrblwwwwwwwwwwwwwwwwdwwrlwdwwbwwwwwuwwbwswswwwwuwwwwwwwwwwwwrblwwwwwwwwwwrlw214130261501423032',
            '....w.w..................................................r..................w....502151321221124215|swswwwwwwwwwwdwswwwwwwbwwwwwwwwbwwwwdwwwuwwwwuwwwwwrblwwwrlwwwwdwwwwwwwwuwswwrblw502151321221124215',
            '................................r.....................................w................b............32231112141002421433|wwwwwwwwwswwwwwwwwwwwwwwwwwwwwwwrlwwwwwwdwwwwswswduwwwwwwwwbwwwwwwwwwuwrbblwwwwwwwwwwwrblwrlwswwwwww32231112141002421433',
            '................................................w......d........5130504215043232|wwwwwwdwrblwswuwwwwwwwwwdwswdwdwbwwwbwuwuwwwbwwwwwswuwwdswwwwwwu5130504215043232',
            '..............................................................................l....d................04030316120201133433|wwwwwwwwwwwwwwwwrlwwwwwwwwwwwwwwwwwwwdwwwwwwwwwbwwwdwwwwwuwswbwswdwwwwwbwwwbwrlwwuwdwuwwwwwwwuwwwsws04030316120201133433',
            '...r...........................................w................1404331422410605|wwwrlwwwwdwwwwwdwuwswswbwwwwwwwuwwwwwwwwrlwrbblwwwwwwwwwwswrblws1404331422410605',
            'w............w..w.............................................r.3223051431522115|wswswswwwwwwwwwdwrblwdwbwwwwwbwuswwwwbwwwwwwwuwwdwwwwwwwuwrlwwrl3223051431522115',
            '........w..............r............................d............................402313124213101615|swwswwwwwwwwwwwwwdwwwwwrlwbwwwwwwwwuwwwwwwwwwwwwwwwwdwdwrbblwuwbwwwwwwwwuwrlwswws402313124213101615',
            's..............................w............b....................................123130505202421162|swswwwwwwwwwwwwwwwwwwwswdwwwrlwwwuwdwwwwswwwbwwwwwwwwuwwwwwwdwwwrbblwbwdwwwwwwuwu123130505202421162',
            '.b....................................b...............................s.............................22214221313003150305|rblwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwrblwwwwdwwwwwwrlwuwswswwwwwwwwwwwswwwrlwwwwwwwwwwwwwwwwwrbblwsw22214221313003150305',
            '...w...................b........................................0705050323413133|wdwwwswwwbwdwwwdwuwuwswbwwwwwwwuwdwswswwwbwwwwwwwbwdwdwwwuwuwuww0705050323413133',
            '......................b.....................................w........w.........................s....42211212142030505221|swwwwwwwwswwwwwwwwwwwrblwwwwwwwwwwwwwwwwrlwwwwwrblwwwwwwwwwwwwswrbblwwdwwwwwwwwduwwwwwwwwuwwwwwswwww42211212142030505221',
            '.........b..............................................s.......3150150523242241|wwwwwswsrblwwwwwwwwwwdwdswdwwbwuwwbwwuwwwwbwwwwdwwuwrlwuswwwwwww3150150523242241',
            '.....r..................................w......................b....................................40221151312201223071|wwwwwrlwwwswwwwwwwswwwwwwwwwwwwwwwwwdwwwwwwwwwbwswswwwwwuwwwwwrblwwwwwwwwwwwwwwwdwrlwwrbbluwwwwwwwww40221151312201223071',
            '................b..r............................................3132150532322251|wwswwswddwwwwwwubwwrlwwwuwwwwwwswwswwdwwwwwwwbwdwrblwbwuwwwwwuww3132150532322251',
            '.....w...................b......................................2405142242411404|rlwdwwwswwwbwdwwwdwuwuwswbwwwwwwwuwwwwwwwwwrbblwwwwwwwwwswwswrlw2405142242411404',
            '...............................................s..............b...........d.........................11412331040512123231|wwwwwwwwwwrbblwdwwwwwwwwwbwwwwwwwwwuwwwswwwwwwwswwwwdwwwwwwdwwbwwwswwuwwuwdwwwwwwwwwuwdwwswwwwwwuwww11412331040512123231',
            '...................d..w...................................................................w.........11305015223232120016|swswwwwdwwwwwwwwwbwdwwwwdwwbwuwwwwbwwuwwwwwwuwwwwwwwswwwwwswwwwwwwwwwwwwwwwwwwwwwwwwdwwwwwwrlwuwrblw11305015223232120016',
            '............................w...................................4042230516152221|wwwwwwwddwrbblwubwwwwwwwuwrlwdwdwwwwwuwbwwswwwwuswwwswwwwwswwwww4042230516152221',
            '..........w...s...........................................s..b......................................23132040500333142121|wwwwwwwwwwwwswswwwdwdwwwwwdwbwuwwwwwbwuwwwwwwwbwwwwdwdwwuwswwbwuwwwwwwwuwwwwwwwwwwwrlwwwwwwwwwwwwwsw23132040500333142121',
            '.............d...........................b......................2315140432223224|dwswwwwsuwwwwdwwwwwdwuwwwwwbwwwswdwbwswwwbwuwwwwwuwwwwwdwwwrblwu2315140432223224',
            '.............................b..................w...............6030160441213423|dwswwswsbwwwwwwwuwwwwdwwwwwwwbwwdwwwwbwduwdwwuwbwwuwwwwuswwwrlww6030160441213423',
            '....................................................s..........................................r....24122220231015141214|wswwwwwwwwwwwwwwwwwwwwwwwwwwdwwwwrbblwuwdwwwwwwwwwuwswswwwwdwwwwwwwwwbwdwwwwwwwuwbwwwwwwwwwuwswrlwww24122220231015141214',
            '................................................d..........................b........................20403231323115240310|wwwwwwrlwdwwwwwwwwwuwwdwwwwwwwswbwrblwwwwwbwwwwwdwswuwswwwuwwwwwwwwwwwwwwwrblwwwwwwwwwwwswwwwwwwwwww20403231323115240310',
            '....w..w......................................................b.5113242240405133|rlwswswwwwwwwwwwswwwrlwswwwwwwwwdwwrbblwbwwwwwwwuwrlwwwwwwwwwrbl5113242240405133',
            '...s...............s..............................................................w.................22112231424140012152|rlwswwswwwwwwwwwwwwswwwwrbblwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwdwwwswwwwwbwwwwwwwwwuwrlwwrblwwwwwwwwwwwrl22112231424140012152',
            '....................................w.............u.............5141323150215214|rlwrlwswwwwwwwwwswwwswwwwwdwwwwwdwbwwrbluwbwwwwwwwuwwwwwswwwrblw5141323150215214',
            '...........................b..............................................................s.........30613021400333511121|wwwwwwwwwwwwrblwwwwwwwwwwwrblwdwdwdwwwwwuwbwuwswswwwbwwwwwwwwwuwwwwwwwwwwwwwwwdwwwswwwwwuwswwwwwwwww30613021400333511121',
            '.............r................s........d............................................................30414040222203245200|wwwwwwswswwwwrlwwwwwwwwwwwwwwwswdwwwwwwdwwbwwwwwwudwbwdwdwwwuwuwbwbwswwwwwuwuwwwwwwwwwwwwwwwwwwwwwww30414040222203245200',
            '..........s.................................................b...5022242321160424|wwwwwrlwwwswwwwwdwwwwwwwuwswrbblwwwwwwwwdwwswswdbwwwwwwuuwwrblww5022242321160424',
            '.....b...............................b..........................4032433131514213|wwwwrblwswwwwwwwwwrbblwsswwwwwwwwwdwrblwdwuwwwwwuwwwwwwwwwwrlwsw4032433131514213',
            '..............b..........b.....w................................2414131413233305|swwwwwwwwwwwwrblwdwdwwwwwbwuwdwwwbwwwuwdwuwswwwuwwwwwwwwswrblwws2414131413233305',
            '..........w.........r...........................................6032220512320624|dwwwwwwwuwwwwwwswwswrlwwswwwwwwswwwwwwwwdwrbblwdbwwwwwwbuwrlwwwu6032220512320624',
            '..b...........................................w.................2332141430260405|wrblwwwwwwwwwwwwwwwwwdwdrbblwuwuwwwwwwwwwswwrlwswwwwwwwwswswwrbl2332141430260405',
            '.....................................................r..........................s.....l.............14141211230243321230|wwwwwwwwwwwdwdwwwwwwwbwbwswwwdwbwuwwwwwbwuwwwwwswuwwwrlwwwwwwwwwwwwwdwwwswwwwwuwswwwwrlwwwwwwwwwwwww14141211230243321230',
            '...............................................b................5131412312506141|swwwwwwwwwwwdwdwrblwuwuwwwwwwwwwswrbblwdwwwwwwwbdwswswwuuwwwwwww5131412312506141',
            '.......w...........r............................................3051502440222343|swswswswwwwwwwwwwwwrlwwwwwwwwwrlwwdwdwwwwwbwbwwddwbwuwwbuwuwwwwu3051502440222343',
            '......s...........s.............w...............................5050411441103434|dwswswswuwwwwwwwwwswwwwwwwwwwwwwwwdwdwwddwbwuwwbbwuwwwwbuwwwrlwu5050411441103434',
            '...................................s..............d...........s.....................................32214140302252022122|wswwwwdwwwwwwwwwuwdwrbblwwwwbwwwwwwswwuwwwwwwwwwwwdwwwswwwwwuwswwwwwwwwwwwdwwwwwwwwwbwdwwwwwwwuwuwww32214140302252022122',
            '..................................................s...............w.................................51303031401003213451|swwwwwwwwwwwwwwwwwwwwwwwwwwwwwrblwwwwwwwwwwwwwrlwwswwwwwwwwwwwswdwwwdwdwwwbwdwbwuwswuwuwbwwwwwwwwwuw51303031401003213451',
            '.......................b.........................b.....................l............................21132412132243211401|wwwwwwwrlwwwwdwdwwwwswwbwbwswwwwwuwbwwwdwwwwwuwwwbwwwwwwwwwuwwwwdwwwwwrlwwuwswwwwwwwwwwwwwwwswwwwwww21132412132243211401',
            '.......w.....................................w..................3040152523340503|wwdwwdwwwwuwwbwddwwwwbwbuwswwuwuwwwwwwwwswswswrlwwwwwwwwwwwwwrbl3040152523340503',
            '...................................s.........................................................l...w..20512313123004111334|wwwwrblwwwwwwwwwwwwwwwwwwwwwwwwwwwwswrblwwdwwwwwwwwwbwwwwwwwwwbwwwwwwwwwuwswwdwwdwwwwwwuwsuwrlwswwww20512313123004111334',
            '..........................b.....w.....u................w........5050404222223333|swwwwwwdwwwwswwuswdwwwwwwwbwwwdwwwbwdwuwdwuwbwwwbwwwuwdwuwswwwuw5050404222223333',
            '.........................w....s..............................................b.................w....21132203330322024115|wwwwwwwwwwwwwdwswwdwwwwuwwwwbwswwwwwwwuwwwwwwwwwwwswwwwwwwwdwwwwrlwdwuwwwwwwwbwwwwwwwwwuwwwrbblwwwws21132203330322024115',
            'w......................................b........................3162320340243304|wrblwswwwwwwwwwwwwdwdwwwdwbwuwwduwbwwwwbwwuwswwuwwwwwwwwswrlwsww3162320340243304',
            '..............................................................b.w.................................s.50506020203101112542|dwswswwwwwuwwwwwwwwwwwwwwwwwwwwwwwdwwwwwwwwwuwwwwwwwdwwwwwwwdwbwwwwwwwbwbwdwdwswuwuwbwuwwwwwwwuwwwsw50506020203101112542',
            'r............................w....................................................................r.41400006142122413122|rlwwwwwwwwwwwwwwwdwwwwdwwwwbwwwwbwwwwbwwswuwwwwuwdwwwwwwwwwbswwwwwwdwuwwwwwwwuwwswswwwwwwwwwwwwwwwrl41400006142122413122',
            '............s.......................u............w..................................................30104042330441321401|wwwwwwwwwwdwwwswdwwduwswwwbwwuwwwwwwuwwwswwwdwwwdwwwwwbwwwuwwwwwuwwwwwwwwwwwrbblwwwwwwwwwwwwwwwwwsww30104042330441321401',
            '.................................b......w...........................s...............................31233040130012325151|wwwwwwwwwwwwwwwwwwwwwwwdwwwwwwwwwbwwwwwdwwwuwwdwwudwwwwwbwwwuwswswbwswwwwwwwuwwwrblwdwwwwswwwwuwwwww31233040130012325151',
            's........................................r.......................................412242212211232162|swwwdwwwwwwwwbwwwwwwwwuwwwwwswwwwwwswwwdwrlwwwwwuwwwwsdwwwwwwwwbwdwrbblwuwuwwwwww412242212211232162',
            '................w...........u........................d...........................231313412133122332|wwwwwdwwwwdwswbwwwwbwwwuwswwuwwwwwwwwwwrlwwwwwwwwwwdwdswwwwwbwuwwrlwwbwwswwwwwuww231313412133122332',
            '........d....w..............................................s.......................................24040231221331226110|wwwwwwwwdwwdwwwwdwuwwbwswwuwwwwbwwwwwwwwwuwwwswwwwwwwdwwwwwdswwbwrblwuwwwuwwwwwwswwwwwwwwwwwwwwwwwww24040231221331226110',
            '........w.......................r..............................d.................241312214262231112|wdwdwwwwwwbwbwrbblwuwuwwwwwwwwwwrlwwwrlwwwwwswwwwswwwwwwwwwwwwsdwwwwwwwwuwwwwwwws241312214262231112',
            '............r................w................................s..................214142123432212213|rlwwwwwrlwwwrblwwwwwwwwwwrlswwwswwwwwwdwwwwwwwwbwswwwwwwbwwwwwswwuwwwwwwwwwwrblww214142123432212213',
            '...r.............................................................s...............141413231231223313|wwwrlwwwwwdwwwwswswbwwwwwwwwbwdwwwwwwuwbwwwwwwwwuwdwdwswwwwuwuwwwswwwwwwwwwwwrblw141413231231223313',
            '.............................s....................................b..............311315222612212141|rlwwrblwdwwwwwwwwuswwwwdwwwwwswwbwwwwwwwwbwwwwwwwwuwswwwwdwwwwwswwbwwrlwwwwuwwwww311315222612212141',
            '...b....................r...................................s.......................................30314323013022324040|wwrblwwwwwwwwwwwwwwwwwwwrlwwwwdwwwwwwswwuwdwswwwwwwwuwwwwwwsswwwwrblwwwwwwwwwwwwwwwwrbblwwwwwwwwwwww30314323013022324040',
            'd...................................................................................................31333002143111102245|dwswwwwwswuwwwwwwwwwwwwdwwwwwwwwwbwwwwwwwwwuwwwwwwwwwwwwwwwwwswwwwwwwdwwwwdwwwwbwwdwbwwdwbswuwuwwuwu31333002143111102245',
            '...........l.............................................d.......................412322222341321114|wwwwdwswsrblwuwwwwwwwwwwwswdwrlwwwwwbwwwwswwwuwwwwwwwwwwwdwwwwwwwwuwwwwwwwwwwrbbl412322222341321114',
            '.............d..............................................................s.......................12234213111141600412|wwwwwswwwwwwwdwwwwwwrlwuwwwdwwwwwwwwwbwwwwrbblwuwswwwwwwwwwwwwwwwwwwwwwrlwdwswwwwwwwbwwwwwwwwwuwwwsw12234213111141600412',
            '......................................s.................u...........................................30221131161413215111|wwwwwwwwwdwwwwwrblwuswwwwwwwwwwwrlwwwwswswwwwwdwwwwwwwwwuwwwswrblwwwwdwwwwwwwwwbwwwwwwwwwbwwwwwwwwwu30221131161413215111',
            '......................r.............w....................s.......................223221332113141513|wwswwwwwwwwwwwwwdwwwwwrlwbwwwwwwwwuwwrbblwwwwwwwwwwwwdrlwswwdwuwwwwwwbwwswswwwuww223221332113141513',
            '............w......................................................d...s.........332224121133321331|wdwwwwwwwwbwwwdwswwuwdwbwwwwwwuwbwswdwwwwuwwwbwwwwwwwwuwdwwwswwwwuwdwwwswwwwuwwww332224121133321331',
            '............................s..................w...............................s.323132213241412231|wwwwwrlwwrbblwwwwwwwwwwwwwdwswwwrlwbwwwwwwwwuswwwdwwwwwwdwbwwwwswuwuwwwwwwwwwwwsw323132213241412231',
            '.......s..............w..............................................u...........214151411323231114|wwwwrlwswdwdwwwwwwuwbwwwswwwwuwdwwwwwwwwbwswswwwwuwwwwwwwwwwdwwwwwwwwuwwwrbblwwww214151411323231114',
            '....................b......................d......................w......................s..........33033121311522111133|wwwwwwwwswdwwrbblwwwbwwwwwwwdwuwwwwwwwuwwwwdwwwwwwwwwuwwwwwwwwwwwwwswwwdwwwwwwwwwbwwdwwwwswuwwuwswww33033121311522111133',
            '...............d..........s...............................................w......414121241412211225|rblwswwwwwwwwwwdwwwwwwwwuwsswdwwwwwwwwuwwwwwwwwwwwwwdwwwswwwwbwdwwwwwwbwuwwrblwuw414121241412211225',
            '....s..................................................................b............................13223113136110003333|wwswswrbblswwwwwwwwwwwswwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwdwrlwwwwwwbwwwwwdwdwuwwwwwuwuwwwrblwwww13223113136110003333',
            '..............................s..................w......u...........................................31313031141201253330|wwwswwwwwwwwwwwwwrlwwwwwwwwwwwswwwwwwwwwwwdwwwdwwwswbwdwuwwdwwuwbwwwwbwwwwuwswwbrlwwwwwwwuwwwwwwwwww31313031141201253330',
            '...............r.........................................................r.......142412213222213143|swswwwwwwwwwwwwrlwwdwdwwwwwwuwbwwwwwwwwbwwwwwwswuwswwwwwwwwwwwdwwwwrblwbwrlwwwwwu142412213222213143',
            '.......w..............................d.............b...............................s...............40503111412025242111|wwwwwwwwrlwwwwwwwwwwdwswwwwwwwuwwwrblwdwwwdwwwwwbwdwbwswwwuwuwbwwwwwwwwwuwwwwwwwwwwwswwwwwwwwwwwwsww40503111412025242111',
            '......s...............s.....................................................................l.......21215230401034313104|wwwwwwswwwwwwwwwwwwwwwswdwwwdwswwwbwdwbwwwwwuwuwbwwwwwwwwwuwwwwrblwwwwswwwwwwwwwwwwwwwwwwwwrlwrlwwww21215230401034313104',
            '.........................................................r....w......................s..............50402201510333421130|wwwwwwwwwwdwwwswwwdwbwdwwwwwbwbwbwwwwwuwuwuwrlwwwwwwwwwwwrlwswwwwwwwwwwwswwwwwwwwwwwwswwrlwwwwwwwwww50402201510333421130',
            '.......r...........s..................w...................w......................414114131223112423|wwwwwwwrlwwwswdwwwwswwwbwswwwwwwuwwwdwwwwwwwwuwdwwwwwwwwbwwrblwdwbwwwwwwuwuwswwww414114131223112423',
            '..w...........................w.....................s...............................................51301210703433111310|dwwwwdwwdwbwdwwuwwbwuwuwwwwwbwwwwwswswuwswwwwwwwwwwwswwwwwwwwwwwwwwwdwrlwwwwwwbwwwwwwwwwuwwwwwwwwwww51301210703433111310',
            '..............d...............s.............u....................................321213215411214313|rblwwwwswwwwwwdwwwwwwwwuwwwwwwswwwwdwwwwwwwwuwwwrbblwwrlwwwwwwdwwwwwwwwbswwwwwswu321213215411214313',
            '..s............................................................s.................231233123111312515|wwswwwwwwswwwwwwwwwwwwwwwswwdwwrlwwwwbwwwwwwwwuwwwwwwdwwwrbblwuswwwwwwwwwwwrblwrl231233123111312515',
            '.......................................................s............................................50603200404211310233|swdwrlwwwwwwuwwwwwdwwwwwwwwwbwwwwwwwwwbwswswwwwwuwwwwwwswwwwwwwwwwwwwwdwdwwwwwwwbwbwdwwwwwuwuwuwwwww50603200404211310233',
            '..................................................................s.................................32101232244011124322|wwwwwrbblwwwwwwwwwwwwdwwwwwwwwwuwwwwwwwwwwwwwwwswwdwwwwwwwwdbwwwswswwbuwswwwwwwuwwwwwrlwwwwwwwwwwwrl32101232244011124322'
        ];

        return LevelService.parseLevel(nr, difficulty, rawLevels[nr + offset - 1]);
    }

    static parseLevel(nr, difficulty, level: string): Level {
        let part1 = level.split("|")[0];
        let part2 = level.split("|")[1];
        let size = Math.sqrt(part1.length + 1) - 1;

        let puzzleGrid = LevelService.parseGridString(part1, size);
        let solutionGrid = LevelService.parseGridString(part2, size);

        return new Level(nr, difficulty, size, puzzleGrid, solutionGrid);
    }

    static parseGridString(gridStr: string, size: number): string[] {
        let grid = [];

        for (let i = 0; i < size; i++) {
            let line = [];
            for (let j = 0; j < size; j++) {
                line.push(gridStr[i * size + j]);
            }
            // add number to grid
            line.push(gridStr[size * size + size + i]);
            grid.push(line);
        }

        // add last line: numbers
        let line = [];
        for (let j = 0; j < size; j++) {
            line.push(gridStr[size * size + j]);
        }
        grid.push(line);

        return grid;
    }

}

LevelService.init();
