describe('RunFinder', function() {

    var finder,
        board;

    beforeEach(function() {
        board = new FOM.LogicalBoard(6,6);
        finder = new FOM.RunFinder(board);
    });

    it('should find a horizontal run', function() {
        var color = 'red',
            minLength = 3;
        board.add({x: 1, y: 1}, color);
        board.add({x: 2, y: 1}, color);
        board.add({x: 3, y: 1}, color);
        board.add({x: 4, y: 1}, color);
        board.add({x: 5, y: 1}, color);
        board.add({x: 0, y: 2}, color);

        var runs = finder.find(minLength);
        expect(runs.length).toBe(1);
        expect(runs[0]).toEqual([7, 8, 9, 10, 11]);
    });

    it('should find a vertical run', function() {
        var color = 'red',
            minLength = 3;
        board.add({x: 2, y: 1}, color);
        board.add({x: 2, y: 2}, color);
        board.add({x: 2, y: 3}, color);
        board.add({x: 2, y: 4}, color);
        board.add({x: 2, y: 5}, color);
        board.add({x: 3, y: 0}, color);

        var runs = finder.find(minLength);
        expect(runs.length).toBe(1);
        expect(runs[0]).toEqual([8, 14, 20, 26, 32]);
    });

    it('should find a right diagonal run', function() {
        var color = 'red',
            minLength = 3;
        board.add({x: 2, y: 0}, color);
        board.add({x: 3, y: 1}, color);
        board.add({x: 4, y: 2}, color);
        board.add({x: 5, y: 3}, color);
        board.add({x: 0, y: 5}, color);

        var runs = finder.find(minLength);
        expect(runs.length).toBe(1);
        expect(runs[0]).toEqual([2, 9, 16, 23]);
    });

    it('should find a left diagonal run', function() {
        var color = 'red',
            minLength = 3;
        board.add({x: 3, y: 0}, color);
        board.add({x: 2, y: 1}, color);
        board.add({x: 1, y: 2}, color);
        board.add({x: 0, y: 3}, color);
        board.add({x: 5, y: 3}, color);

        var runs = finder.find(minLength);
        expect(runs.length).toBe(1);
        expect(runs[0]).toEqual([3, 8, 13, 18]);
    });

    it('should find runs of same color', function() {
        setFiveRunsOfThree(board, 'blue', 'red');
        var runs = finder.find(3);
        expect(runs.length).toEqual(5);
        flattened = _.flatten([[6,7,8],[0,6,12],[2,8,14],[0,7,14],[2,7,12]]);

        expect(_.flatten(runs).sort()).toEqual(flattened.sort());
    });

});
