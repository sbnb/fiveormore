(function () {

    "use strict";

    /*
        Search for valid paths on a board.
    */

    FOM.PathSearcher = function (logicalBoard) {
        this._logicalBoard = logicalBoard;
    };

    // Return the list of cells from startCell to targetCell (include both ends)
    FOM.PathSearcher.prototype.search = function (startCell, targetCell) {
        var firstNode = buildPathNode(startCell, targetCell),
            openList = [firstNode],
            closedList = [],
            currentNode,
            neighbourCells,
            neighbour,
            tentativeCostSoFar,
            estimatedCost,
            safety = 200,
            loops = 0,
            that = this;

        while (openList.length !== 0) {

            currentNode = getLowestCostNode(openList);

            if (cellsEqual(currentNode, targetCell)) {
                var path = reconstructPath(currentNode);
                path = path.reverse();
                return path.slice(1);
            }

            openList = removeNodeFromList(openList, currentNode);
            addNodeToList(closedList, currentNode);
            neighbourCells = this._logicalBoard.getNeighbours(
                {x: currentNode.x, y: currentNode.y}, true);

            for (var idx = 0; idx < neighbourCells.length; idx += 1) {
                neighbour = neighbourCells[idx];
                tentativeCostSoFar = currentNode.costSoFar + 1;
                estimatedCost = getEstimatedCostToEnd(neighbour, targetCell);

                if (nodeInList(closedList, neighbour)) {
                    if (tentativeCostSoFar >= estimatedCost) {
                        continue;
                    }
                }

                if (!nodeInList(openList, neighbour) ||
                    tentativeCostSoFar < estimatedCost) {

                    neighbour.cameFrom = currentNode;
                    neighbour.costSoFar = tentativeCostSoFar;
                    neighbour.costToEnd = neighbour.costSoFar + estimatedCost;

                    if (!nodeInList(openList, neighbour)) {
                        addNodeToList(openList, neighbour);
                    }
                }
            }

            loops += 1;
            if (loops > safety) {
                throw "Loop safety breakout at loop: " + loops;
            }
        }
        return [];
    };

    function buildPathNode(startCell, targetCell) {
        var estimatedCost = getEstimatedCostToEnd(startCell, targetCell);
        return new FOM.PathNode(startCell, 0, estimatedCost);
    }

    function reconstructPath(targetCell) {
        if (!targetCell.cameFrom) {
            return [{x: targetCell.x, y: targetCell.y}];
        }

        return [{x: targetCell.x, y: targetCell.y}].concat(
            reconstructPath(targetCell.cameFrom));
    }

    function getEstimatedCostToEnd(startCell, targetCell) {
        return Math.abs(targetCell.x - startCell.x) +
            Math.abs(targetCell.y - startCell.y);
    }

    // return lowest cost-to-end node in nodeList, or undefined if list empty
    function getLowestCostNode(nodeList) {
        var lowest = _.min(nodeList, function(node) { return node.costToEnd; });
        return typeof lowest === 'object' ? lowest : 'undefined';
    }

    function removeNodeFromList(nodeList, node) {
        if ('x' in node && 'y' in node) {
            return _.filter(nodeList, function (eachNode) {
                return !cellsEqual(node, eachNode);
            });
        }
        return nodeList;
    }

    // add node to list if (and only if) not already in there
    function addNodeToList(nodeList, node) {
        if (!nodeInList(nodeList, node)) {
            nodeList.push(node);
        }
    }

    // return true if node is in list
    function nodeInList(nodeList, node) {
        return _.any(nodeList, function (eachNode) {
            return cellsEqual(node, eachNode);
        });
    }

    function sharesKeys(keys, objA, objB) {
        if (_.isUndefined(objA) || _.isUndefined(objB)) {
            return false;
        }
        return _.every(keys, function (key) {
            return key in objA && key in objB;
        });
    }

    function cellsEqual(cellA, cellB) {
        return sharesKeys(['x', 'y'], cellA, cellB) &&
            cellA.x === cellB.x && cellA.y === cellB.y;
    }

    FOM.PathNode = function (cell, costSoFar, costToEnd) {
        this.cell = cell;
        this.x = cell.x;
        this.y = cell.y;
        this.costSoFar = costSoFar;
        this.costToEnd = costToEnd;
    };

})();
