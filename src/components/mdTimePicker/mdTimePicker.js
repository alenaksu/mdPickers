function TimePickerCtrl($scope, $mdDialog, currentDate, $mdMedia) {
	var self = this;

    this.currentDate = currentDate;
    this.currentMoment = moment(self.currentDate);
	
	$scope.$mdMedia = $mdMedia;
    $scope.clockSteps = [1,2,3,4,5,6,7,8,9,10,11,12];
	
	this.range = function() {
		
	};
}

module.provider("$mdTimePicker", function() {
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
                template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-md\') }">' +
                            '<md-dialog-content layout="row" layout-wrap>' +
                                '<div layout="column" layout-align="start center">' +
                                    '<md-toolbar layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary" layout="column">' +
                                        '<div class="mdp-timepicker-selected-time">' +
											'<span>3</span>:<span>30</span>' +
										'</div>' +
										'<div layout="column" class="mdp-timepicker-selected-ampm">' + 
											'<span>AM</span>' +
											'<span>PM</span>' +
										'</div>' +
                                    '</md-toolbar>' +
                                '</div>' +  
                                '<div layout="column" layout-align="start center">' +
									'<div class="mdp-timepicker-clock">' +
										'<md-button class="md-icon-button md-raised mdp-timepicker-clock-deg{{ (30 * ($index + 1 )) }}" ng-repeat="step in clockSteps">{{ step }}</md-button>' +
									'</div>' +
                                    '<div class="md-actions" layout-align="end center" layout="row">' +
                                        '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                        '<md-button ng-click="datepicker.confirm()" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                                    '</div>' +
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