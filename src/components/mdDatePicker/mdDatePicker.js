/* global = */

function DatePickerCtrl($scope, $mdDialog, currentDate, minDate, maxDate, $mdMedia, $timeout) {
    var self = this;

    this.currentDate = currentDate;
    this.minDate = (minDate) ? moment(minDate).subtract(1, 'days') : undefined;
    this.maxDate = (maxDate) ? moment(maxDate).add(1, 'days') : undefined;
    this.currentMoment = moment(self.currentDate);
    this.selectingYear = false;
    console.log(minDate);
    console.log(maxDate);
    $scope.$mdMedia = $mdMedia;
    this.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 5,
        START: 1900,
        getItemAtIndex: function (index) {
            if (this.currentIndex_ < index)
                this.currentIndex_ = index;
            return this.START + index;
        },
        getLength: function () {
            return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
        }
    }

    $scope.year = this.currentMoment.year();

    this.selectYear = function (year) {
        self.currentMoment.year(year);
        $scope.year = year;
        self.selectingYear = false;
        self.animate();
    };

    this.showYear = function () {
        self.yearTopIndex = (self.currentMoment.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.currentMoment.year() - self.yearItems.START) + 1;
        self.selectingYear = true;
    };

    this.showCalendar = function () {
        self.selectingYear = false;
    };

    this.cancel = function () {
        $mdDialog.cancel();
    };

    this.confirm = function () {
        $mdDialog.hide(this.currentMoment.toDate());
    };

    this.animate = function () {
        self.animating = true;
        $timeout(angular.noop).then(function () {
            self.animating = false;
        })
    };
    this.isDisabled = function (day) {
        var testMoment = moment(this.currentMoment);
        testMoment.date(day);
        if (this.minDate && this.maxDate) {
            if (this.minDate.isBefore(testMoment, 'day') && this.maxDate.isAfter(testMoment, 'day')) {
                return false;
            }
            return true;
        }
        return false;
    };
}

module.provider("$mdpDatePicker", function () {
    var LABEL_OK = "ok",
        LABEL_CANCEL = "cancel";

    this.setOKButtonLabel = function (label) {
        LABEL_OK = label;
    };

    this.setCancelButtonLabel = function (label) {
        LABEL_CANCEL = label;
    };

    this.$get = ["$mdDialog", function ($mdDialog) {
        var datePicker = function (targetEvent, currentDate, minDate, maxDate) {
            if (!angular.isDate(currentDate)) currentDate = Date.now();

            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', 'currentDate','minDate', 'maxDate', '$mdMedia', '$timeout', DatePickerCtrl],
                controllerAs: 'datepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
                '<md-dialog-content layout="row" layout-wrap>' +
                '<div layout="column" layout-align="start center">' +
                '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' +
                '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.currentMoment.format(\'YYYY\') }}</span>' +
                '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.currentMoment.format("ddd, MMM DD") }}</span> ' +
                '</md-toolbar>' +
                '</div>' +
                '<div>' +
                '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" ng-if="datepicker.selectingYear">' +
                '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' +
                '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' +
                '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' +
                '</div>' +
                '</md-virtual-repeat-container>' +
                '</div>' +
                '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.currentMoment"></mdp-calendar>' +
                '<md-dialog-actions layout-align="end center" layout="row">' +
                '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                '<md-button ng-click="datepicker.confirm()" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                '</md-dialog-actions>' +
                '</div>' +
                '</md-dialog-content>' +
                '</md-dialog>',
                targetEvent: targetEvent,
                locals: {
                    currentDate: currentDate,
                    minDate: minDate,
                    maxDate: maxDate,
                }
            });
        };

        return datePicker;
    }];
});

function CalendarCtrl($scope) {
    var self = this;
    this.currentMoment;
    this.weekDays = moment.weekdaysMin();

    this.getDaysInMonth = function () {
        var days = self.currentMoment.daysInMonth(),
            firstDay = moment(self.currentMoment).date(1).day();

        var arr = [];
        for (var i = 1; i <= (firstDay + days); i++)
            arr.push(i > firstDay ? (i - firstDay) : false);

        return arr;
    };

    this.selectDate = function (dom) {
        self.currentMoment.date(dom);
    };

    this.nextMonth = function () {
        self.currentMoment.add(1, 'months');
    };

    this.prevMonth = function () {
        self.currentMoment.subtract(1, 'months');
    };

    this.init = function (date) {
        self.currentMoment = date;
    };
}

module.directive("mdpCalendar", ["$animate", function ($animate) {
    return {
        restrict: 'E',
        scope: {
            "date": "="
        },
        template: '<div class="mdp-calendar">' +
        '<div layout="row" layout-align="space-between center">' +
        '<md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-font-set="material-icons"> chevron_left </md-icon></md-button>' +
        '<div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.currentMoment.format("MMMM YYYY") }}</div>' +
        '<md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-font-set="material-icons"> chevron_right </md-icon></md-button>' +
        '</div>' +
        '<div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating">' +
        '<div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div>' +
        '</div>' +
        '<div layout="row" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating">' +
        '<div layout layout-align="center center" ng-repeat-start="n in calendar.getDaysInMonth() track by $index" ng-class="{ \'mdp-day-placeholder\': n === false }">' +
        '<md-button class="md-icon-button md-raised" aria-label="seleziona giorno" ng-if="n !== false" ng-disabled="datepicker.isDisabled(n)" ng-class="{\'md-accent\': calendar.currentMoment.date() == n}" ng-click="calendar.selectDate(n)">{{ n }}</md-button>' +
        '</div>' +
        '<div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' +
        '</div>' +
        '</div>',
        controller: ["$scope", CalendarCtrl],
        controllerAs: "calendar",
        link: function (scope, element, attrs, ctrl) {
            var animElements = [
                element[0].querySelector(".mdp-calendar-week-days"),
                element[0].querySelector('.mdp-calendar-days'),
                element[0].querySelector('.mdp-calendar-monthyear')
            ];
            animElements = animElements.map(function (a) {
                return angular.element(a);
            });

            ctrl.init(scope.date);

            scope.$watch(function () { return scope.date.format("YYYYMM") }, function (newValue, oldValue) {
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
}]);

module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function ($mdpDatePicker, $timeout) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if ('undefined' !== typeof attrs.type && 'date' === attrs.type && ngModel) {
                angular.element(element).on("click", function (ev) {
                  		ev.preventDefault();
                    $mdpDatePicker(ev, ngModel.$modelValue).then(function (selectedDate) {
                        $timeout(function () {
                            ngModel.$setViewValue(moment(selectedDate).format("YYYY-MM-DD"));
                            ngModel.$render();
                        });
                    });
                });
            }
        }
    };
}]);