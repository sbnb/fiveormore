describe('GameEventProducer', function() {

    var eventProducer,
        gameEvents,
        board,
        width = 6,
        height = 6;

    beforeEach(function() {
        board = new FOM.LogicalBoard(width, height);
        gameEvents = [];
        eventProducer = new FOM.GameEventProducer(board, gameEvents);
    });

    it('ignores all events if gameEvents not empty', function() {
        gameEvents.push({foo: 'bar'});
        eventProducer.processClick();
        expect(gameEvents.length).toBe(1);
    });

    it('can add a seek move event to an empty events list', function() {
        board.cellSelected = {x: 2, y: 2};
        eventProducer.processClick({x: 1, y: 1});
        expect(gameEvents.length).toBe(1);
        expect(gameEvents[0].event).toBe(FOM.constants.SEEK_MOVE);
    });

    it('can select a filled cell with no current selection', function() {
        board.add({x: 1, y: 1}, 'red');
        eventProducer.processClick({x: 1, y: 1});
        expect(gameEvents.length).toBe(1);
        expect(gameEvents[0].event).toBe(FOM.constants.SELECT);
        expect(gameEvents[0].target).toEqual({x: 1, y: 1});
    });

    it('can select a filled cell with an existing selection', function() {
        board.add({x: 1, y: 1}, 'red');
        board.add({x: 2, y: 2}, 'green');
        board.cellSelected = {x: 2, y: 2};
        eventProducer.processClick({x: 1, y: 1});
        expect(gameEvents.length).toBe(1);
        expect(gameEvents[0].event).toBe(FOM.constants.SELECT);
        expect(gameEvents[0].target).toEqual({x: 1, y: 1});
    });

});
