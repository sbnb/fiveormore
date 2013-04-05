function Score() {
    this.score = 0;
};

Score.prototype = {
    add: function (runs) {
        this.score += _.reduce(_.flatten(runs), function(sum, num) {
          return sum + num;
        }, 0);
    },
    get: function () {
        return this.score;
    }
}

