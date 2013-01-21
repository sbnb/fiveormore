function Score() {
    var score = 0;
    $('#score').text(score);

    this.getScore = function() {
        return score;
    }

    this.clearedChainOfLength = function(chainHolder) {
    //~ this.clearedChainOfLength = function(chainLength) {
        var chainLength = chainHolder.chain.size;
        assert(POINTS_FOR_CHAINS[chainLength] > 0, "Score: unknown chain length: " + chainLength);
        score += POINTS_FOR_CHAINS[chainLength];
        $('#score').text(score);

        animatePointsForClearance(chainHolder, POINTS_FOR_CHAINS[chainLength]);
    }

    //chainHolder: {cell: startCell, chain: chain, type: cellListType}
    function animatePointsForClearance(chainHolder, points) {
        var middleCell = getMiddleCell(chainHolder.type, chainHolder.cell, chainHolder.chain),
            $middleCell = $(BOARD + ' tr').eq(middleCell.rowIdx).find('td').eq(middleCell.colIdx),
            position = $middleCell.position(),
            middleCellWidth = $middleCell.outerWidth(),
            pointsWidth;


        $('#points').text(points);
        pointsWidth = $('#points').outerWidth();
        $('#pointsPopup').css({
                top: position.top + 'px',
                left: position.left + 'px',
                opacity: 1.0
            });
        $('#pointsPopup').show();

        $('#pointsPopup').animate({
                opacity: 0.4,
                top: '-=30'
                }, 500, function() {
                $('#pointsPopup').hide();
            });
    }

    function getMiddleCell(cellListType, baseCell, chain) {
        var middleCell = {};
        switch(cellListType) {
            case COLUMNS:
                middleCell.colIdx = baseCell.colIdx;
                middleCell.rowIdx = chain.index + Math.floor(chain.size / 2);
                break;
            case ROWS:
                middleCell.colIdx = chain.index + chain.size / 2;
                middleCell.rowIdx = baseCell.rowIdx;
                break;
            case DIAGONAL_RIGHT:
                middleCell.colIdx = baseCell.colIdx + chain.index + Math.floor(chain.size / 2);
                middleCell.rowIdx = baseCell.rowIdx + chain.index + Math.floor(chain.size / 2);
                break;
            case DIAGONAL_LEFT:
                middleCell.colIdx = baseCell.colIdx - chain.index - Math.floor(chain.size / 2);
                middleCell.rowIdx = baseCell.rowIdx + chain.index + Math.floor(chain.size / 2);
                break;
            default:
                assert(false, 'Score.getMiddleCell: bad type: ' + cellListType);
        }
        return middleCell;
    }
};
