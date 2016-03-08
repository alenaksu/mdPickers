(function() {
"use strict";
/* global moment, angular */

var module = angular.module("mdPickers", [
	"ngMaterial",
	"ngAnimate",
	"ngAria"
]);

module.config(["$mdIconProvider", "mdpIconsRegistry", function($mdIconProvider, mdpIconsRegistry) {
	angular.forEach(mdpIconsRegistry, function(icon, index) {
		$mdIconProvider.icon(icon.id, icon.url);
	});
}]);

module.run(["$templateCache", "mdpIconsRegistry", function($templateCache, mdpIconsRegistry) {
	angular.forEach(mdpIconsRegistry, function(icon, index) {
		$templateCache.put(icon.url, icon.svg);
	});
}]);
module.constant("mdpIconsRegistry", [
    {
        id: 'mdp-chevron-left',
        url: 'mdp-chevron-left.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    },
    {
        id: 'mdp-chevron-right',
        url: 'mdp-chevron-right.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }
]);
/* global moment, angular */

function DatePickerCtrl($scope, $mdDialog, $mdMedia, $timeout, currentDate, options) {
    var self = this;

    this.date = moment(currentDate);
    this.minDate = options.minDate && moment(options.minDate).isValid() ? moment(options.minDate) : null;
    this.maxDate = options.maxDate && moment(options.maxDate).isValid() ? moment(options.maxDate) : null;
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
        	if(this.currentIndex_ < index)
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

module.provider("$mdpDatePicker", function() {
    var LABEL_OK = "OK",
        LABEL_CANCEL = "Cancel";
        
    this.setOKButtonLabel = function(label) {
        LABEL_OK = label;
    };
    
    this.setCancelButtonLabel = function(label) {
        LABEL_CANCEL = label;
    };
    
    this.$get = ["$mdDialog", function($mdDialog) {
        var datePicker = function(currentDate, options) {
            if (!angular.isDate(currentDate)) currentDate = Date.now();
            if (!angular.isObject(options)) options = {};
    
            return $mdDialog.show({
                controller:  ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'options', DatePickerCtrl],
                controllerAs: 'datepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
                            '<md-dialog-content layout="row" layout-wrap>' +
                                '<div layout="column" layout-align="start center">' +
                                    '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' +
                                        '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>' +
                                        '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format("ddd, MMM DD") }}</span> ' +
                                    '</md-toolbar>' + 
                                '</div>' +  
                                '<div>' + 
                                    '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">' +
                                        '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' +
                                            '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' +
                                                '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' +
                                            '</div>' +
                                        '</md-virtual-repeat-container>' +
                                    '</div>' +
                                    '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>' +
                                    '<md-dialog-actions layout="row">' +
                                    	'<span flex></span>' +
                                        '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                        '<md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                                    '</md-dialog-actions>' +
                                '</div>' +
                            '</md-dialog-content>' +
                        '</md-dialog>',
                targetEvent: options.targetEvent,
                locals: {
                    currentDate: currentDate,
                    options: options
                }
            });
        };
    
        return datePicker;
    }];
});

function CalendarCtrl($scope) {
	var self = this;
    this.weekDays = moment.weekdaysMin();
    this.daysInMonth = [];
    
    this.getDaysInMonth = function() {
        var days = self.date.daysInMonth(),
            firstDay = moment(self.date).date(1).day();

        var arr = [];
        for(var i = 1; i <= (firstDay + days); i++) {
            var day = null;
            if(i > firstDay) {
                day =  {
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
    
    $scope.$watch(function() { return  self.date.unix() }, function(newValue, oldValue) {
        if(newValue && newValue !== oldValue)
            self.updateDaysInMonth();
    })
    
    self.updateDaysInMonth();
}

module.directive("mdpCalendar", ["$animate", function($animate) {
    return {
        restrict: 'E',
        bindToController: {
            "date": "=",
            "minDate": "=",
            "maxDate": "=",
            "dateFilter": "="
        },
        template: '<div class="mdp-calendar">' +
                    '<div layout="row" layout-align="space-between center">' +
                        '<md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button>' +
                        '<div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div>' +
                        '<md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button>' +
                    '</div>' +
                    '<div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating">' +
                        '<div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div>' +
                    '</div>' +
                    '<div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()">' +
                        '<div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }">' +
                            '<md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button>' +
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
            ].map(function(a) {
               return angular.element(a); 
            });
                
            scope.$watch(function() { return  ctrl.date.format("YYYYMM") }, function(newValue, oldValue) {
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
        scope: {
            "minDate": "@min",
            "maxDate": "@max",
            "dateFilter": "=mdpDateFilter",
            "dateFormat": "@mdpFormat"
        },
        link: function(scope, element, attrs, ngModel) {
            var dateFormat = scope.dateFormat || moment.defaultFormat;
            if ('undefined' !== typeof attrs.type && ngModel) {
                
                angular.element(element).on("click", function(ev) {
                	ev.preventDefault();
                	
                	$mdpDatePicker(ngModel.$modelValue, {
                	    minDate: scope.minDate, 
                	    maxDate: scope.maxDate,
                	    dateFilter: scope.dateFilter,
                	    targetEvent: ev
            	    }).then(function(selectedDate) {
                		$timeout(function() {
                		    switch(attrs.type) {
                		        case "date":
                		            ngModel.$setViewValue(moment(selectedDate).format("YYYY-MM-DD"));
                		            break;
            		            default:
            		                ngModel.$setViewValue(moment(selectedDate).format(dateFormat));
            		                break;
                		    }
                			
                			ngModel.$render(); 
                        });
                      });
                });
            }
        }
    };
}]);
/* global moment, angular */

function TimePickerCtrl($scope, $mdDialog, currentDate, $mdMedia) {
	var self = this;
    this.VIEW_HOURS = 1;
    this.VIEW_MINUTES = 2;
    this.currentDate = currentDate;
    this.currentView = this.VIEW_HOURS;
    this.time = moment(self.currentDate);
    
    this.clockHours = parseInt(this.time.format("h"));
    this.clockMinutes = parseInt(this.time.minutes());
    
	$scope.$mdMedia = $mdMedia;
	
	this.switchView = function() {
	    self.currentView = self.currentView == self.VIEW_HOURS ? self.VIEW_MINUTES : self.VIEW_HOURS;
	};
    
	this.setAM = function() {
        if(self.time.format("A") == "PM")
            self.time.hour(self.time.hour() - 12);
	};
    
    this.setPM = function() {
        if(self.time.format("A") == "AM")
            self.time.hour(self.time.hour() + 12);
	};
    
    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function() {
        $mdDialog.hide(this.time.toDate());
    };
}

function ClockCtrl($scope) {
    var TYPE_HOURS = "hours";
    var TYPE_MINUTES = "minutes";
    var self = this;
    
    this.STEP_DEG = 360 / 12;
    this.steps = [];
    
    this.CLOCK_TYPES = {
        "hours": {
            range: 12,
        },
        "minutes": {
            range: 60,
        }
    }
    
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
    
    this.setTime = function(time, type) {
        this.selected = time;
        
        switch(self.type) {
            case TYPE_HOURS:
                if(self.time.format("A") == "PM") time += 12;
                this.time.hours(time);
                break;
            case TYPE_MINUTES:
                if(time > 59) time -= 60;
                this.time.minutes(time);
                break;
        }
        
    };
    
    this.init = function() {
        self.type = self.type || "hours";
        switch(self.type) {
            case TYPE_HOURS:
                for(var i = 1; i <= 12; i++)
                    self.steps.push(i);
                self.selected = self.time.hours() || 0;
                if(self.selected > 12) self.selected -= 12;
                    
                break;
            case TYPE_MINUTES:
                for(var i = 5; i <= 55; i+=5)
                    self.steps.push(i);
                self.steps.push(0);
                self.selected = self.time.minutes() || 0;
                
                break;
        }
    };
    
    this.init();
}

module.directive("mdpClock", ["$animate", "$timeout", function($animate, $timeout) {
    return {
        restrict: 'E',
        bindToController: {
            'type': '@?',
            'time': '='
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
        link: function(scope, element, attrs, ctrl) {
            var pointer = angular.element(element[0].querySelector(".mdp-pointer")),
                timepickerCtrl = scope.$parent.timepicker;
            
            var onEvent = function(event) {
                var containerCoords = event.currentTarget.getClientRects()[0];
                var x = ((event.currentTarget.offsetWidth / 2) - (event.pageX - containerCoords.left)),
                    y = ((event.pageY - containerCoords.top) - (event.currentTarget.offsetHeight / 2));

                var deg = Math.round((Math.atan2(x, y) * (180 / Math.PI)));
                $timeout(function() {
                    ctrl.setTimeByDeg(deg + 180);
                    if(["mouseup", "click"].indexOf(event.type) !== -1 && timepickerCtrl) timepickerCtrl.switchView();
                });
            }; 
            
            element.on("mousedown", function() {
               element.on("mousemove", onEvent);
            });
            
            element.on("mouseup", function(e) {
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
    var LABEL_OK = "OK",
        LABEL_CANCEL = "Cancel";
        
    this.setOKButtonLabel = function(label) {
        LABEL_OK = label;
    };
    
    this.setCancelButtonLabel = function(label) {
        LABEL_CANCEL = label;
    };
    
    this.$get = ["$mdDialog", function($mdDialog) {
        var timePicker = function(currentDate, options) {
            if(!angular.isDate(currentDate)) currentDate = Date.now();
            if (!angular.isObject(options)) options = {};
    
            return $mdDialog.show({
                controller:  ['$scope', '$mdDialog', 'currentDate', '$mdMedia', TimePickerCtrl],
                controllerAs: 'timepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
                            '<md-dialog-content layout-gt-xs="row" layout-wrap>' +
                                '<md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary">' +
                                    '<div class="mdp-timepicker-selected-time">' +
                                        '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:' + 
                                        '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span>' +
                                    '</div>' +
                                    '<div layout="column" class="mdp-timepicker-selected-ampm">' + 
                                        '<span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.format(\'A\') == \'AM\' }">AM</span>' +
                                        '<span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.format(\'A\') == \'PM\' }">PM</span>' +
                                    '</div>' + 
                                '</md-toolbar>' +
                                '<div>' +
                                    '<div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center">' +
	                                    '<mdp-clock class="mdp-animation-zoom" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock>' +
	                                    '<mdp-clock class="mdp-animation-zoom" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock>' +
                                    '</div>' +
                                    
                                    '<md-dialog-actions layout="row">' +
	                                	'<span flex></span>' +
                                        '<md-button ng-click="timepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                        '<md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                                    '</md-dialog-actions>' +
                                '</div>' +
                            '</md-dialog-content>' +
                        '</md-dialog>',
                targetEvent: options.targetEvent,
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
        scope: {
            "timeFormat": "@mdpFormat"
        },
        link: function(scope, element, attrs, ngModel) {
            var timeFormat = scope.timeFormat || "HH:mm";
            if ('undefined' !== typeof attrs.type && ngModel) {
                angular.element(element).on("click", function(ev) {
                    ev.preventDefault();
                    $mdpTimePicker(ngModel.$modelValue, {
                        targetEvent: ev
                    }).then(function(selectedDate) {
                        $timeout(function() { 
                            switch(attrs.type) {
                		        case "time":
                        	        ngModel.$setViewValue(moment(selectedDate).format("HH:mm")); 
                        	        break;
                    	        default:
                    	            ngModel.$setViewValue(moment(selectedDate).format(timeFormat));
                    	            break;
                            }
                        	ngModel.$render(); 
                        });
                    });
                });
            }
        }
    };
}]);

})();