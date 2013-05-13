function ServerHighScoreWriter() {
}

ServerHighScoreWriter.prototype.write = function (username, score, uniqId) {
    sendScoreToServer(username, score, uniqId);
};

function sendScoreToServer(username, score, uniqId) {
    $.ajax({
        url: 'server.php',
        type: 'POST',
        data: 'q=sendHighScore&uniqId='+uniqId+'&username='+username+'&score='+score
    });
}
