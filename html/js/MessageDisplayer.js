(function (FOM, $, _) {

    "use strict";

    FOM.MessageDisplayer = function () {

        this.display = display;
        this.hide = hide;

        var messageDivSelector = '#messages',
            messageTextSelector = '#messages span',
            tableSelector = FOM.constants.TABLE_SELECTOR,
            bottomOffset = FOM.constants.MSG_BOTTOM_OFFSET;

        function display(message) {
            var $messageDiv = $(messageDivSelector),
                $table = $(tableSelector),
                tablePos = $table.position(),
                bottom = tablePos.top + $table.outerHeight() - bottomOffset;

            $(messageTextSelector).text(message);
            $messageDiv.centerHorizontal();
            $messageDiv.css({ position: "absolute", top: bottom + "px"});
            $messageDiv.fadeIn('fast');
        }

        function hide() {
            $(messageDivSelector + ':visible').fadeOut('fast');
        }
    };

})(FOM, jQuery, _);
