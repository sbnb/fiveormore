describe('HighScoreGroup', function() {

    var highScoreGroup,
        highScoreLists,
        limit = 3,
        NAME = 0,
        SCORE = 1;

    beforeEach(function() {
        highScoreLists = {
            local: createHighScoreList(limit),
            recent: createHighScoreList(limit),
            allTime: createHighScoreList(limit)
        };

        highScoreGroup = new HighScoreGroup(highScoreLists);
    });

    it('contains local high scores', function() {
        expect(highScoreGroup.local.entries.length).toBe(3);
        expect(highScoreGroup.local.entries[0][NAME]).toBe('Chuck');
        expect(highScoreGroup.local.entries[0][SCORE]).toBe(12);
    });

    it('contains recent high scores', function() {
        expect(highScoreGroup.recent.entries.length).toBe(3);
        expect(highScoreGroup.local.entries[1][NAME]).toBe('Bill');
        expect(highScoreGroup.local.entries[1][SCORE]).toBe(11);
    });

    it('contains allTime high scores', function() {
        expect(highScoreGroup.allTime.entries.length).toBe(3);
        expect(highScoreGroup.local.entries[2][NAME]).toBe('Bob');
        expect(highScoreGroup.local.entries[2][SCORE]).toBe(10);
    });

    it('detects new high scores', function() {
        expect(highScoreGroup.isHighScore(100)).toBe(true);
    });

    it('detects non high scores', function() {
        expect(highScoreGroup.isHighScore(1)).toBe(false);
    });



});

