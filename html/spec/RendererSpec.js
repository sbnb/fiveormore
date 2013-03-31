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
        renderer.render();
    });

    it('takes a snapshot after rendering', function() {
        expect(renderer.snapshot.length).toBe(width * height);
        expect(renderer.snapshot[0]).toBe('blue');
    });

    it('updates the DOM with changed cells', function() {
        var $cell = $(tableId + ' tr').eq(0).find('td').eq(0);
        expect($cell.hasClass(onColor)).toBe(true);
    });



});
