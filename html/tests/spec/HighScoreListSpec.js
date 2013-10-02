describe('HighScoreList', function() {

    var highScoreList,
        LIMIT = 3,
        NAME = 0,
        SCORE = 1;

    beforeEach(function() {
        highScoreList = new FOM.HighScoreList(LIMIT);
        populateHighScoreList(highScoreList);
    });

    it('can add entries to an empty list', function() {
        expect(highScoreList.entries.length).toBe(LIMIT);
    });

    it('recognises a qualifying score, by merit', function() {
        expect(highScoreList.isHighScore(15)).toBe(true);
        expect(highScoreList.isHighScore(11)).toBe(true);
    });

    it('recognises a non-qualifying score, by merit', function() {
        expect(highScoreList.isHighScore(10)).toBe(false);
        expect(highScoreList.isHighScore(0)).toBe(false);
    });

    it('recognises a qualifying score, by empty slots available', function() {
        var aHighScoreList = new FOM.HighScoreList(LIMIT);
        expect(aHighScoreList.isHighScore(0)).toBe(true);
        expect(aHighScoreList.isHighScore(20)).toBe(true);
    });

    it('orders the entries in descending order', function() {
        expect(highScoreList.entries[0][NAME]).toBe('Chuck');
        expect(highScoreList.entries[0][SCORE]).toBe(12);
        expect(highScoreList.entries[1][NAME]).toBe('Bill');
        expect(highScoreList.entries[1][SCORE]).toBe(11);
        expect(highScoreList.entries[2][NAME]).toBe('Bob');
        expect(highScoreList.entries[2][SCORE]).toBe(10);
    });

    it('replaces lower scores with higher scores', function() {
        highScoreList.maybeAdd('Mary', 15);
        highScoreList.maybeAdd('April', 14);
        expect(highScoreList.entries[0][NAME]).toBe('Mary');
        expect(highScoreList.entries[0][SCORE]).toBe(15);
        expect(highScoreList.entries[1][NAME]).toBe('April');
        expect(highScoreList.entries[1][SCORE]).toBe(14);
        expect(highScoreList.entries.length).toBe(LIMIT);
    });

    it('can give scores as an array suitable for cookieHandler', function() {
        var asArray = highScoreList.toArray()
        expect(asArray).toEqual([['Chuck', 12], ['Bill', 11], ['Bob', 10]]);
    });

    it('wraps the list in html', function() {
        var frag = highScoreList.wrapInHtml();
        expect(frag).toMatch('dt');
    });

});
