const WIDTH = 7;
const HEIGHT = 6;

let p1Color;
let p2Color;
const setPlayerColors = () => {
    const p1 = document.querySelector('#p1Color');
    const p2 = document.querySelector('#p2Color');

    let color1 = p1.value;
    let color2 = p2.value;

    let r;
    let g;
    let b;

    if(color1.includes('#')){
        const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color1);
        
        const rHex = parseInt(hex[1], 16);
        const gHex = parseInt(hex[2], 16);
        const bHex = parseInt(hex[3], 16);

        r = rHex / 255;
        g = gHex / 255;
        b = bHex / 255;
    }
    else if(color1.includes('rgb')){
        const rIndex = color1.indexOf('rgb(');
        const gIndex = color1.indexOf(' ,');
        const bIndex = color1.indexOf(gIndex + 1, ' ,');
        const closeIndex = color1.indexOf(')');

        r = parseInt(color1.substring(rIndex, gIndex)) / 255;
        g = parseInt(color1.substring(gIndex, bIndex)) / 255;
        b = parseInt(color1.substring(bIndex, closeIndex)) / 255;
    }

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h = (max + min) / 2;
    let s;
    let l = h;

    if(max == min){
        color1 = {h: 0, s: r * 100 , l: l * 100};
    }
    else{
        const diff = max - min;
        
        s = l > 0.5? diff / (2 - max - min): diff / (max + min);

        switch(max){
            case r: 
                h = (g - b) / diff + (g < b? 6: 0);
                break;
            case g:
                h = (b - r) / diff + 2;
                break;
            case b:
                h = (r - g) / diff + 4;
        }

        h /= 6;

        s = s * 100;
        s = Math.floor(s);
        l = l * 100;
        l = Math.floor(l);
        h = Math.floor(360 * h);

        color1 = {h, s, l};
    }


    if(color2.includes('#')){
        const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2);
        
        const rHex = parseInt(hex[1], 16);
        const gHex = parseInt(hex[2], 16);
        const bHex = parseInt(hex[3], 16);

        r = rHex / 255;
        g = gHex / 255;
        b = bHex / 255;
    }
    else if(color2.includes('rgb')){
        const rIndex = color1.indexOf('rgb(');
        const gIndex = color1.indexOf(' ,');
        const bIndex = color1.indexOf(gIndex + 1, ' ,');
        const closeIndex = color1.indexOf(')');

        r = parseInt(color1.substring(rIndex, gIndex)) / 255;
        g = parseInt(color1.substring(gIndex, bIndex)) / 255;
        b = parseInt(color1.substring(bIndex, closeIndex)) / 255;
    }

    max = Math.max(r, g, b);
    min = Math.min(r, g, b);

    h = (max + min) / 2;
    l = h;

    if(max == min){
        color2 = {h: 0, s: r * 100, l: l * 100};
    }
    else{
        const diff = max - min;
        
        s = l > 0.5? diff / (2 - max - min): diff / (max + min);

        switch(max){
            case r: 
                h = (g - b) / diff + (g < b? 6: 0);
                break;
            case g:
                h = (b - r) / diff + 2;
                break;
            case b:
                h = (r - g) / diff + 4;
        }

        h /= 6;

        s = s * 100;
        s = Math.floor(s);
        l = l * 100;
        l = Math.floor(l);
        h = Math.floor(360 * h);

        color2 = {h, s, l};
    }

    p1Color = color1;
    p2Color = color2;
};

let playerTurn;
const changeTurn = () => {
    playerTurn = playerTurn % 2 + 1;
    
    const footer = document.querySelector('#game-footer');

    if(playerTurn === 1){
        footer.style.backgroundColor = `hsl(${p1Color.h}, ${p1Color.s - 30}%, ${p1Color.l}%)`;
        footer.innerText = 'player turn: 1';
    }
    else{
        footer.style.backgroundColor = `hsl(${p2Color.h}, ${p2Color.s - 30}%, ${p2Color.l}%)`;
        footer.innerText = 'player turn: 2';
    }
}

const board = []; //board[row][col], [0][0] top left
const resetBoard = () => {
    const boardTable = document.querySelector('#board');

    coinCount = 0;

    for(let row = 0; row < HEIGHT; row++){
        board[row] = [];

        for(let col = 0; col < WIDTH; col++){
            board[row][col] = null;

            boardTable.children[HEIGHT - row].children[col].style.backgroundColor = 'hsl(0, 0%, 85%)';
        }
    }
};

const makeBoard = () => {
    const boardTable = document.querySelector('#board');

    for(let i = 0; i <= HEIGHT; i++){
        const newTr = document.createElement('tr');

        if(i === 0){
            boardTable.appendChild(newTr);

            for(let j = 0; j < WIDTH; j++){
                const newTd = document.createElement('td');
                newTd.classList.add('topTiles');
                newTd.innerText = j + 1;
                newTr.appendChild(newTd);

                newTd.addEventListener('click', () => {
                    placeCoin(j);
                }); 
            }
        }
        else{
            boardTable.appendChild(newTr);

            for(let j = 0; j < WIDTH; j++){
                const newTd = document.createElement('td');
                newTd.classList.add('tiles');
                newTr.appendChild(newTd);
            }
        }
    }

    resizeGame();
};

