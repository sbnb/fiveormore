/*
    A single list of high scores. The high score results consist of more
    than one list. The list can be no longer than LIMIT.
*/

function HighScoreList(LIMIT) {
    this.limit = LIMIT;
    this.entries = [];
}

// if is high score, add it and return true, else false
HighScoreList.prototype.maybeAdd = function (name, score) {
    if (this.isHighScore(score)) {
        this._add(name, score);
        return true;
    }
    return false;
};

HighScoreList.prototype.isHighScore = function (score) {
    var SCORE = 1,
        entries = this.entries;
    if (entries.length < this.limit) {
        return true;
    }
    var lowestScore = entries[entries.length - 1][SCORE];
    return score > lowestScore ? true : false;
};

HighScoreList.prototype._add = function (name, score) {
    this.entries.push([name, score]);
    this.entries.sort(compareByScore).reverse();
    this._truncateToLimit();
};

HighScoreList.prototype._truncateToLimit = function () {
    var len = this.entries.length;
    this.entries.length = len > this.limit ? this.limit : len;
};

HighScoreList.prototype.toArray = function () {
    return _.clone(this.entries, true);
};

HighScoreList.prototype.toString = function () {
    var buffer = 'High Scores\n',
        NAME = 0,
        SCORE = 1;

    _.forEach(this.entries, function (entry, idx) {
        buffer += '  ' + (idx + 1) + '. ' + entry[NAME] + ': ' +
            entry[SCORE] + '\n';
    }, this);
    return buffer;
};

HighScoreList.prototype.wrapInHtml = function () {
    return wrapScoresInHtml(this.entries);

    // wrap each score with <dt><dd> tags
    function wrapScoresInHtml(highScores) {
        var html = '',
            entry;
        for (var idx = 0; idx < constants.HIGH_SCORE_LENGTH; idx += 1) {
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
};

// compare two highscore entries by score: [name, -> score <-]
function compareByScore(a, b) {
    var SCORE = 1;
    if (a[SCORE] < b[SCORE]) {
        return -1;
    }
    else if (a[SCORE] > b[SCORE]) {
        return 1;
    }
    return 0;
}
