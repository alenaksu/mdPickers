(function() {
    'use strict';

    angular
        .module('mdPickers')
        .directive('mdpClock', mdpClock);

    /** @ngInject */
    function mdpClock($animate, $timeout, $$rAF, $window) {
        var directive = {
            restrict: 'E',
            bindToController: {
                'type': '@?',
                'time': '=',
                'autoSwitch': '=?',
                'autoClose': '=?',
                'minutesSteps': '=?'
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
                var isMinutesPicker = timepickerCtrl.currentView === 2;
                var shouldClose = ctrl.autoClose && isMinutesPicker;
                var isClickOrUp = ['mouseup', 'click'].indexOf(event.type) !== -1;

                console.log(shouldClose, isMinutesPicker, isClickOrUp);

                $$rAF(function() {
                    $timeout(function () {
                        ctrl.setTimeByDeg(deg + 180);

                        if (!timepickerCtrl) {
                            return;
                        }

                        if (!isClickOrUp) {
                            return;
                        }
                        if (ctrl.autoSwitch && !shouldClose) {
                            timepickerCtrl.switchView();
                            return;
                        };

                        if (shouldClose) {
                            timepickerCtrl.confirm();
                            return;
                        };
                    });
                });
            };

            element.on('mousedown', function() {
                element.on('mousemove', onEvent);

                element.on('mouseup', function(e) {
                    element.off('mousemove', onEvent);
                    element.off('mouseup');
                    onEvent(e);
                });
            });

            scope.$on('$destroy', function() {
                element.off('click', onEvent);
                element.off('mousemove', onEvent);
                element.off('mousedown', onEvent);
            });
        }
    }

})();
