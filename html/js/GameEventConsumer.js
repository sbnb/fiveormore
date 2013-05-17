/*
    GameEventConsumer:

    Consumes events from the game events list in a FIFO order.

    Consumes one event per call of consume(). Repeated calls, including timing
    for animations, must be handled up call chain.

    Will add events to game events list when consuming a valid SEEK_MOVE event,
    setting up the TRANSITION events for animation.

    Also produces MATCH_RUNS and ADD_PIECES events.

    Calls gameOverCallback when game complete.
*/

function GameEventConsumer(logicalBoard, gameEvents, score, gameOverCallback) {
    this._logicalBoard = logicalBoard;
    this._gameEvents = gameEvents;
    this.score = score;
    this._pathSearcher = new PathSearcher(logicalBoard);
    this._messageDisplayer = new MessageDisplayer();
}

GameEventConsumer.prototype = {

    consume:
        function (opts) {
            // guard clause: if gameEvents empty nothing to process
            if (this._gameEvents.length === 0) {
                return;
            }

            opts = tools.setIfUndefined(opts, {
                schedulingOk: true,
                interval: constants.INTERVAL
            });
            var event = this._gameEvents.shift()
                gameOver = false;
            //~ console.log('cosuming event: ' + event.event);
            switch(event.event) {
                case constants.SEEK_MOVE:
                    this.processSeekMove(event.target);
                    break;
                case constants.SELECT:
                    this._logicalBoard.selectCell(event.target);
                    this._messageDisplayer.hide();
                    break;
                case constants.TRANSITION:
                    this._processTransition(event);
                    break;
                case constants.MATCH_RUNS:
                    this._matchRuns();
                    break;
                case constants.MATCH_RUNS_NO_ADD:
                    this._matchRuns(false);
                    break;
                case constants.ADD_PIECES:
                    this._logicalBoard.previewStones.addToBoard(this._logicalBoard);
                    gameOver = this._isGameOver();
                    if (gameOver) {
                        // TODO: launch a game over sequence from here.
                        // something in Game2.js, need a ref
                        console.log('game over');
                    }
                    break;
                default:
                    console.log('Unknown event: ' + event.event);
            }
            // schedule this.consume in x millis if pending transitions
            if (opts.schedulingOk) {
                this._scheduleNextConsume(opts.interval);
            }
        },

    processSeekMove:
        function (targetCell) {
            var startCell = this._logicalBoard.getSelectedCell();
            if (startCell === null) {
                return;
            }
            var path = this._pathSearcher.search(startCell, targetCell);
            if (path.length > 0) {
                this._createTransitions(path, startCell);
                this._gameEvents.push({event: constants.MATCH_RUNS});
                this._logicalBoard.selectCell(null);
            }
            else {
                this._messageDisplayer.display(constants.NO_MOVE_MSG);
            }
        },

    _createTransitions:
        function (path, startCell) {
            var color = this._logicalBoard.get(startCell);
            _.forEach(path, function (cell, index) {
                var previous = index > 0 ? path[index - 1] : startCell;
                this._gameEvents.push({event: constants.TRANSITION, target: cell,
                    color: color, previous: previous});
            }, this);
        },

    _processTransition:
        function (transition) {
            this._messageDisplayer.hide();
            this._logicalBoard.add(transition.target, transition.color);
            // conditionally remove color from previous cell
            if (!_.isUndefined(transition.previous)) {
                this._logicalBoard.add(transition.previous, constants.EMPTY);
            }
        },

    _matchRuns:
        function (addPiecesAfter) {
            addPiecesAfter = tools.setIfUndefined(addPiecesAfter, true);
            var runs = this._logicalBoard.findCompleteRuns(constants.RUN_LENGTH),
                points = this.score.add(runs);
            this._logicalBoard.clearRuns(runs);

            // if scored points no add pieces
            if (points === 0 && addPiecesAfter) {
                this._gameEvents.push({event: constants.ADD_PIECES});
                // special match runs -- no add pieces after
                this._gameEvents.push({event: constants.MATCH_RUNS_NO_ADD});
            }
            // render board
        },

    _isGameOver:
        function () {
            return this._logicalBoard.isFull();
        },

    _scheduleNextConsume:
        function (interval) {
            var that = this,
                period = 0;
            if (this._gameEvents.length > 0) {
                setTimeout(_.bind(this.consume, this, {schedulingOk: true, interval: interval}), interval);
            }
        }
};
