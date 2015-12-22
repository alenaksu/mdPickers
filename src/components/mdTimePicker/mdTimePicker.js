function TimePickerCtrl($scope, $mdDialog, currentDate, $mdMedia) {
	var self = this;
    this.VIEW_HOURS = 1;
    this.VIEW_MINUTES = 2;
    this.currentDate = currentDate;
    this.currentView = this.VIEW_HOURS;
    this.currentMoment = moment(self.currentDate);
	
	$scope.$mdMedia = $mdMedia;
    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.minutes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0];
	
	this.range = function() {
		
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
    var self = this;
    this.steps = [];
    this.currentMoment;
    
    this.setTime = function(time) {
        switch(self.type) {
            case TYPE_HOURS:
                switch(self.currentMoment.format("A")) {
                    case "AM":
                        self.currentMoment.hour(time);
                        break;
                    case "PM":
                        self.currentMoment.hour(time + 12);
                        break;
                }
            case TYPE_MINUTES:
                self.currentMoment.time(time);
                break;
        }  
    };
    
    this.init = function(time, type) {
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
        self.currentMoment = time;
    };
}

module.directive("mdpClock", ["$animate", "$timeout", function($animate, $timeout) {
    return {
        restrict: 'E',
        scope: {
            'time': '=',
            'type': '@?'
        },
        template: '<div class="mdp-timepicker-clock">' +
                        '<div class="mdp-timepicker-clock-container mdp-timepicker-hours">' +
                            '<md-button class="md-icon-button md-raised mdp-timepicker-clock-deg{{ (30 * ($index + 1 )) }}" ng-repeat="step in clock.steps">{{ step }}</md-button>' +
                        '</div>' +
                    '</div>',
        controller: ["$scope", ClockCtrl],
        controllerAs: "clock",
        link: function(scope, element, attrs, ctrl) {
            scope.type = scope.type || "hours";
            ctrl.init(scope.time, scope.type);
            
            var onClick = function(event) {
                // TODO compute correct degrees
                var x = (event.target.offsetWidth / 2) - (event.offsetX - (event.target.offsetWidth / 2)),
                    y = (event.target.offsetHeight / 2) - event.offsetY;

                var deg = (Math.atan2(-y, x) * (180 / Math.PI));
                
                var next = ctrl.steps[Math.max(Math.ceil(deg / 30), 1) - 1] || ctrl.steps.length,
                    value = ctrl.steps[Math.max(Math.floor(deg / 30), 1) - 1] || ctrl.steps.length,
                    gap = (deg/30) % 1;
                
                $timeout(function() {
                    ctrl.setTime(value + Math.round((next - value) * gap));
                });
            };
            
            element.on("click", onClick);
            scope.$on("$destroy", function() {
                element.off("click", onClick);
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
                template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-md\') }">' +
                            '<md-dialog-content layout="row" layout-wrap>' +
                                '<div layout="column" layout-align="start center">' +
                                    '<md-toolbar layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary" layout="column">' +
                                        '<div class="mdp-timepicker-selected-time">' +
											'<span class="active">{{ timepicker.currentMoment.format("H") }}</span>:<span>{{ timepicker.currentMoment.format("mm") }}</span>' +
										'</div>' +
										'<div layout="column" class="mdp-timepicker-selected-ampm">' + 
											'<span ng-class="{ \'active\': timepicker.currentMoment.format(\'A\') == \'AM\' }">AM</span>' +
											'<span ng-class="{ \'active\': timepicker.currentMoment.format(\'A\') == \'PM\' }">PM</span>' +
										'</div>' + 
                                    '</md-toolbar>' +
                                '</div>' +  
                                '<div layout="column" layout-align="start center">' +
                                    '<ng-switch on="timepicker.currentView">' +
									   '<mdp-clock time="timepicker.currentMoment" format="hours" ng-switch-when="1"></mdp-picker>' +
                                    '</ng-switch>' +
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