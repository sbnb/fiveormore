// lines: 212 - refactor!
function HighScores(cookieHandler, NUM_TO_DISPLAY) {

    var cookieHandler = cookieHandler;
        localScores = [],
        allTimeScores = [],
        recentScores = [],
        hsData = {
            local: {scores: [], isHighScore: false},
            recent: {scores: [], isHighScore: false},
            allTime: {scores: [], isHighScore: false}
        };

    // serverScores looks like: {allTime:[[name,score]...[]], recent:[[name,score]...[]]}
    // not json encoded
    this.isNewHighScore = function(freshServerScores, score) {
        if (score === 0) {
            return false;
        }
        setServerScores(freshServerScores);
        loadHighScoresFromCookie();

        _.forEach(hsData, function (data, key) {
            console.log('score: ' + score + ' key: ' + key + ' ' + hsData[key].scores);
            hsData[key].isHighScore = isHighScore(hsData[key].scores, score);
        }, this);

        return hsData.local.isHighScore ||
            hsData.recent.isHighScore  ||
            hsData.allTime.isHighScore;
    }

    this.generateHighScoresHtml = function(reentryFunction) {
        loadHighScoresFromCookie();
        getHighScoresFromServer(reentryFunction);
    }

    this.enterNewHighScore = function(uniqId, name, theScore) {
        var sanitisedName = name === "" ? "anonymous" : name;

        console.log('enterNewHighScore(' + uniqId + ', ' + name + ', ' + theScore + '):');

        if (isHighScore(hsData.local.scores, score)) {
            console.log('   is a local high score');
            updateHighScoreArray(hsData.local.scores, sanitisedName, theScore);
            saveHighScoresToCookie();
            cookieHandler.saveUsername(sanitisedName);
        }

        if (isHighScore(hsData.allTime.scores, score)) {
            console.log('   is a allTime high score');
            updateHighScoreArray(hsData.allTime.scores, sanitisedName, theScore);
            sendScoreToServer(uniqId, sanitisedName, theScore);
        }

        if (isHighScore(hsData.recent.scores, score)) {
            console.log('   is a recent high score');
            updateHighScoreArray(hsData.recent.scores, sanitisedName, theScore);
            sendScoreToServer(uniqId, sanitisedName, theScore);
        }
    }

    function updateHighScoreArray(highScoreArray, name, theScore) {
        if (highScoreArray.length >= NUM_TO_DISPLAY) {
            highScoreArray.pop();
        }
        highScoreArray.push([name, theScore]);
        highScoreArray.sort(compareByScore).reverse();
    }

    function saveHighScoresToCookie() {
        cookieHandler.saveLocalHighScores(localScores);
    }

    this.displayHighScores = function(opts) {
        opts = tools.setIfUndefined(opts, {});
        if (opts.serverScores) {
            setServerScores(opts.serverScores);
        }
        loadHighScoresFromCookie();
        setHighScoresHtml();
    }

    function setServerScores(combinedServerScores) {
        allTimeScores = combinedServerScores["allTime"];
        recentScores = combinedServerScores["recent"];

        hsData.allTime.scores = combinedServerScores["allTime"];
        hsData.recent.scores = combinedServerScores["recent"];
    }

    function setHighScoresHtml() {
        $('#allTimeScores dl').html(wrapScoresInHtml(allTimeScores));
        $('#recentScores dl').html(wrapScoresInHtml(recentScores));
        $('#localScores dl').html(wrapScoresInHtml(localScores));

        $('#recentScores').show();
        $('#localScores, #allTimeScores').hide();
    }

    function loadHighScoresFromCookie() {
        localScores = cookieHandler.readLocalHighScores();
        hsData.local.scores = cookieHandler.readLocalHighScores();
    }

    function isHighScore(highScores, score) {
        console.log('isHighScore: score: ' + score + ' scores: ' + JSON.stringify(highScores));
        if (highScores.length === 0) {
            return true;
        }
        var lastIndex = highScores.length - 1;
        return score > highScores[lastIndex][1] || highScores.length < NUM_TO_DISPLAY;
    }

    // wrap each score with <dt><dd> tags
    function wrapScoresInHtml(highScores) {
        var html = '',
            entry;
        for (var idx = 0; idx < NUM_TO_DISPLAY; idx += 1) {
            entry = getHighScoreEntry(highScores, idx);
            html += '<dt>' + entry.rank + '. ' + entry.name + '</dt>\n';
            html += '<dd>' + entry.score + '</dd>\n';
        }
        return html;
    }

    function getHighScoreEntry(highScores, idx) {
        var lead = idx < 9 ? '&nbsp;&nbsp;' : '',
            entry = {rank: lead + (idx + 1), name: '', score: '&nbsp;'};
        if (highScores.length > idx) {
            entry.name = chopUserName(highScores[idx][0], HS_MAX_NAME_LENGTH);
            entry.score = highScores[idx][1];
        }
        return entry;
    }

    function chopUserName(name, maxLength) {
        return name.length <= maxLength ? name : name.slice(0, maxLength);
    }

    // compare two highscore entry arrays by score: [name, score]
    function compareByScore(a, b) {
        if (a[1] < b[1]) {
            return -1;
        }
        else if (a[1] > b[1]) {
            return 1;
        }
        return 0;
    }

    /* Server high scores */
};
