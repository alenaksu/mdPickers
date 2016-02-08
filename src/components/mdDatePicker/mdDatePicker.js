/* global = */

function DatePickerCtrl($scope, $mdDialog, $mdMedia, $timeout, currentDate, minDate, maxDate) {
    var self = this;

    this.currentDate = currentDate;
    this.currentMoment = moment(self.currentDate);
    this.minMoment = minDate ? moment(minDate).startOf("day") : null;
    this.maxMoment = maxDate ? moment(maxDate).startOf("day") : null;
    this.selectingYear = false;

    $scope.$mdMedia = $mdMedia;
    
    this.init = function() {
    	// validate min and max date
    	if (this.minMoment && this.maxMoment) {
    		if (this.maxMoment.isBefore(this.minMoment)) {
    			this.maxMoment = moment(this.minMoment).add(1, 'days');
    		}
    	}
    	
    	if (this.currentMoment) {
    		// check min date
	    	if (this.minMoment && this.currentMoment.isBefore(this.minMoment)) {
    			this.currentMoment = moment(this.minMoment);
	    	}
	    	
	    	// check max date
	    	if (this.maxMoment && this.currentMoment.isAfter(this.maxMoment)) {
    			this.currentMoment = moment(this.maxMoment);
	    	}
    	}
    	
    	var startYear = this.minMoment ? this.minMoment.year() : 1900;
    	var endYear = this.maxMoment ? this.maxMoment.year() : null;
    	
    	this.yearItems = {
	        currentIndex_: 0,
	        PAGE_SIZE: 5,
	        START: startYear,
	        getItemAtIndex: function(index) {
	        	if(this.currentIndex_ < index)
	                this.currentIndex_ = index;
	        	
	        	return this.START + index;
	        },
	        getLength: function() {
	            return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
	        }
	    };
    };
    
    self.init();
    
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
    
    this.today = function() {
    	self.currentMoment = moment();
    	this.selectYear(self.currentMoment.year());
    };
    
    this.isTodayAvailable = function() {
    	var minValid = true, maxValid = true;
    	var date = moment().startOf("day").toDate();
    	
    	if (this.minMoment) {
    		minValid = date >= this.minMoment.toDate();
    	}
    	
    	if (this.maxMoment) {
    		maxValid = date <= this.maxMoment.toDate();
    	}
    	
    	return minValid && maxValid;
    };

    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function() {
    	var date = this.currentMoment;
    	
    	if (this.minMoment && this.currentMoment.isBefore(this.minMoment)) {
    		date = moment(this.minMoment);
    	}
    	
    	if (this.maxMoment && this.currentMoment.isAfter(this.maxMoment)) {
    		date = moment(this.maxMoment);
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
        LABEL_CANCEL = "Cancel",
        LABEL_TODAY = "Today"; 
        
    this.setOKButtonLabel = function(label) {
        LABEL_OK = label;
    };
    
    this.setCancelButtonLabel = function(label) {
        LABEL_CANCEL = label;
    };
    
    this.$get = ["$mdDialog", function($mdDialog) {
        var datePicker = function(targetEvent, currentDate, minDate, maxDate) {
            if (!angular.isDate(currentDate)) currentDate = Date.now();
            if (!angular.isDate(minDate)) minDate = null;
            if (!angular.isDate(maxDate)) maxDate = null;
    
            return $mdDialog.show({
                controller:  ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'minDate', 'maxDate', DatePickerCtrl],
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
                                    '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.currentMoment" min-date="datepicker.minMoment" max-date="datepicker.maxMoment"></mdp-calendar>' +
                                    '<md-dialog-actions layout="row">' +
                                    	'<md-button ng-click="datepicker.today()" ng-if="datepicker.isTodayAvailable()" aria-label="' + LABEL_TODAY + '">' + LABEL_TODAY + '</md-button>' +
                                    	'<span flex></span>' +
                                        '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                        '<md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                                    '</md-dialog-actions>' +
                                '</div>' +
                            '</md-dialog-content>' +
                        '</md-dialog>',
                targetEvent: targetEvent,
                locals: {
                    currentDate: currentDate,
                    minDate: minDate, 
                    maxDate: maxDate
                }
            });
        };
    
        return datePicker;
    }];
});

