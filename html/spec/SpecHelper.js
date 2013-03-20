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
