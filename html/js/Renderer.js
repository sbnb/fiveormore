function Renderer(logicalBoard, tableId, previewSelector) {
    this._logicalBoard = logicalBoard;
    this._tableId = tableId;
    this._previewSelector = previewSelector;
    this.snapshot = [];

    // register as a subscriber to changes in LogicalBoard
    // render when any changes made
    var that = this;
    this._logicalBoard.subscribe(function (msg, data) {
        that.render();
    });
}

// render any changed cells since the last render
Renderer.prototype.render = function () {
    var changed = this._logicalBoard.getChangedCells(this.snapshot);

    _.forEach(changed, function (cell) {
        var $cell = $(this._tableId + ' tr').eq(cell.y).find('td').eq(cell.x);
        var color = this._logicalBoard.get(cell);
        $cell.removeClass().addClass(color);
    }, this);

    this._renderPreviewStones();
    this.snapshot = this._logicalBoard.takeSnapshot();
}

Renderer.prototype._renderPreviewStones = function () {
    var stones = this._logicalBoard.previewStones.stones;
    _.forEach(stones, function (color, idx) {
        var selector = this._previewSelector + ' li:eq(' + idx + ')',
            $previewLi = $(selector);
        $previewLi.removeClass().addClass(color);
    }, this);
}
