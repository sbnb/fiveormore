function Game2() {
}

Game2.prototype.start = function () {
    console.log('starting game');
    this.logicalBoard.previewStones.addToBoard(this.logicalBoard);
};
