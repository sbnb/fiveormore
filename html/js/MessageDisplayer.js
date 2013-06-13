(function () {

    "use strict";

    /*
        Used to display messages to the user on the page.
    */

    FOM.MessageDisplayer = function () {
        var messageDivSelector = '#messages',
            messageTextSelector = '#messages span',
            tableSelector = FOM.constants.TABLE_SELECTOR,
            bottomOffset = FOM.constants.MSG_BOTTOM_OFFSET;

        this.display = function (message) {
            var $messageDiv = $(messageDivSelector),
                $table = $(tableSelector),
                tablePos = $table.position(),
                bottom = tablePos.top + $table.outerHeight() - bottomOffset;

            $(messageTextSelector).text(message);
            $messageDiv.centerHorizontal();
            $messageDiv.css({ position: "absolute", top: bottom + "px"});
            $messageDiv.fadeIn('fast');
        };

        this.hide = function () {
            $(messageDivSelector + ':visible').fadeOut('fast');
        };
    };

})();
