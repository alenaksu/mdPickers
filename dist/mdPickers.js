(function() {
"use strict";
/* global moment, angular */
(function() {
    'use strict';

    configIcons.$inject = ["$mdIconProvider", "mdpIconsRegistry"];
    runBlock.$inject = ["$templateCache", "mdpIconsRegistry"];
    angular
        .module('mdPickers', [
            'ngMaterial',
            'ngAnimate',
            'ngAria'
        ])
        .config(configIcons)
        .run(runBlock);

    /** @ngInject */
    function configIcons($mdIconProvider, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function(icon, index) {
            $mdIconProvider.icon(icon.id, icon.url);
        });
    }

    /** @ngInject */
    function runBlock($templateCache, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function(icon, index) {
            $templateCache.put(icon.url, icon.svg);
        });
    }

})();

(function() {
    'use strict';

    angular
        .module('mdPickers')
        .constant('mdpIconsRegistry', [{
            id: 'mdp-chevron-left',
            url: 'mdp-chevron-left.svg',
            svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        }, {
            id: 'mdp-chevron-right',
            url: 'mdp-chevron-right.svg',
            svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        }, {
            id: 'mdp-access-time',
            url: 'mdp-access-time.svg',
            svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
        }, {
            id: 'mdp-event',
            url: 'mdp-event.svg',
            svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        }]);

})();

(function() {
    'use strict';

    ngMessage.$inject = ["$mdUtil"];
    angular
        .module('mdPickers')
        .directive('ngMessage', ngMessage);

    /** @ngInject */
    function ngMessage($mdUtil) {
        return {
            restrict: 'EA',
            priority: 101,
            compile: function(element) {
                var inputContainer = $mdUtil.getClosest(element, 'mdp-time-picker', true) ||
                    $mdUtil.getClosest(element, 'mdp-date-picker', true);

                // If we are not a child of an input container, don't do anything
                if (!inputContainer) return;

                // Add our animation class
                element.toggleClass('md-input-message-animation', true);

                return {};
            }
        }
    }

})();

/* global moment, angular */
(function () {
    'use strict';

    CalendarCtrl.$inject = ["$scope"];
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

/* global moment, angular */
(function() {
    'use strict';

    DatePickerCtrl.$inject = ["$scope", "$mdDialog", "$mdMedia", "$timeout", "currentDate", "options"];
    angular
        .module('mdPickers')
        .controller('DatePickerCtrl', DatePickerCtrl);

    /** @ngInject */
    function DatePickerCtrl($scope, $mdDialog, $mdMedia, $timeout, currentDate, options) {
        var self = this;

        this.date = moment(currentDate);
        this.minDate = options.minDate && moment(options.minDate).isValid() ? moment(options.minDate) : null;
        this.maxDate = options.maxDate && moment(options.maxDate).isValid() ? moment(options.maxDate) : null;
        this.displayFormat = options.displayFormat || "ddd, MMM DD";
        this.labels = options.labels;
        this.dateFilter = angular.isFunction(options.dateFilter) ? options.dateFilter : null;
        this.selectingYear = false;

        // validate min and max date
        if (this.minDate && this.maxDate) {
            if (this.maxDate.isBefore(this.minDate)) {
                this.maxDate = moment(this.minDate).add(1, 'days');
            }
        }

        if (this.date) {
            // check min date
            if (this.minDate && this.date.isBefore(this.minDate)) {
                this.date = moment(this.minDate);
            }

            // check max date
            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                this.date = moment(this.maxDate);
            }
        }

        this.yearItems = {
            currentIndex_: 0,
            PAGE_SIZE: 5,
            START: (self.minDate ? self.minDate.year() : 1900),
            END: (self.maxDate ? self.maxDate.year() : 0),
            getItemAtIndex: function(index) {
                if (this.currentIndex_ < index)
                    this.currentIndex_ = index;

                return this.START + index;
            },
            getLength: function() {
                return Math.min(
                    this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2),
                    Math.abs(this.START - this.END) + 1
                );
            }
        };

        $scope.$mdMedia = $mdMedia;
        $scope.year = this.date.year();

        this.selectYear = function(year) {
            self.date.year(year);
            $scope.year = year;
            self.selectingYear = false;
            self.animate();
        };

        this.showYear = function() {
            self.yearTopIndex = (self.date.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
            self.yearItems.currentIndex_ = (self.date.year() - self.yearItems.START) + 1;
            self.selectingYear = true;
        };

        this.showCalendar = function() {
            self.selectingYear = false;
        };

        this.cancel = function() {
            $mdDialog.cancel();
        };

        this.confirm = function() {
            var date = this.date;

            if (this.minDate && this.date.isBefore(this.minDate)) {
                date = moment(this.minDate);
            }

            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                date = moment(this.maxDate);
            }

            $mdDialog.hide(date.toDate());
        };

        this.animate = function() {
            self.animating = true;
            $timeout(angular.noop).then(function() {
                self.animating = false;
            })
        };
    }

})();

