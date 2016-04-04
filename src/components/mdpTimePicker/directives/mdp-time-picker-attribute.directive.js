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
            },
            link: linkFn
        }

        return directive;

        function linkFn(scope, element, attrs, ngModel, $transclude) {
            scope.format = scope.format || "HH:mm";

            function showPicker(ev) {
                $mdpTimePicker(ngModel.$modelValue, {
                    targetEvent: ev,
                    autoSwitch: scope.autoSwitch
                }).then(function(time) {
                    ngModel.$setViewValue(moment(time).format(scope.format));
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
