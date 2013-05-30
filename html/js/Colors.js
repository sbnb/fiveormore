(function () {

    "use strict";

    FOM.Colors = function () {
        this.COLORS = ['green', 'red', 'blue', 'orange', 'purple', 'yellow'];
    };

    FOM.Colors.prototype = {

        // return list of random colors, in random order, of length len
        getRandom:
            function (len) {
                var randColors = [];
                _.forEach(_.range(len), function () {
                    randColors.push(_.shuffle(this.COLORS)[0]);
                }, this);

                return randColors;
            }
    };

})();
