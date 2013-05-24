// length: 155 lines - reduced to 126
function ClickHandlers(container) {

    this._container = container;

    this.setUp = function(game, cookieHandler) {
        var uniqId = cookieHandler.readUniqId(),
            highScoreAccessor = game.highScoreAccessor,
            popups = game.popups;

        $('.newGame').off('click').click(function(e) {
            startNewGame(e.target.id);
        });

        function startNewGame(buttonId) {
            var buttonIdToMessageId = {
                'newGameButton': MESSAGE_ID.NEW_GAME,
                'playAgain': MESSAGE_ID.PLAY_AGAIN
            };
            messageServer(buttonIdToMessageId[buttonId], uniqId);
            popups.closeAll();

            window.game = new GameBuilder(this._container).build(constants.BOARD_SELECTOR);
            window.game.start();
        }

        $('#highScoresButton').off('click').click(function(e) {
            messageServer(MESSAGE_ID.VIEW_HIGH_SCORES, uniqId);
            highScoreAccessor.read(function (hsGroup) {
                hsGroup.writeHighScoresToDom();
                popups.requestedHighScores();
            });
        });


        $('#submitHighScore').off('click').click(function(e) {
            submitHighScore();
        });

        $('#highScoreName').off('keypress').bind('keypress', function(e){
            if ( e.keyCode === 13 ) {
                submitHighScore();
            }
        });

        function submitHighScore() {
            assert(typeof game.highScoreGroup !== 'undefined',
                'ClickHandlers.submitHighScore: no game.highScoreGroup');

            var name = $('#highScoreName').val(),
                score = game.score.get();

            game.highScoreGroup.update(name, score, uniqId);
            game.highScoreGroup.writeHighScoresToDom();
            popups.submittedNameForHighScore();
            game.cookieHandler.saveUsername(name);
            messageServer(MESSAGE_ID.ENTERED_HIGH_SCORE, uniqId);
        }

        $('#highScoresWrap').off('click').on('click', 'em', function(e) {
            $('.subScore').hide();
            var hsSubtypeSelector = '#' + e.target.className + 'Scores';
            $(hsSubtypeSelector).show();
        });


        // handler for viewing simple popups of information, with no processing
        $('.show').off('click').click(function (e) {
            var m = MESSAGE_ID,
                buttonIdMappings = {
                    'showRules': {popup: 'rules', messageId: m.VIEW_RULES},
                    'showPreferences': {popup: 'preferences', messageId: m.VIEW_PREFERENCES},
                    'showAbout': {popup: 'about', messageId: m.VIEW_ABOUT}
                };
            messageServer(buttonIdMappings[e.target.id].messageId, uniqId);
            popups.showPopup(buttonIdMappings[e.target.id].popup);
        });


        // handler for closing popup windows (only one popup is open at a time)
        $('div.closeWindowX span, span.closeWindowText').off('click').click(function (e) {
            popups.closeAll();
        });

        $('input[name=boardSize]').off('change').change(function(){
            messageServer(MESSAGE_ID.BOARD_SIZE_CHANGE, uniqId);
            changeBoardSize(this.id);
        });

        $('#endGame').off('click').click(function (e) {
            constants.GAME_OVER_DEV = true;
        });

        function changeBoardSize(size) {
            var prefs = cookieHandler.readPreferences();
            prefs.boardSize = size;
            cookieHandler.savePreferences(prefs);
            $(TABLE).removeClass().addClass(size);
            changePointsPopupTextSize(size);
        }

        $('input[name=shapesOn]').off('change').change(function() {
            if ("on" === this.id) {
                boardGame.turnShapesOn();
            }
            else {
                boardGame.turnShapesOff();
            }
            saveShapesSetting(this.id);
        });

        function saveShapesSetting(shapesSetting) {
            var prefs = cookieHandler.readPreferences();
            prefs.shapesOn = shapesSetting === "on" ? true : false;
            SHAPES_ON = prefs.shapesOn;
            cookieHandler.savePreferences(prefs);
        }

        if (SHAPES_ON) {
            $('input:radio[name=shapesOn][value=on]').attr('checked', 'checked');
        }
        else {
            $('input:radio[name=shapesOn][value=off]').attr('checked', 'checked');
        }

        centerAbsoluteOnElement($(this._container), $("#loading"), $(TABLE));

        // safety: hide loading gif on ajax stop, in case success func in
        // getHighScoresFromServer doesn't fire
        $("#loading").ajaxStart(function(){
                //$(this).show();
            }).ajaxStop(function(){
                $(this).hide();
            });

    };
}
