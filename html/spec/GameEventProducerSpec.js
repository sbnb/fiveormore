describe('GameEventProducer', function() {

    var eventProducer,
        gameEvents = [],
        board,
        width = 6,
        height = 6;

    beforeEach(function() {
        board = new LogicalBoard(width, height);
        gameEvents = [];
        eventProducer = new GameEventProducer(board, gameEvents);
    });

    it('ignores all events if gameEvents not empty', function() {
        gameEvents.push({foo: 'bar'});
        eventProducer.processClick();
        expect(gameEvents.length).toBe(1);
    });

    it('can add a select event to the events list', function() {
        board.cellSelected = {x: 2, y: 2};
        eventProducer.processClick({x: 1, y: 1});
        expect(gameEvents.length).toBe(1);
    });



});
