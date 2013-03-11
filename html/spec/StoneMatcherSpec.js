describe("StoneMatcher", function() {

    var stoneMatcher;

    beforeEach(function() {
        var score = {};
        score.clearedChainOfLength = function() {
            //NOP
        };

        stoneMatcher = new StoneMatcher(score);
    });

    it("should pass this example test", function() {
        //~ expect(player.currentlyPlayingSong).toEqual(song);
        expect(stoneMatcher).toEqual(stoneMatcher);
    });

});
