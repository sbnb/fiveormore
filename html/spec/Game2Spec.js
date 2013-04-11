describe('Game2', function() {

    var gameBuilder = new GameBuilder('#container'),
        game,
        boardSelector = '#container';

    // global, try and re-think this
    isIe = false;

    beforeEach(function() {
        game = gameBuilder.build(boardSelector);
    });

    it('can be constructed with a builder', function() {
        //~ console.log(JSON.stringify(game, null, 2));
        runs(function() {
            $(boardSelector + ' td').eq(6).trigger('click');
        });

    });

});
