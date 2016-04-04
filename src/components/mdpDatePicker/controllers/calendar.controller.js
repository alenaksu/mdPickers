/* global moment, angular */
(function () {
    'use strict';

    angular
        .module('mdPickers')
        .controller('CalendarCtrl', CalendarCtrl);

    /** @ngInject */
    function CalendarCtrl($scope) {
        var self = this;
        this.dow = moment.localeData().firstDayOfWeek();

        this.weekDays = [].concat(
            moment.weekdaysMin().slice(
                this.dow
            ),
            moment.weekdaysMin().slice(
                0,
                this.dow
            )
        );

        this.daysInMonth = [];

        this.getDaysInMonth = function() {
            var days = self.date.daysInMonth(),
                firstDay = moment(self.date).date(1).day() - this.dow;

            if (firstDay < 0) firstDay = this.weekDays.length - 1;


            var arr = [];
            for (var i = 1; i <= (firstDay + days); i++) {
                var day = null;
                if (i > firstDay) {
                    day = {
                        value: (i - firstDay),
                        enabled: self.isDayEnabled(moment(self.date).date(i - firstDay).toDate())
                    };
                }
                arr.push(day);
            }

            return arr;
        };

        this.isDayEnabled = function(day) {
            return (!this.minDate || this.minDate <= day) &&
                (!this.maxDate || this.maxDate >= day) &&
                (!self.dateFilter || !self.dateFilter(day));
        };

        this.selectDate = function(dom) {
            self.date.date(dom);
        };

        this.nextMonth = function() {
            self.date.add(1, 'months');
        };

        this.prevMonth = function() {
            self.date.subtract(1, 'months');
        };

        this.updateDaysInMonth = function() {
            self.daysInMonth = self.getDaysInMonth();
        };

        $scope.$watch(function() {
            return self.date.unix() }, function(newValue, oldValue) {
            if (newValue && newValue !== oldValue)
                self.updateDaysInMonth();
        })

        self.updateDaysInMonth();
    }

})();
