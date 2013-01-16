$(document).ready(function() {

    $('.full-width').horizontalNav({});
    $(BOARD+' td.selected').removeClass('selected');
    var board = new BoardGame();

    // TODO: promote
    // TODO: BUG: select a tile & move before anim finsihed can get some classes locked (EMPTY?)
    // result is the tile will not complete a row, and stays highlighted (selected class?)
});
