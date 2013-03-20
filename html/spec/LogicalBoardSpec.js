describe('LogicalBoard', function() {

    var board,
        width = 13,
        height = 13,
        onColor = 'blue',
        offColor = 'red';

    beforeEach(function() {
        board = new LogicalBoard(width, height);
    });

    it('should not be full when created', function() {
        expect(board.isFull()).toBe(false);
    });


    it('should return the color from x,y we have inserted there', function() {
        var cell = {x: 3 , y: 3},
            color = 'blue';
        board.add(cell, color);
        expect(board.get(cell)).toBe(color);
    });

    it('should report as full if it is', function() {
        fillBoard();
        expect(board.isFull()).toBe(true);
    });

    it('should clear a run of cells when asked', function() {
        var run = [0, 1, 2, 3, 4, 5],
            cells = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0},
                {x: 4, y: 0}, {x: 5, y: 0}];
        fillBoard();
        board.clearRun(run);
        for (var idx = 0; idx < cells.length; idx += 1) {
            expect(board.get(cells[idx])).toBe('');
        }
    });

    it('should find runs of same color', function() {
        setFiveRunsOfThree(board, onColor, offColor);
        var runs = board.findCompleteRuns(3);
        expect(runs.length).toEqual(5);
    });


    it('should clear a list of runs when asked', function() {
        var runs = [[0, 13, 26], [0, 14, 28], [2, 15, 28]],
            clearCells = [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2},
                            {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2},
                            {x: 1, y: 1}],
            filledCells = [{x: 1, y: 0}, {x: 1, y: 2}];

        setFiveRunsOfThree(board, onColor, offColor);
        board.clearRuns(runs);

        for (var idx = 0; idx < clearCells.length; idx += 1) {
            expect(board.get(clearCells[idx])).toBe('');
        }
        expect(board.get(filledCells[0])).toBe(offColor);
        expect(board.get(filledCells[1])).toBe(offColor);
    });


    function fillBoard() {
        var color = 'blue';
        for (var x = 0; x < width; x += 1) {
            for (var y = 0; y < height; y += 1) {
                board.add({x: x, y: y}, color);
            }
        }
    }

});
