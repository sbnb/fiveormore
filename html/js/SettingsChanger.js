(function () {

    'use strict';

    /*
        Handle settings changes, and save them to cookie:
            - board size: small/medium/large
            - shapes: on/off
    */

    var c = FOM.constants,
        t = FOM.tools,
        sendMsg = t.messageServer,
        msgId = c.MESSAGE_ID;

    FOM.SettingsChanger = function (cookieHandler) {
        this._cookieHandler = cookieHandler;
        this._uniqId = cookieHandler.readUniqId();
    };

    FOM.SettingsChanger.prototype = {

        // change board to newSize, and save pref if savePrefs true
        changeBoardSize: function (newSize, savePrefs) {
            $(c.TABLE_SELECTOR).removeClass().addClass(newSize);
            t.changePointsPopupTextSize(newSize);

            if (savePrefs) {
                this._saveBoardSize(newSize);
            }
        },

        _saveBoardSize: function (newSize) {
            var prefs = this._cookieHandler.readPreferences();
            prefs.boardSize = newSize;
            this._cookieHandler.savePreferences(prefs);
        },

        // if have a saved board size, use it; else use best fit size
        setInitialBoardSize: function () {
            var preferences = this._cookieHandler.readPreferences();
            if (preferences.boardSize !== c.PREFS_DEFAULT.boardSize) {
                this.changeBoardSize(preferences.boardSize);
            }
            else {
                this.changeBoardSize(getBestFitBoardSize());
            }
        },

        turnShapesOn: function () {
            this._saveShapesSetting('on');
        },

        turnShapesOff: function () {
            this._saveShapesSetting('off');
        },

        _saveShapesSetting: function (shapesSetting) {
            var prefs = this._cookieHandler.readPreferences();
            prefs.shapesOn = shapesSetting === 'on' ? true : false;
            c.SHAPES_ON = prefs.shapesOn;
            this._cookieHandler.savePreferences(prefs);
        },

        registerBoardSizeInputChangeListener: function () {
            var that = this;
            $('input[name=boardSize]').off('change').change(function () {
                sendMsg(msgId.BOARD_SIZE_CHANGE, that._uniqId);
                that.changeBoardSize(this.id, true);
            });
        },

        registerShapesInputChangeListener: function () {
            var that = this;
            $('input[name=shapesOn]').off('change').change(function () {
                // TODO: add message for shapes on or off (check db updating,
                // or stop db updates!)
                if ("on" === this.id) {
                    that.turnShapesOn();
                }
                else {
                    that.turnShapesOff();
                }
            });

            this._setRadioButtons();
        },

        _setRadioButtons: function () {
            // TODO: check cookie for last setting
            var shapesRadioInput = 'input:radio[name=shapesOn]';
            if (c.SHAPES_ON) {
                $(shapesRadioInput + '[value=on]').attr('checked', 'checked');
            }
            else {
                $(shapesRadioInput + '[value=off]').attr('checked', 'checked');
            }
        }


    };

    // choose a best fit board size given window vertical size
    function getBestFitBoardSize() {
        var viewportHeightInPx = $(window).height(),
            size;

        if (viewportHeightInPx < c.VIEWPORT_CUTOFFS.SMALL) {
            size = c.SIZE.SMALL;
        }
        else if (viewportHeightInPx < c.VIEWPORT_CUTOFFS.MEDIUM) {
            size = c.SIZE.MEDIUM;
        }
        else {
            size = c.SIZE.LARGE;
        }
        return size;
    }

})();

