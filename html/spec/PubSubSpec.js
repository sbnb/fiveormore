describe('PubSub', function() {

    var UPDATED = 'updated';

    it('subscriber can get messages from publisher', function() {
        var called = 0,
            subscriber = function (msg, data) {
                called += 1;
            };

        runs(function() {
            PubSub.subscribe(UPDATED, subscriber);
            PubSub.publish(UPDATED, {foo: 'bar'});
        });

        waitsFor(function() {
          return called === 1;
        }, "called to become 1", 50);

        runs(function() {
            expect(called).toBe(1);
        });
    });

});
