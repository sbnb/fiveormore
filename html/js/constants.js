var BOARD = "table#fiveormore tbody";
var TABLE = "table#fiveormore";
var GAME_OVER_PU = '#gameOverPopup';
var HOW_TO_PLAY_PU = '#rules';
var STONE_COLORS = ["green", "red", "blue", "orange", "purple", "yellow"];
var STONE_SHAPES = {green: "circle.png", red: "star.png", blue: "triangle.png", orange: "square.png", purple: "splat.png", yellow: "diamond.png"};
var SHAPES_ON = true;
var ROWS = 1;
var COLUMNS = 2;
var DIAGONAL_RIGHT = 3; // slopes down to right of board
var DIAGONAL_LEFT = 4;  // slopes down to left of board
var EMPTY = 'empty';
var EMPTY_TD = 'td.' + EMPTY;
var CELL_CONTENT = "";
var CHAIN_LENGTH = 5;
var NUM_NEW_STONES = 3;
var SEARCH_LOOP_LIMIT = 500;
var PATH_ANIMATION_SPEED = 75;
var ANIMATING = false;
var POINTS_FOR_CHAINS = {5: 10, 6: 12, 7: 18, 8: 28, 9: 42};
var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
var ASSERTS_ON = true;
var LOGGING_ON = true;
var TEST_FULL_BOARD = true;
var STATES = {};
var NO_MOVE_MESSAGE = "You can't move there!";
var MSG_BOTTOM_OFFSET = 20;
var RULES_TOP_OFFSET = 20;
var HS_COOKIE = 'gridGameHighScores';
var PREFS_COOKIE = 'gridGamePreferences';
var COOKIE_NAME = 'fiveormore';             // supersedes {HS|PREFS}_COOKIE
var PREFS_DEFAULT = {boardSize: "", shapesOn: false};
var UNIQ_ID_DEFAULT = "unknown";
var LOCAL_HS_DEFAULT = [];
var USERNAME_DEFAULT = "";
var HS_MAX_NAME_LENGTH = 20;
var SMALL_BOARD_CUTOFF = 550;    // height of viewport in pixels, below this use small board
var MEDIUM_BOARD_CUTOFF = 750;
var SIZE = {SMALL: 'small', MEDIUM: 'medium', LARGE: 'large'};
var MESSAGE_ID = {
    NEW_GAME: 1, GAME_FINISHED: 2, PAGE_REFRESHED: 3,
    VIEW_HIGH_SCORES: 4, ENTERED_HIGH_SCORE: 5, VIEW_RULES: 6, VIEW_ABOUT: 7,
    PLAY_AGAIN: 8, VIEW_PREFERENCES: 9, BOARD_SIZE_CHANGE: 10
};
var MSG_TXT = ['hitNewGame','gameFinished','pageRefreshed','viewedHighScores',
    'enteredHighScore','viewedRules','viewedAbout','hitPlayAgain',
    'viewedPreferences','changedBoardSize'];

// shared routines

function changePointsPopupTextSize(size) {
    switch(size) {
        case SIZE.SMALL:
            $('#pointsPopup p').css('fontSize', '2em');
            break;
        case SIZE.MEDIUM:
            $('#pointsPopup p').css('fontSize', '3em');
            break;
        case SIZE.LARGE:
            $('#pointsPopup p').css('fontSize', '4em');
            break;
        default:
            assert(false, 'constants.changePointsPopupTextSize: unknown size ' + size);
    }
}

// return random number from 0..n-1
function rand(n) {
    return Math.floor(Math.random() * n);
}

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

(function ($) {
    'use strict';

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

        this.each(function (idx) {
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

})(jQuery);

//~ // jquery extensions
//~ jQuery.fn.center = function () {
    //~ var theParent = this.parent();
    //~ this.css("position","absolute");
    //~ this.css("top", (($(theParent).height() - this.outerHeight()) / 2) + $(theParent).scrollTop() + "px");
    //~ this.css("left", (($(theParent).width() - this.outerWidth()) / 2) + $(theParent).scrollLeft() + "px");
    //~ return this;
//~ }

jQuery.fn.centerHorizontal = function () {
    var theParent = this.parent();
    this.css("position","absolute");
    this.css("left", (($(theParent).width() - this.outerWidth()) / 2) + $(theParent).scrollLeft() + "px");
    return this;
};

// center jquery element $over on element $under
// invariant: both elements are children of relative pos $container
// (e.g. body or container)
function centerAbsoluteOnElement($container, $over, $under) {
    var pos = $under.position();
    var left = ($container.width() - $over.outerWidth()) / 2;
    var top = pos.top + ( ($under.outerHeight() - $over.outerHeight() ) / 2 );
    top = top < RULES_TOP_OFFSET ? RULES_TOP_OFFSET : top;
    $over.css({ position: "absolute", top: top + "px", left: left + "px" });
}

function keys(obj) {
    var theKeys = [];
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            theKeys.push(key);
        }
    }
    return theKeys;
}

function messageServer(messageId, uniqId) {
    $.ajax({
        url: 'server.php',
        type: 'POST',
        data: 'q=message&uniqId='+uniqId+'&messageId='+messageId
    });
    _gaq.push(['_trackEvent', 'Interaction', MSG_TXT[messageId-1], uniqId]);
}

// production only routines
function assert(condition, message) {
    if (ASSERTS_ON && !condition) {
        throw Error("ASSERTION FAIL: " + message);
    }
}

function logMessage(message) {
    if (LOGGING_ON) {
        console.log(message);
    }
}
