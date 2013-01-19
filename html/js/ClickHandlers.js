function ClickHandlers() {

    this.setUp = function(boardGame, highScores, popups, score, cookieHandler) {
        var uniqId = cookieHandler.readUniqId();
        $(HOW_TO_PLAY_PU).hide();

        $('#newGame').off('click').click(function(e) {
            messageServer(MESSAGE_ID.NEW_GAME, uniqId);
            popups.closeGameOverPopup();
            boardGame.setNewBoard();
        });

        $('#playAgain').off('click').click(function(e) {
            messageServer(MESSAGE_ID.PLAY_AGAIN, uniqId);
            popups.closeGameOverPopup();
            boardGame.setNewBoard();
        });

        $('#finish').off('click').click(function(e) {
            boardGame.gameOver();
        });

        $('#highScoresButton').off('click').click(function(e) {
            messageServer(MESSAGE_ID.VIEW_HIGH_SCORES, uniqId);
            highScores.generateHighScoresHtml(boardGame.showHighScoresNowServerScoresLoaded);
        });

        $('#submitHighScore').off('click').click(function(e) {
            messageServer(MESSAGE_ID.ENTERED_HIGH_SCORE, uniqId);
            highScores.enterNewHighScore(uniqId, $('#highScoreName').val(), score.getScore());
            highScores.displayHighScores({});
            popups.submittedNameForHighScore();
        });

        $('#highScoreName').off('keypress').bind('keypress', function(e){
            if ( e.keyCode === 13 ) {
                messageServer(MESSAGE_ID.ENTERED_HIGH_SCORE, uniqId);
                highScores.enterNewHighScore(uniqId, $('#highScoreName').val(), score.getScore());
                highScores.displayHighScores({});
                popups.submittedNameForHighScore();
            }
        });

        $('#highScoresWrap').off('click').on('click', 'em', function(e) {
            $('#localScores').hide();
            $('#allTimeScores').hide();
            $('#recentScores').hide();

            switch($(this).attr('class')) {
                case 'allTime': {
                    $('#allTimeScores').show();
                    break;
                }
                case 'recent': {
                    $('#recentScores').show();
                    break;
                }
                case 'local': {
                    $('#localScores').show();
                    break;
                }
                default: {
                    logMessage("ClickHandler: error should not get here!");
                }
            }
        });

        $('#showHowToPlay').off('click').click(function(e) {
            messageServer(MESSAGE_ID.VIEW_RULES, uniqId);
            popups.openHowToPlayPopup();
        });

        $('#howToPlay div.closeWindowX span, #howToPlay span.closeWindowText').off('click').click(function(e) {
            popups.closeHowToPlayPopup();
        });

        $('#showPreferences').off('click').click(function(e) {
            messageServer(MESSAGE_ID.VIEW_PREFERENCES, uniqId);
            popups.openPreferencesPopup();
        });

        $('#preferencesPopup div.closeWindowX span, #preferencesPopup span.closeWindowText').off('click').click(function(e) {
            popups.closePreferencesPopup();
        });

        $('input[name=boardSize]').off('change').change(function(){
            messageServer(MESSAGE_ID.BOARD_SIZE_CHANGE, uniqId);
            changeBoardSize(this.id);
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

        $('#showAbout').off('click').click(function(e) {
            messageServer(MESSAGE_ID.VIEW_ABOUT, uniqId);
            popups.openAboutPopup();
        });

        $('#aboutPopup div.closeWindowX span, #aboutPopup span.closeWindowText').off('click').click(function(e) {
            popups.closeAboutPopup();
        });

        $('#gameOverPopup div.closeWindowX span, #gameOverPopup span.closeWindowText').click(function(e) {
            popups.closeGameOverPopup();
        });

        centerAbsoluteOnElement($('#container'), $("#loading"), $(TABLE));

        // safety: hide loading gif on ajax stop, in case success func in
        // getHighScoresFromServer doesn't fire
        $("#loading").ajaxStart(function(){
            //$(this).show();
        }).ajaxStop(function(){
            $(this).hide();
        });

    }


};
