var constants = {
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

    EMPTY: '',
    UPDATES: 'updates',
    // interval between animation frames
    INTERVAL: 50,

    GAME_OVER_DEV: false,

    // number of high scores to display in each highscore list
    HIGH_SCORE_LENGTH: 10
};

var tools = {
    setIfUndefined: function (variable, defaultValue) {
            variable = (typeof variable === "undefined") ? defaultValue : variable;
            return variable;
        },
    foo: 'bar'
};
