beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong &&
             player.isPlaying;
    }
  });


});

// b r b
// b b b
// b r b
function setFiveRunsOfThree(board, onColor, offColor) {
    board.add({x: 0, y: 0}, onColor);
    board.add({x: 1, y: 0}, offColor);
    board.add({x: 2, y: 0}, onColor);
    board.add({x: 0, y: 1}, onColor);
    board.add({x: 1, y: 1}, onColor);
    board.add({x: 2, y: 1}, onColor);
    board.add({x: 0, y: 2}, onColor);
    board.add({x: 1, y: 2}, offColor);
    board.add({x: 2, y: 2}, onColor);
}

function flatten(multiDimArray) {
    return [].concat.apply([], multiDimArray);
}

function addListOfCellsToBoard(board, cells, color) {
    for (var idx = 0; idx < cells.length; idx += 1) {
        board.add(cells[idx], color);
    }
}

function contains(listOfCells, cell) {
    for (var idx = 0; idx < listOfCells.length; idx += 1) {
        if (listOfCells[idx].x === cell.x && listOfCells[idx].y === cell.y) {
            return true;
        }
    }
    return false;
}

