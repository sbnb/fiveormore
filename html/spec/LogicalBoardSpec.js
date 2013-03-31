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

    it('should return four neighbours in the general case', function() {
        var cell = {x: 1 , y: 1},
            neighbourCells = [{x: 1 , y: 0}, {x: 0 , y: 1}, {x: 2 , y: 1},
                {x: 1 , y: 2}],
            neighbours;

        neighbours = board.getNeighbours(cell);
        expect(neighbours.length).toBe(4);
        for (var idx = 0; idx < neighbourCells.length; idx += 1) {
            expect(contains(neighbours, neighbourCells[idx])).toBe(true);
        }
    });

    it('should return two neighbours for top left cell', function() {
        var cell = {x: 0 , y: 0},
            neighbourCells = [{x: 1 , y: 0}, {x: 0 , y: 1}],
            neighbours;

        neighbours = board.getNeighbours(cell);
        expect(neighbours.length).toBe(2);
        for (var idx = 0; idx < neighbourCells.length; idx += 1) {
            expect(contains(neighbours, neighbourCells[idx])).toBe(true);
        }
    });


    it('should return two neighbours for bottom right cell', function() {
        var cell = {x: 12 , y: 12},
            neighbourCells = [{x: 11 , y: 12}, {x: 12 , y: 11}],
            neighbours;

        neighbours = board.getNeighbours(cell);
        expect(neighbours.length).toBe(2);
        for (var idx = 0; idx < neighbourCells.length; idx += 1) {
            expect(contains(neighbours, neighbourCells[idx])).toBe(true);
        }
    });

    // check can get only empty neighbours
    it('should return only empty neighbours if asked', function() {
        var cell = {x: 1 , y: 1},
            neighbourCells = [{x: 0 , y: 1}, {x: 2 , y: 1}, {x: 1 , y: 2}],
            neighbours;

        addListOfCellsToBoard(board, neighbourCells, 'blue');
        neighbours = board.getNeighbours(cell, true);
        expect(neighbours.length).toBe(1);
        expect(neighbours[0]).toEqual({x: 1, y: 0});
    });

    it('should return a snapshot of the board', function() {
        var snapshot = board.takeSnapshot();
        expect(snapshot.length).toBe(width * height);
    });

    it('can find differences between current state and old snapshot', function() {
        board.add({x: 2, y: 2}, 'green');
        var snapshot = board.takeSnapshot();
        expect();
        board.add({x: 2, y: 2}, '');
        board.add({x: 1, y: 1}, 'blue');
        var changed = board.getChangedCells(snapshot);
        expect(changed.length).toBe(2);
        expect(changed[0]).toEqual({x: 1, y: 1});
        expect(changed[1]).toEqual({x: 2, y: 2});
    });

    it('finds all cells changed if snapshot empty', function() {
        var changed = board.getChangedCells([]),
            lastIndex = width * height - 1;
        expect(changed.length).toBe(width * height);
        expect(changed[0]).toEqual({x: 0, y: 0});
        expect(changed[lastIndex]).toEqual({x: width - 1, y: height - 1});
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
