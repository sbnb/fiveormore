(function () {

    "use strict";

    var c = FOM.constants,
        t = FOM.tools;


    // TODO: length: 155 lines - reduced to 126
    FOM.ClickHandlers = function (container) {

        this._container = container;
        var that = this;

        this.setUp = function (game, cookieHandler) {
            var uniqId = cookieHandler.readUniqId(),
                highScoreAccessor = game.highScoreAccessor,
                popups = game.popups,
                msgId = c.MESSAGE_ID,
                sendMsg = t.messageServer;

            $('.newGame').off('click').click(function (e) {
                startNewGame(e.target.id);
            });

            function startNewGame(buttonId) {
                var buttonIdToMessageId = {
                    'newGameButton': msgId.NEW_GAME,
                    'playAgain': msgId.PLAY_AGAIN
                };
                sendMsg(buttonIdToMessageId[buttonId], uniqId);
                popups.closeAll();

                // TODO: can save builder at start in FOM
                var builder = new FOM.GameBuilder(that._container);
                FOM.game = builder.build(c.BOARD_SELECTOR);
                FOM.game.start();
            }

            $('#highScoresButton').off('click').click(function () {
                sendMsg(msgId.VIEW_HIGH_SCORES, uniqId);
                highScoreAccessor.read(function (hsGroup) {
                    hsGroup.writeHighScoresToDom();
                    popups.requestedHighScores();
                });
            });


            $('#submitHighScore').off('click').click(function () {
                submitHighScore();
            });

            $('#highScoreName').off('keypress').bind('keypress', function (e) {
                if (e.keyCode === 13) {
                    submitHighScore();
                }
            });

            function submitHighScore() {
                t.assert(typeof game.highScoreGroup !== 'undefined',
                    'ClickHandlers.submitHighScore: no game.highScoreGroup');

                var name = $('#highScoreName').val(),
                    score = game.score.get();

                game.highScoreGroup.update(name, score, uniqId);
                game.highScoreGroup.writeHighScoresToDom();
                popups.submittedNameForHighScore();
                game.cookieHandler.saveUsername(name);
                sendMsg(msgId.ENTERED_HIGH_SCORE, uniqId);
            }

            $('#highScoresWrap').off('click').on('click', 'em', function (e) {
                $('.subScore').hide();
                var hsSubtypeSelector = '#' + e.target.className + 'Scores';
                $(hsSubtypeSelector).show();
            });


            // handles 'rules', 'preferences' and 'about' button clicks
            $('.show').off('click').click(function (e) {
                var m = msgId,
                    buttonIdMappings = {
                        'showRules': {popup: 'rules', messageId: m.VIEW_RULES},
                        'showPreferences': {popup: 'preferences',
                            messageId: m.VIEW_PREFERENCES},
                        'showAbout': {popup: 'about', messageId: m.VIEW_ABOUT}
                    };
                sendMsg(buttonIdMappings[e.target.id].messageId, uniqId);
                popups.showPopup(buttonIdMappings[e.target.id].popup);
            });


            // for closing popup windows (only one popup is open at a time)
            var windowClosers = '.closeWindowX span, .closeWindowText';
            $(windowClosers).off('click').click(function () {
                popups.closeAll();
            });

            $('input[name=boardSize]').off('change').change(function () {
                sendMsg(msgId.BOARD_SIZE_CHANGE, uniqId);
                changeBoardSize(this.id);
            });

            $('#endGame').off('click').click(function () {
                c.GAME_OVER_DEV = true;
            });

            function changeBoardSize(size) {
                var prefs = cookieHandler.readPreferences();
                prefs.boardSize = size;
                cookieHandler.savePreferences(prefs);
                $(c.TABLE_SELECTOR).removeClass().addClass(size);
                t.changePointsPopupTextSize(size);
            }

            // TODO: this shapes on needs to go to new shapes handler
            $('input[name=shapesOn]').off('change').change(function () {
                if ("on" === this.id) {
                    //~ boardGame.turnShapesOn();
                }
                else {
                    //~ boardGame.turnShapesOff();
                }
                saveShapesSetting(this.id);
            });

            function saveShapesSetting(shapesSetting) {
                var prefs = cookieHandler.readPreferences();
                prefs.shapesOn = shapesSetting === "on" ? true : false;
                c.SHAPES_ON = prefs.shapesOn;
                cookieHandler.savePreferences(prefs);
            }

            // TODO: hey, this is not in a function!
            var shapesRadioInput = 'input:radio[name=shapesOn]';

            if (c.SHAPES_ON) {
                $(shapesRadioInput + '[value=on]').attr('checked', 'checked');
            }
            else {
                $(shapesRadioInput + '[value=off]').attr('checked', 'checked');
            }

            t.centerAbsoluteOnElement($(this._container),
                $("#loading"), $(c.TABLE_SELECTOR));

            // safety: hide loading gif on ajax stop, in case success func in
            // getHighScoresFromServer doesn't fire
            $("#loading").ajaxStart(function () {
                //$(this).show();
            }).ajaxStop(function () {
                $(this).hide();
            });

        };
    };

})();
