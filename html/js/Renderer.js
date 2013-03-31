function Renderer(logicalBoard, tableId) {
    this._logicalBoard = logicalBoard;
    this._tableId = tableId;
    this.snapshot = [];
}

// render any changed cells since the last render
Renderer.prototype.render = function () {
    var changed = this._logicalBoard.getChangedCells(this.snapshot);

    _.forEach(changed, function (cell) {
        var $cell = $(this._tableId + ' tr').eq(cell.y).find('td').eq(cell.x);
        $cell.removeClass().addClass(color);
    }, this);

    this.snapshot = this._logicalBoard.takeSnapshot();
}
