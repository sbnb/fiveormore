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

function countEvents(gameEvents, eventType) {
    var count = 0;
    _.forEach(gameEvents, function (event) {
        count = event.event === eventType ? count + 1 : count;
    }, this);
    return count;
}

function populateHighScoreList(highScoreList) {
    highScoreList.maybeAdd('Bob', 10);
    highScoreList.maybeAdd('Bill', 11);
    highScoreList.maybeAdd('Chuck', 12);
}

function createHighScoreList(limit) {
    highScoreList = new FOM.HighScoreList(limit);
    populateHighScoreList(highScoreList);
    return highScoreList;
}
