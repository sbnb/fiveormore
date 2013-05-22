describe('GameEventConsumer', function() {

    var board,
        width = 6,
        height = 6,
        game,
        gameEvents,
        selectedCell = {x: 0, y: 0},
        targetCell = {x: 1, y: 1},
        color = 'blue',
        tableId = '#container table';

    beforeEach(function() {
        $(tableId + ' td').removeClass();
        board = new LogicalBoard(width, height);
        board.add(selectedCell, color);
        board.cellSelected = selectedCell;
        gameEvents = [];

        //~ game = new GameBuilder('#container').build(constants.BOARD_SELECTOR);

        consumer = new GameEventConsumer(board, gameEvents, new Score(new PointsPopup()), game);
        //~ consumer = new GameEventConsumer(game);
        gameEvents.push({event: constants.SEEK_MOVE, target: targetCell});
    });

    it('translates valid move into animation transitions', function() {
        consumer.consume({schedulingOk: false});
        expect(countEvents(gameEvents, constants.TRANSITION)).toBe(2);
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

        expect(countEvents(gameEvents, constants.TRANSITION)).toBe(1);
        expect(board.get(selectedCell)).toBe(constants.EMPTY);
        expect(board.get({x: 0, y: 1})).toBe(color);

        consumer.consume({schedulingOk: false}); // consume second transition

        expect(countEvents(gameEvents, constants.TRANSITION)).toBe(0);
        expect(board.get(selectedCell)).toBe(constants.EMPTY);
        expect(board.get({x: 0, y: 1})).toBe(constants.EMPTY);
        expect(board.get(targetCell)).toBe(color);
    });

    it('can schedule future consumes (async)', function() {
        runs(function() {
            consumer.consume({schedulingOk: true, interval: 1});
        });

        waitsFor(function() {
          return countEvents(gameEvents, constants.TRANSITION) === 0;
        }, "gameEvents length to be 0", 50);

        runs(function() {
            expect(board.get(selectedCell)).toBe(constants.EMPTY);
            expect(board.get({x: 0, y: 1})).toBe(constants.EMPTY);
            expect(board.get(targetCell)).toBe(color);
        });

    });

    it('does not add pieces after a matched run', function() {
        // fill board with a run
        var cells = [{x: 0 , y: 1}, {x: 1 , y: 1}, {x: 2 , y: 1}, {x: 3 , y: 1}, {x: 4 , y: 1}];
        addListOfCellsToBoard(board, cells, 'green');
        gameEvents.length = 0;

        // run a match (will succeed)
        gameEvents.push({event: constants.MATCH_RUNS});
        consumer.consume({schedulingOk: false});

        // no events created since the match found a run (no add pieces)
        expect(gameEvents.length).toBe(0);
    });

    it('does add pieces after a failure to match a run', function() {
        gameEvents.length = 0;

        // run a match (which will fail)
        gameEvents.push({event: constants.MATCH_RUNS});
        consumer.consume({schedulingOk: false});

        // expect an ADD_PIECES event, and a special MATCH_NO_ADD event
        expect(countEvents(gameEvents, constants.ADD_PIECES)).toBe(1);
        expect(countEvents(gameEvents, constants.MATCH_RUNS_NO_ADD)).toBe(1);
    });

    //~ it('does not add pieces after a matched run', function() {
        //~ // fill board with a run
        //~ var cells = [{x: 0 , y: 1}, {x: 1 , y: 1}, {x: 2 , y: 1}, {x: 3 , y: 1}, {x: 4 , y: 1}];
        //~ addListOfCellsToBoard(board, cells, 'green');
        //~ gameEvents.length = 0;

        //~ // run a match (will succeed)
        //~ gameEvents.push({event: constants.MATCH_RUNS});
        //~ consumer.consume({schedulingOk: false});

        //~ // no events created since the match found a run (no add pieces)
        //~ expect(gameEvents.length).toBe(0);
    //~ });


});
