describe('Renderer', function() {

    var board,
        width = 13,
        height = 13,
        renderer,
        onColor = 'blue',
        offColor = 'red',
        tableId = '#container table',
        previewSelector = '#preview';

    beforeEach(function() {
        // clear table cells
        $(tableId + ' td').removeClass();

        // clear preview tds
        $(previewSelector + ' li').removeClass();

        board = new FOM.LogicalBoard(width, height);
        renderer = new FOM.Renderer(board, tableId, previewSelector, new FOM.Score());
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
            var $cell = $(tableId + ' tbody tr').eq(0).find('td').eq(0);
            return $cell.hasClass(onColor);
        }, "$cell has class onColor", 1);

        runs(function() {
            var $cell = $(tableId + ' tbody tr').eq(0).find('td').eq(0);
            expect($cell.hasClass(onColor)).toBe(true);
        });
    });

    it('updates the DOM when a cell is selected', function() {
        // check that DOM has been updated to select the clicked cell
        var cell = {x: 2, y: 2};
        board.selectCell(cell);

        // select all cells to check cell selection clears all but one
        var $allCells = $(tableId + ' td');
            totalCells = $allCells.length;
        $allCells.addClass('selected');
        expect($(tableId + ' td.selected').length).toBe(totalCells);

        waits(1);

        runs(function() {
            var $cell = $(tableId + ' tr').eq(2).find('td').eq(2);
            expect($cell.hasClass('selected')).toBe(true);
            expect($(tableId + ' td.selected').length).toBe(1);
        });
    });


    it('renders the prevew stones', function() {
        waits(1);
        runs(function() {
            var $previewLis = $(previewSelector + ' li'),
                stones = board.previewStones.stones;
            expect($previewLis.eq(0).hasClass(stones[0])).toBe(true);
            expect($previewLis.eq(1).hasClass(stones[1])).toBe(true);
            expect($previewLis.eq(2).hasClass(stones[2])).toBe(true);
        });


    });

});
