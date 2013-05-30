(function () {

    "use strict";
    /*global _gaq*/

    FOM.constants = {
        DIMENSIONS: {WIDTH: 9, HEIGHT: 9},
        RUN_LENGTH: 5,
        TABLE_SELECTOR: 'table#fiveormore',
        BOARD_SELECTOR: 'table#fiveormore tbody',
        PREVIEW_SELECTOR: '#preview',

        // messages
        NO_MOVE_MSG: 'You can\'t move there!',
        MSG_BOTTOM_OFFSET: 20,

        // event types
        TRANSITION: 'transition',
        MATCH_RUNS: 'match_runs',
        MATCH_RUNS_NO_ADD: 'match_runs_no_add',
        ADD_PIECES: 'add_pieces',
        SEEK_MOVE: 'seek_move',
        SELECT: 'select',

        // server message types
        MESSAGE_ID: {NEW_GAME: 1, GAME_FINISHED: 2, PAGE_REFRESHED: 3,
            VIEW_HIGH_SCORES: 4, ENTERED_HIGH_SCORE: 5, VIEW_RULES: 6,
            VIEW_ABOUT: 7, PLAY_AGAIN: 8, VIEW_PREFERENCES: 9,
            BOARD_SIZE_CHANGE: 10},
        // text for server message types
        MSG_TXT: ['hitNewGame', 'gameFinished', 'pageRefreshed',
            'viewedHighScores', 'enteredHighScore', 'viewedRules',
            'viewedAbout', 'hitPlayAgain', 'viewedPreferences',
            'changedBoardSize'],
        EMPTY: '',
        // interval between animation frames
        INTERVAL: 50,

        UNIQ_ID_DEFAULT: "unknown",
        PREFS_DEFAULT: {boardSize: "", shapesOn: false},
        SHAPES_ON: false,
        SIZE: {SMALL: 'small', MEDIUM: 'medium', LARGE: 'large'},
        // map viewport height (px) to a default screen size
        VIEWPORT_CUTOFFS: {SMALL: 550, MEDIUM: 750},

        GAME_OVER_DEV: false,
        ASSERTS_ON: true,

        // number of high scores to display in each highscore list
        HIGH_SCORE_LENGTH: 10
    };

    FOM.tools = {
        setIfUndefined: function (variable, defaultVal) {
            var isUndef = typeof variable === "undefined";
            variable = isUndef ? defaultVal : variable;
            return variable;
        },

        centerAbsoluteOnElement: function($container, $over, $under) {
            var RULES_TOP_OFFSET = 20,
                pos = $under.position(),
                left = ($container.width() - $over.outerWidth()) / 2,
                heightDiff = $under.outerHeight() - $over.outerHeight(),
                top = pos.top + (heightDiff / 2);

            top = top < RULES_TOP_OFFSET ? RULES_TOP_OFFSET : top;
            $over.css({
                position: "absolute",
                top: top + "px", left: left + "px"
            });
        },

        changePointsPopupTextSize: function (size) {
            switch(size) {
                case FOM.constants.SIZE.SMALL:
                    $('#pointsPopup p').css('fontSize', '2em');
                    break;
                case FOM.constants.SIZE.MEDIUM:
                    $('#pointsPopup p').css('fontSize', '3em');
                    break;
                case FOM.constants.SIZE.LARGE:
                    $('#pointsPopup p').css('fontSize', '4em');
                    break;
                default:
                    FOM.tools.assert(false,
                        'const.changePointsPopupTextSize: bad size ' + size);
            }
        },

        // send message to server, and push event to Google Analytics
        messageServer: function (messageId, uniqId) {
            var eventText = FOM.constants.MSG_TXT[messageId-1];
            $.ajax({
                url: 'server.php',
                type: 'POST',
                data: 'q=message&uniqId='+uniqId+'&messageId='+messageId
            });
            _gaq.push(['_trackEvent', 'Interaction', eventText, uniqId]);
        },

        // production only routines
        assert: function (condition, message) {
            if (FOM.constants.ASSERTS_ON && !condition) {
                throw new Error("ASSERTION FAIL: " + message);
            }
        },

        // generates a rfc4122 comliant Universally Unique IDentifier (UUID)
        // rfc: http://www.ietf.org/rfc/rfc4122.txt
        // src: http://stackoverflow.com/a/2117523/1175459
        generateUniqId: function () {
            /* jshint eqeqeq: false */
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        },

        /*
            isDefined check for nested objects
            src: http://stackoverflow.com/a/2631198/1175459
            usage:
                var test = {level1:{level2:{level3:'level3'}} };
                checkNested(test, 'level1', 'level2', 'level3'); // true
                checkNested(test, 'level1', 'level2', 'foo'); // false
        */
        checkNested: function (/*obj, level1, level2, ... levelN*/) {
            var args = Array.prototype.slice.call(arguments),
                obj = args.shift();

            if ('undefined' === typeof obj) {
                return false;
            }

            for (var i = 0; i < args.length; i += 1) {
                if (!obj.hasOwnProperty(args[i])) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        }

    };

    FOM.env.freshUniqId = FOM.tools.generateUniqId();
    FOM.env.isIe = false;
    // TODO: check for IE now

    // jQuery extensions

    // center this element on the background element
    // if $bgElement contains multiple elements, center on whole area
    // this element should be absolutely positioned (made so if not)
    // will not work with margins
    // assertion: all elements share same offset parent
    $.fn.centerOn = function ($bgElement) {
        var bgCenter = $bgElement.getCenter();
        this.css("position", "absolute");
        this.css({left: bgCenter.left - this.outerWidth() / 2,
            top: bgCenter.top - this.outerHeight() / 2});
        return this;
    };

    // find center point of this element(s) relative to offset parent
    $.fn.getCenter = function () {

        var position = this.position(),
            min = {x: position.left, y: position.top},
            max = {x: position.left, y: position.top};

        this.each(function () {
            var position = $(this).position(),
                topLeft,
                bottomRight;

            topLeft = {x: position.left, y: position.top};
            bottomRight = {x: position.left + $(this).outerWidth(),
                y: position.top + $(this).outerHeight()};

            min.x = Math.min(topLeft.x, min.x);
            min.y = Math.min(topLeft.y, min.y);
            max.x = Math.max(bottomRight.x, max.x);
            max.y = Math.max(bottomRight.y, max.y);
        });
        return {left: (min.x + max.x) / 2, top: (min.y + max.y) / 2};
    };

    // like eq() but give an array of indexes instead of just one
    $.fn.eqAnyOf = function (arrayOfIndexes) {
        return this.filter(function(i) {
            return $.inArray(i, arrayOfIndexes) > -1;
        });
    };

    $.fn.centerHorizontal = function () {
        var theParent = this.parent(),
            $parent = $(theParent),
            left = ($parent.width() - this.outerWidth()) / 2 +
                $parent.scrollLeft();
        this.css("position","absolute");
        this.css("left", left + "px");
        return this;
    };


})();
