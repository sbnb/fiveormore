// TODO: add game end checks in Game2.js
function Game2() {
}

Game2.prototype.start = function () {
    console.log('starting game');
    this.logicalBoard.previewStones.addToBoard(this.logicalBoard);
};

Game2.prototype.onGameOver = function () {
    console.log('ending game');
    // this.highsScoresGroup does the thing
    // and popups, and ...?
};
