(function() {
    'use strict';

    angular
        .module('mdPickers')
        .provider('$mdpTimePicker', $mdpTimePicker);

    function $mdpTimePicker() {
        var LABEL_OK = 'OK',
            LABEL_CANCEL = 'Cancel';

        this.setOKButtonLabel = function(label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function(label) {
            LABEL_CANCEL = label;
        };

        /** @ngInject */
        this.$get = function($mdDialog) {
            var timePicker = function(time, options) {
                if (!angular.isDate(time)) time = Date.now();
                if (!angular.isObject(options)) options = {};

                options.labels = {
                    cancel: LABEL_CANCEL,
                    ok: LABEL_OK
                };

                return $mdDialog.show({
                    controller: 'TimePickerCtrl',
                    controllerAs: 'timepicker',
                    clickOutsideToClose: true,
                    templateUrl: 'mdpTimePicker/templates/mdp-time-picker.html',
                    targetEvent: options.targetEvent,
                    locals: {
                        time: time,
                        options: options
                    },
                    skipHide: true
                });
            };

            return timePicker;
        };
    }

})();
