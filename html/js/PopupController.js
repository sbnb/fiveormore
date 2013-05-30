(function () {

    "use strict";

    var t = FOM.tools;

    // line length 180 - reduce it
    FOM.PopupController = function () {
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
        };

        this.playAgain = function() {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
                'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.namePromptForHighScore = function(username) {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'enterHighScore');
            $('#highScoreName').val(username);
            callJqueryShowAndHides();
        };

        this.submittedNameForHighScore = function() {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
                'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.requestedHighScores = function() {
            allOff();
            turnOn('gameOverPopup', 'highScoresWrap', 'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.closeAll = function() {
            allOff();
            callJqueryShowAndHides();
        };

        this.showPopup = function(popupId) {
            allOff();
            turnOn(popupId);
            callJqueryShowAndHides();
        };

        function callJqueryShowAndHides() {
            setVisibilityFromState('gameOver');
            setVisibilityFromState('enterHighScore');
            setVisibilityFromState('highScoresWrap');
            setVisibilityFromState('playAgain');

            if (states.showCloseWindow) {
                $('#gameOverPopup .closeText').show();
                $('#gameOverPopup .closeWindowX').show();
            }
            else {
                $('#gameOverPopup .closeText').hide();
                $('#gameOverPopup .closeWindowX').hide();
            }

            setVisibilityFromState('gameOverPopup',
                {center: true, fadeIn: true});
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
            options = t.setIfUndefined(options, {});
            options.center = t.setIfUndefined(options.center, false);
            options.fadeIn = t.setIfUndefined(options.fadeIn, false);

            if (states[property]) {
                if (options.center) {
                    t.centerAbsoluteOnElement($('#container'),
                        $('#' + property), $(FOM.constants.TABLE_SELECTOR));
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

        /* For each arg, set states[arg] to true (variable arg length) */
        function turnOn() {
            var fun = states.hasOwnProperty;
            _.forEach(arguments, function (state) {
                t.assert(states.hasOwnProperty(state),
                    'PopupController.turnOn(): no such state: ' + state);
                states[state] = true;
            });
        }
    };

})();
