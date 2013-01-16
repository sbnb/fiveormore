function PathAnimator() {
    
    this.animate = function(boardGame, boardIndexList, colorOfStone, imgSrc) {
        animateStone(boardGame, boardIndexList, 1, colorOfStone, imgSrc);
    }
    
    // recursively traverse boardIndexList
    function animateStone(boardGame, boardIndexList, idx, colorOfStone, imgSrc) {
        if (idx < boardIndexList.length) {
            if (idx > 0) {
                // set previous stone to EMPTY, remove any img
                setStoneColor(boardIndexList[idx-1], EMPTY, '');
            }
            // set current stone to right color and (potentially) image
            setStoneColor(boardIndexList[idx], colorOfStone, imgSrc);
            // set timer for next frame
            setTimeout(function() {
                animateStone(boardGame, boardIndexList, idx+1, colorOfStone, imgSrc);
            }, PATH_ANIMATION_SPEED);
            
        }
        else {
            // base case: end of path, animation finished
            boardGame.animationFinished();
        }
    }
    
    function setStoneColor(boardIndex, color, imgSrc) {
        $cell = boardIndex.getAsJqueryTd();
        $cell.removeClass().addClass(color);
        if (SHAPES_ON) {
            if (imgSrc !== '') {
                $cell.html('<img src='+imgSrc+' />');
            }
            else {
                $cell.html(CELL_CONTENT);
            }
        }
    }
};
