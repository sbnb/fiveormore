describe('GameEventProducer', function() {

    var score;

    beforeEach(function() {
        score = new Score();
    });

    it('scores empty runs as 0', function() {
        var empty1 = [],
            empty2 = [[], [], []];
        score.add(empty1);
        score.add(empty2);
        expect(score.get()).toBe(0);
    });

    it('adds a simple run', function() {
        var run = [1, 3, 7, 8, 11];
        score.add(run);
        expect(score.get()).toBe(30);
    });

    it('adds a complex run', function() {
        var run = [[1, 3], [7, 8], 11];
        score.add(run);
        expect(score.get()).toBe(30);
    });

});
