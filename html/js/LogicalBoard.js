(function () {

    "use strict";
    /*global PubSub*/

    /*
        A model of the board. This object contains NO jQuery or controllers.
    */
    FOM.LogicalBoard = function (width, height) {
        this._board = [];
        this._width = width;
        this._height = height;
        this._topic = 'topic';
        this._runFinder = new FOM.RunFinder(this);
        this.cellSelected = null;
        this.previewStones = new FOM.PreviewStones();

        for (var idx = 0, len = width * height; idx < len; idx += 1) {
            this._board.push('');
        }
    };

    FOM.LogicalBoard.prototype = {
        // True if no empty cells on board
        isFull:
            function () {
                return _.every(this._board, function (color) {
                    return color !== '';
                });
            },

        // get idx into this.board given cell(x,y) (idx = width * y + x)
        index:
            function (cell) {
                return this._width * cell.y + cell.x;
            },

        // add a stone color at cell(x,y)
        add:
            function (cell, color) {
                this._board[this.index(cell)] = color;
                PubSub.publish(FOM.constants.UPDATES, {});
            },

        // place a list of stones randomly on the board in empty cells
        // returns: the array of cells where they were placed
        placeStones:
            function (stones) {
                var emptyCells = this.getEmptyCells().slice(0, stones.length);
                _.forEach(emptyCells, function (cell, idx) {
                    this._board[this.index(cell)] = stones[idx];
                }, this);
                PubSub.publish(FOM.constants.UPDATES, {});
                return emptyCells;
            },

        // place the stones in preview stones onto the board
        addPreviewStones:
            function () {
                this.previewStones.addToBoard(this);
            },

        selectCell:
            function (cell) {
                this.cellSelected = cell;
                PubSub.publish(FOM.constants.UPDATES, {});
            },

        getSelectedCell:
            function () {
                return this.cellSelected;
            },

        // retrieve the color at cell(x,y) (or empty string)
        get:
            function (cell) {
                return this._board[this.index(cell)];
            },

        // return the empty cells as a shuffled array (random order)
        getEmptyCells:
            function () {
                var emptyCells = [];
                _.forEach(this._board, function (color, idx) {
                    if (color === '') {
                        emptyCells.push(this._cellFromIndex(idx));
                    }
                }, this);
                return _.shuffle(emptyCells);
            },

        // retrieve the neighbours of cell as an array of cells
        // a neighbour is a vertically or horizontally adjacent cell
        // if onlyEmpty is given as true, ignore filled neighbours
        getNeighbours:
            function (cell, onlyEmpty) {
                onlyEmpty = FOM.tools.setIfUndefined(onlyEmpty, false);
                var neighbours = [];

                if (cell.y > 0) {
                    neighbours.push({x: cell.x, y: cell.y - 1});
                }

                if (cell.y + 1 < this._height) {
                    neighbours.push({x: cell.x, y: cell.y + 1});
                }

                if (cell.x > 0) {
                    neighbours.push({x: cell.x - 1, y: cell.y});
                }

                if (cell.x + 1 < this._width) {
                    neighbours.push({x: cell.x + 1, y: cell.y});
                }

                if (onlyEmpty) {
                    neighbours = this._removeFilledNeighbours(neighbours);
                }
                return neighbours;
            },

        // return only the empty neighbours
        _removeFilledNeighbours:
            function (neighbours) {
                var emptyNeighbours = [];
                _.forEach(neighbours, function (neighbour) {
                    if (this.get(neighbour) === '') {
                        emptyNeighbours.push(neighbour);
                    }
                }, this);
                return emptyNeighbours;
            },

        // return a list of completed runs as arrays of indices
        findCompleteRuns:
            function (minLength) {
                return this._runFinder.find(minLength);
            },

        // clear the cells for run (run: [1,2,..,n], indices of this.board)
        clearRun:
            function (run) {
                _.forEach(run, function (index) {
                    this._board[index] = '';
                }, this);
            },

        // clear the cells in each run (runs: [[1,2,2], [3,5,7],..])
        clearRuns:
            function (runs) {
                _.forEach(runs, function (run) {
                    this.clearRun(run);
                }, this);
                PubSub.publish(FOM.constants.UPDATES, {});
            },

        subscribe:
            function (subscriber) {
                return PubSub.subscribe(FOM.constants.UPDATES, subscriber);
            },

        takeSnapshot:
            function () {
                return this._board.slice();
            },

        getChangedCells:
            function (snapshot) {
                var changed = [];
                _.forEach(this._board, function (color, index) {
                    if (index >= snapshot.length || color !== snapshot[index]) {
                        changed.push(this._cellFromIndex(index));
                    }
                }, this);
                return changed;
            },

        _cellFromIndex:
            function (index) {
                var x = (index % this._width),
                    y = Math.floor(index / this._width);
                return {x: x, y: y};
            },

        toString:
            function () {
                var buffer = 'LogicalBoard:\n';
                _.forEach(this._board, function (color, index) {
                    buffer += color.slice(0, 2) || pad(index, 2);
                    buffer += ' ';
                    if ((index + 1) % this._width === 0) {
                        buffer += '\n';
                    }
                }, this);
                return buffer;
            }
    };


    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }

})();
