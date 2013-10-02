describe('PreviewStones', function() {

    var preview;

    beforeEach(function() {
        preview = new FOM.PreviewStones();
    });

    it('can refresh the preview stones', function() {
        preview.refresh();
        expect(preview.size()).toBe(3);
    });

    it('can add preview stones to board', function() {
        var board = new FOM.LogicalBoard(6, 6);
        preview.refresh();
        preview.addToBoard(board);
        expect(board.getEmptyCells().length).toBe(36 - 3);
    });
});
