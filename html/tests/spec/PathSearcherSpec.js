describe('PathSearcher', function() {

    var searcher,
        board,
        width = 6,
        height = 6;


    beforeEach(function() {
        board = new FOM.LogicalBoard(width, height);
        searcher = new FOM.PathSearcher(board);
    });

    it('should find a path to an empty adjacent square', function() {
        var startCell = {x: 3 , y: 3},
            targetCell = {x: 4 , y: 3},
            color = 'blue',
            path;
        board.add(startCell, color);
        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(1);
        expect(contains(path, {x: 4, y: 3})).toBe(true);
    });

    it('should find a path to an empty nearby square', function() {
        var startCell = {x: 3 , y: 3},
            targetCell = {x: 5 , y: 4},
            color = 'blue',
            path;
        board.add(startCell, color);
        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(3);
        expect(contains(path, {x: 5, y: 4})).toBe(true);
    });

    it('should detect when no path is possible', function() {
        var startCell = {x: 0 , y: 0},
            targetCell = {x: 5 , y: 5},
            color = 'blue',
            path;

        board.add(startCell, color);
        board.add({x: 5, y: 4}, color);
        board.add({x: 4, y: 5}, color);

        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(0);
    });

    it('should encapsulate a PathNode', function() {
        var cell = {x: 1, y: 1},
            node = new FOM.PathNode(cell, 10, 20);
        expect(node.x).toBe(1);
        expect(node.y).toBe(1);
    });


});
