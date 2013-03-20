describe('PathSearcherNew', function() {

    var searcher,
        board,
        width = 6,
        height = 6;


    beforeEach(function() {
        board = new LogicalBoard(width, height);
        searcher = new PathSearcherNew(board);
    });

    it('Should find a path to an empty adjacent square', function() {
        var startCell = {x: 3 , y: 3},
            targetCell = {x: 4 , y: 3},
            color = 'blue',
            path;
        board.add(startCell, color);
        path = searcher.search(startCell, targetCell);
        expect(path.length).toBe(1);
    });

});
