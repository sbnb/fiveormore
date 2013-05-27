describe('Score', function() {

    var score;

    beforeEach(function() {
        score = new FOM.Score(new FOM.PointsPopup());
    });

    it('adds a simple run', function() {
        var run = [[1, 3, 7, 8, 11]];
        var points = score.add(run);
        expect(score.get()).toBe(score.POINTS_FOR_LENGTH[run[0].length]);
        expect(points).toBe(score.POINTS_FOR_LENGTH[run[0].length]);
    });

    it('adds each possible length', function() {
        var runs = [[1,2,3,4,5], [1,2,3,4,5,6], [1,2,3,4,5,6,7],
            [1,2,3,4,5,6,7,8], [1,2,3,4,5,6,7,8,9]];
        var points = score.add(runs);

        var expectTotal = score.POINTS_FOR_LENGTH[5] +
            score.POINTS_FOR_LENGTH[6] +
            score.POINTS_FOR_LENGTH[7] +
            score.POINTS_FOR_LENGTH[8] +
            score.POINTS_FOR_LENGTH[9];

        expect(score.get()).toBe(expectTotal);
        expect(points).toBe(expectTotal);


    });

});
