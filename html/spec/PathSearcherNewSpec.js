describe('PathSearcherNew', function() {

    var searcher,
        board,
        width = 6,
        height = 6;


    beforeEach(function() {
        board = new LogicalBoard(width, height);
        searcher = new PathSearcherNew(board);
    });

    it('should find a path to an empty adjacent square', function() {
        var startCell = {x: 3 , y: 3},
            targetCell = {x: 4 , y: 3},
            color = 'blue',
            path;
        board.add(startCell, color);
        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(2);
    });

    it('should find a path to an empty nearby square', function() {
        var startCell = {x: 3 , y: 3},
            targetCell = {x: 5 , y: 4},
            color = 'blue',
            path;
        board.add(startCell, color);
        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(4);
    });

    it('should encapsulate a PathNode', function() {
        var cell = {x: 1, y: 1},
            node = new PathNode(cell, 10, 20);
        expect(node.x).toBe(1);
        expect(node.y).toBe(1);
    });


});
