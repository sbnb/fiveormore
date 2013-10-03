(function () {

    "use strict";

    var c = FOM.constants,
        t = FOM.tools;

    /*
        Renderer

        Responsible for rendering the game by changing classes of html entities.
        Subscribes to changes in LogicalBoard, receiving updates.
    */

    /* jshint -W072 */
    FOM.Renderer = function (logicalBoard, boardSelector, previewSel, score) {
        this._logicalBoard = logicalBoard;
        this._boardSelector = boardSelector;
        this._previewSel = previewSel;
        this._score = score;
        this.snapshot = [];
        this.lastPreviewStones = [];
        this.cellCache = {};
        this.$allCells = $(this._boardSelector + ' td');

        var that = this;

        // register as a subscriber to changes in LogicalBoard
        this._logicalBoard.subscribe(function () {
            that.render();
        });
    };
    /* jshint +W072 */

    FOM.Renderer.prototype = {

        render:
            function () {
                this._renderChangedStones();
                this._renderPreviewStones();
                this._renderSelectedCell();
                this._renderScore();
                this.snapshot = this._logicalBoard.takeSnapshot();
            },

        _renderChangedStones: function () {
            var changed = this._logicalBoard.getChangedCells(this.snapshot);
            for (var idx = 0; idx < changed.length; idx += 1) {
                var color = this._logicalBoard.get(changed[idx]) || c.EMPTY,
                    $cell = this._getJqueryCell(changed[idx]);
                this._maybeRenderShape($cell, color);
                $cell.removeClass().addClass(color);
            }
        },

        _renderPreviewStones:
            function () {
                var stones = this._logicalBoard.previewStones.stones;
                if (stones === this.lastPreviewStones) {
                    return; // no render if stones have not changed
                }
                for (var idx = 0; idx < stones.length; idx += 1) {
                    var selector = this._previewSel + ' li:eq(' + idx + ')',
                        $previewLi = $(selector);
                    this._maybeRenderShape($previewLi, stones[idx]);
                    $previewLi.removeClass().addClass(stones[idx]);
                }
                this.lastPreviewStones = stones;
            },

        _maybeRenderShape:
            function ($element, color) {
                if (c.SHAPES_ON) {
                    var imgSrc = t.imgSrcFromColor(color);
                    if (imgSrc) {
                        $element.html('<img src=' + imgSrc + ' />');
                    }
                    else {
                        $element.html(c.CELL_CONTENT);
                    }
                }
            },

        _renderSelectedCell:
            function () {
                // make sure no TD is selected
                this.$allCells.removeClass('selected');

                // add 'selected' class to the TD selected in logicalBoard
                var selectedCell = this._logicalBoard.getSelectedCell();
                if (selectedCell) {
                    this._getJqueryCell(selectedCell).addClass('selected');
                }
            },

        _renderScore:
            function () {
                // render score if it has changed
                var score = this._score.get();
                if (score !== this.renderedScore) {
                    $('#score').text(score);
                    this.renderedScore = score;
                }
            },

        _getJqueryCell:
            function (cell) {
                var key = cell.x + ',' + cell.y,
                    $cell;
                if (!this.cellCache[key]) {
                    $cell = $(this._boardSelector + ' tr')
                        .eq(cell.y)
                        .find('td')
                        .eq(cell.x);
                    // cache the jQuery object, only do find once
                    this.cellCache[key] = $cell;
                }
                return this.cellCache[key];
            }
    };

})();
