function Score() {
    var score = 0;
    $('#score').text(score);
    
    this.getScore = function() {
        return score;
    }
    
    this.clearedChainOfLength = function(chainLength) {
        assert(POINTS_FOR_CHAINS[chainLength] > 0, "Score: unknown chain length: " + chainLength);
        score += POINTS_FOR_CHAINS[chainLength];
        $('#score').text(score);
    }
};
