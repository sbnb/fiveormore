(function () {

    "use strict";

    FOM.CookieHandler = function () {
        var allData = {},
            COOKIE_NAME = 'fiveormore',
            LOCAL_HS_DEFAULT = [],
            USERNAME_DEFAULT = '',
            t = FOM.tools;

        this.readPreferences = function () {
            var cookieData = getCookie(COOKIE_NAME);
            if (t.checkNested(cookieData, 'preferences', 'boardSize')) {
                if (typeof cookieData.preferences.shapesOn  === "undefined") {
                    cookieData.preferences.shapesOn = false;
                }
                return cookieData.preferences;
            }
            return FOM.constants.PREFS_DEFAULT;
        };

        this.savePreferences = function (preferences) {
            readAllData(this);
            allData.preferences = preferences;
            writeAllData();
        };

        this.shapesOn = function () {
            return this.readPreferences().shapesOn;
        };

        this.readLocalHighScores = function () {
            var cookieData = getCookie(COOKIE_NAME);
            if (cookieData && cookieData.localHighScores) {
                return cookieData.localHighScores;
            }
            return LOCAL_HS_DEFAULT;
        };

        this.saveLocalHighScores = function (localHighScores) {
            readAllData(this);
            allData.localHighScores = localHighScores;
            writeAllData();
        };

        this.readUniqId = function () {
            var cookieData = getCookie(COOKIE_NAME);
            if (cookieData && cookieData.uniqId) {
                return cookieData.uniqId;
            }
            return FOM.constants.UNIQ_ID_DEFAULT;
        };

        this.saveUniqId = function (uniqId) {
            readAllData(this);
            allData.uniqId = uniqId;
            writeAllData();
        };

        this.readUsername = function () {
            var cookieData = getCookie(COOKIE_NAME);
            if (cookieData && cookieData.username) {
                return cookieData.username;
            }
            return USERNAME_DEFAULT;
        };

        this.saveUsername = function (username) {
            readAllData(this);
            allData.username = username;
            writeAllData();
        };


        // save a new uniqId if none found in cookie
        if (allData.uniqId === FOM.constants.UNIQ_ID_DEFAULT) {
            this.saveUniqId(FOM.env.freshUniqId);
        }

        function readAllData(ctx) {
            allData.preferences = ctx.readPreferences();
            allData.localHighScores = ctx.readLocalHighScores();
            allData.uniqId = ctx.readUniqId();
            allData.username = ctx.readUsername();
        }

        readAllData(this);

        function writeAllData() {
            t.assert(allData.preferences,
                "CookieHandler: writeAllData: preferences not set!");
            t.assert(allData.localHighScores,
                "CookieHandler: writeAllData: localHighScores not set!");
            t.assert(allData.uniqId,
                "CookieHandler: writeAllData: uniqId not set!");
            t.assert(allData.username,
                "CookieHandler: writeAllData: username not set!");
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
    };

})();
