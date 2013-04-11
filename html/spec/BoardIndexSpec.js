describe('BoardIndex', function() {

    var rowIdx = 2,
        colIdx = 3,
        boardIndex,
        tableId = '#container table';

    beforeEach(function() {
        boardIndex = new BoardIndex(rowIdx, colIdx);
    });

    it('should recognise two equivalent board indexes as equal', function() {
        var other = new BoardIndex(rowIdx, colIdx);
        expect(boardIndex.equals(other)).toBe(true);
        expect(other.equals(boardIndex)).toBe(true);
    });

    it('should return the right jQuery object', function() {
        var $td = boardIndex.getAsJqueryTd(tableId);
        expect($td.text()).toBe('r2 c3');
    });

    it('mock mock mock', function() {
        spyOn(boardIndex, 'getAsJqueryTd').andCallThrough();
        var $td = boardIndex.getAsJqueryTd(tableId);
        expect($td.text()).toBe('r2 c3');
        expect(boardIndex.getAsJqueryTd).toHaveBeenCalledWith(tableId);
    });




});
