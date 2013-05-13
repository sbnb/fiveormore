function StoneMaker() {

    var previewStoneColors = new Array(NUM_NEW_STONES);
    setPreview();

    // add NUM_NEW_STONES stones to board in random empty positions
    // return true on completion, false if no empty positions left afterward
    this.placeStones = function(numEmptySquares) {
        var boardWillFill= boardWillBeFull(numEmptySquares);
        var squaresToFill = Math.min(NUM_NEW_STONES, numEmptySquares);
        for (var idx = 0; idx < squaresToFill;  idx++) {
            addNewStoneToBoard(numEmptySquares-idx, previewStoneColors[idx]);
        }
        if (!boardWillFill) {
            setPreview();
        }
        return boardWillFill;
    };

    function addNewStoneToBoard(numEmptySquares, stoneColor) {
        var emptySquareIndex = rand(numEmptySquares);
        var $cell = $(BOARD).find(EMPTY_TD).eq(emptySquareIndex);
        $cell.removeClass().addClass(stoneColor);
        if (SHAPES_ON) {
            $cell.html('<img src="imgs/'+STONE_SHAPES[stoneColor]+'" />');
        }

    }

    // set preview stones
    function setPreview() {
        var $previewLis = $('#preview').find('li');
        $previewLis.each(function(idx) {
            previewStoneColors[idx] = getNewStoneColor();
            $(this).removeClass().addClass(previewStoneColors[idx]);
            if (SHAPES_ON) {
                var imgSrc = "imgs/" + STONE_SHAPES[previewStoneColors[idx]];
                $(this).html('<img src='+imgSrc+' />');
            }
            else {
                $(this).html('');
            }

        });
    }

    function getNewStoneColor() {
        return STONE_COLORS[rand(STONE_COLORS.length)];
    }

    function boardWillBeFull(numEmptySquares) {
        return numEmptySquares <= NUM_NEW_STONES;
    }
}
