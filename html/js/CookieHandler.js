function CookieHandler() {
    var allData = {};
    var that = this;

    this.readPreferences = function() {
        var preferences = getPreferencesFromNewCookie();
        return preferences;
    };

    this.savePreferences = function(preferences) {
        readAllData();
        allData.preferences = preferences;
        writeAllData();
    };

    this.readLocalHighScores = function() {
        var localHighScores = getLocalHighScoresFromNewCookie();
        if (isDefaultLocalHighScores(localHighScores)) {
            return getLocalHighScoresFromOldCookie();
        }
        return localHighScores;
    };

    this.saveLocalHighScores = function(localHighScores) {
        readAllData();
        allData.localHighScores = localHighScores;
        writeAllData();
    };

    this.readUniqId = function() {
        var cookieData = getCookie(COOKIE_NAME);
        if (cookieData && cookieData.uniqId) {
            return cookieData.uniqId;
        }
        return UNIQ_ID_DEFAULT;
    };

    this.saveUniqId = function(uniqId) {
        readAllData();
        allData.uniqId = uniqId;
        writeAllData();
    };

    this.readUsername = function() {
        var cookieData = getCookie(COOKIE_NAME);
        if (cookieData && cookieData.username) {
            return cookieData.username;
        }
        return USERNAME_DEFAULT;
    };

    this.saveUsername = function(username) {
        readAllData();
        allData.username = username;
        writeAllData();
    };

    readAllData();

    // adjust uniqId if found pre-existing uniqId in cookie
    if (UNIQ_ID_DEFAULT === allData.uniqId) {
        this.saveUniqId(freshUniqId);
    }

    function readAllData() {
        allData.preferences = that.readPreferences();
        allData.localHighScores = that.readLocalHighScores();
        allData.uniqId = that.readUniqId();
        allData.username = that.readUsername();
    }

    function writeAllData() {
        assert(allData.preferences, "CookieHandler: writeAllData: preferences not set!");
        assert(allData.localHighScores, "CookieHandler: writeAllData: localHighScores not set!");
        assert(allData.uniqId, "CookieHandler: writeAllData: uniqId not set!");
        assert(allData.username, "CookieHandler: writeAllData: username not set!");
        var encodedData = JSON.stringify(allData, null, 4);
        $.cookie(COOKIE_NAME, encodedData, {path: '/', expires: 365});
    }

    // return parsed cookie data, or null if no cookie 'cookieName'
    function getCookie(cookieName) {
        var cookie = $.cookie(cookieName);
        if (cookie !== null) {
            var parsedCookieData = JSON.parse(cookie);
            return parsedCookieData;
        }
        return null;
    }

    function getPreferencesFromNewCookie() {
        var cookieData = getCookie(COOKIE_NAME);
        if (cookieData && cookieData.preferences && cookieData.preferences.boardSize) {
            if (typeof cookieData.preferences.shapesOn  === "undefined") {
                cookieData.preferences.shapesOn = false;
            }
            return cookieData.preferences;
        }
        return PREFS_DEFAULT;
    }

    function getLocalHighScoresFromNewCookie() {
        var cookieData = getCookie(COOKIE_NAME);
        if (cookieData && cookieData.localHighScores) {
            return cookieData.localHighScores;
        }
        return LOCAL_HS_DEFAULT;
    }

    function getLocalHighScoresFromOldCookie() {
        var localHighScores = getCookie(HS_COOKIE);
        if (localHighScores) {
            return localHighScores;
        }
        return LOCAL_HS_DEFAULT;
    }

    function isDefaultLocalHighScores(localHighScores) {
        if (localHighScores.length === 0) {
            return true;
        }
        return false;
    }
}
