(function() {
    'use strict';

    angular
        .module('mdPickers')
        .controller('ClockCtrl', ClockCtrl);

    /** @ngInject */
    function ClockCtrl($scope) {
        var vm = this;

        var TYPE_HOURS = 'hours';
        var TYPE_MINUTES = 'minutes';

        vm.STEP_DEG = 360 / 12;
        vm.steps = [];
        vm.CLOCK_TYPES = {
            hours: {
                range: 12,
            },
            minutes: {
                range: 60,
            }
        };

        vm.getPointerStyle = getPointerStyle;
        vm.setTimeByDeg = setTimeByDeg;
        vm.setTime = setTime;
        vm.init = init;

        vm.init();

        function getPointerStyle() {
            var divider = 1;
            switch (vm.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }

            if (angular.isNumber(vm.minutesSteps) && vm.type === TYPE_MINUTES) {
                vm.selected = getClosestStep(vm.selected);
            }

            var degrees = Math.round(vm.selected * (360 / divider)) - 180;

            return {
                '-webkit-transform': 'rotate(' + degrees + 'deg)',
                '-ms-transform': 'rotate(' + degrees + 'deg)',
                'transform': 'rotate(' + degrees + 'deg)'
            }
        }

        function setTimeByDeg(deg) {
            deg = deg >= 360 ? 0 : deg;
            var divider = 0;
            switch (vm.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }

            vm.setTime(
                Math.round(divider / 360 * deg)
            );
        }

        function getClosestStep (time) {
            return Math.round(time / vm.minutesSteps) * vm.minutesSteps;
        }

        function setTime(time, type) {
            vm.selected = time;

            switch (vm.type) {
                case TYPE_HOURS:
                    if (vm.time.format('A') == 'PM') time += 12;
                    vm.time.hours(time);
                    break;
                case TYPE_MINUTES:
                    if (angular.isNumber(vm.minutesSteps)) {
                        time = getClosestStep(time);
                    }
                    if (time > 59) time -= 60;
                    vm.time.minutes(time);
                    break;
            }
        }

        function init() {
            vm.type = vm.type || 'hours';
            switch (vm.type) {
                case TYPE_HOURS:
                    for (var i = 1; i <= 12; i++)
                        vm.steps.push(i);
                    vm.selected = vm.time.hours() || 0;
                    if (vm.selected > 12) vm.selected -= 12;

                    break;
                case TYPE_MINUTES:
                    for (var i = 5; i <= 55; i += 5)
                        vm.steps.push(i);
                    vm.steps.push(0);
                    vm.selected = vm.time.minutes() || 0;

                    break;
            }
        }
    }

})();
