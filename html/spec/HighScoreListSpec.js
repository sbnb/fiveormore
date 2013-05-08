describe('HighScoreList', function() {

    var highScoreList,
        LIMIT = 3,
        NAME = 0,
        SCORE = 1;

    beforeEach(function() {
        highScoreList = new HighScoreList(LIMIT);
    });

    it('can add entries to an empty list', function() {
        populateHighScoreList(highScoreList);
        expect(highScoreList.entries.length).toBe(LIMIT);
    });

    it('orders the entries in descending order', function() {
        populateHighScoreList(highScoreList);
        expect(highScoreList.entries[0][NAME]).toBe('Chuck');
        expect(highScoreList.entries[0][SCORE]).toBe(12);
        expect(highScoreList.entries[1][NAME]).toBe('Bill');
        expect(highScoreList.entries[1][SCORE]).toBe(11);
        expect(highScoreList.entries[2][NAME]).toBe('Bob');
        expect(highScoreList.entries[2][SCORE]).toBe(10);
    });

    it('replaces lower scores with higher scores', function() {
        populateHighScoreList(highScoreList);
        highScoreList.maybeAdd('Mary', 15);
        highScoreList.maybeAdd('April', 14);
        expect(highScoreList.entries[0][NAME]).toBe('Mary');
        expect(highScoreList.entries[0][SCORE]).toBe(15);
        expect(highScoreList.entries[1][NAME]).toBe('April');
        expect(highScoreList.entries[1][SCORE]).toBe(14);
        expect(highScoreList.entries.length).toBe(LIMIT);
    });

    it('can give scores as an array suitable for cookieHandler', function() {
        populateHighScoreList(highScoreList);
        var asArray = highScoreList.toArray()
        expect(asArray).toEqual([['Chuck', 12], ['Bill', 11], ['Bob', 10]]);
    });
});
