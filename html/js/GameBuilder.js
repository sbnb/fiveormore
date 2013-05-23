/*
    Wires together a new Game object.
*/

function GameBuilder(container) {
    this._container = container;
}

// TODO: only window.game should be exposed in the DOM - currently full of crap

// build a new Game object and return it - call on game start (& restart)
GameBuilder.prototype.build = function (boardSelector) {
    var game = new Game2(),
        logicalBoard = new LogicalBoard(constants.DIMENSIONS.WIDTH,
                                        constants.DIMENSIONS.HEIGHT),
        gameEvents = [],
        cookieHandler = new CookieHandler(),
        popups = new PopupController(),
        pointsPopup = new PointsPopup(),
        score = new Score(pointsPopup),
        clickHandlers;

    game.popups = popups;
    game.cookieHandler = cookieHandler;
    game.highScoreAccessor = buildHighScoreAccessor(cookieHandler);
    game.logicalBoard = logicalBoard;
    game.score = score;
    game.renderer = new Renderer(logicalBoard, boardSelector,
        constants.PREVIEW_SELECTOR, score);
    game.gameEvents = gameEvents;
    game.gameEventProducer = new GameEventProducer(logicalBoard, gameEvents);
    game.gameEventConsumer = new GameEventConsumer(logicalBoard, gameEvents, score);

    clearBoard();
    setUpTdClickListener(boardSelector, game);

    clickHandlers = new ClickHandlers(this._container);
    clickHandlers.setUp(game, cookieHandler);

    setBoardSize(cookieHandler);
    positionPopupWindows(popups);
    //~ messageServer(MESSAGE_ID.PAGE_REFRESHED, cookieHandler.readUniqId());

    // TODO: special shortcut to finish a game (dev only)
    constants.GAME_OVER_DEV = false;

    return game;
};

/* Construct a HighScoreAccessor object, along with its readers & writers */
function buildHighScoreAccessor(cookieHandler) {
    var options = {},
        limit = constants.HIGH_SCORE_LENGTH;

    options.localHighScoreReader = new LocalHighScoreReader(cookieHandler, limit);
    options.serverHighScoreReader = new ServerHighScoreReader(limit);
    options.localHighScoreWriter = new LocalHighScoreWriter(cookieHandler);
    options.serverHighScoreWriter = new ServerHighScoreWriter();

    return new HighScoreAccessor(options);
}

function clearBoard() {
    if (isIe) {
        // workaround for ie no border on empty cells problem; give all cells content (a space)
        CELL_CONTENT = "&nbsp;";
        $("td:empty").html(CELL_CONTENT);
    }
    // set cells empty, clear any shapes, but preserve IE nbsp
    $(BOARD).find('td').removeClass().addClass(EMPTY).html(CELL_CONTENT);
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
    if (preferences.boardSize !== PREFS_DEFAULT.boardSize) {
        updateToNewBoardSize(preferences.boardSize);
        return;
    }

    // no board size preference, so use best fit size
    viewportHeightInPx = $(window).height();

    if (viewportHeightInPx < SMALL_BOARD_CUTOFF) {
        size = SIZE.SMALL;
    }
    else if (viewportHeightInPx < MEDIUM_BOARD_CUTOFF) {
        size = SIZE.MEDIUM;
    }
    else {
        size = SIZE.LARGE;
    }
    updateToNewBoardSize(size);
}

function updateToNewBoardSize(size) {
    $(TABLE).removeClass().addClass(size);
    changePointsPopupTextSize(size);
}

function positionPopupWindows(popups) {
    popups.closeAll();
    $('#messages').centerHorizontal().hide();
}
