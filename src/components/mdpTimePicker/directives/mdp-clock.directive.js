(function() {
    'use strict';

    angular
        .module('mdPickers')
        .directive('mdpClock', mdpClock);

    /** @ngInject */
    function mdpClock($animate, $timeout, $$rAF) {
        var directive = {
            restrict: 'E',
            bindToController: {
                'type': '@?',
                'time': '=',
                'autoSwitch': '=?'
            },
            replace: true,
            templateUrl: 'mdpTimePicker/templates/clock.html',
            controller: 'ClockCtrl',
            controllerAs: 'clock',
            link: linkFn
        };

        return directive;

        function linkFn(scope, element, attrs, ctrl) {
            var pointer = angular.element(element[0].querySelector('.mdp-pointer')),
                timepickerCtrl = scope.$parent.timepicker;

            var onEvent = function(event) {
                var containerCoords = event.currentTarget.getClientRects()[0];
                var x = ((event.currentTarget.offsetWidth / 2) - (event.pageX - containerCoords.left)),
                    y = ((event.pageY - containerCoords.top) - (event.currentTarget.offsetHeight / 2));

                var deg = Math.round((Math.atan2(x, y) * (180 / Math.PI)));
                $$rAF(function() {
                    $timeout(function() {
                        ctrl.setTimeByDeg(deg + 180);
                        if (ctrl.autoSwitch && ['mouseup', 'click'].indexOf(event.type) !== -1 && timepickerCtrl) timepickerCtrl.switchView();
                    });
                });
            };

            element.on('mousedown', function() {
                element.on('mousemove', onEvent);
            });

            element.on('mouseup', function(e) {
                element.off('mousemove', onEvent);
            });

            element.on('click', onEvent);
            scope.$on('$destroy', function() {
                element.off('click', onEvent);
                element.off('mousemove', onEvent);
            });
        }
    }

})();