/* global moment, angular */

(function() {
    'use strict';

    mdpCalendar.$inject = ["$animate"];
    angular
        .module('mdPickers')
        .directive('mdpCalendar', mdpCalendar);

    /** @ngInject */
    function mdpCalendar($animate) {
        var directive = {
            restrict: 'E',
            bindToController: {
                'date': '=',
                'minDate': '=',
                'maxDate': '=',
                'dateFilter': '='
            },
            templateUrl: 'mdpDatePicker/templates/mdp-date-picker-calendar.html',
            controller: 'CalendarCtrl',
            controllerAs: 'calendar',
            link: linkFn
        };

        return directive;

        function linkFn(scope, element, attrs, ctrl) {
            var animElements = [
                element[0].querySelector('.mdp-calendar-week-days'),
                element[0].querySelector('.mdp-calendar-days'),
                element[0].querySelector('.mdp-calendar-monthyear')
            ].map(function(a) {
                return angular.element(a);
            });

            scope.$watch(function() {
                return ctrl.date.format('YYYYMM')
            }, function(newValue, oldValue) {
                var direction = null;

                if (newValue > oldValue)
                    direction = "mdp-animate-next";
                else if (newValue < oldValue)
                    direction = "mdp-animate-prev";

                if (direction) {
                    for (var i in animElements) {
                        animElements[i].addClass(direction);
                        $animate.removeClass(animElements[i], direction);
                    }
                }
            });
        }
    }

})();

