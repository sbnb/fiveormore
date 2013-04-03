describe('GameEventConsumer', function() {

    var board,
        width = 6,
        height = 6,
        gameEvents,
        selectedCell = {x: 0, y: 0},
        targetCell = {x: 1, y: 1},
        color = 'blue',
        tableId = '#target table';

    beforeEach(function() {
        $(tableId + ' td').removeClass();
        board = new LogicalBoard(width, height);
        board.add(selectedCell, color);
        board.cellSelected = selectedCell;
        gameEvents = [];
        consumer = new GameEventConsumer(board, gameEvents);
        gameEvents.push({event: constants.SEEK_MOVE, target: targetCell});
    });

    it('translates valid move into animation transitions', function() {
        consumer.consume({schedulingOk: false});
        expect(gameEvents.length).toBe(2);
        _.forEach(gameEvents, function (event) {
            expect(event.event).toBe(constants.TRANSITION);
        }, this);
    });

    it('removes selectedCell from board', function() {
        consumer.consume({schedulingOk: false});
        expect(board.cellSelected).toBeNull();
    });

    it('registers selection of a filled cell', function() {
        gameEvents.length = 0;
        var filledCell = {x: 2, y: 2};
        board.add(filledCell, 'red');
        gameEvents.push({event: constants.SELECT, target: filledCell});
        consumer.consume();
        expect(board.cellSelected).toEqual(filledCell);
        expect(gameEvents.length).toBe(0);
    });

    it('consumes transition frames into animations', function() {
        consumer.consume({schedulingOk: false});  // create transitions
        consumer.consume({schedulingOk: false}); // consume first transition
        expect(gameEvents.length).toBe(1);
        expect(board.get(selectedCell)).toBe(constants.EMPTY);
        expect(board.get({x: 0, y: 1})).toBe(color);
        consumer.consume({schedulingOk: false}); // consume second transition
        expect(gameEvents.length).toBe(0);
        expect(board.get(selectedCell)).toBe(constants.EMPTY);
        expect(board.get({x: 0, y: 1})).toBe(constants.EMPTY);
        expect(board.get(targetCell)).toBe(color);
    });


    it('can schedule future consumes (async)', function() {
        runs(function() {
            consumer.consume({schedulingOk: true, interval: 1});
        });

        waitsFor(function() {
          return gameEvents.length === 0;
        }, "gameEvents length to be 0", 50);

        runs(function() {
            expect(board.get(selectedCell)).toBe(constants.EMPTY);
            expect(board.get({x: 0, y: 1})).toBe(constants.EMPTY);
            expect(board.get(targetCell)).toBe(color);
        });

    });

});
