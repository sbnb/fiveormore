/*
    A logical representation of the board. This object contains NO jQuery, to
    facilitate easier testing.
*/
function LogicalBoard(width, height) {
    this._board = [];
    this._width = width;
    this._height = height;
    this._runFinder = new RunFinder(this);

    for (var idx = 0, len = width * height; idx < len; idx += 1) {
        this._board.push('');
    }
}

// True if no empty cells on board
LogicalBoard.prototype.isFull = function () {
    for (var idx = 0; idx < this._board.length; idx += 1) {
        if (this._board[idx] === '') {
            return false;
        }
    }
    return true;
}

// get idx into this.board given cell(x,y) (idx = width * y + x)
LogicalBoard.prototype.index = function (cell) {
    return this._width * cell.y + cell.x;
}

// add a stone color at cell(x,y)
LogicalBoard.prototype.add = function (cell, color) {
    this._board[this.index(cell)] = color;
}

// retrieve the color at cell(x,y) (or empty string)
LogicalBoard.prototype.get = function (cell) {
    return this._board[this.index(cell)];
}

// return a list of completed runs as arrays of indices
LogicalBoard.prototype.findCompleteRuns = function (minLength) {
    return this._runFinder.find(minLength);
}

// clear the cells for run (run: [1,2,..,n], indices of this.board)
LogicalBoard.prototype.clearRun = function (run) {
    for (var idx = 0; idx < run.length; idx += 1) {
        this._board[run[idx]] = '';
    }
}

// clear the cells in each run (runs: [[1,2,2], [3,5,7],..])
LogicalBoard.prototype.clearRuns = function (runs) {
    for (var idx = 0; idx < runs.length; idx += 1) {
        this.clearRun(runs[idx]);
    }
}

LogicalBoard.prototype.toString = function () {
    var buffer = '\n';
    for (var idx = 0; idx < this._board.length; idx += 1) {
        buffer += this._board[idx][0] + this._board[idx][1] || pad(idx, 2);
        buffer += ' ';
        if ((idx + 1)  % this._width === 0) {
            buffer += '\n';
        }
    }
    return buffer;
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
