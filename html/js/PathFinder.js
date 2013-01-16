// A* search implementation
function PathFinder() {
    
    var $rows = $(BOARD).children('tr');
    var openList = [];
    var closedList = [];
    var startingNode = null;
    var currentNode = null;
    var targetNode = null;
    
    this.search = function($currentTd, $targetTd) {
        openList = [];
        closedList = [];
        
        var endBoardIndex = getBoardIndexFromTd($targetTd);
        targetNode = new Node($targetTd, null, endBoardIndex, null);
        
        var startBoardIndex = getBoardIndexFromTd($currentTd);
        currentNode = new Node($currentTd, null, startBoardIndex, targetNode);
        startingNode = new Node($currentTd, null, startBoardIndex, targetNode);
        openList.push(currentNode);
        
        var path = findPath($targetTd);
        return path;
    }
    
    function findPath($targetTd) {
        // loop until find target or open list is empty (no path)
        var counter = 0;
        while (openList.length > 0) {
            currentNode = popBestFromOpenList();
            
            if (!onNodeList(closedList, currentNode)) {
                closedList.push(currentNode);
            }
            
            if (checkAdjacentNodes()) {
                var pathList = getPathAsBoardIndexListInForwardOrder();
                return pathList;
            }
                            
            counter++;
            if (counter > SEARCH_LOOP_LIMIT) {
                assert(false, "findPath: too many iterations " + counter);
                return false;
            }
        }
        return false; // no path
    }
    
    function getPathAsBoardIndexListInForwardOrder() {
        var node = targetNode;
        var nodeList = [];
        while (node != null) {
            nodeList.unshift(node.getBoardIndex());
            node = node.ancestor;
        }
        return nodeList;
    }
    
    // return true if any adjacent nodes equal target node, else false
    function checkAdjacentNodes() {
        var adjacentNodes = getAdjacentNodes(currentNode);
        for (var direction in adjacentNodes) {
            if (checkAdjacentNode(adjacentNodes[direction])) {
                return true;
            }
        }
        return false;
    }
    
    // return true if adjacentNode is targetNode, else false
    function checkAdjacentNode(adjacentNode) {
        if (adjacentNode.walkable && !onNodeList(closedList, adjacentNode)) {
            if (!onNodeList(openList, adjacentNode)) {
                adjacentNode.ancestor = currentNode;
                openList.push(adjacentNode);
                if (adjacentNode.equals(targetNode)) {
                    // make target node the same object as adjacentNode
                    targetNode = adjacentNode;
                    return true;
                }
            }
            else {
                if (betterPath(adjacentNode, null)) {
                    // TODO: update if found better path
                    // change ancestor
                }
            }
        }
        return false;
    }
    
    // TODO: implement better path check
    function betterPath(node, nodeFromOpenList) {
        return false;
    }
    
    function popBestFromOpenList() {
        var lowestNode = null;
        var lowIndex = -1;
        
        var opnListLen = openList.length;
        
        for (var idx = 0; idx < openList.length;  idx++) {
            if (lowestNode === null || openList[idx].F < lowestNode.F) {
                lowestNode = openList[idx];
                lowIndex = idx;
            }
        }
        openList.splice(lowIndex, 1);
        return lowestNode;
    }
    
    function onNodeList(list, node) {
        for (var idx = 0; idx < list.length;  idx++) {
            if (node.equals(list[idx])) {
                return true;
            }
        }
        return false;
    }
    
    function getAdjacentNodes(node) {
        assert(!(undefined === node), "getAdjacentNodes: node is undefined");
        assert(!(null === node), "getAdjacentNodes: node is null");
        assert(!(undefined === node.getBoardIndex()), "getAdjacentNodes: node.getBoardIndex() is undefined");
        
        var boardIndex = node.getBoardIndex();
        var $up = $rows.eq(boardIndex.row-1).children('td').eq(boardIndex.col);
        if (boardIndex.row === 0) {
            $up = null;
        }
        var $right = $rows.eq(boardIndex.row).children('td').eq(boardIndex.col + 1);
        var $down = $rows.eq(boardIndex.row+1).children('td').eq(boardIndex.col);
        var $left = $rows.eq(boardIndex.row).children('td').eq(boardIndex.col - 1);
        if (boardIndex.col === 0) {
            $left = null;
        }
        return {
            up: new Node($up, node, node.getAdjacentBoardIndex(UP), targetNode),
            right: new Node($right, node, node.getAdjacentBoardIndex(RIGHT), targetNode),
            down: new Node($down, node, node.getAdjacentBoardIndex(DOWN), targetNode),
            left: new Node($left, node, node.getAdjacentBoardIndex(LEFT), targetNode)
        }
    }
    
    function getBoardIndexFromTd($td) {
        return new BoardIndex(
            $td.parent().prevAll('tr').length,
            $td.prevAll('td').length
        );
    }
            
};
