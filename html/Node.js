function Node($td, ancestor, boardIndex, targetNode) {
    this.$td = $td;
    this.G = ancestor !== null ? ancestor.G + 1 : 0;
    this.ancestor = ancestor;
    this.walkable = false;
    if ($td !== null) {
        this.walkable = this.$td.hasClass(EMPTY);
    }
    var boardIndex = boardIndex;
    assert(!(undefined === boardIndex), "Node: boardIndex not defined!")
    
    this.H = getManhattanDistance(targetNode);
    this.F = this.G + this.H;
    
    this.getBoardIndex = function() {
        return boardIndex;
    }
    
    this.getAdjacentBoardIndex = function(direction) {
        switch(direction) {
            case UP:
                return new BoardIndex(boardIndex.row - 1, boardIndex.col);
            case RIGHT:
                return new BoardIndex(boardIndex.row, boardIndex.col + 1);
            case DOWN:
                return new BoardIndex(boardIndex.row + 1, boardIndex.col);
            case LEFT:
                return new BoardIndex(boardIndex.row, boardIndex.col - 1);
        }
        return null;
    }
    
    this.equals = function(otherNode) {
        if (boardIndex.equals(otherNode.getBoardIndex())) {
            return true;
        }
        return false;
    }
    
    // find L shaped distance between two nodes, vertical + horizontal
    function getManhattanDistance(dest) {
        assert(!(undefined === boardIndex), "boardIndex is undefined!");
        if (dest === null) {
            //logMessage("getManhattanDistance: dest is null, returning 1000");
            return 1000;
        }
        return Math.abs(boardIndex.row - dest.getBoardIndex().row) + 
            Math.abs(boardIndex.col - dest.getBoardIndex().col);
    }
};

Node.prototype.toString = function() {
    return "[Node "+this.getBoardIndex()+" F:"+this.F+" G:"+this.G+" H:"+this.H+" ancestor: "+this.ancestor+"]";
}
