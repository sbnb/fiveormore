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
        safety = 50,
        loops = 0;

    while (openList.length !== 0) {

        currentNode = getNodeWithLowestCostToEnd(openList);

        // currentNode may be {}
        if (size(currentNode) === 0) {
            console.log('currentNode === {}');
        }

        if (cellsEqual(currentNode, targetCell)) {
            var path = reconstructPath(currentNode);
            return path;
        }

        removeNodeFromList(openList, currentNode);
        addNodeToList(closedList, currentNode);

        neighbourCells = this._logicalBoard.getNeighbours({x: currentNode.x, y: currentNode.y}, true);

        for (var idx = 0; idx < neighbourCells.length; idx += 1) {

            neighbour = neighbourCells[idx];
            //~ tentative_g_score := g_score[current] + dist_between(current,neighbor)
            tentativeCostSoFar = currentNode.costSoFar + 1;
            estimatedCostToEnd = this.estimatedCostToEnd(neighbour, targetCell);

            //~ if neighbor in closedset
            if (nodeInList(closedList, neighbour)) {
                if (tentativeCostSoFar >= estimatedCostToEnd) {
                    continue;
                }
            }


            //~ if neighbor not in openset or tentative_g_score < g_score[neighbor]
            if (!nodeInList(openList, neighbour) ||
                tentativeCostSoFar < estimatedCostToEnd) {
                //~ came_from[neighbor] := current
                neighbour.cameFrom = currentNode;

                //~ g_score[neighbor] := tentative_g_score
                neighbour.costSoFar = tentativeCostSoFar;

                //~ f_score[neighbor] := g_score[neighbor] + heuristic_cost_estimate(neighbor, goal)
                neighbour.costToEnd = neighbour.costSoFar + estimatedCostToEnd;

                //~ if neighbor not in openset
                if (!nodeInList(openList, neighbour)) {
                    //~ add neighbor to openset
                    addNodeToList(openList, neighbour);

                }

            }

        }


        loops += 1;
        if (loops > safety) {
            console.log('Breaking loop at ' + loops);
            break;
        }
    }
    return [];
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
    if (node.x && node.y) {
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


//~ function A*(start,goal)
     //~ closedset := the empty set    // The set of nodes already evaluated.
     //~ openset := {start}    // The set of tentative nodes to be evaluated, initially containing the start node
     //~ came_from := the empty map    // The map of navigated nodes.

     //~ g_score[start] := 0    // Cost from start along best known path.
     //~ // Estimated total cost from start to goal through y.
     //~ f_score[start] := g_score[start] + heuristic_cost_estimate(start, goal)

     //~ while openset is not empty
         //~ current := the node in openset having the lowest f_score[] value
         //~ if current = goal
             //~ return reconstruct_path(came_from, goal)

         //~ remove current from openset
         //~ add current to closedset
         //~ for each neighbor in neighbor_nodes(current)
             //~ tentative_g_score := g_score[current] + dist_between(current,neighbor)
             //~ if neighbor in closedset
                 //~ if tentative_g_score >= g_score[neighbor]
                     //~ continue

             //~ if neighbor not in openset or tentative_g_score < g_score[neighbor]
                 //~ came_from[neighbor] := current
                 //~ g_score[neighbor] := tentative_g_score
                 //~ f_score[neighbor] := g_score[neighbor] + heuristic_cost_estimate(neighbor, goal)
                 //~ if neighbor not in openset
                     //~ add neighbor to openset

     //~ return failure

 //~ function reconstruct_path(came_from, current_node)
     //~ if came_from[current_node] in set
         //~ p := reconstruct_path(came_from, came_from[current_node])
         //~ return (p + current_node)
     //~ else
         //~ return current_node

