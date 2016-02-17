(function() {
"use strict";
var module = angular.module("mdPickers", [
	"ngMaterial",
	"ngAnimate",
	"ngAria"
]); 
/* global = */

function DatePickerCtrl($scope, $mdDialog, currentDate, $mdMedia, $timeout) {
    var self = this;

    this.currentDate = currentDate;
    this.currentMoment = moment(self.currentDate);
    this.selectingYear = false;

    $scope.$mdMedia = $mdMedia;
    this.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 5,
        START: 1900,
        getItemAtIndex: function(index) {
            if(this.currentIndex_ < index)
                this.currentIndex_ = index;
            return this.START + index;
        },
        getLength: function() {
            return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
        }
    }
    
    $scope.year = this.currentMoment.year();

	this.selectYear = function(year) {
        self.currentMoment.year(year);
        $scope.year = year;
        self.selectingYear = false;
        self.animate();
    };
    
    this.showYear = function() { 
        self.yearTopIndex = (self.currentMoment.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.currentMoment.year() - self.yearItems.START) + 1;
        self.selectingYear = true;
    };
    
    this.showCalendar = function() {
        self.selectingYear = false;
    };

    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function() {
        $mdDialog.hide(this.currentMoment.toDate());
    };
    
    this.animate = function() {
        self.animating = true;
        $timeout(angular.noop).then(function() {
            self.animating = false;
        })  
    };
}

module.provider("$mdpDatePicker", function() {
    var LABEL_OK = "ok",
        LABEL_CANCEL = "cancel"; 
        
    this.setOKButtonLabel = function(label) {
        LABEL_OK = label;
    };
    
    this.setCancelButtonLabel = function(label) {
        LABEL_CANCEL = label;
    };
    
    this.$get = ["$mdDialog", function($mdDialog) {
        var datePicker = function(targetEvent, currentDate) {
            if(!angular.isDate(currentDate)) currentDate = Date.now();
    
            return $mdDialog.show({
                controller:  ['$scope', '$mdDialog', 'currentDate', '$mdMedia', '$timeout', DatePickerCtrl],
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
                    currentDate: currentDate
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
    
    this.getDaysInMonth = function() {
        var days = self.currentMoment.daysInMonth(),
            firstDay = moment(self.currentMoment).date(1).day();

        var arr = [];
        for(var i = 1; i <= (firstDay + days); i++)
            arr.push(i > firstDay ? (i - firstDay) : false);

        return arr;
    };
    
    this.selectDate = function(dom) {
        self.currentMoment.date(dom);
    };

    this.nextMonth = function() {
        self.currentMoment.add(1, 'months');
    };

    this.prevMonth = function() {
        self.currentMoment.subtract(1, 'months');
    };
    
    this.init = function(date) {
        self.currentMoment = date;
    };
}

module.directive("mdpCalendar", ["$animate", function($animate) {
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
                            '<md-button class="md-icon-button md-raised" aria-label="seleziona giorno" ng-if="n !== false" ng-class="{\'md-accent\': calendar.currentMoment.date() == n}" ng-click="calendar.selectDate(n)">{{ n }}</md-button>' +
                        '</div>' +
                        '<div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' +
                    '</div>' +
                '</div>',
        controller: ["$scope", CalendarCtrl],
        controllerAs: "calendar",
        link: function(scope, element, attrs, ctrl) {
            var animElements = [
                element[0].querySelector(".mdp-calendar-week-days"),
                element[0].querySelector('.mdp-calendar-days'),
                element[0].querySelector('.mdp-calendar-monthyear')
            ];
            animElements = animElements.map(function(a) {
               return angular.element(a); 
            });
                
            ctrl.init(scope.date);
            
            scope.$watch(function() { return  scope.date.format("YYYYMM") }, function(newValue, oldValue) {
                var direction = null;
                
                if(newValue > oldValue)
                    direction = "mdp-animate-next";
                else if(newValue < oldValue)
                    direction = "mdp-animate-prev";
                
                if(direction) {
                    for(var i in animElements) {
                        animElements[i].addClass(direction);
                        $animate.removeClass(animElements[i], direction);
                    }
                }
            });
        }
    }
}]);

module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function($mdpDatePicker, $timeout) {
    return  {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if ('undefined' !== typeof attrs.type && 'date' === attrs.type && ngModel) {
                angular.element(element).on("click", function(ev) {
                  		ev.preventDefault();
                      $mdpDatePicker(ev, ngModel.$modelValue).then(function(selectedDate) {
                          $timeout(function() { 
                            	ngModel.$setViewValue(moment(selectedDate).format("YYYY-MM-DD")); 
                            	ngModel.$render(); 
                          });
                      });
                });
            }
        }
    };
}]);
function TimePickerCtrl($scope, $mdDialog, currentDate, $mdMedia) {
	var self = this;
    this.VIEW_HOURS = 1;
    this.VIEW_MINUTES = 2;
    this.currentDate = currentDate;
    this.currentView = this.VIEW_HOURS;
    this.currentMoment = moment(self.currentDate);
    
    this.clockHours = parseInt(this.currentMoment.format("h"));
    this.clockMinutes = parseInt(this.currentMoment.minutes());
	
    $scope.$watch(function() { return self.clockHours }, function(newValue, oldValue) {
        if(angular.isDefined(oldValue)) {
            if(self.currentMoment.format("A") == "AM")
                self.currentMoment.hour(self.clockHours);
            else
                self.currentMoment.hour(self.clockHours < 12 ? self.clockHours + 12 : self.clockHours);
        }
    });
    
     $scope.$watch(function() { return self.clockMinutes }, function(newValue, oldValue) {
        if(angular.isDefined(oldValue)) {
            self.currentMoment.minutes(newValue < 60 ? newValue : 0);
        }
    });
    
	$scope.$mdMedia = $mdMedia;
    
	this.setAM = function() {
        if(self.currentMoment.format("A") == "PM")
            self.currentMoment.hour(self.currentMoment.hour() - 12);
	};
    
    this.setPM = function() {
        if(self.currentMoment.format("A") == "AM")
            self.currentMoment.hour(self.currentMoment.hour() + 12);
	};
    
    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function() {
        $mdDialog.hide(this.currentMoment.toDate());
    };
}

function ClockCtrl($scope) {
    var TYPE_HOURS = "hours";
    var TYPE_MINUTES = "minutes";
    this.ngModel;
    
    this.STEP_DEG = 360 / 12;
    var self = this;
    this.steps = [];
    this.selected = 0;
    
    this.CLOCK_TYPES = {
        "hours": {
            range: 12,
        },
        "minutes": {
            range: 60,
        }
    }
    
    this.setTimeByDeg = function(deg) {
        deg = deg >= 360 ? 0 : deg;
        var divider = 0;
        switch(self.type) {
            case TYPE_HOURS:
                divider = 12;
                break;
            case TYPE_MINUTES:
                divider = 60;
                break;
        }  
        
        self.setTime(
            Math.round(divider / 360 * deg)
        );
    };
    
    this.getPointerStyle = function() {
        var divider = 1;
        switch(self.type) {
            case TYPE_HOURS:
                divider = 12;
                break;
            case TYPE_MINUTES:
                divider = 60;
                break;
        }  
        var degrees = Math.round(self.selected * (360 / divider)) - 180;
        return { 
            "-webkit-transform": "rotate(" + degrees + "deg)",
            "-ms-transform": "rotate(" + degrees + "deg)",
            "transform": "rotate(" + degrees + "deg)"
        }
    };
    
    this.setTime = function(time) {
        this.selected = time;
        self.ngModel.$setViewValue(time);
        self.ngModel.$render();
    };
    
    this.init = function(ngModel, type) {
        self.type = type;
        switch(type) {
            case TYPE_HOURS:
                for(var i = 1; i <= 12; i++)
                    self.steps.push(i);
                    
                break;
            case TYPE_MINUTES:
                for(var i = 5; i <= 55; i+=5)
                    self.steps.push(i);
                self.steps.push(0);
                
                break;
                
        }
        
        self.ngModel = ngModel;
        self.selected = self.ngModel.$modelValue || 0;
    };
}

module.directive("mdpClock", ["$animate", "$timeout", function($animate, $timeout) {
    return {
        restrict: 'E',
        require: ['mdpClock', 'ngModel'],
        scope: {
            'type': '@?'
        },
        replace: true,
        template: '<div class="mdp-clock">' +
                        '<div class="mdp-clock-container">' +
                            '<md-toolbar class="mdp-clock-center md-primary"></md-toolbar>' +
                            '<md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary">' +
                                '<span class="mdp-clock-selected md-button md-raised md-primary"></span>' +
                            '</md-toolbar>' +
                            '<md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button>' +
                        '</div>' +
                    '</div>',
        controller: ["$scope", ClockCtrl],
        controllerAs: "clock",
        link: function(scope, element, attrs, ctrls) {
            var ctrl = ctrls[0],
                ngModel = ctrls[1];
                
            var pointer = angular.element(element[0].querySelector(".mdp-pointer"));
            
            scope.type = scope.type || "hours";
            $timeout(function() {
                ctrl.init(ngModel, scope.type);
            });
            
            var onEvent = function(event) {
                var containerCoords = event.currentTarget.getClientRects()[0];
                var x = ((event.currentTarget.offsetWidth / 2) - (event.pageX - containerCoords.left)),
                    y = ((event.pageY - containerCoords.top) - (event.currentTarget.offsetHeight / 2));

                var deg = Math.round((Math.atan2(x, y) * (180 / Math.PI)));
                $timeout(function() {
                    ctrl.setTimeByDeg(deg + 180);
                });
            }; 
            
            element.on("mousedown", function() {
               element.on("mousemove", onEvent);
            });
            
            element.on("mouseup mouseleave", function() {
               element.off("mousemove", onEvent);
            });
            
            element.on("click", onEvent);
            scope.$on("$destroy", function() {
                element.off("click", onEvent);
                element.off("mousemove", onEvent); 
            });
        }
    }
}]);

module.provider("$mdpTimePicker", function() {
    var LABEL_OK = "ok",
        LABEL_CANCEL = "cancel"; 
        
    this.setOKButtonLabel = function(label) {
        LABEL_OK = label;
    };
    
    this.setCancelButtonLabel = function(label) {
        LABEL_CANCEL = label;
    };
    
    this.$get = ["$mdDialog", function($mdDialog) {
        var timePicker = function(targetEvent, currentDate) {
            if(!angular.isDate(currentDate)) currentDate = Date.now();
    
            return $mdDialog.show({
                controller:  ['$scope', '$mdDialog', 'currentDate', '$mdMedia', TimePickerCtrl],
                controllerAs: 'timepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
                            '<md-dialog-content layout-gt-xs="row" layout-wrap>' +
                                '<md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary">' +
                                    '<div class="mdp-timepicker-selected-time">' +
                                        '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.currentMoment.format("h") }}</span>:' + 
                                        '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.currentMoment.format("mm") }}</span>' +
                                    '</div>' +
                                    '<div layout="column" class="mdp-timepicker-selected-ampm">' + 
                                        '<span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.currentMoment.format(\'A\') == \'AM\' }">AM</span>' +
                                        '<span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.currentMoment.format(\'A\') == \'PM\' }">PM</span>' +
                                    '</div>' + 
                                '</md-toolbar>' +
                                '<div>' +
                                    '<div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center">' +
									   '<mdp-clock class="mdp-animation-zoom" ng-model="timepicker.clockHours" type="hours" ng-switch-when="1"></mdp-clock>' +
                                       '<mdp-clock class="mdp-animation-zoom" ng-model="timepicker.clockMinutes" type="minutes" ng-switch-when="2"></mdp-clock>' +
                                    '</div>' +
                                    
                                    '<md-dialog-actions layout-align="end center" layout="row">' +
                                        '<md-button ng-click="timepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                        '<md-button ng-click="timepicker.confirm()" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                                    '</md-dialog-actions>' +
                                '</div>' +
                            '</md-dialog-content>' +
                        '</md-dialog>',
                targetEvent: targetEvent,
                locals: {
                    currentDate: currentDate
                }
            });
        };
    
        return timePicker;
    }];
});

module.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function($mdpTimePicker, $timeout) {
    return  {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if ('undefined' !== typeof attrs.type && 'time' === attrs.type && ngModel) {
                angular.element(element).on("click", function(ev) {
                  		ev.preventDefault();
                      $mdpTimePicker(ev, ngModel.$modelValue).then(function(selectedDate) {
                          $timeout(function() { 
                            	ngModel.$setViewValue(moment(selectedDate).format("HH:mm")); 
                            	ngModel.$render(); 
                          });
                      });
                });
            }
        }
    };
}]);
})();