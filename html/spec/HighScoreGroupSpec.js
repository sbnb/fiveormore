describe('HighScoreGroup', function() {

    var highScoreGroup,
        highScoreLists,
        highScoreAccessor,
        limit = 3,
        NAME = 0,
        SCORE = 1;

    beforeEach(function() {
        highScoreLists = {
            local: createHighScoreList(limit),
            recent: createHighScoreList(limit),
            allTime: createHighScoreList(limit)
        };
        highScoreAccessor = jasmine.createSpyObj('highScoreAccessor',
            ['writeLocal', 'writeServer']);

        highScoreGroup = new HighScoreGroup(highScoreLists, highScoreAccessor);
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

    it('recognises a qualifying score', function() {
        expect(highScoreGroup.isHighScore(11)).toBe(true);
        expect(highScoreGroup.isHighScore(100)).toBe(true);
    });

    it('recognises a non-qualifying score', function() {
        expect(highScoreGroup.isHighScore(0)).toBe(false);
        expect(highScoreGroup.isHighScore(10)).toBe(false);
    });

    it('adds qualifying highscore to local list', function() {
        highScoreGroup.update('Mary', 100, 'abcdefg');
        expect(highScoreLists.local.entries[0]).toEqual(['Mary', 100]);
        expect(highScoreLists.local.entries[1]).toEqual(['Chuck', 12]);
        expect(highScoreLists.local.entries[2]).toEqual(['Bill', 11]);

    });

    it('adds qualifying highscore to recent list', function() {
        highScoreGroup.update('Mary', 100, 'abcdefg');
        expect(highScoreLists.recent.entries[0]).toEqual(['Mary', 100]);
        expect(highScoreLists.recent.entries[1]).toEqual(['Chuck', 12]);
        expect(highScoreLists.recent.entries[2]).toEqual(['Bill', 11]);
    });

    it('adds qualifying highscore to allTime list', function() {
        highScoreGroup.update('Mary', 100, 'abcdefg');
        expect(highScoreLists.allTime.entries[0]).toEqual(['Mary', 100]);
        expect(highScoreLists.allTime.entries[1]).toEqual(['Chuck', 12]);
        expect(highScoreLists.allTime.entries[2]).toEqual(['Bill', 11]);
    });

    it('writes to the server and locally on new high scores', function() {
        highScoreGroup.update('Mary', 100, 'abcdefg');
        expect(highScoreAccessor.writeLocal).toHaveBeenCalled();
        expect(highScoreAccessor.writeLocal.callCount).toBe(1);
        expect(highScoreAccessor.writeServer).toHaveBeenCalled();
        expect(highScoreAccessor.writeServer.callCount).toBe(1);
    });



});

