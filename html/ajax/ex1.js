
$(document).ready(function() {
    var MESSAGES = ['newGameButtonPressed', 'gameFinished', 'pageRefreshed', 
        'viewHighScores', 'highScoreEntered', 'viewRules', 'viewAbout'];
    var message = MESSAGES[rand(MESSAGES.length)];
    var uniqId = uniqIdHtml;
    messageServer(message, uniqId);
    
    function messageServer(message, uniqId) {
        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: 'uniqId='+uniqId+'&message='+message,
            success: function(result) {
                console.log(result);
                $('p').text(result);
            }
        });
    }
        
    // return random number from 0..n-1
    function rand(n) {
        return Math.floor(Math.random() * n);
    }
});