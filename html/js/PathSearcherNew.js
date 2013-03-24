/*
    Search for valid paths on a board.
*/

function PathSearcherNew(logicalBoard) {
    this._logicalBoard = logicalBoard;
}

// Return the list of cells from startCell to targetCell (include both ends)
PathSearcherNew.prototype.search = function (startCell, targetCell) {
    var openList = [new PathNode(startCell, 0, this.estimatedCostToEnd(startCell, targetCell))],
        closedList = [],
        currentNode,
        neighbourCells,
        neighbour,
        tentativeCostSoFar,
        estimatedCostToEnd,
        safety = 200,
        loops = 0;

    while (openList.length !== 0) {

        currentNode = getNodeWithLowestCostToEnd(openList);

        if (cellsEqual(currentNode, targetCell)) {
            return reconstructPath(currentNode);
        }

        removeNodeFromList(openList, currentNode);
        addNodeToList(closedList, currentNode);
        neighbourCells = this._logicalBoard.getNeighbours({x: currentNode.x,
            y: currentNode.y}, true);

        for (var idx = 0; idx < neighbourCells.length; idx += 1) {

            neighbour = neighbourCells[idx];
            tentativeCostSoFar = currentNode.costSoFar + 1;
            estimatedCostToEnd = this.estimatedCostToEnd(neighbour, targetCell);

            if (nodeInList(closedList, neighbour)) {
                if (tentativeCostSoFar >= estimatedCostToEnd) {
                    continue;
                }
            }

            if (!nodeInList(openList, neighbour) ||
                tentativeCostSoFar < estimatedCostToEnd) {

                neighbour.cameFrom = currentNode;
                neighbour.costSoFar = tentativeCostSoFar;
                neighbour.costToEnd = neighbour.costSoFar + estimatedCostToEnd;

                if (!nodeInList(openList, neighbour)) {
                    addNodeToList(openList, neighbour);
                }

            }

        }


        loops += 1;
        if (loops > safety) {
            throw "Loop safety breakout at loop: " + loops;
            break;
        }
    }
    return [];
}

function listAsStr(cellList) {
    var buff = '';
    for (var idx = 0; idx < cellList.length; idx += 1) {
        buff += '(' + cellList[idx].x + ',' + cellList[idx].y + ') '
    }
    return buff;
}

function reconstructPath(targetCell) {
    if (!targetCell.cameFrom) {
        return [{x: targetCell.x, y: targetCell.y}];
    }

    return [{x: targetCell.x, y: targetCell.y}].concat(reconstructPath(targetCell.cameFrom));
}

PathSearcherNew.prototype.estimatedCostToEnd = function (startCell, targetCell) {
    return Math.abs(targetCell.x - startCell.x) +
        Math.abs(targetCell.y - startCell.y);
}

function getNodeWithLowestCostToEnd(openList) {
    if (openList.length === 0) {
        return {};
    }

    var lowestCostNode = openList[0];
    for (var idx = 0; idx < openList.length; idx += 1) {
        if (openList[idx].costToEnd < lowestCostNode.costToEnd) {
            lowestCostNode = openList[idx];
        }
    }
    return lowestCostNode;
}

function removeNodeFromList(nodeList, node) {
    if ('x' in node && 'y' in node) {
        var idx = nodeList.length - 1;
        while (idx > -1) {
            if (cellsEqual(node, nodeList[idx])) {
                nodeList.splice(idx, 1);
                break;
            }
            idx -= 1;
        }
    }
}

// add node to list if (and only if) not already in there
function addNodeToList(nodeList, node) {
    if (!nodeInList(nodeList, node)) {
        nodeList.push(node);
    }
}

// return true if node is in list
function nodeInList(nodeList, node) {
    for (var idx = 0; idx < nodeList.length; idx += 1) {
        if (cellsEqual(node, nodeList[idx])) {
            return true;
        }
    }
    return false;
}

function cellsEqual(cellA, cellB) {
    if (cellA && cellB && 'x' in cellA && 'x' in cellB && 'y' in cellA && 'y' in cellB) {
        if (cellA.x === cellB.x && cellA.y === cellB.y ) {
            return true;
        }
    }
    return false;
}

function size(obj) {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            count += 1;
        }
    }
    return count;
}

function PathNode(cell, costSoFar, costToEnd) {
    this.cell = cell;
    this.x = cell.x;
    this.y = cell.y;
    this.costSoFar = costSoFar;
    this.costToEnd = costToEnd;
}