function CalendarCtrl($scope) {
	var _self = this;
	
    this.weekDays = moment.weekdaysMin();
    this.daysInMonth = [];
    
    this.updateDaysInMonth = function() {
        var days = $scope.date.daysInMonth(),
        	firstDay = moment($scope.date).date(1).day();
        
        var viewDays = Math.ceil((days + firstDay) / 7) * 7;

        var arr = [];
        for(var i = 1; i <= viewDays; i++) {
        	var n = (i - firstDay);
        	arr.push(i > firstDay && i <= days + firstDay ? {n: n, valid: this.isValidDay(n)} : false);
        }
        
        this.daysInMonth = arr;
    };
    
    this.isValidDay = function(day) {
    	var minValid = true, maxValid = true;
    	var date = moment($scope.date).date(day).startOf("day").toDate();
    	
    	if ($scope.minDate) {
    		minValid = date >= $scope.minDate.toDate();
    	}
    	
    	if ($scope.maxDate) {
    		maxValid = date <= $scope.maxDate.toDate();
    	}
    	
    	return minValid && maxValid;
    };
   
    this.selectDate = function(dom) {
    	$scope.date.date(dom);
    };

    this.nextMonth = function() {
    	$scope.date.add(1, 'months');
    	this.updateDaysInMonth();
    };

    this.prevMonth = function() {
    	$scope.date.subtract(1, 'months');
    	this.updateDaysInMonth();
    };
    
    // init
    this.updateDaysInMonth();
}

module.directive("mdpCalendar", ["$animate", function($animate) {
    return {
        restrict: 'E',
        scope: {
            "date": "=",
            "minDate": "=",
            "maxDate": "="
        },
        template: '<div class="mdp-calendar">' +
                    '<div layout="row" layout-align="space-between center">' +
                        '<md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-font-set="material-icons"> chevron_left </md-icon></md-button>' +
                        '<div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ date.format("MMMM YYYY") }}</div>' +
                        '<md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-font-set="material-icons"> chevron_right </md-icon></md-button>' +
                    '</div>' +
                    '<div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating">' +
                        '<div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div>' +
                    '</div>' +
                    '<div layout="row" layout-align="space-around center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()">' +
                        '<div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': day === false }">' +
                            '<md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day !== false" ng-class="{\'md-accent\': date.date() == day.n}" ng-click="calendar.selectDate(day.n)" ng-disabled="!day.valid">{{ day.n }}</md-button>' +
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
        scope: {
            "minDate": "=mdMinDate",
            "maxDate": "=mdMaxDate"
        },
        link: function(scope, element, attrs, ngModel) {
            if ('undefined' !== typeof attrs.type && 'date' === attrs.type && ngModel) {
                angular.element(element).on("click", function(ev) {
                	ev.preventDefault();
                	
                	$mdpDatePicker(ev, ngModel.$modelValue, scope.minDate, scope.maxDate).then(function(selectedDate) {
                		$timeout(function() {
                			var selectedMoment = moment(selectedDate).startOf("day");
                			var minMoment = scope.minDate ? moment(scope.minDate) : null;
                			var maxMoment = scope.maxDate ? moment(scope.maxDate) : null;
                			
                			// validate min and max date
                        	if (minMoment && maxMoment) {
                        		if (maxMoment.isBefore(minMoment)) {
                        			maxMoment = moment(minMoment).add(1, 'days');
                        		}
                        	}
                			
                			if (minMoment && minMoment.isValid()) {
                				minMoment.startOf("day");
                				ngModel.$setValidity('mindate', selectedMoment.toDate() >= minMoment.toDate());
                			}
                			
                			if (maxMoment && maxMoment.isValid()) {
                				maxMoment.startOf("day");
                				ngModel.$setValidity('maxdate', selectedMoment.toDate() <= maxMoment.toDate());
                			}
                    	      
                			ngModel.$setViewValue(selectedMoment.format("YYYY-MM-DD")); 
                			ngModel.$render(); 
                          });
                      });
                });
            }
        }
    };
}]);