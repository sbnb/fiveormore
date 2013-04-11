describe('HighScores', function() {

    var highScores,
        cookieHandler,
        readLocalSpy,
        saveLocalHighScoresSpy,
        localHs,
        serverData,
        NUM_TO_DISPLAY = 3;

    beforeEach(function() {
        localHs = [['Bill', 352], ['Bobby', 250], ['Chuck', 225]];
        serverData = {
            allTime:[['Robo', 20152], ['Marvin', 12000], ['Bot', 6700]],
            recent:[['Mary', 95], ['Sally', 80], ['April', 60]]
        };
        cookieHandler = new CookieHandler();
        readLocalSpy = spyOn(cookieHandler,
            'readLocalHighScores').andReturn(localHs);
        saveLocalHighScoresSpy = spyOn(cookieHandler,
            'saveLocalHighScores');
        highScores = new HighScores(cookieHandler, NUM_TO_DISPLAY);
    });

    it('calls cookieHandler.readLocalHighScores', function() {
        highScores.isNewHighScore(serverData, 100);
        expect(cookieHandler.readLocalHighScores).toHaveBeenCalled();
        expect(readLocalSpy).wasCalled();
    });

    it('rejects a non qualifying score', function() {
        expect(highScores.isNewHighScore(serverData, 20)).toBe(false);
    });

    it('recognises a new highscore', function() {
        expect(highScores.isNewHighScore(serverData, 100)).toBe(true);
    });

    it('displays local high scores', function() {
        highScores.displayHighScores({serverScores: serverData});
        var localHsText = $('#localScores dl').text(),
            lines = localHsText.split('\n');
        expect(lines[0]).toMatch(/1. Bill/);
        expect(lines[2]).toMatch(/2. Bobby/);
        expect(lines[4]).toMatch(/3. Chuck/);
        expect(lines[1]).toMatch(/352/);
        expect(lines[3]).toMatch(/250/);
        expect(lines[5]).toMatch(/225/);
        expect();
    });

    it('displays recent high scores', function() {
        highScores.displayHighScores({serverScores: serverData});
        var localHsText = $('#recentScores dl').text(),
            lines = localHsText.split('\n');
        expect(lines[0]).toMatch(/1. Mary/);
        expect(lines[2]).toMatch(/2. Sally/);
        expect(lines[4]).toMatch(/3. April/);
        expect(lines[1]).toMatch(/95/);
        expect(lines[3]).toMatch(/80/);
        expect(lines[5]).toMatch(/60/);
        expect();
    });

    it('displays all time high scores', function() {
        highScores.displayHighScores({serverScores: serverData});
        var localHsText = $('#allTimeScores dl').text(),
            lines = localHsText.split('\n');
        expect(lines[0]).toMatch(/1. Robo/);
        expect(lines[2]).toMatch(/2. Marvin/);
        expect(lines[4]).toMatch(/3. Bot/);
        expect(lines[1]).toMatch(/20152/);
        expect(lines[3]).toMatch(/12000/);
        expect(lines[5]).toMatch(/6700/);
        expect();
    });

    //~ this.enterNewHighScore = function(uniqId, name, theScore)
    it('enters new high score', function() {
        highScores.enterNewHighScore('abc', 'Gabo', 400);
        expect();
    });

});
