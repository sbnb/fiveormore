describe('Node', function() {

    var rowIdx = 2,
        colIdx = 3,
        tableId = '#container table',
        $td,
        ancestor = null,
        boardIndex,
        targetNode = null,
        node;

    beforeEach(function() {
        boardIndex = new BoardIndex(rowIdx, colIdx);
        $td = boardIndex.getAsJqueryTd(tableId);
        node = new Node($td, ancestor, boardIndex, targetNode);
    });

    it('should return the neighbour above', function() {
        var neighbour = node.getAdjacentBoardIndex(UP);
        expect(neighbour.row).toBe(1);
        expect(neighbour.col).toBe(3);
    });

    it('should return the neighbour below', function() {
        var neighbour = node.getAdjacentBoardIndex(DOWN);
        expect(neighbour.row).toBe(3);
        expect(neighbour.col).toBe(3);
    });

    it('should return the neighbour to right', function() {
        var neighbour = node.getAdjacentBoardIndex(RIGHT);
        expect(neighbour.row).toBe(2);
        expect(neighbour.col).toBe(4);
    });

    it('should return the neighbour to left', function() {
        var neighbour = node.getAdjacentBoardIndex(LEFT);
        expect(neighbour.row).toBe(2);
        expect(neighbour.col).toBe(2);
    });
});
