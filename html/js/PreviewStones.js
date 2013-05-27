(function (FOM, $, _) {

    "use strict";

    /*
        PreviewStones

        The next three stones that will appear on the board after the users current
        turn completes.

        Visually represented above the board, in:

            <ul id='#preview'>
                <li></li>
                <li></li>
                <li></li>
            </ul>
    */

    // colors is an object: see Colors.js
    FOM.PreviewStones = function () {
        this.colors = new FOM.Colors();
        this.stones = [];
        this.refresh();
    };

    FOM.PreviewStones.prototype = {

        // refresh the preview stones held in memory
        refresh:
            function () {
                this.stones = this.colors.getRandom(3);
            },

        // add the current preview stones to the logical board
        addToBoard:
            function (logicalBoard) {
                logicalBoard.placeStones(this.stones);
                this.refresh();
            },

        // return number of preview stones held
        size:
            function () {
                return this.stones.length;
            },

        toString:
            function () {
                return this.stones.toString();
            }
    };

})(FOM, jQuery, _);
