/* Create a StoneMatcher object, shielding StoneMatcher from the DOM */

function StoneMatcherFactory() {
    this.makeStoneMatcher = makeStoneMatcher;

    function makeStoneMatcher(score) {
        var ROW_COUNT = $(BOARD + ' tr').length;
        var COLUMN_COUNT = $(BOARD).find('tr:first td').length;

        var stoneMatcher = new StoneMatcher(score);

        return stoneMatcher;
    }
}
