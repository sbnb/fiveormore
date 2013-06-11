(function () {

    "use strict";

    var c = FOM.constants;

    /*
        Wires together a new Game object.
    */

    FOM.GameBuilder = function (container) {
        this._container = container;
    };

    // build a new Game object and return it - call on game start (& restart)
    FOM.GameBuilder.prototype.build = function (boardSelector) {
        var game = new FOM.Game2(),
            logicalBoard =
                new FOM.LogicalBoard(c.DIMENSIONS.WIDTH, c.DIMENSIONS.HEIGHT),
            gameEvents = [],
            cookieHandler = new FOM.CookieHandler(),
            popups = new FOM.PopupController(),
            pointsPopup = new FOM.PointsPopup(),
            score = new FOM.Score(pointsPopup),
            clickHandlers;

        game.popups = popups;
        game.cookieHandler = cookieHandler;
        game.settingsChanger = new FOM.SettingsChanger(cookieHandler);
        game.highScoreAccessor = buildHighScoreAccessor(cookieHandler);
        game.logicalBoard = logicalBoard;
        game.score = score;
        game.renderer = new FOM.Renderer(logicalBoard, boardSelector,
            c.PREVIEW_SELECTOR, score);
        game.gameEvents = gameEvents;
        game.gameEventProducer =
            new FOM.GameEventProducer(logicalBoard, gameEvents);
        game.gameEventConsumer =
            new FOM.GameEventConsumer(logicalBoard, gameEvents, score);

        clearBoard();
        setUpTdClickListener(boardSelector, game);

        clickHandlers = new FOM.ClickHandlers(this._container);
        clickHandlers.setUp(game, cookieHandler);

        game.settingsChanger.setInitialBoardSize();
        game.settingsChanger.registerShapesInputChangeListener();
        game.settingsChanger.registerBoardSizeInputChangeListener();

        positionPopupWindows(popups);
        // TODO: message on page refresh: send one
        //~ messageServer(MESSAGE_ID.PAGE_REFRESHED,
            //~ cookieHandler.readUniqId());

        // TODO: special shortcut to finish a game (dev only)
        c.GAME_OVER_DEV = false;
        return game;
    };

    /* Construct a HighScoreAccessor object, along with its readers & writers */
    function buildHighScoreAccessor(cookieHandler) {
        var options = {},
            limit = c.HIGH_SCORE_LENGTH;

        options.localHighScoreReader =
            new FOM.LocalHighScoreReader(cookieHandler, limit);
        options.serverHighScoreReader = new FOM.ServerHighScoreReader(limit);
        options.localHighScoreWriter =
            new FOM.LocalHighScoreWriter(cookieHandler);
        options.serverHighScoreWriter = new FOM.ServerHighScoreWriter();

        return new FOM.HighScoreAccessor(options);
    }

    function clearBoard() {
        if (FOM.env.isIe) {
            // workaround for ie no border on empty cells problem;
            // give all cells content (a space)
            c.CELL_CONTENT = "&nbsp;";
            $("td:empty").html(c.CELL_CONTENT);
        }
        // set cells empty, clear any shapes, but preserve IE nbsp
        $(c.BOARD_SELECTOR).find('td')
            .removeClass()
            .addClass(c.EMPTY)
            .html(c.CELL_CONTENT);
    }

    function setUpTdClickListener(boardSelector, game) {
        // setup a jQuery click listener (replace any existing one)
        $(boardSelector).off('click').on('click', 'td', function () {
            var colIndex = $(this).prevAll().length,
                rowIndex = $(this).parent('tr').prevAll().length,
                cell = {x: colIndex, y: rowIndex};
            game.gameEventProducer.processClick(cell);
            game.gameEventConsumer.consume();
        });
    }

    function positionPopupWindows(popups) {
        popups.closeAll();
        $('#messages').centerHorizontal().hide();
    }

})();
