describe('Renderer', function() {

    var board,
        width = 13,
        height = 13,
        renderer,
        onColor = 'blue',
        offColor = 'red',
        tableId = '#target table';

    beforeEach(function() {
        $(tableId + ' td').removeClass();
        board = new LogicalBoard(width, height);
        renderer = new Renderer(board, tableId);
        setFiveRunsOfThree(board, onColor, offColor);
    });

    it('takes a snapshot after rendering', function() {
        waitsFor(function() {
            return renderer.snapshot.length === width * height;
        }, "snapshot length to be width * height", 1);

        runs(function() {
            expect(renderer.snapshot.length).toBe(width * height);
            expect(renderer.snapshot[0]).toBe('blue');
        });

    });

    it('updates the DOM with changed cells', function() {
        waitsFor(function() {
            var $cell = $(tableId + ' tr').eq(0).find('td').eq(0);
            return $cell.hasClass(onColor);
        }, "$cell has class onColor", 1);

        runs(function() {
            var $cell = $(tableId + ' tr').eq(0).find('td').eq(0);
            expect($cell.hasClass(onColor)).toBe(true);
        });
    });





});