const findSpotForCol = (col) => {
    let emptyRow = HEIGHT - 1;

    for(let row = 0; row < HEIGHT; row++){
        if(board[HEIGHT - 1 - row][col] === null){
            break;
        }
        else{
            emptyRow--;
        }
    }

    if(emptyRow === -1){
        return null;
    }

    return emptyRow;
};

let coinCount = 0;
const addCoin = (row, col) => {
    board[row][col] = playerTurn;

    const boardTable = document.querySelector('#board');

    if(playerTurn === 1){
        boardTable.children[row + 1].children[col].style.backgroundColor = `hsl(${p1Color.h}, ${p1Color.s}%, ${p1Color.l}%)`;
    }
    else{
        boardTable.children[row + 1].children[col].style.backgroundColor = `hsl(${p2Color.h}, ${p2Color.s}%, ${p2Color.l}%)`;
    }

    changeTurn();
    coinCount++;
};

const endGame = (drawR, coinR, setScore) => {
    const gameResult = document.querySelector('#gameResult');
    const coinResult = document.querySelector('#coinResult');
    const setResult = document.querySelector('#setResult');

    if(drawR){
        gameResult.innerText = 'draw';
    }
    else{
        gameResult.innerHTML = `player ${playerTurn % 2 + 1} wins`;
    }

    if(coinR){
        coinResult.innerHTML = `at coin ${coinCount}`;
    }
    else{
        coinResult.innerText = '';
    }

    if(setScore){
        setResult.innerHTML = 
            `game score<br>
            player 1 : ${gameScore[0]}<br>
            player 2 : ${gameScore[1]}<br>
            draw: ${gameScore[2]}
        `;
    }
    else{
        setResult.innerText = '';
    }

    const gameMsg = document.querySelector('#game-msg');
    gameMsg.style.display = 'block';

    const boardTable = document.querySelector('#board');
    boardTable.style.display = 'none';

    if(gameLimit === gameScore.reduce((sum, games) => sum + games)){
        const endSet = document.querySelector('#endSet');
        endSet.style.display = 'block';
        if(gameScore[0] === gameScore[1]){
            endSet.innerText = `draw in ${gameScore[2]} games set`;
        }
        else if(gameScore[0] > gameScore[1]){
            endSet.innerText = `player ${playerTurn % 2 + 1} wins in ${gameLimit} games set`;
        }
        else{
            endSet.innerText = `player ${playerTurn % 2 + 1} wins in ${gameLimit} games set`;
        }
    }
    else{
        const againBtn = document.querySelector('#againBtn');
        againBtn.style.display = 'block';
        againBtn.addEventListener('click', () => {
            resetBoard();

            playerTurn = Math.floor(Math.random() * 2);
            changeTurn();

            gameMsg.style.display = 'none';
            againBtn.style.display = 'none';
            boardTable.style.display = 'block';
        });
    }
};

let gameLimit;
const gameScore = [0,0,0]; //[p1, p2, draw]
const placeCoin = (col) => {
    const emptyRow = findSpotForCol(col);

    if(emptyRow === null){
        return ;
    }
    
    addCoin(emptyRow, col);
    
    if(checkForWin()){
        const gameType = document.querySelectorAll('input[type="radio"]');
        if(gameType[1].checked === true){

            if(coinCount >= WIDTH * HEIGHT){
                gameScore[2]++;
                endGame(true, false, true);
            }
            else{
                gameScore[playerTurn % 2]++;
                endGame(false, true, true);
            }
        }
        else{
            if(coinCount >= WIDTH * HEIGHT){
                endGame(true, false, false)
            }
            else{
                endGame(false, true, false);
            }
        }
    }
};

const inbound = (paths) => (
    paths.some((path) => (
        path.every(([row, col]) => (
            row >= 0 && 
            row < HEIGHT && 
            col >= 0 && 
            col < WIDTH && 
            board[row][col] === playerTurn % 2 + 1
        ))
    ))
);

const checkForWin = () => {
    for(let row = HEIGHT - 1; row >= 3; row--){
        for(let col = 0; col < WIDTH; col++){
            const horiz = [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]];
            const vert = [[row, col], [row - 1, col], [row - 2, col], [row - 3, col]];
            const diagDR = [[row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]];
            const diagDL = [[row, col], [row - 1, col - 1], [row - 2, col - 2], [row - 3, col - 3]];

            const paths = [horiz, vert, diagDR, diagDL];

            if(inbound(paths)){
                return true;
            }
        }
    }
    return false;
};