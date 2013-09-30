(function () {

    "use strict";

    /*
        RunFinder

        Searches the board for completed runs, vertically, horizontally and
        diagonally upward and downward.
    */

    FOM.RunFinder = function (logicalBoard) {
        this.logicalBoard = logicalBoard;
        this.boardArray = logicalBoard._board;
    };

    // return a list of completed runs as arrays of indices
    FOM.RunFinder.prototype.find = function (minLength) {

        var singleRuns = {},
            savedRuns = {horizontal: [], vertical: [], leftDiagonal: [],
                rightDiagonal: []},
            width = this.logicalBoard._width,
            height = this.logicalBoard._height;

        for (var idx = 0; idx < this.boardArray.length; idx += 1) {
            singleRuns.horizontal =
                this.findRun(idx, 1, getEndOfRow(idx, width));
            singleRuns.vertical =
                this.findRun(idx, width, this.boardArray.length);
            singleRuns.leftDiagonal =
                this.findRun(idx, width + 1,
                    getDownDiagonalLimit(idx, width, height));
            singleRuns.rightDiagonal =
                this.findRun(idx, width - 1,
                    getLeftDiagonalLimit(idx, width, height));

            saveValidRuns(singleRuns, savedRuns, minLength);
        }

        return savedRuns.horizontal.concat(
            savedRuns.vertical,
            savedRuns.rightDiagonal,
            savedRuns.leftDiagonal);
    };

    FOM.RunFinder.prototype.findRun = function (startIdx, increment, limit) {
        /*jshint maxdepth:3*/
        /* jshint -W074 */
        var idx,
            run = [];

        if (this.boardArray[startIdx] !== '') {
            var color = this.boardArray[startIdx];
            idx = startIdx;
            while (this.boardArray[idx] === color) {
                run.push(idx);
                idx += increment;
                if (idx >= limit || idx > this.boardArray.length) {
                    break;
                }
            }
        }
        return run;
    };

    // save new runs, if they are long enough and unique
    function saveValidRuns(singleRuns, savedRuns, minLength) {
        /* jshint forin: false */
        var run, saved, key;

        for (key in singleRuns) {
            run = singleRuns[key];
            saved = savedRuns[key];
            if (run.length >= minLength && isUniqueRun(run, saved)) {
                saved.push(run);
            }
        }
    }

    // true if run is not a subset of any member of runs
    function isUniqueRun(run, runs) {
        if (run.length === 0) {
            return false;
        }

        for (var idx = 0; idx < runs.length; idx += 1) {
            if (subset(run, runs[idx])) {
                return false;
            }
        }
        return true;
    }

    // true if every element of array a is also in array b
    function subset(a, b) {
        var intersection = _.intersection(a, b);
        return intersection.length === a.length;
    }

    // given width of 3: idx=[0,1,2] => 3 : idx=[3,4,5] => 6, etc
    function getEndOfRow(idx, width) {
        var limit = idx + 1;

        while (limit % width !== 0) {
            limit += 1;

            if (limit > 200) {
                FOM.tools.assert(false,
                    'RunFinder.getEndOfRow: infinite loop detected');
                break;
            }
        }
        return limit;
    }

    // count the max cells between this cell and any board edge diagonally down
    function getDownDiagonalLimit(idx, width, height) {
        var rightEdge = width - (idx % width) - 1,
            min = Math.min(rightEdge, getBottomEdge(idx, height)),
            limit = idx + min * width + min + 1;
        return limit;
    }

    // count the max cells between this cell and any board edge diagonally up
    function getLeftDiagonalLimit(idx, width, height) {
        var leftEdge = idx % width,
            min = Math.min(leftEdge, getBottomEdge(idx, height)),
            limit = idx + min * width - min + 1;
        return limit;
    }

    function getBottomEdge(idx, height) {
        return height - Math.floor(idx / height) - 1;
    }

})();
