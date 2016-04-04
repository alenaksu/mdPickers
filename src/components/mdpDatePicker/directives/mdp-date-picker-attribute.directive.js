(function() {
    'use strict';

    angular
        .module('mdPickers')
        .directive("mdpDatePicker", mdpDatePicker);

    /** @ngInject */
    function mdpDatePicker($mdpDatePicker, $timeout, mdpDatePickerService) {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                "minDate": "@min",
                "maxDate": "@max",
                "dateFilter": "=mdpDateFilter",
                "dateFormat": "@mdpFormat",
            },
            link: linkFn
        };

        return directive;

        function linkFn(scope, element, attrs, ngModel, $transclude) {
            scope.dateFormat = scope.dateFormat || "YYYY-MM-DD";

            ngModel.$validators.format = function(modelValue, viewValue) {
                return mdpDatePickerService.formatValidator(viewValue, scope.format);
            };

            ngModel.$validators.minDate = function(modelValue, viewValue) {
                return mdpDatePickerService.minDateValidator(viewValue, scope.format, scope.minDate);
            };

            ngModel.$validators.maxDate = function(modelValue, viewValue) {
                return mdpDatePickerService.maxDateValidator(viewValue, scope.format, scope.maxDate);
            };

            ngModel.$validators.filter = function(modelValue, viewValue) {
                return mdpDatePickerService.filterValidator(viewValue, scope.format, scope.dateFilter);
            };

            function showPicker(ev) {
                $mdpDatePicker(ngModel.$modelValue, {
                    minDate: scope.minDate,
                    maxDate: scope.maxDate,
                    dateFilter: scope.dateFilter,
                    targetEvent: ev
                }).then(function(time) {
                    ngModel.$setViewValue(moment(time).format(scope.format));
                    ngModel.$render();
                });
            }

            element.on('click', showPicker);

            scope.$on('$destroy', function() {
                element.off('click', showPicker);
            });
        }
    }

})();