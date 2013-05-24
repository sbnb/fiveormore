/*
    Renderer

    Responsible for rendering the game by changing classes of html entities.
    Subscribes to changes in LogicalBoard to detect when an update is required.
*/

function Renderer(logicalBoard, boardSelector, previewSelector, score) {
    this._logicalBoard = logicalBoard;
    this._boardSelector = boardSelector;
    this._previewSelector = previewSelector;
    this._score = score;
    this.snapshot = [];

    var that = this;

    // register as a subscriber to changes in LogicalBoard
    this._logicalBoard.subscribe(function (msg, data) {
        that.render();
    });
}

Renderer.prototype = {

    render:
        function () {
            var changed = this._logicalBoard.getChangedCells(this.snapshot);
            _.forEach(changed, function (cell) {
                var color = this._logicalBoard.get(cell) || EMPTY;
                this._getJqueryCell(cell).removeClass().addClass(color);
            }, this);

            this._renderPreviewStones();
            this._renderSelectedCell();
            this._renderScore();
            this.snapshot = this._logicalBoard.takeSnapshot();
        },

    _renderPreviewStones:
        function () {
            var stones = this._logicalBoard.previewStones.stones;
            _.forEach(stones, function (color, idx) {
                var selector = this._previewSelector + ' li:eq(' + idx + ')',
                    $previewLi = $(selector);
                $previewLi.removeClass().addClass(color);
            }, this);
        },

    _renderSelectedCell:
        function () {
            // make sure no TD is selected
            $(this._boardSelector + ' td').removeClass('selected');

            // add 'selected' class to the TD that is selected in logicalBoard
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
            var $cell = $(this._boardSelector + ' tr').eq(cell.y).find('td').eq(cell.x);
            return $cell;
        }
};

