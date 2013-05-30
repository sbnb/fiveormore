(function () {

    "use strict";
    /*global window*/

    /*
        Wires together a new Game object.
    */

    FOM.GameBuilder = function(container) {
        this._container = container;
    };

    // TODO: only window.game should be exposed in the DOM - currently full of crap

    // build a new Game object and return it - call on game start (& restart)
    FOM.GameBuilder.prototype.build = function (boardSelector) {
        var game = new FOM.Game2(),
            logicalBoard = new FOM.LogicalBoard(FOM.constants.DIMENSIONS.WIDTH,
                                            FOM.constants.DIMENSIONS.HEIGHT),
            gameEvents = [],
            cookieHandler = new FOM.CookieHandler(),
            popups = new FOM.PopupController(),
            pointsPopup = new FOM.PointsPopup(),
            score = new FOM.Score(pointsPopup),
            clickHandlers;

        game.popups = popups;
        game.cookieHandler = cookieHandler;
        game.highScoreAccessor = buildHighScoreAccessor(cookieHandler);
        game.logicalBoard = logicalBoard;
        game.score = score;
        game.renderer = new FOM.Renderer(logicalBoard, boardSelector,
            FOM.constants.PREVIEW_SELECTOR, score);
        game.gameEvents = gameEvents;
        game.gameEventProducer = new FOM.GameEventProducer(logicalBoard, gameEvents);
        game.gameEventConsumer = new FOM.GameEventConsumer(logicalBoard, gameEvents, score);

        clearBoard();
        setUpTdClickListener(boardSelector, game);

        clickHandlers = new FOM.ClickHandlers(this._container);
        clickHandlers.setUp(game, cookieHandler);

        setBoardSize(cookieHandler);
        positionPopupWindows(popups);
        //~ messageServer(MESSAGE_ID.PAGE_REFRESHED, cookieHandler.readUniqId());

        // TODO: special shortcut to finish a game (dev only)
        FOM.constants.GAME_OVER_DEV = false;

        return game;
    };

    /* Construct a HighScoreAccessor object, along with its readers & writers */
    function buildHighScoreAccessor(cookieHandler) {
        var options = {},
            limit = FOM.constants.HIGH_SCORE_LENGTH;

        options.localHighScoreReader = new FOM.LocalHighScoreReader(cookieHandler, limit);
        options.serverHighScoreReader = new FOM.ServerHighScoreReader(limit);
        options.localHighScoreWriter = new FOM.LocalHighScoreWriter(cookieHandler);
        options.serverHighScoreWriter = new FOM.ServerHighScoreWriter();

        return new FOM.HighScoreAccessor(options);
    }

    function clearBoard() {
        if (FOM.env.isIe) {
            // workaround for ie no border on empty cells problem; give all cells content (a space)
            FOM.constants.CELL_CONTENT = "&nbsp;";
            $("td:empty").html(FOM.constants.CELL_CONTENT);
        }
        // set cells empty, clear any shapes, but preserve IE nbsp
        $(FOM.constants.BOARD_SELECTOR).find('td').removeClass().addClass(FOM.constants.EMPTY).html(FOM.constants.CELL_CONTENT);
    }

    function setUpTdClickListener(boardSelector, game) {
        // setup a jQuery click listener (replace any existing one)
        $(boardSelector).off('click').on('click', 'td', function (event) {
            var colIndex = $(this).prevAll().length,
                rowIndex = $(this).parent('tr').prevAll().length,
                cell = {x: colIndex, y: rowIndex};
            game.gameEventProducer.processClick(cell);
            game.gameEventConsumer.consume();
        });
    }

    // TODO: board size editing should be own object
    function setBoardSize(cookieHandler) {
        var preferences, viewportHeightInPx, size;

        // first check if a board size preference has been set
        preferences = cookieHandler.readPreferences();
        if (preferences.boardSize !== FOM.constants.PREFS_DEFAULT.boardSize) {
            updateToNewBoardSize(preferences.boardSize);
            return;
        }

        // no board size preference, so use best fit size
        viewportHeightInPx = $(window).height();

        if (viewportHeightInPx < FOM.constants.VIEWPORT_CUTOFFS.SMALL) {
            size = FOM.constants.SIZE.SMALL;
        }
        else if (viewportHeightInPx < FOM.constants.VIEWPORT_CUTOFFS.MEDIUM) {
            size = FOM.constants.SIZE.MEDIUM;
        }
        else {
            size = FOM.constants.SIZE.LARGE;
        }
        updateToNewBoardSize(size);
    }

    function updateToNewBoardSize(size) {
        $(FOM.constants.TABLE_SELECTOR).removeClass().addClass(size);
        FOM.tools.changePointsPopupTextSize(size);
    }

    function positionPopupWindows(popups) {
        popups.closeAll();
        $('#messages').centerHorizontal().hide();
    }

})();
