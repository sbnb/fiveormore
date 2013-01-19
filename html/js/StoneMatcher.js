/*
    Find matching runs of colors vertically and horizontally.
    If greater than CHAIN_LENGTH set the cells to empty.
    Invariant: classes in td's are colors and each td has exactly
    one class entry (a color or 'empty')
*/
function StoneMatcher(score) {

    var score = score;
    var ROW_COUNT = $(BOARD + ' tr').length;
    var COLUMN_COUNT = $(BOARD).find('tr:first td').length;
    var foundColorChain = false;
    var chainsToClear = [];
    var boardMatrix;

    this.findAllColorChains = function() {
        foundColorChain = false;
        chainsToClear = [];
        boardMatrix = getBoardAsMatrix();

        searchRowsForColors();
        searchColumnsForColors();
        searchDiagonalsForColors();

        clearFoundChains();
        return foundColorChain;
    };

    function getBoardAsMatrix() {
        var matrix = [];
        for (var idx = 0; idx < ROW_COUNT;  idx++) {
            matrix.push(getRowColorList(idx));
        }
        return matrix;
    }

    function searchRowsForColors() {
        for (var rowNum = 0; rowNum < ROW_COUNT;  rowNum++) {
            var cellList = getRowColorList(rowNum);
            var firstCell = {rowIdx: rowNum, colIdx: 0};
            searchCellListByEachColor(cellList, firstCell, ROWS);
        }
    }

    function searchColumnsForColors() {
        for (var columnNum = 0; columnNum < COLUMN_COUNT;  columnNum++) {
            var cellList = getColumnColorList(columnNum);
            var firstCell = {rowIdx: 0, colIdx: columnNum};
            searchCellListByEachColor(cellList, firstCell, COLUMNS);
        }
    }

    function searchDiagonalsForColors() {
        searchRightDiagonalsStartingInFirstColumn();
        searchRightDiagonalsStartingInFirstRow();
        searchLeftDiagonalsStartingInFirstRow();
        searchLeftDiagonalsStartingInLastColumn();
    }

    function searchRightDiagonalsStartingInFirstColumn() {
        var lastRowDiagonalPossible = ROW_COUNT - CHAIN_LENGTH;
        for (var rowIdx = 0; rowIdx <= lastRowDiagonalPossible; rowIdx++) {
            var firstCell = {rowIdx: rowIdx, colIdx: 0};
            var cellList = getRightDiagonalColorList(firstCell);
            searchCellListByEachColor(cellList, firstCell, DIAGONAL_RIGHT);
        }
    }

    function searchRightDiagonalsStartingInFirstRow() {
        var lastColumnDiagonalPossible = COLUMN_COUNT - CHAIN_LENGTH;
        for (var colIdx = 1; colIdx <= lastColumnDiagonalPossible;  colIdx++) {
            var firstCell = {rowIdx: 0, colIdx: colIdx};
            var cellList = getRightDiagonalColorList(firstCell);
            searchCellListByEachColor(cellList, firstCell, DIAGONAL_RIGHT);
        }
    }

    function searchLeftDiagonalsStartingInFirstRow() {
        var firstColumnDiagonalPossible = COLUMN_COUNT - CHAIN_LENGTH;
        for (var colIdx = firstColumnDiagonalPossible; colIdx < COLUMN_COUNT; colIdx++) {
            var firstCell = {rowIdx: 0, colIdx: colIdx};
            var cellList = getLeftDiagonalColorList(firstCell);
            searchCellListByEachColor(cellList, firstCell, DIAGONAL_LEFT);
        }
    }

    function searchLeftDiagonalsStartingInLastColumn() {
        var lastRowDiagonalPossible = ROW_COUNT - CHAIN_LENGTH;
        for (var rowIdx = 1; rowIdx <= lastRowDiagonalPossible; rowIdx++) {
            var firstCell = {rowIdx: rowIdx, colIdx: COLUMN_COUNT - 1};
            var cellList = getLeftDiagonalColorList(firstCell);
            searchCellListByEachColor(cellList, firstCell, DIAGONAL_LEFT);
        }
    }

    function getRowColorList(rowNum) {
        var rowColors = $.map($(BOARD + ' tr').eq(rowNum).find('td'), function(cell) {
            return $(cell).attr('class');
        });
        return rowColors;
    }

    function getColumnColorList(columnNum) {
        var columnColors = $.map($(BOARD + ' tr td:nth-child(' + (columnNum+1) + ')'), function(cell) {
            return $(cell).attr('class');
        });
        return columnColors;
    }

    function getRightDiagonalColorList(firstCell) {
        var cellList = [];
        var rowNum = firstCell.rowIdx;
        var colNum = firstCell.colIdx;

        while (rowNum < ROW_COUNT && colNum < COLUMN_COUNT) {
            cellList.push(boardMatrix[rowNum][colNum]);
            rowNum += 1;
            colNum += 1;
        }
        return cellList;
    }

    function getLeftDiagonalColorList(firstCell) {
        var cellList = [];
        var rowNum = firstCell.rowIdx;
        var colNum = firstCell.colIdx;

        while (rowNum < ROW_COUNT && colNum > -1) {
            cellList.push(boardMatrix[rowNum][colNum]);
            rowNum += 1;
            colNum -= 1;
        }
        return cellList;
    }

    function searchCellListByEachColor(cellList, startCell, cellListType) {
        for (var colorIdx = 0; colorIdx < STONE_COLORS.length;  colorIdx++) {
            var searchColor = STONE_COLORS[colorIdx];
            var chain = findLongestChainOfColor(searchColor, cellList);
            if (chain.size >= CHAIN_LENGTH) {
                foundColorChain = true;
                chainsToClear.push({cell: startCell, chain: chain, type: cellListType});
            }
        }
    }

    // return: index to start of chain in cellList and the chain size.
    function findLongestChainOfColor(color, cellList) {
        var count = 0;
        var firstStoneIdx = -1;
        var longestChain = {index: -1, size: 0};

        for (var stoneIdx = 0; stoneIdx < cellList.length;  stoneIdx++) {
            var stoneMatchesColor = (cellList[stoneIdx] === color);
            var firstStoneInChain = (count === 0);
            if (stoneMatchesColor) {
                if (firstStoneInChain) {
                    firstStoneIdx = stoneIdx;
                }
                count++;
                if (count > longestChain.size) {
                    longestChain.index = firstStoneIdx;
                    longestChain.size = count;
                }
            }
            else {
                count = 0;
            }
        }
        return longestChain;
    }

    function clearFoundChains() {
        for (var idx = 0; idx < chainsToClear.length;  idx++) {
            var chainHolder = chainsToClear[idx];
            switch(chainsToClear[idx].type) {
                case COLUMNS: {
                    clearColumnChain(chainHolder.cell.colIdx, chainHolder.chain);
                    break;
                }
                case ROWS: {
                    clearRowChain(chainHolder.cell.rowIdx, chainHolder.chain);
                    break;
                }
                case DIAGONAL_RIGHT: {
                    clearRightDiagonalChain(chainHolder.cell, chainHolder.chain);
                    break;
                }
                case DIAGONAL_LEFT: {
                    clearLeftDiagonalChain(chainHolder.cell, chainHolder.chain);
                    break;
                }
                default: {
                    assert(false, "StoneMatcher.clearFoundChains Unknown type: " +
                    chainHolder.type)
                }
            }
            //~ score.clearedChainOfLength(chainHolder.chain.size);
            score.clearedChainOfLength(chainHolder);

        }
    }

    function clearRowChain(rowNum, chain) {
        $.map($(BOARD + ' tr').eq(rowNum).find('td').slice(chain.index, chain.index + chain.size), function(cell) {
            setCellToEmpty($(cell));
        });
    }

    function clearColumnChain(columnNum, chain) {
        $.map($(BOARD + ' tr td:nth-child('+(columnNum+1)+')').slice(chain.index, chain.index + chain.size), function(cell) {
            setCellToEmpty($(cell));
        });
    }

    function clearRightDiagonalChain(startCell, chain) {
        var rowIdx = startCell.rowIdx + chain.index;
        var colIdx = startCell.colIdx + chain.index;
        for (var idx = 0; idx < chain.size;  idx++) {
            var $cell = $(BOARD + ' tr').eq(rowIdx).find('td').eq(colIdx);
            setCellToEmpty($cell);
            rowIdx++;
            colIdx++;
        }
    }

    function clearLeftDiagonalChain(startCell, chain) {
        var rowIdx = startCell.rowIdx + chain.index;
        var colIdx = startCell.colIdx - chain.index;
        for (var idx = 0; idx < chain.size;  idx++) {
            var $cell = $(BOARD + ' tr').eq(rowIdx).find('td').eq(colIdx);
            setCellToEmpty($cell);
            rowIdx++;
            colIdx--;
        }
    }

    function setCellToEmpty($cell) {
        $cell.removeClass().addClass(EMPTY);
        $cell.html(CELL_CONTENT);
    }

};
