(function() {
    'use strict';

    angular
        .module('mdPickers')
        .controller('TimePickerCtrl', TimePickerCtrl);

    /** @ngInject */
    function TimePickerCtrl($scope, $mdDialog, time, options, $mdMedia) {
        var vm = this;

        vm.VIEW_HOURS = 1;
        vm.VIEW_MINUTES = 2;
        vm.currentView = vm.VIEW_HOURS;
        vm.time = moment(time);
        vm.labels = options.labels;
        vm.autoSwitch = !!options.autoSwitch;
        vm.autoClose = !!options.autoClose;
        vm.minutesSteps = options.minutesSteps || null;

        vm.clockHours = parseInt(vm.time.format("h"));
        vm.clockMinutes = parseInt(vm.time.minutes());

        vm.switchView = switchView;
        vm.setAM = setAM;
        vm.setPM = setPM;
        vm.cancel = cancel;
        vm.confirm = confirm;

        $scope.$mdMedia = $mdMedia;

        function switchView() {
            vm.currentView = vm.currentView == vm.VIEW_HOURS ? vm.VIEW_MINUTES : vm.VIEW_HOURS;
        }

        function setAM() {
            if (vm.time.hours() >= 12)
                vm.time.hour(vm.time.hour() - 12);
        }

        function setPM() {
            if (vm.time.hours() < 12)
                vm.time.hour(vm.time.hour() + 12);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function confirm() {
            $mdDialog.hide(vm.time.toDate());
        }
    }
})();
