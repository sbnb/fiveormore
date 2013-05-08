describe('HighScoreAccessor', function() {

    var highScoreAccessor,
        limit = 3,
        localReader,
        serverReader,
        localWriter,
        serverWriter;

    // mock the readers and writers for testing
    beforeEach(function() {

        localReader = jasmine.createSpyObj('LocalHighScoreReader', ['read']);
        localReader.read.andCallFake(function() {
            return getLocalList(limit);
        });

        serverReader = jasmine.createSpyObj('ServerHighScoreReader', ['read']);
        serverReader.read.andCallFake(function(callback) {
            return callback(getServerList(limit));
        });

        localWriter = jasmine.createSpyObj('LocalHighScoreWriter', ['write']);
        serverWriter = jasmine.createSpyObj('ServerHighScoreWriter', ['write']);

        var options = {
            localHighScoreReader: localReader,
            serverHighScoreReader: serverReader,
            localHighScoreWriter: localWriter,
            serverHighScoreWriter: serverWriter
        };
        highScoreAccessor = new HighScoreAccessor(options);
    });

    it('can get a HighScoreGroup on read', function() {
        highScoreAccessor.read(function (highScoreGroup) {
            expect(highScoreGroup.constructor.name).toEqual('HighScoreGroup');
            expect(localReader.read).toHaveBeenCalled();
            expect(serverReader.read).toHaveBeenCalled();
        });
    });

    it('returns the right lists as a HighScoreGroup', function() {
        highScoreAccessor.read(function (highScoreGroup) {
            expect(highScoreGroup.constructor.name).toEqual('HighScoreGroup');
            expect(highScoreGroup.local).toEqual(getLocalList(limit));
            var server = getServerList(limit);
            expect(highScoreGroup.recent).toEqual(server.recent);
            expect(highScoreGroup.allTime).toEqual(server.allTime);
        });
    });

    it('passes writes to the server writer', function() {
        var username = 'Amos',
            score = 123,
            uniqId = 'abc';
        highScoreAccessor.writeServer(username, score, uniqId);
        expect(serverWriter.write).toHaveBeenCalledWith(username, score, uniqId);
    });

    it('passes writes to the local writer', function() {
        var username = 'Amos',
            score = 123,
            uniqId = 'abc',
            localList = getLocalList(limit);
        highScoreAccessor.writeLocal(username, localList);
        expect(localWriter.write).toHaveBeenCalledWith(username, localList);
    });


    function getLocalList(limit) {
        var localList = new HighScoreList(limit);
        localList.maybeAdd('Bill', 100);
        localList.maybeAdd('Bill', 150);
        localList.maybeAdd('Bill', 200);
        return localList;
    }

    function getServerList(limit) {
        var scores = {},
            recentList = new HighScoreList(limit),
            allTimeList = new HighScoreList(limit);

        recentList.maybeAdd('Mary', 400);
        recentList.maybeAdd('Chuck', 300);
        recentList.maybeAdd('Megan', 250);

        allTimeList.maybeAdd('April', 1000);
        allTimeList.maybeAdd('Louise', 600);
        allTimeList.maybeAdd('Mary', 400);

        return {recent: recentList, allTime: allTimeList}
    }

});

