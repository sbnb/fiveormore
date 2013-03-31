function BoardIndex(rowIdx, colIdx) {
    this.row = rowIdx;
    this.col = colIdx;

    this.equals = function(otherBoardIndex) {
        if (undefined === otherBoardIndex) {
            return false;
        }

        if (this.row === otherBoardIndex.row && this.col === otherBoardIndex.col) {
            return true;
        }
        return false;
    }

    this.getAsJqueryTd = function(tableId) {
        tableId = setIfUndefined(tableId, BOARD);
        var $cell = $(tableId + ' tr').eq(this.row).find('td').eq(this.col);
        return $cell;
    }
};

BoardIndex.prototype.toString = function() {
    return this.row + ", " + this.col;
}
