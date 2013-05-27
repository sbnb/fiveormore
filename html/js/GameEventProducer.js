(function (FOM, $, _) {

    "use strict";

    /*
        GameEventProducer (GEP)

        The interface between jQuery/DOM events and game events.

        JQuery listeners call processClick when a board cell clicked by player.

        GEP examines game state and determines whether to trigger a game event,
        and if so, which type of game event.

        If the game events list is non-empty then input is ignored, as this
        represents a dynamic movement in the game (an animation).
    */

    FOM.GameEventProducer = function (logicalBoard, gameEvents) {
        this._logicalBoard = logicalBoard;
        this._gameEvents = gameEvents;
    };

    // user clicked a cell. If no pending game events, process.
    FOM.GameEventProducer.prototype.processClick = function (cell) {

        if (this._gameEvents.length !== 0) {
            return;
        }

        var contents = this._logicalBoard.get(cell);

        if (contents === FOM.constants.EMPTY) {
            if (this._logicalBoard.getSelectedCell() !== null) {
                this._gameEvents.push({event: FOM.constants.SEEK_MOVE, target: cell});
            }
        }
        else {
            // filled cell click, select it
            this._gameEvents.push({event: FOM.constants.SELECT, target: cell});
        }
    };

})(FOM, jQuery, _);
