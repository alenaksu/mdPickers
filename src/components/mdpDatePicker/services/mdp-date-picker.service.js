(function() {
    'use strict';

    angular
        .module('mdPickers')
        .factory('mdpDatePickerService', mdpDatePickerService);

    /** @ngInject */
    function mdpDatePickerService() {

        var service = {
            formatValidator: formatValidator,
            minDateValidator: minDateValidator,
            maxDateValidator: maxDateValidator,
            filterValidator: filterValidator,
            requiredValidator: requiredValidator
        };

        return service;

        function formatValidator(value, format) {
            return !value || angular.isDate(value) || moment(value, format, true).isValid();
        }

        function minDateValidator(value, format, minDate) {
            minDate = moment(minDate, "YYYY-MM-DD", true);
            var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

            return !value ||
                angular.isDate(value) ||
                !minDate.isValid() ||
                date.isSameOrAfter(minDate);
        }

        function maxDateValidator(value, format, maxDate) {
            maxDate = moment(maxDate, "YYYY-MM-DD", true);
            var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

            return !value ||
                angular.isDate(value) ||
                !maxDate.isValid() ||
                date.isSameOrBefore(maxDate);
        }

        function filterValidator(value, format, filter) {
            var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

            return !value ||
                angular.isDate(value) ||
                !angular.isFunction(filter) ||
                !filter(date);
        }

        function requiredValidator(value) {
            return !(value === undefined || value === null || value === '');
        }

    }
})();
