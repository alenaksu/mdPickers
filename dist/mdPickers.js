(function() {
"use strict";
var module = angular.module("mdPickers", [
	"ngMaterial",
	"ngAnimate",
	"ngAria"
]); 

module.controller('DatePickerCtrl', ['$scope', '$mdDialog', 'currentDate', '$mdMedia', function($scope, $mdDialog, currentDate, $mdMedia) {
    var self = this;

    this.currentDate = currentDate;
    this.currentMoment = moment(self.currentDate);
    this.weekDays = moment.weekdaysMin();

    $scope.$mdMedia = $mdMedia;
    $scope.yearsOptions = [];
    for(var i = 1900; i <= (this.currentMoment.year() + 12); i++) {
        $scope.yearsOptions.push(i);
    }
    $scope.year = this.currentMoment.year();

	this.setYear = function() {
        self.currentMoment.year($scope.year);
    };

    this.selectDate = function(dom) {
        self.currentMoment.date(dom);
    };

    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function() {
        $mdDialog.hide(this.currentMoment.toDate());
    };

    this.getDaysInMonth = function() {
        var days = self.currentMoment.daysInMonth(),
            firstDay = moment(self.currentMoment).date(1).day();

        var arr = [];
        for(var i = 1; i <= (firstDay + days); i++)
            arr.push(i > firstDay ? (i - firstDay) : false);

        return arr;
    };

    this.nextMonth = function() {
        self.currentMoment.add(1, 'months');
      	$scope.year = self.currentMoment.year();
    };

    this.prevMonth = function() {
        self.currentMoment.subtract(1, 'months');
      	$scope.year = self.currentMoment.year();
    };
}]);

module.provider("$mdDatePicker", function() {
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
                controller: 'DatePickerCtrl',
                controllerAs: 'datepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-md\') }">' +
                            '<md-dialog-content layout="row" layout-wrap>' +
                                '<div layout="column" layout-align="start center">' +
                                    '<md-toolbar layout-align="center center" class="mdp-datepicker-dow md-primary"><span>{{ datepicker.currentMoment.format("dddd") }}</span></md-toolbar>' +
                                    '<md-toolbar layout-align="center center" class="mdp-datepicker-date md-hue-1 md-primary" layout="column">' +
                                        '<div class="mdp-datepicker-month">{{ datepicker.currentMoment.format("MMM") }}</div>' +
                                        '<div class="mdp-datepicker-day">{{ datepicker.currentMoment.format("DD") }}</div>' +
                                        '<md-select class="mdp-datepicker-year" placeholder="{{ datepicker.currentMoment.format(\'YYYY\') }}" ng-model="year" ng-change="datepicker.setYear()">' +
                                            '<md-option ng-value="year" ng-repeat="year in yearsOptions">{{ year }}</md-option>' +
                                        '</md-select>' +
                                    '</md-toolbar>' +
                                '</div>' +
                                '<div layout="column" layout-align="start center" class="mdp-datepicker-calendar">' +
                                    '<div layout="row" layout-align="space-between center" class="mdp-datepicker-monthyear">' +
                                        '<md-button aria-label="previous month" class="md-icon-button" ng-click="datepicker.prevMonth()"><md-icon md-font-set="material-icons"> chevron_left </md-icon></md-button>' +
                                        '{{ datepicker.currentMoment.format("MMMM YYYY") }}' +
                                        '<md-button aria-label="next month" class="md-icon-button" ng-click="datepicker.nextMonth()"><md-icon md-font-set="material-icons"> chevron_right </md-icon></md-button>' +
                                    '</div>' +
                                    '<div layout="row" layout-align="space-around center" class="mdp-datepicker-week-days">' +
                                        '<div layout layout-align="center center" ng-repeat="d in datepicker.weekDays track by $index">{{ d }}</div>' +
                                    '</div>' +
                                    '<div layout="row" layout-wrap class="mdp-datepicker-days">' +
                                        '<div layout layout-align="center center" ng-repeat-start="n in datepicker.getDaysInMonth() track by $index">' +
                                            '<md-button class="md-icon-button md-raised" aria-label="seleziona giorno" ng-if="n !== false" ng-class="{\'md-accent\': datepicker.currentMoment.date() == n}" ng-click="datepicker.selectDate(n)">{{ n }}</md-button>' +
                                        '</div>' +
                                        '<div flex ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' +
                                    '</div>' +
                                '</div>' +
                            '</md-dialog-content>' +
                            '<div class="md-actions" layout="row">' +
                                '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' +
                                '<md-button ng-click="datepicker.confirm()" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' +
                            '</div>' +
                        '</md-dialog>',
                targetEvent: targetEvent,
                locals: {
                    currentDate: currentDate
                }
            });
        }
    
        return datePicker;
    }];
});

module.directive("mdDatePicker", ["$mdDatePicker", "$timeout", function($mdDatePicker, $timeout) {
    return  {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if ('undefined' !== typeof attrs.type && 'date' === attrs.type && ngModel) {
                angular.element(element).on("click", function(ev) {
                  		ev.preventDefault();
                      $mdDatePicker(ev, ngModel.$modelValue).then(function(selectedDate) {
                          $timeout(function() { 
                            	ngModel.$setViewValue(moment(selectedDate).format("YYYY-MM-DD")); 
                            	ngModel.$render(); 
                          });
                      });
                });
            }
        }
    }
}]);
})();