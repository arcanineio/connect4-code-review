//assuming closeGame(), setGameD() works properly
describe('resizeGame(), when window is resized', () => {
    beforeAll((done) => {
        isHidden = false;
        isFading =
        resizeGame();

        setTimeout(done, 550);
    });
    it('should determine next function to call correctly', (done) => {

        if(innerWidth < 700 || innerHeight < 800){
            //test this by decreasing window size
            expect(isFading).toBe(false);

            resizeGame();
        }
        else{
            //test this by increasing window size
            expect(isHidden).toBe(false);
        }

        setTimeout(done, 550);
    });
}); 

//assuming fadeGame() works properly
describe('closeGame(), when window is less than 700px in width or 800px in height', () => {
    it('should call next function correctly', (done) => {
        isHidden = false;
        closeGame();

        expect(isFading).toBe(true);

        setTimeout(done, 550);
    });
    it('should do nothing correctly', () => {
        isHidden = true;
        isFading = false;
        closeGame();

        expect(isFading).toBe(false);
    });

    afterEach(() => {
        resizeGame();
    });
});

describe('fadeGame(), if game is hidden or fading', () => {
    beforeAll((done) => {
        isFading = true;
        fadeGame();

        setTimeout(done, 550);
    });

    it('should decrease opacity close to 0, then hide game correctly', () => {
        expect(isHidden).toBe(true);
        expect(isFading).toBe(false);
    });

    afterAll(() => {
        isHidden = false;
        resizeGame();
    });
});

//assuming board is made
describe('setGameD(), when window size restrictions are passed', () => {
    let answerGameWidth;
    let answerGameHeight;
    let answerTdSize;

    let gameWidth;
    let gameHeight;
    let tdSize;

    beforeAll(() => {
        setGameD();

        const game = document.querySelector('#game');
        const boardTable = document.querySelector('#board');

        gameWidth = game.style.width.replace('px', '');
        gameHeight = game.style.height.replace('px', '');

        tdSize = boardTable.children[1].children[0].style.width.replace('px', '');


        const windowWidth = innerWidth;
        const windowHeight = innerHeight;

        const dRatio = 7 / 8;
        const windowRatio = windowWidth / windowHeight;

        if(dRatio < windowRatio){
            answerGameWidth = (windowHeight * 7 / 8).toFixed(3) + '';
            answerGameHeight = windowHeight + '';

            answerTdSize = (windowHeight / 8).toFixed(3) - 5 + '';
        }
        else{
            answerGameWidth = windowWidth + '';
            answerGameHeight = (windowWidth * 8 / 7).toFixed(3) + '';

            answerTdSize = (windowWidth / 7).toFixed(3) - 5 + '';
        }
    });

    it('should set game div`s width and height correctly', () => {
        expect(answerGameWidth).toBe(gameWidth);
        expect(answerGameHeight).toBe(gameHeight);
    });
    it('should set board`s size correctly', () => {
        expect(answerTdSize).toBe(tdSize);
    });
});

describe('startGame(), when submit is clicked', () => {
    const startScr = document.querySelector('#start-screen');
    const board = document.querySelector('#board');
    const gameFooter= document.querySelector('#game-footer');

    beforeAll(() => {
        startGame();
    });

    it('should switch display screen', () => {
        expect(startScr.style.display).toBe('none');
        expect(board.style.display).toBe('block');
        expect(gameFooter.style.display).toBe('block');
        expect(playerTurn === 1 || playerTurn === 2).toBe(true);
    });

    afterAll(() => {
        startScr.style.display = 'block';
        board.style.display = 'none';
        gameFooter.style.display = 'none';
    });
});