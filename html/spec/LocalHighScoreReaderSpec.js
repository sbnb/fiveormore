describe('LocalHighScoreReader', function() {

    var localReader,
        limit = 3,
        cookieHandler,
        localScores = [['Amos', 9], ['Bill', 15], ['Chuck', 12]],
        localHighScoresList;

    beforeEach(function() {
        cookieHandler = jasmine.createSpyObj('CookieHandler', ['readLocalHighScores']);
        cookieHandler.readLocalHighScores.andCallFake(function() {
            return localScores;
        });
        localReader = new FOM.LocalHighScoreReader(cookieHandler, limit);
    });

    it('reads local high scores', function() {
        var highScoresList = localReader.read(),
            entries = highScoresList.entries;
        expect(entries[0]).toEqual(['Bill', 15]);
        expect(entries[1]).toEqual(['Chuck', 12]);
        expect(entries[2]).toEqual(['Amos', 9]);
    });

});

