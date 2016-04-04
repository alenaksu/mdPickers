(function() {
    'use strict';

    angular
        .module('mdPickers')
        .provider("$mdpDatePicker", $mdpDatePicker);

    /** @ngInject */
    function $mdpDatePicker() {
        var LABEL_OK = 'OK',
            LABEL_CANCEL = 'Cancel',
            DISPLAY_FORMAT = 'ddd, MMM DD';

        this.setDisplayFormat = function(format) {
            DISPLAY_FORMAT = format;
        };

        this.setOKButtonLabel = function(label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function(label) {
            LABEL_CANCEL = label;
        };

        /** @ngInject */
        this.$get = function($mdDialog) {
            var datePicker = function(currentDate, options) {
                if (!angular.isDate(currentDate)) currentDate = Date.now();
                if (!angular.isObject(options)) options = {};

                options.displayFormat = DISPLAY_FORMAT;
                options.labels = {
                    cancel: LABEL_CANCEL,
                    ok: LABEL_OK
                };

                return $mdDialog.show({
                    controller: 'DatePickerCtrl',
                    controllerAs: 'datepicker',
                    clickOutsideToClose: true,
                    templateUrl: 'mdpDatePicker/templates/mdp-date-picker.html',
                    targetEvent: options.targetEvent,
                    locals: {
                        currentDate: currentDate,
                        options: options
                    },
                    skipHide: true
                });
            };

            return datePicker;
        };
    }

})();
