// line length 180 - reduce it
function PopupController() {
    var states = {
        gameOverPopup: false,
        gameOver: false,
        enterHighScore: false,
        highScoresWrap: false,
        playAgain: false,
        showCloseWindow: false,
        rules: false,
        preferences: false,
        about: false
    }

    this.gameOverNoHighScore = function() {
        allOff();
        turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
            'showCloseWindow');
        callJqueryShowAndHides();
    }

    this.gameOverGotHighScore = function(username) {
        allOff();
        turnOn('gameOverPopup', 'gameOver', 'enterHighScore');
        $('#highScoreName').val(username);
        callJqueryShowAndHides();
    }

    this.submittedNameForHighScore = function() {
        allOff();
        turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
            'showCloseWindow');
        callJqueryShowAndHides();
    }

    this.requestedHighScores = function() {
        allOff();
        turnOn('gameOverPopup', 'highScoresWrap', 'showCloseWindow');
        callJqueryShowAndHides();
    }

    this.closeAll = function() {
        allOff();
        callJqueryShowAndHides();
    }

    this.showPopup = function(popupId) {
        allOff();
        turnOn(popupId);
        callJqueryShowAndHides();
    }

    function callJqueryShowAndHides() {
        setVisibilityFromState('gameOver');
        setVisibilityFromState('enterHighScore');
        setVisibilityFromState('highScoresWrap');
        setVisibilityFromState('playAgain');

        if (states.showCloseWindow) {
            $('#gameOverPopup p.closeText').show();
            $('#gameOverPopup div.closeWindowX').show();
        }
        else {
            $('#gameOverPopup p.closeText').hide();
            $('#gameOverPopup div.closeWindowX').hide();
        }

        setVisibilityFromState('gameOverPopup', {center: true, fadeIn: true});
        setVisibilityFromState('rules', {center: true});
        setVisibilityFromState('preferences', {center: true});
        setVisibilityFromState('about', {center: true});
    }

    /*
        If states.property is true, show the div '#property'.
        Otherwise hide the corresponding div.
        Options allow 'fadeIn' and 'center'ing of the div when showing.
    */
    function setVisibilityFromState(property, options) {
        options = tools.setIfUndefined(options, {});
        options.center = tools.setIfUndefined(options.center, false);
        options.fadeIn = tools.setIfUndefined(options.fadeIn, false);

        if (states[property]) {
            if (options.center) {
                centerAbsoluteOnElement($('#container'), $('#' + property), $(TABLE));
            }
            if (options.fadeIn) {
                $('#' + property).fadeIn('fast');
            }
            else {
                $('#' + property).show();
            }
        }
        else {
            $('#' + property).hide();
        }
    }

    /* Set all members of states to false. */
    function allOff() {
        for (var prop in states) {
            states[prop] = false;
        }
    }

    /* For each argument, set states[argument] to true (variable arg length) */
    function turnOn() {
        var fun = states.hasOwnProperty;
        _.forEach(arguments, function (state) {
            assert(states.hasOwnProperty(state), 'PopupController.turnOn(): ' +
                'no such state: ' + state);
            states[state] = true;
        });
    }
};
