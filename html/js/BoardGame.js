
function BoardGame() {

    var objSelf = this;
    var pathFinder;
    var stoneMaker;
    var score;
    var stoneMatcher;
    var pathAnimator;
    var animating;
    var popups = new PopupController();
    var clickHandlers = new ClickHandlers();
    var cookieHandler = new CookieHandler();
    var highScores = new HighScores(cookieHandler);

    if (isIe) {
        // workaround for ie no border on empty cells problem; give all cells content (a space)
        CELL_CONTENT = "&nbsp;";
        $("td:empty").html(CELL_CONTENT);
    }

    // set SHAPES_ON to value in cookie at game start
    var prefs = cookieHandler.readPreferences();
    SHAPES_ON = prefs.shapesOn;

    setUpBoard();
    clickHandlers.setUp(objSelf, highScores, popups, score, cookieHandler);
    messageServer(MESSAGE_ID.PAGE_REFRESHED, cookieHandler.readUniqId());

    // position share buttons aligned to H1 tag
    var li = $('h1');
    //$('#sharePanel').css('margin-left', li.position().left + 'px');

    $(BOARD).delegate('td','click', function(e) {
        if (e.type == 'click') {
            boardCellWasClicked($(this));
        }
    });

    this.setNewBoard = function() {
        setUpBoard();
    }

    this.turnShapesOn = function() {
        turnOnShapesForBoardStones();
        turnOnShapesForPreviewStones();
    }

    this.turnShapesOff = function() {
        turnOffShapesForBoardStones();
        turnOffShapesForPreviewStones();
    }

    function turnOnShapesForBoardStones() {
        $(BOARD).find('td').each(function(idx) {
            $(this).removeClass('selected');
            if (!$(this).hasClass(EMPTY)) {
                var color = $(this).attr('class');
                var imgSrc = "imgs/" + STONE_SHAPES[color];
                $(this).html('<img src='+imgSrc+' />');
            }
        });
    }

    function turnOnShapesForPreviewStones() {
        $('#preview').find('li').each(function(idx) {
            var color = $(this).attr('class');
            var imgSrc = "imgs/" + STONE_SHAPES[color];
            $(this).html('<img src='+imgSrc+' />');
        });
    }

    function turnOffShapesForBoardStones() {
        $(BOARD).find('td').html(CELL_CONTENT);
    }

    function turnOffShapesForPreviewStones() {
        $('#preview').find('li').html("");
    }

    // empty board and populate with first stones
    function setUpBoard() {
        setBoardSize();
        score = new Score();
        positionPopupWindows();
        // set cells empty, clear any shapes, but preserve IE nbsp
        $(BOARD).find('td').removeClass().addClass(EMPTY).html(CELL_CONTENT);
        //nearlyFillBoard();
        pathFinder = new PathFinder();
        stoneMaker = new StoneMaker();
        stoneMatcher = new StoneMatcher(score);
        pathAnimator = new PathAnimator();
        clickHandlers.setUp(objSelf, highScores, popups, score, cookieHandler);
        animating = false;
        stoneMaker.placeStones(countEmptySquares());
        popups.closeGameOverPopup();
    }

    // dev class to create a nearly full board for testing
    function nearlyFillBoard() {
        if (TEST_FULL_BOARD) {
            $(BOARD).find('td').each(function(idx) {
                var idx = rand(STONE_COLORS.length);
                $(this).removeClass().addClass(STONE_COLORS[idx]);
                if(rand(10)===0) {
                $(this).removeClass().addClass(EMPTY);
                }
            });
            score.clearedChainOfLength(6);
        }
    }

    function setBoardSize() {
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

    function positionPopupWindows() {
        popups.closeGameOverPopup();
        $('#messages').centerHorizontal().hide();
    }

    // main game loop, waiting for clicks from user
    function boardCellWasClicked($clickedBoardCell) {
        // no clicks processed while animating moves
        if (!animating) {
            var $currentlySelectedStone = $(BOARD).find('td.selected:first');
            if (playerSelectedAStone($clickedBoardCell)) {
                selectANewStone($currentlySelectedStone, $clickedBoardCell);
            }
            else if (playerSelectedADestination($currentlySelectedStone, $clickedBoardCell)) {
                makeMoveIfPossible($currentlySelectedStone, $clickedBoardCell);
            }
        }

    }

    this.gameOver = function() {
        gameOverWaitForServerResponse();
    }

    this.showHighScoresNowServerScoresLoaded = function(serverScores) {
        highScores.displayHighScores({serverScores: serverScores});
        popups.requestedHighScores();
    }

    function gameOverWaitForServerResponse() {
        messageServer(MESSAGE_ID.GAME_FINISHED, cookieHandler.readUniqId());
        // retrieve highscores from server, call gameOverReentry on success
        getHighScoresFromServer(gameOverReentry);
    }

    function gameOverReentry(serverScores) {
        var finalScore = score.getScore();
        $('#finalScore span').text(finalScore);
        if (highScores.isNewHighScore(serverScores, finalScore)) {
            popups.gameOverGotHighScore(cookieHandler.readUsername());
        }
        else {
            highScores.displayHighScores({serverScores: serverScores});
            popups.gameOverNoHighScore();
        }
    }

    function notifyUser(message) {
        var $msg = $('#messages');
        $('#messages span').text(message);
        $msg.centerHorizontal();

        var tablePos = $(TABLE).position();
        var bottom = tablePos.top + $(TABLE).outerHeight() - MSG_BOTTOM_OFFSET;
        $msg.css({ position: "absolute", top: bottom + "px"});

        $msg.fadeIn('fast');
    }

    function removeNotification() {
        $('#messages:visible').fadeOut('fast');
    }

    function playerSelectedAStone($clickedBoardCell) {
        return !$clickedBoardCell.hasClass(EMPTY);
    }

    function selectANewStone($currentlySelectedStone, $newlySelectedStone) {
        if ($currentlySelectedStone.length) {
            $currentlySelectedStone.removeClass('selected');
        }
        $newlySelectedStone.toggleClass('selected');
        removeNotification();
    }

    function playerSelectedADestination($currentlySelectedStone, $clickedBoardCell) {
        return ($currentlySelectedStone.length === 1 && $clickedBoardCell.hasClass(EMPTY) &&
            !$clickedBoardCell.hasClass('selected'));
    }

    function makeMoveIfPossible($currentlySelectedStone, $destinationBoardCell) {
        var path = pathFinder.search($currentlySelectedStone, $destinationBoardCell);
        if (path) {
            animateMove(path, $currentlySelectedStone, $destinationBoardCell);
            removeNotification();
        }
        else {
            notifyUser(NO_MOVE_MESSAGE);
        }
    }

    function animateMove(path, $currentlySelectedStone, $clickedBoardCell) {
        animating = true;
        $currentlySelectedStone.removeClass('selected');
        var colorOfStone = $currentlySelectedStone.attr('class');
        var imgSrc = getImageSrc($currentlySelectedStone);
        pathAnimator.animate(objSelf, path, colorOfStone, imgSrc);
    }

    function getImageSrc($currentlySelectedStone) {
        var img = $currentlySelectedStone.find('img');
        if (img.length && img.attr('src')) {
            return img.attr('src');
        }
        return '';
    }

    this.animationFinished = function() {
        animating = false;
        checkForMatchesAndPlaceNewStones();
    }

    function checkForMatchesAndPlaceNewStones() {
        var completedColorChain = stoneMatcher.findAllColorChains();

        if (!completedColorChain) {
            stoneMaker.placeStones(countEmptySquares());
            stoneMatcher.findAllColorChains();
            if (boardIsFull()) {
                gameOverWaitForServerResponse();
            }

        }
    }

    function countEmptySquares() {
        return $(BOARD).find(EMPTY_TD).length;
    }

    function boardIsFull() {
        return (countEmptySquares()  === 0);
    }

};
