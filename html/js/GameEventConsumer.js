/*
    GameEventConsumer:

    Consumes events from the game events list in a FIFO order.

    Consumes one event per call of consume(). Repeated calls, including timing
    for animations, must be handled up call chain.

    Will add events to game events list when consuming a valid SEEK_MOVE event,
    setting up the TRANSITION events for animation.
*/

function GameEventConsumer(logicalBoard, gameEvents) {
    this._logicalBoard = logicalBoard;
    this._gameEvents = gameEvents;
    this._pathSearcher = new PathSearcher(logicalBoard);
}

GameEventConsumer.prototype.consume = function (opts) {
    opts = setIfUndefined(opts, {
        schedulingOk: true,
        interval: constants.INTERVAL
    });
    var event = this._gameEvents.shift();
    switch(event.event) {
        case constants.SEEK_MOVE:
            this.processSeekMove(event.target);
            break;
        case constants.SELECT:
            this._logicalBoard.cellSelected = event.target;
            break;
        case constants.TRANSITION:
            this.processTransition(event);
            break;
        default:
            console.log('Unknown event: ' + event.event);
    }
    // schedule this.consume in x millis if pending transitions
    if (opts.schedulingOk) {
        this._scheduleNextConsume(opts.interval);
    }
}

GameEventConsumer.prototype.processSeekMove = function (targetCell) {
    var startCell = this._logicalBoard.cellSelected;
    if (startCell === null) {
        return;
    }
    var path = this._pathSearcher.search(startCell, targetCell);
    this._createTransitions(path, startCell);
    this._logicalBoard.cellSelected = null;
}

GameEventConsumer.prototype._createTransitions = function (path, startCell) {
    var color = this._logicalBoard.get(startCell);
    _.forEach(path, function (cell, index) {
        var previous = index > 0 ? path[index - 1] : startCell;
        this._gameEvents.push({event: constants.TRANSITION, target: cell,
            color: color, previous: previous});
    }, this);
}

GameEventConsumer.prototype.processTransition = function (transition) {
    // set target to color
    this._logicalBoard.add(transition.target, transition.color);
    // conditionally remove color from previous cell
    if (!_.isUndefined(transition.previous)) {
        this._logicalBoard.add(transition.previous, constants.EMPTY);
    }

    // get render to run (responsibility lies higher up call chain)
    // schedule call to consume next event (same)
}

// look for TRANSITION events, if found schedule a call to consume
GameEventConsumer.prototype._scheduleNextConsume = function (interval) {
    var that = this,
        period = 0;
    if (this._gameEvents.length > 0 &&
        this._gameEvents[0].event === constants.TRANSITION) {
        setTimeout(_.bind(this.consume, this, {schedulingOk: true, interval: interval}), interval);
    }

}
