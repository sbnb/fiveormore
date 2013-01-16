function PopupController() {
    var states = {
        gameOverPopup: false,
        gameOver: false,
        enterHighScore: false,
        highScoresWrap: false,
        playAgain: false,
        showCloseWindow: false,
        howToPlayPopup: false,
        preferencesPopup: false,
        aboutPopup: false
    }
        
    this.gameOverNoHighScore = function() {
        allOff();
        states.gameOverPopup = true;
        states.gameOver = true;
        states.highScoresWrap = true;
        states.playAgain = true;
        states.showCloseWindow = true;
        callJqueryShowAndHides();
    }
    
    this.gameOverGotHighScore = function(username) {
        allOff();
        states.gameOverPopup = true;
        states.gameOver = true;
        states.enterHighScore = true;
        $('#highScoreName').val(username);
        callJqueryShowAndHides();
    }
    
    this.submittedNameForHighScore = function() {
        allOff();
        states.gameOverPopup = true;
        states.gameOver = true;
        states.highScoresWrap = true;
        states.playAgain = true;
        states.showCloseWindow = true;
        callJqueryShowAndHides();
    }
    
    this.requestedHighScores = function() {
        allOff();
        states.gameOverPopup = true;
        states.highScoresWrap = true;
        states.showCloseWindow = true;
        callJqueryShowAndHides();
    }
    
    this.closeGameOverPopup = function() {
        allOff();
        callJqueryShowAndHides();
    }
    
    this.pressedPlayAgainButton = function() {
        allOff();
        callJqueryShowAndHides();
    }
    
    this.pressedNewGameButton = function() {
        allOff();
        callJqueryShowAndHides();
    }
    
    this.openHowToPlayPopup = function() {
        allOff();
        states.howToPlayPopup = true;
        callJqueryShowAndHides();
    }
    
    this.closeHowToPlayPopup = function() {
        allOff();
        callJqueryShowAndHides();
    }
        
    this.openPreferencesPopup = function() {
        allOff();
        states.preferencesPopup = true;
        callJqueryShowAndHides();
    }
    
    this.closePreferencesPopup = function() {
        allOff();
        callJqueryShowAndHides();
    }
    
    this.openAboutPopup = function() {
        allOff();
        states.aboutPopup = true;
        callJqueryShowAndHides();
    }
    
    this.closeAboutPopup = function() {
        allOff();
        callJqueryShowAndHides();
    }
    
    function callJqueryShowAndHides() {
        if (states.gameOver) {
            $('#gameOver').show();
        }
        else {
            $('#gameOver').hide();
        }
        
        if (states.enterHighScore) {
            $('#enterHighScore').show();
        }
        else {
            $('#enterHighScore').hide();
        }
        
        if (states.highScoresWrap) {
            $('#highScoresWrap').show();
        }
        else {
            $('#highScoresWrap').hide();
        }
        
        if (states.playAgain) {
            $('#playAgain').show();
        }
        else {
            $('#playAgain').hide();
        }
        
        if (states.showCloseWindow) {
            $('#gameOverPopup p.closeText').show();
            $('#gameOverPopup div.closeWindowX').show();
        }
        else {
            $('#gameOverPopup p.closeText').hide();
            $('#gameOverPopup div.closeWindowX').hide();
        }
        
        if (states.gameOverPopup) {
            centerAbsoluteOnElement($('#container'), $(GAME_OVER_PU), $(TABLE));
            $('#gameOverPopup').fadeIn('fast');
        }
        else {
            $('#gameOverPopup').hide();
        }
        
        if (states.howToPlayPopup) {
            centerAbsoluteOnElement($('#container'), $(HOW_TO_PLAY_PU), $(TABLE));
            $(HOW_TO_PLAY_PU).show();
        }
        else {
            $(HOW_TO_PLAY_PU).hide();
        }
        
        if (states.preferencesPopup) {
            centerAbsoluteOnElement($('#container'), $('#preferencesPopup'), $(TABLE));
            $('#preferencesPopup').show();            
        }
        else {
            $('#preferencesPopup').hide();
        }
        
        if (states.aboutPopup) {
            centerAbsoluteOnElement($('#container'), $('#aboutPopup'), $(TABLE));
            $('#aboutPopup').show();
        }
        else {
            $('#aboutPopup').hide();
        }
    }

    function allOff() {
        for (var prop in states) {
            states[prop] = false;
        }
    }
};
