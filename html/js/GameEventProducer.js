function GameEventProducer(logicalBoard, gameEvents) {
    this._logicalBoard = logicalBoard;
    this._gameEvents = gameEvents;
}

// user clicked cell. If no pending game events, process.
GameEventProducer.prototype.processClick = function (cell) {

    if (this._gameEvents.length !== 0) {
        return;
    }

    var contents = this._logicalBoard.get(cell),
        EMPTY = '';

    if (contents === EMPTY) {
        if (this._logicalBoard.cellSelected !== null) {
            this._gameEvents.push({event: 'seekMove', target: cell});
        }
    }
    else {
        // filled cell click, select it
        this._gameEvents.push({event: 'select', target: cell});
    }
}
