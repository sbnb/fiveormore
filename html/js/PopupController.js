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

        this.playAgain = function () {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
                'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.namePromptForHighScore = function (username) {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'enterHighScore');
            $('#highScoreName').val(username);
            callJqueryShowAndHides();
        };

        this.submittedNameForHighScore = function () {
            allOff();
            turnOn('gameOverPopup', 'gameOver', 'highScoresWrap', 'playAgain',
                'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.requestedHighScores = function () {
            allOff();
            turnOn('gameOverPopup', 'highScoresWrap', 'showCloseWindow');
            $('#recentScores').show();
            $('#localScores, #allTimeScores').hide();
            callJqueryShowAndHides();
        };

        this.closeAll = function () {
            allOff();
            callJqueryShowAndHides();
        };

        this.showPopup = function (popupId) {
            allOff();
            turnOn(popupId);
            callJqueryShowAndHides();
        };

        function callJqueryShowAndHides() {
            showOrHideGroup(['gameOver', 'enterHighScore', 'highScoresWrap',
                'playAgain']);
            showOrHideFromState('gameOverPopup', {center: true, fadeIn: true});
            showOrHideGroup(['rules', 'preferences', 'about'], {center: true});
            showOrHideCloseWindowWidgets(states.showCloseWindow);
        }

        // show or hide a group of divs based on state; options applies to all
        function showOrHideGroup(props, options) {
            _.forEach(props, function (property) {
                showOrHideFromState(property, options);
            });
        }

        /*
            If states.property is true, show the div '#property'.
            Otherwise hide the corresponding div.
            Options allow 'fadeIn' and 'center'ing of the div when showing.
        */
        function showOrHideFromState(property, options) {
            if (states[property]) {
                if (t.checkNested(options, 'center')) {
                    t.centerAbsoluteOnElement($('#container'),
                        $('#' + property), $(FOM.constants.TABLE_SELECTOR));
                }
                if (t.checkNested(options, 'fadeIn')) {
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

        // display or hide the buttons for closing windows
        function showOrHideCloseWindowWidgets(show) {
            if (show) {
                $('#gameOverPopup .closeText').show();
                $('#gameOverPopup .closeWindowX').show();
            }
            else {
                $('#gameOverPopup .closeText').hide();
                $('#gameOverPopup .closeWindowX').hide();
            }
        }



        /* Set all members of states to false. */
        function allOff() {
            /* jshint forin: false */
            for (var prop in states) {
                states[prop] = false;
            }
        }

        /* For each arg, set states[arg] to true (variable arg length) */
        function turnOn() {
            _.forEach(arguments, function (state) {
                t.assert(states.hasOwnProperty(state),
                    'PopupController.turnOn(): no such state: ' + state);
                states[state] = true;
            });
        }
    };

})();
