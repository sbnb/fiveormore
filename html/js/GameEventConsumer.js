(function () {

    "use strict";
    /*global setTimeout*/

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
    FOM.GameEventConsumer = function (logicalBoard, gameEvents, score) {
        this._logicalBoard = logicalBoard;
        this._gameEvents = gameEvents;
        this.score = score;
        this._pathSearcher = new FOM.PathSearcher(logicalBoard);
        this._messageDisplayer = new FOM.MessageDisplayer();
    };

    FOM.GameEventConsumer.prototype = {

        consume:
            function (opts) {
                // guard clause: if gameEvents empty nothing to process
                if (this._gameEvents.length === 0) {
                    return;
                }

                opts = FOM.tools.setIfUndefined(opts, {
                    schedulingOk: true,
                    interval: FOM.constants.INTERVAL
                });

                var event = this._gameEvents.shift();
                switch(event.event) {
                    case FOM.constants.SEEK_MOVE:
                        this.processSeekMove(event.target);
                        break;
                    case FOM.constants.SELECT:
                        this._logicalBoard.selectCell(event.target);
                        this._messageDisplayer.hide();
                        break;
                    case FOM.constants.TRANSITION:
                        this._processTransition(event);
                        break;
                    case FOM.constants.MATCH_RUNS:
                        var match = this._matchRuns();
                        break;
                    case FOM.constants.MATCH_RUNS_NO_ADD:
                        this._matchRuns(false);
                        if (this._isGameOver() && !match) {
                            FOM.game.onGameOver();
                        }
                        break;
                    case FOM.constants.ADD_PIECES:
                        this._logicalBoard.previewStones.addToBoard(this._logicalBoard);
                        break;
                    default:
                        FOM.tools.assert(false, 'GameEventConsumer.consume: Unknown ' +
                            'event: ' + event.event);
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
                    this._gameEvents.push({event: FOM.constants.MATCH_RUNS});
                    this._logicalBoard.selectCell(null);
                }
                else {
                    this._messageDisplayer.display(FOM.constants.NO_MOVE_MSG);
                }
            },

        _createTransitions:
            function (path, startCell) {
                var color = this._logicalBoard.get(startCell);
                _.forEach(path, function (cell, index) {
                    var previous = index > 0 ? path[index - 1] : startCell;
                    this._gameEvents.push({event: FOM.constants.TRANSITION, target: cell,
                        color: color, previous: previous});
                }, this);
            },

        _processTransition:
            function (transition) {
                this._messageDisplayer.hide();
                this._logicalBoard.add(transition.target, transition.color);
                // conditionally remove color from previous cell
                if (!_.isUndefined(transition.previous)) {
                    this._logicalBoard.add(transition.previous, FOM.constants.EMPTY);
                }
            },

        // match runs, add points, clear runs. Return true is run matched.
        _matchRuns:
            function (addPiecesAfter) {
                addPiecesAfter = FOM.tools.setIfUndefined(addPiecesAfter, true);
                var runs = this._logicalBoard.findCompleteRuns(FOM.constants.RUN_LENGTH),
                    points = this.score.add(runs);
                this._logicalBoard.clearRuns(runs);

                // if scored points no add pieces
                if (points === 0 && addPiecesAfter) {
                    this._gameEvents.push({event: FOM.constants.ADD_PIECES});
                    // special match runs -- no add pieces after
                    this._gameEvents.push({event: FOM.constants.MATCH_RUNS_NO_ADD});
                }
                return _.flatten(runs).length > 0;
            },

        _isGameOver:
            function () {
                return this._logicalBoard.isFull() || FOM.constants.GAME_OVER_DEV;
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

})();
