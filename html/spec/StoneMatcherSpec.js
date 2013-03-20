describe("StoneMatcher", function() {

    var stoneMatcher;

    beforeEach(function() {
        // insert fixtures into DOM

        var score = {};
        score.clearedChainOfLength = function() {};
        stoneMatcher = new StoneMatcher(score);
    });

    it("should pass this example test", function() {
        //~ expect(player.currentlyPlayingSong).toEqual(song);
        expect(stoneMatcher).toEqual(stoneMatcher);
    });

});
