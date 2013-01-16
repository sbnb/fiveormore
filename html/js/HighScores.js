function HighScores(cookieHandler) {
    
    var cookieHandler = cookieHandler;
    var localScores = [];
    var allTimeScores = [];
    var recentScores = [];
    var isLocalHighScore = false;
    var isAllTimeHighScore = false;
    var isRecentHighScore = false;

    // serverScores looks like: {allTime:[[name,score]...[]], recent:[[name,score]...[]]}
    // not json encoded
    this.isNewHighScore = function(freshServerScores, score) {
        if (score === 0) {
            return false;
        }
        setServerScores(freshServerScores);
        loadHighScoresFromCookie();
        isLocalHighScore = isHighScore(localScores, score);
        isAllTimeHighScore = isHighScore(allTimeScores, score);
        isRecentHighScore = isHighScore(recentScores, score);
        return isLocalHighScore || isAllTimeHighScore || isRecentHighScore;
    }
        
    this.generateHighScoresHtml = function(reentryFunction) {
        loadHighScoresFromCookie();
        getHighScoresFromServer(reentryFunction);
    }
    
    this.enterNewHighScore = function(uniqId, name, theScore) {
        if (name === "") {
            sanitisedName = "anonymous";
        }
        else {
            sanitisedName = name;
        }
        
        if (isLocalHighScore) {
            updateHighScoreArray(localScores, sanitisedName, theScore);
            saveHighScoresToCookie();
            cookieHandler.saveUsername(sanitisedName);
        }
                
        if (isAllTimeHighScore) {
            updateHighScoreArray(allTimeScores, sanitisedName, theScore);
        }
        
        if (isRecentHighScore) {
            updateHighScoreArray(recentScores, sanitisedName, theScore);
        }
        
        if (isRecentHighScore || isAllTimeHighScore) {
            // TODO: check live server after db soft link to ../protected/fiveormore.db
            sendScoreToServer(uniqId, sanitisedName, theScore);
        }
        
    }
    
    function updateHighScoreArray(highScoreArray, name, theScore) {
        if (highScoreArray.length >= HS_NUM_DISPLAYED) {
            highScoreArray.pop();
        }
        highScoreArray.push([name, theScore]);
        highScoreArray.sort(compareByScore).reverse();
    }
    
    function saveHighScoresToCookie() {
        cookieHandler.saveLocalHighScores(localScores);
    }
    
    this.displayHighScores = function(opts) {
        if (opts.serverScores) {
            setServerScores(opts.serverScores);
        }
        loadHighScoresFromCookie();
        setHighScoresHtml();
    }
    
    function setServerScores(combinedServerScores) {
        allTimeScores = combinedServerScores["allTime"];
        recentScores = combinedServerScores["recent"];
    }
    
    function setHighScoresHtml() {
        var allTimeBestHtml = getAllTimeBestHtml();
        var recentBestHtml = getRecentBestHtml();
        var localBestHtml = getLocalBestHtml();
        var allScores = 
            '<div id="allTimeScores">\n'+allTimeBestHtml+'</div>\n\n' + 
            '<div id="recentScores">\n'+recentBestHtml+'</div>\n\n' + 
            '<div id="localScores">\n'+localBestHtml+'</div>\n\n';
        $('#highScoresWrap').html(allScores);
        $('#localScores').hide();
        $('#allTimeScores').hide();
    }
    
    function loadHighScoresFromCookie() {
        localScores = cookieHandler.readLocalHighScores();
    }
    
    function isHighScore(highScores, score) {
        if (highScores.length === 0) {
            return true;
        }
        var lastIndex = highScores.length - 1;
        return score > highScores[lastIndex][1] || highScores.length < HS_NUM_DISPLAYED;
    }

    function getLocalBestHtml() {
        var highScores = getHighScoresHtml(localScores, "Local Best");
        highScores += getHighScoreBottomButtonsHtml("All Time Best", "allTime", "Daily Best", "recent");
        return highScores;
    }
    
    function getAllTimeBestHtml() {
        var highScores = getHighScoresHtml(allTimeScores, "All Time Best");
        highScores += getHighScoreBottomButtonsHtml("Daily Best", "recent", "Local Best", "local");
        return highScores;
    }
    
    function getRecentBestHtml() {
        var highScores = getHighScoresHtml(recentScores, "Daily Best");
        highScores += getHighScoreBottomButtonsHtml("All Time Best", "allTime", "Local Best", "local");
        return highScores;
    }
    
    function getHighScoreBottomButtonsHtml(nav1Title, nav1Class, nav2Title, nav2Class) {
        var nav = 
            "<p class='toggleHighScores'><em class='" + nav1Class + "'>" + nav1Title + 
            "</em><em class='" + nav2Class + "'>" + nav2Title + "</em></p>\n";
        return nav;
    }
    function getHighScoresHtml(highScores, title) {
        //highScores.sort(compareByScore).reverse();
        var highScoresHtml = '';
        highScoresHtml += '<h3><span>' + title + '</span></h3>\n';
        highScoresHtml += '<dl>\n';
        var leadin = HS_LEADIN;
        var oneBasedIndex = 1;
        for (var idx = 0; idx < highScores.length;  idx++) {
            highScoresHtml += '<dt>'+leadin+oneBasedIndex+'. '+chopUserName(highScores[idx][0], HS_MAX_NAME_LENGTH)+'</dt>\n';
            highScoresHtml += '<dd>'+highScores[idx][1]+'\n';
            oneBasedIndex += 1;
            if (oneBasedIndex >= 10) {
                leadin = '';
            }
        }
        highScoresHtml += createEmptyHighScoreSlots(oneBasedIndex, highScores);
        highScoresHtml += '</dl>\n';
        return highScoresHtml;
    }
        
    function createEmptyHighScoreSlots(currentOneBasedIndex, highScores) {
        var definitionList = '';
        var leadin = HS_LEADIN;
        var emptyHighScoreSlots = HS_NUM_DISPLAYED - highScores.length;
        var oneBasedIndex = currentOneBasedIndex;
        for (var idx = 0; idx < emptyHighScoreSlots;  idx++) {
            definitionList += '<dt>'+leadin+oneBasedIndex+'.</dt>\n';
            definitionList += '<dd>&nbsp;</dd>\n';
            oneBasedIndex += 1;
            if (oneBasedIndex >= 10) {
                leadin = '';
            }
        }
        return definitionList;
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
    
    function chopUserName(name, maxLength) {
        return name.length <= maxLength ? name : name.slice(0, maxLength);
    }
    
    /* Server high scores */
};
