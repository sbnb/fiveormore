(function () {

    "use strict";

    FOM.RunFinder = function (logicalBoard) {
        this.logicalBoard = logicalBoard;
        this.boardArray = logicalBoard._board;
    };

    // return a list of completed runs as arrays of indices
    FOM.RunFinder.prototype.find = function (minLength) {

        var singleRuns = {},
            savedRuns = {horizontal: [], vertical: [], leftDiagonal: [], rightDiagonal: []},
            boardArray = this.logicalBoard._board,
            width = this.logicalBoard._width,
            height = this.logicalBoard._height;

        for (var idx = 0; idx < this.boardArray.length; idx += 1) {
            singleRuns.horizontal = findRun(boardArray, width, idx, 1, getEndOfRow(idx, width));
            singleRuns.vertical = findRun(boardArray, width, idx, width, boardArray.length);
            singleRuns.leftDiagonal = findRun(boardArray, width, idx, width + 1, getDownDiagonalLimit(idx, width, height));
            singleRuns.rightDiagonal = findRun(boardArray, width, idx, width - 1, getLeftDiagonalLimit(idx, width, height));
            saveValidRuns(singleRuns, savedRuns, minLength);
        }
        return savedRuns.horizontal.concat(savedRuns.vertical, savedRuns.rightDiagonal, savedRuns.leftDiagonal);
    };

    function findRun(boardArray, width, startIdx, increment, limit) {
        var idx,
            run = [];

        if (boardArray[startIdx] !== '') {
            var color =  boardArray[startIdx];
            idx = startIdx;
            while (boardArray[idx] === color ) {
                run.push(idx);
                idx += increment;
                if (idx >= limit || idx > boardArray.length) {
                    break;
                }
            }
        }
        return run;
    }

    // save new runs, if they are long enough and unique
    function saveValidRuns(singleRuns, savedRuns, minLength) {
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
        if (a.length > b.length) {
            return false;
        }

        var setA = arrayToKeys(a),
            setB = arrayToKeys(b);

        for (var element in setA) {
            if (!(element in setB)) {
                return false;
            }
        }
        return true;
    }

    // convert array vals to obj keys ['a','b','c'] => {'a': 'a', 'b': 'b', 'c': 'c'}
    function arrayToKeys(array) {
        var obj = {};
        for (var i = 0; i < array.length; ++i) {
            if (array[i] !== undefined) obj[array[i]] = array[i];
        }
        return obj;
    }

    // given width of 3: idx=[0,1,2] => 3 : idx=[3,4,5] => 6, etc
    function getEndOfRow(idx, width) {
        var limit = idx + 1;

        while (limit % width !== 0) {
            limit += 1;

            if (limit > 200) {
                FOM.tools.assert(false, 'RunFinder.getEndOfRow: infinite loop detected');
                break;
            }
        }
        return limit;
    }

    function getDownDiagonalLimit(idx, width, height) {
        var rightEdge = width - (idx % width) - 1,
            min = Math.min(rightEdge, getBottomEdge(idx, height)),
            limit = idx + min * width + min + 1;
        return limit;
    }

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
