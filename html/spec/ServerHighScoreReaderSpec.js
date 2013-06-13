describe('ServerHighScoreReader', function() {

    var serverReader,
        limit = 3,
        serverScores = {
            recent: [['Amos', 9], ['Bill', 15], ['Chuck', 12]],
            allTime: [['Amos', 9], ['Bill', 15], ['Chuck', 12]]
        }

    beforeEach(function() {
        serverReader = new FOM.ServerHighScoreReader(limit);
    });

    it('reads local high scores', function() {
        var callBackMade = false,
            highScoresList = serverReader.read(function (highScores) {
            callBackMade = true;
        });

        waitsFor(function() {
            return callBackMade;
        }, "call back never made", 30);

        runs(function() {
            expect(callBackMade).toBe(true);
        });

    });

});