(function() {
    'use strict';

    mdpDatePicker.$inject = ["$mdpDatePicker", "$timeout", "mdpDatePickerService"];
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

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, applyValue);

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

            ngModel.$validators.required = function(modelValue, viewValue) {
                return mdpDatePickerService.requiredValidator(viewValue);
            };

            function showPicker(ev) {
                $mdpDatePicker(ngModel.$modelValue, {
                    minDate: scope.minDate,
                    maxDate: scope.maxDate,
                    dateFilter: scope.dateFilter,
                    targetEvent: ev
                }).then(applyValue);
            }

            function applyValue (value) {
                ngModel.$setViewValue(value ? moment(value).format(scope.format) : '');
                ngModel.$render();
            }

            element.on('click', showPicker);

            scope.$on('$destroy', function() {
                element.off('click', showPicker);
            });
        }
    }

})();
(function() {
    'use strict';

    mdpDatePicker.$inject = ["$mdpDatePicker", "$timeout", "mdpDatePickerService"];
    angular
        .module('mdPickers')
        .directive('mdpDatePicker', mdpDatePicker);

    /** @ngInject */
    function mdpDatePicker($mdpDatePicker, $timeout, mdpDatePickerService) {

        var directive = {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' +
                            '<md-button ng-disabled="disabled" class="md-icon-button" ng-click="showPicker($event)">' +
                                '<md-icon md-svg-icon="mdp-event"></md-icon>' +
                            '</md-button>' +
                            '<md-input-container' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()" flex>' +
                                '<input ng-disabled="disabled" type="{{ type }}" aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' +
                            '</md-input-container>' +
                        '</div>';
            },
            scope: {
                'minDate': '=mdpMinDate',
                'maxDate': '=mdpMaxDate',
                'dateFilter': '=mdpDateFilter',
                'dateFormat': '@mdpFormat',
                'placeholder': '@mdpPlaceholder',
                'noFloat': '=mdpNoFloat',
                'openOnClick': '=mdpOpenOnClick',
                'disabled': '=?mdpDisabled'
            },
            link: {
                post: postLink
            }
        };

        return directive;

        function postLink(scope, element, attrs, ngModel, $transclude) {
            var inputElement = angular.element(element[0].querySelector('input')),
                inputContainer = angular.element(element[0].querySelector('md-input-container')),
                inputContainerCtrl = inputContainer.controller('mdInputContainer');

            $transclude(function(clone) {
                inputContainer.append(clone);
            });

            var messages = angular.element(inputContainer[0].querySelector('[ng-messages]'));

            scope.type = scope.dateFormat ? 'text' : 'date';
            scope.dateFormat = scope.dateFormat || 'YYYY-MM-DD';
            scope.model = ngModel;

            if (!angular.isDefined(scope.disabled)) {
                scope.disabled = attrs.hasOwnProperty('mdpDisabled');
            }

            scope.isError = function() {
                return !ngModel.$pristine && !!ngModel.$invalid;
            };

            // update input element if model has changed
            ngModel.$formatters.unshift(function(value) {
                var date = angular.isDate(value) && moment(value);
                if (date && date.isValid()) {
                    updateInputElement(date.format(scope.dateFormat));
                }
            });

            ngModel.$validators.format = function(modelValue, viewValue) {
                return mdpDatePickerService.formatValidator(viewValue, scope.dateFormat);
            };

            ngModel.$validators.minDate = function(modelValue, viewValue) {
                return mdpDatePickerService.minDateValidator(viewValue, scope.dateFormat, scope.minDate);
            };

            ngModel.$validators.maxDate = function(modelValue, viewValue) {
                return mdpDatePickerService.maxDateValidator(viewValue, scope.dateFormat, scope.maxDate);
            };

            ngModel.$validators.filter = function(modelValue, viewValue) {
                return mdpDatePickerService.filterValidator(viewValue, scope.dateFormat, scope.dateFilter);
            };

            ngModel.$validators.required = function(modelValue, viewValue) {
                return mdpDatePickerService.requiredValidator(viewValue);
            };

            ngModel.$parsers.unshift(function(value) {
                var parsed = moment(value, scope.dateFormat, true);
                if (parsed.isValid()) {
                    if (angular.isDate(ngModel.$modelValue)) {
                        var originalModel = moment(ngModel.$modelValue);
                        originalModel.year(parsed.year());
                        originalModel.month(parsed.month());
                        originalModel.date(parsed.date());

                        parsed = originalModel;
                    }
                    return parsed.toDate();
                } else {
                    return angular.isDate(ngModel.$modelValue) ? ngModel.$modelValue : null;
                }
            });

            // update input element value
            function updateInputElement(value) {
                if (ngModel.$valid && value && value.length) {
                    inputElement[0].size = value.length + 1;
                }
                inputElement[0].value = value;
                inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
            }

            function updateDate(date) {
                if (date) {
                    var value = moment(date, angular.isDate(date) ? null : scope.dateFormat, true),
                        strValue = value.format(scope.dateFormat);

                    if (value.isValid()) {
                        updateInputElement(strValue);
                        ngModel.$setViewValue(strValue);
                    } else {
                        updateInputElement(date);
                        ngModel.$setViewValue(date);
                    }
                } else {
                    ngModel.$setViewValue('');
                }

                if (!ngModel.$pristine &&
                    messages.hasClass('md-auto-hide') &&
                    inputContainer.hasClass('md-input-invalid')) messages.removeClass('md-auto-hide');

                ngModel.$render();
            }

            scope.showPicker = function(ev) {
                $mdpDatePicker(ngModel.$modelValue, {
                    minDate: scope.minDate,
                    maxDate: scope.maxDate,
                    dateFilter: scope.dateFilter,
                    targetEvent: ev
                }).then(updateDate);
            };

            function onInputElementEvents(event) {
                if (event.target.value !== ngModel.$viewValue) {
                    updateDate(event.target.value);
                }
            }

            inputElement.on('reset input blur', onInputElementEvents);

            scope.$on('$destroy', function() {
                inputElement.off('reset input blur', onInputElementEvents);
            });
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('mdPickers')
        .provider("$mdpDatePicker", $mdpDatePicker);

    /** @ngInject */
    function $mdpDatePicker() {
        var LABEL_OK = 'OK',
            LABEL_CANCEL = 'Cancel',
            DISPLAY_FORMAT = 'ddd, MMM DD';

        this.setDisplayFormat = function(format) {
            DISPLAY_FORMAT = format;
        };

        this.setOKButtonLabel = function(label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function(label) {
            LABEL_CANCEL = label;
        };

        /** @ngInject */
        this.$get = ["$mdDialog", function($mdDialog) {
            var datePicker = function(currentDate, options) {
                if (!angular.isDate(currentDate)) currentDate = Date.now();
                if (!angular.isObject(options)) options = {};

                options.displayFormat = DISPLAY_FORMAT;
                options.labels = {
                    cancel: LABEL_CANCEL,
                    ok: LABEL_OK
                };

                return $mdDialog.show({
                    controller: 'DatePickerCtrl',
                    controllerAs: 'datepicker',
                    clickOutsideToClose: true,
                    templateUrl: 'mdpDatePicker/templates/mdp-date-picker.html',
                    targetEvent: options.targetEvent,
                    locals: {
                        currentDate: currentDate,
                        options: options
                    },
                    skipHide: true
                });
            };

            return datePicker;
        }];
        this.$get.$inject = ["$mdDialog"];
    }

})();

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

(function() {
    'use strict';

    ClockCtrl.$inject = ["$scope"];
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

(function() {
    'use strict';

    TimePickerCtrl.$inject = ["$scope", "$mdDialog", "time", "options", "$mdMedia"];
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

(function() {
    'use strict';

    mdpClock.$inject = ["$animate", "$timeout", "$$rAF", "$window"];
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

                $$rAF(function() {
                    $timeout(function () {
                        ctrl.setTimeByDeg(deg + 180);

                        if (!timepickerCtrl) {
                            return;
                        }

                        var isClickOrUp = ['mouseup', 'click'].indexOf(event.type) !== -1;
                        var isMinutesPicker = timepickerCtrl.currentView === 2;
                        var shouldClose = ctrl.autoClose && isMinutesPicker;

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

            element.on('click', onEvent);

            scope.$on('$destroy', function() {
                element.off('click', onEvent);
                element.off('mousemove', onEvent);
                element.off('mousedown', onEvent);
            });
        }
    }

})();

(function() {
    'use strict';

    mdpTimePicker.$inject = ["$mdpTimePicker", "$timeout"];
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

(function() {
    'use strict';

    mdpTimePicker.$inject = ["$mdpTimePicker", "$timeout"];
    angular
        .module('mdPickers')
        .directive('mdpTimePicker', mdpTimePicker);

    /** @ngInject */
    function mdpTimePicker($mdpTimePicker, $timeout) {
        var directive = {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' +
                            '<md-button ng-disabled="disabled" class="md-icon-button" ng-click="showPicker($event)">' +
                                '<md-icon md-svg-icon="mdp-access-time"></md-icon>' +
                            '</md-button>' +
                            '<md-input-container flex' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()">' +
                                '<input ng-disabled="disabled" type="{{ ::type }}" aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' +
                            '</md-input-container>' +
                        '</div>';
            },
            scope: {
                'timeFormat': '@mdpFormat',
                'placeholder': '@mdpPlaceholder',
                'autoSwitch': '=?mdpAutoSwitch',
                'autoClose': '=?mdpAutoClose',
                'minutesSteps': '=?mdpMinutesSteps',
                'disabled': '=?mdpDisabled'
            },
            link: linkFn
        };

        return directive;

        function linkFn(scope, element, attrs, ngModel, $transclude) {
            var inputElement = angular.element(element[0].querySelector('input')),
                inputContainer = angular.element(element[0].querySelector('md-input-container')),
                inputContainerCtrl = inputContainer.controller('mdInputContainer');

            $transclude(function(clone) {
                inputContainer.append(clone);
            });

            var messages = angular.element(inputContainer[0].querySelector('[ng-messages]'));

            scope.type = scope.timeFormat ? 'text' : 'time';
            scope.timeFormat = scope.timeFormat || 'HH:mm';
            scope.autoSwitch = scope.autoSwitch || false;
            scope.autoClose = scope.autoClose || false;
            scope.minutesSteps = scope.minutesSteps || null;

            if (!angular.isDefined(scope.disabled)) {
                scope.disabled = attrs.hasOwnProperty('mdpDisabled');
            }

            scope.$watch(function() {
                return ngModel.$error;
            }, function(newValue, oldValue) {
                inputContainerCtrl.setInvalid(!ngModel.$pristine && !!Object.keys(ngModel.$error).length);
            }, true);

            // update input element if model has changed
            ngModel.$formatters.unshift(function(value) {
                var time = angular.isDate(value) && moment(value);
                if (time && time.isValid())
                    updateInputElement(time.format(scope.timeFormat));
            });

            ngModel.$validators.format = function(modelValue, viewValue) {
                return !viewValue || angular.isDate(viewValue) || moment(viewValue, scope.timeFormat, true).isValid();
            };

            ngModel.$parsers.unshift(function(value) {
                var parsed = moment(value, scope.timeFormat, true);
                if (parsed.isValid()) {
                    if (angular.isDate(ngModel.$modelValue)) {
                        var originalModel = moment(ngModel.$modelValue);
                        originalModel.minutes(parsed.minutes());
                        originalModel.hours(parsed.hours());
                        originalModel.seconds(parsed.seconds());

                        parsed = originalModel;
                    }
                    return parsed.toDate();
                } else
                    return angular.isDate(ngModel.$modelValue) ? ngModel.$modelValue : null;
            });

            // update input element value
            function updateInputElement(value) {
                if (ngModel.$valid)
                    inputElement[0].size = value.length + 1;
                inputElement[0].value = value;
                inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
            }

            function updateTime(time) {
                var value = moment(time, angular.isDate(time) ? null : scope.timeFormat, true),
                    strValue = value.format(scope.timeFormat);

                if (value.isValid()) {
                    updateInputElement(strValue);
                    ngModel.$setViewValue(strValue);
                } else {
                    updateInputElement(time);
                    ngModel.$setViewValue(time);
                }

                if (!ngModel.$pristine &&
                    messages.hasClass('md-auto-hide') &&
                    inputContainer.hasClass('md-input-invalid')) messages.removeClass('md-auto-hide');

                ngModel.$render();
            }

            scope.showPicker = function(ev) {
                $mdpTimePicker(ngModel.$modelValue, {
                    targetEvent: ev,
                    autoSwitch: scope.autoSwitch,
                    autoClose: scope.autoClose,
                    minutesSteps: scope.minutesSteps
                }).then(function(time) {
                    updateTime(time, true);
                });
            };

            function onInputElementEvents(event) {
                if (event.target.value !== ngModel.$viewVaue)
                    updateTime(event.target.value);
            }

            inputElement.on('reset input blur', onInputElementEvents);

            scope.$on('$destroy', function() {
                inputElement.off('reset input blur', onInputElementEvents);
            });
        }
    }

})();

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
        this.$get = ["$mdDialog", function($mdDialog) {
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
        }];
        this.$get.$inject = ["$mdDialog"];
    }

})();

!function(e){try{e=angular.module("mdPickers")}catch(a){e=angular.module("mdPickers",[])}e.run(["$templateCache",function(e){e.put("mdpDatePicker/templates/mdp-date-picker-calendar.html",'<div class="mdp-calendar"><div layout="row" layout-align="space-between center"><md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button><div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div><md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button></div><div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating"><div layout="" layout-align="center center" ng-repeat="d in ::calendar.weekDays track by $index">{{ ::d }}</div></div><div layout="row" layout-align="start center" layout-wrap="" class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()"><div layout="" layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }"><md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button></div><div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end=""></div></div></div>')}])}(),function(e){try{e=angular.module("mdPickers")}catch(a){e=angular.module("mdPickers",[])}e.run(["$templateCache",function(e){e.put("mdpDatePicker/templates/mdp-date-picker.html",'<md-dialog class="mdp-datepicker" ng-class="{portrait: !$mdMedia(\'gt-xs\')}"><md-dialog-content layout="row" layout-wrap=""><div layout="column" layout-align="start center"><md-toolbar layout-align="start start" flex="noshrink" class="mdp-datepicker-date-wrapper md-primary" layout="column"><span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{active: datepicker.selectingYear}">{{ datepicker.date.format(\'YYYY\') }}</span> <span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{active: !datepicker.selectingYear}">{{ datepicker.date.format(datepicker.displayFormat) }}</span></md-toolbar></div><div><div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear"><md-virtual-repeat-container md-auto-shrink="" md-top-index="datepicker.yearTopIndex"><div flex="" md-virtual-repeat="item in ::datepicker.yearItems" md-on-demand="" class="repeated-year"><span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple="" ng-class="{ \'md-primary current\': item == year }">{{ item }}</span></div></md-virtual-repeat-container></div><mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar><md-dialog-actions layout="row"><span flex=""></span><md-button ng-click="datepicker.cancel()" aria-label="{{::datepicker.labels.cancel}}">{{::datepicker.labels.cancel}}</md-button><md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="{{::datepicker.labels.ok}}">{{::datepicker.labels.ok}}</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>')}])}(),function(e){try{e=angular.module("mdPickers")}catch(a){e=angular.module("mdPickers",[])}e.run(["$templateCache",function(e){e.put("mdpTimePicker/templates/clock.html",'<div class="mdp-clock"><div class="mdp-clock-container"><md-toolbar class="mdp-clock-center md-primary"></md-toolbar><md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary"><span class="mdp-clock-selected md-button md-raised md-primary"></span></md-toolbar><md-button ng-class="{\'md-primary\': clock.selected == step}" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button></div></div>')}])}(),function(e){try{e=angular.module("mdPickers")}catch(a){e=angular.module("mdPickers",[])}e.run(["$templateCache",function(e){e.put("mdpTimePicker/templates/mdp-time-picker.html",'<md-dialog class="mdp-timepicker" ng-class="{portrait: !$mdMedia(\'gt-xs\')}"><md-dialog-content layout="column" layout-gt-xs="row"><md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex="noshrink" class="mdp-timepicker-time md-primary"><div class="mdp-timepicker-selected-time"><span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span></div><div layout="column" class="mdp-timepicker-selected-ampm"><span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span> <span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span></div></md-toolbar><div flex="noshrink"><div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout="" layout-align="center center"><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" auto-close="timepicker.autoClose" minutes-steps="timepicker.minutesSteps" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" auto-close="timepicker.autoClose" minutes-steps="timepicker.minutesSteps" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock></div><md-dialog-actions layout="row"><span flex=""></span><md-button ng-click="timepicker.cancel()" aria-label="{{::timepicker.labels.cancel}}">{{::timepicker.labels.cancel}}</md-button><md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="{{::timepicker.labels.ok}}">{{::timepicker.labels.ok}}</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>')}])}();
})();