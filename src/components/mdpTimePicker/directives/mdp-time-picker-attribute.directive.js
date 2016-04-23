(function() {
    'use strict';

    angular
        .module('mdPickers')
        .directive('mdpTimePicker', mdpTimePicker);

    /** @ngInject */
    function mdpTimePicker($mdpTimePicker, $timeout) {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                'timeFormat': '@mdpFormat',
                'autoSwitch': '=?mdpAutoSwitch',
                'autoClose': '=?mdpAutoClose',
                'minutesSteps': '=?mdpMinutesSteps'
            },
            link: linkFn
        }

        return directive;

        function linkFn(scope, element, attrs, ngModel, $transclude) {
            scope.timeFormat = scope.timeFormat || 'HH:mm';

            function showPicker(ev) {
                $mdpTimePicker(ngModel.$modelValue, {
                    targetEvent: ev,
                    autoSwitch: scope.autoSwitch,
                    autoClose: scope.autoClose,
                    minutesSteps: scope.minutesSteps
                }).then(function(time) {
                    ngModel.$setViewValue(moment(time).format(scope.timeFormat));
                    ngModel.$render();
                });
            };

            element.on('click', showPicker);

            scope.$on('$destroy', function() {
                element.off('click', showPicker);
            });
        }
    }

})();
