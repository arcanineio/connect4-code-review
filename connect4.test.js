describe('setPlayerColors(), set players color', () => {
    it('should set p#Color to default colors correctly', () => {
        setPlayerColors();

        expect(p1Color).toEqual({h: 0, s: 100, l: 50});
        expect(p2Color).toEqual({h: 60, s: 100, l: 50});
    });
});

//assuming setPlayerColors() is already done
describe('changeTurn(), change player turn and visual display', () => {
    beforeAll(() => {
        setPlayerColors();
        playerTurn = 1;
    });

    it('should change player turn and game footer correctly', () => {
        const prevPlayer = playerTurn;

        changeTurn();

        expect(playerTurn).toBe(prevPlayer % 2 + 1);
    });
});

describe('resetBoard(), set all boards array of arrays to null', () => {
    it('should set all elements to null correctly', () => {
        resetBoard();

        for(let row of board){
            for(let tile of row){
                expect(tile).toBe(null);
            }
        }
    })
});

describe('makeBoard(), create trs and tds for #board', () => {
    it('should create 7 rows and 7 cols on board correctly', () => {
        const board = document.querySelector('#board');

        const numRows = board.childElementCount;
        const numCols = board.firstChild.childElementCount;
        
        expect(numRows).toBe(7);
        expect(numCols).toBe(7);
    });
});

describe('findSpotForCol(col), returns the row of empty tile in col', () => {
    let randCol;
    
    beforeAll(() => {
        resetBoard();
    });
    beforeEach(() => {
        randCol = Math.floor(Math.random() * WIDTH);
    });
    
    it('should return row correctly', () => {
        board[5][randCol] = 1;

        const answer = findSpotForCol(randCol);

        expect(answer).toBe(4);
    });
    it('should return null correctly', () => {
        for(let i = 0; i < HEIGHT; i++){
            board[i][randCol] = 1;
        }

        const answer = findSpotForCol(randCol);

        expect(answer).toBe(null);
    });

    afterEach(() => {
        resetBoard();
    });
});

describe('addCoin(), drop a players coin', () => {
    beforeAll(() => {
        playerTurn = 2;
        setPlayerColors();
        resetBoard();
        addCoin(5,0);
    });

    it('should set players class color to coin in open tile correctly', () => {
        const boardTable = document.querySelector('#board');
        
        const hex = '#ffff00';
        const r = parseInt(hex[1]+hex[2],16);
        const g = parseInt(hex[3]+hex[4],16);
        const b = parseInt(hex[5]+hex[6],16);
        
        expect(boardTable.children[6].children[0].style.backgroundColor).toBe(`rgb(${r}, ${g}, ${b})`);
    });

    afterAll(() => {
        resetBoard();
    });
}); 

//assuming resetBoard works properly
describe('endGame(drawR, coinR, setScore), display results div', () => {
    it('should set and show the game ended screen correctly', () => {
        const gameMsg = document.querySelector('#game-msg');

        endGame(true, false, false);

        expect(gameMsg.style.display).toBe('block');
        expect(gameMsg.querySelector('p').innerText).toBe('draw');
    });
    afterAll(() => {
        const gameMsg = document.querySelector('#game-msg');
        gameMsg.style.display = 'none';
    });
});

//assuming addCoin(row,col) and checkForWin(row,col) works properly
describe('placeCoin(col), search and place coin and process current game status', () => {
    beforeEach(() => {
        playerTurn = 1;
        resetBoard();
        setPlayerColors();
    });
    it('should place coin correctly', () => {
        const randCol = Math.floor(Math.random() * WIDTH);

        placeCoin(randCol);
        placeCoin(randCol);
        
        const boardTable = document.querySelector('#board');

        expect(boardTable.children[HEIGHT].children[randCol].style.backgroundColor).toBe('rgb(255, 0, 0)');
        expect(boardTable.children[HEIGHT - 1].children[randCol].style.backgroundColor).toBe('rgb(255, 255, 0)');
    });
    afterEach(() => {
        resetBoard();
    });
});

describe('inbound(paths), finds 4 connected coins in only certain direction', () => {
    beforeAll(() => {
        resetBoard();
        playerTurn = 2;
        board[5][0] = 1;
        board[5][1] = 1;
        board[5][2] = 1;
        board[5][3] = 1;
    });

    it('should check for color set correctly', () => {
        const paths = [[[5, 0], [5, 1], [5, 2], [5, 3]]];
        expect(inbound(paths)).toBe(true);
    });

    afterAll(() => {
        resetBoard();
    }); 
});

//assuming inbound(paths) works properly
describe('checkForWin(), after last coin placed that computer can access from below', () => {
    beforeAll(() => {
        playerTurn = 2;
        resetBoard();
        board[5][0] = 1;
        board[5][1] = 1;
        board[5][2] = 1;
        board[5][3] = 1;
    });

    it('should set and check placed coin`s color set correctly', () => {
        expect(checkForWin()).toBe(true);
    });

    afterAll(() => {
        resetBoard();
    }); 
});