(function () {

    "use strict";

    var c = FOM.constants,
        t = FOM.tools;

    /*
        Renderer

        Responsible for rendering the game by changing classes of html entities.
        Subscribes to changes in LogicalBoard, receiving updates.
    */

    FOM.Renderer = function (logicalBoard, boardSelector, previewSel, score) {
        this._logicalBoard = logicalBoard;
        this._boardSelector = boardSelector;
        this._previewSel = previewSel;
        this._score = score;
        this.snapshot = [];

        var that = this;

        // register as a subscriber to changes in LogicalBoard
        this._logicalBoard.subscribe(function () {
            that.render();
        });
    };

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
            _.forEach(changed, function (cell) {
                var color = this._logicalBoard.get(cell) || c.EMPTY,
                    $cell = this._getJqueryCell(cell);
                this._maybeRenderShape($cell, color);
                $cell.removeClass().addClass(color);
            }, this);
        },

        _renderPreviewStones:
            function () {
                var stones = this._logicalBoard.previewStones.stones;
                _.forEach(stones, function (color, idx) {
                    var selector = this._previewSel + ' li:eq(' + idx + ')',
                        $previewLi = $(selector);
                    this._maybeRenderShape($previewLi, color);
                    $previewLi.removeClass().addClass(color);
                }, this);
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
                $(this._boardSelector + ' td').removeClass('selected');

                // add 'selected' class to the TD selected in logicalBoard
                var selectedCell = this._logicalBoard.getSelectedCell();
                if (selectedCell) {
                    this._getJqueryCell(selectedCell).addClass('selected');
                }
            },

        _renderScore:
            function () {
                $('#score').text(this._score.get());
            },

        _getJqueryCell:
            function (cell) {
                var $cell = $(this._boardSelector + ' tr')
                    .eq(cell.y)
                    .find('td')
                    .eq(cell.x);
                return $cell;
            }
    };

})();
