/* global moment, angular */

DatePickerCtrl.prototype.setAM = function() {
  var self = this;
  if(self.date.hours() >= 12)
      self.date.hour(self.date.hour() - 12);
};

DatePickerCtrl.prototype.setPM = function() {
  var self = this;
  if(self.date.hours() < 12)
      self.date.hour(self.date.hour() + 12);
};

module.provider('$mdpDateTimePicker', function(){
  var LABEL_OK = "OK",
      LABEL_CANCEL = "Cancel",
      DISPLAY_FORMAT = "ddd, MMM DD";

  this.setDisplayFormat = function(format) {
      DISPLAY_FORMAT = format;
  };

  this.setOKButtonLabel = function(label) {
      LABEL_OK = label;
  };

  this.setCancelButtonLabel = function(label) {
      LABEL_CANCEL = label;
  };

  this.$get = ["$mdDialog", function($mdDialog){
    var dateTimePicker = function(currentDate, options){
      if (!angular.isDate(currentDate)) currentDate = Date.now();
      if (!angular.isObject(options)) options = {};

      options.displayFormat = DISPLAY_FORMAT;

      return $mdDialog.show({
          controller:  ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'options', DatePickerCtrl],
          controllerAs: 'datepicker',
          clickOutsideToClose: true,
          template: '<md-dialog aria-label="" class="mdp-datetime-picker mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
                      '<md-dialog-content layout="row" layout-wrap>' +
                          '<div layout="column" layout-align="start center">' +
                              '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' +
                                  '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>' +
                                  '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> ' +
                                  '<p>{{ datepicker.date.format("HH:mm") }}</p>' +
                              '</md-toolbar>' +
                          '</div>' +
                          '<div>' +
                              '<div layout="row">' +
                                '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">' +
                                    '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' +
                                        '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' +
                                            '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' +
                                        '</div>' +
                                    '</md-virtual-repeat-container>' +
                                '</div>' +
                                '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>' +
                                '<div layout="column">' +
                                  '<div class="mdp-timepicker-selected-ampm">' +
                                    '<span ng-click="datepicker.setAM()" ng-class="{ \'active\': datepicker.date.hours() < 12 }">AM</span>' +
                                    '<span ng-click="datepicker.setPM()" ng-class="{ \'active\': datepicker.date.hours() >= 12 }">PM</span>' +
                                  '</div>' +
                                  '<mdp-clock class="mdp-animation-zoom" auto-switch="true" time="datepicker.date" type="hours" ></mdp-clock>' +
                                  '<mdp-clock class="mdp-animation-zoom" auto-switch="true" time="datepicker.date" type="minutes" ></mdp-clock>' +
                                '</div>'+
                              '</div>' +
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
          },
          skipHide: true
      });

    }

    return dateTimePicker;
  }];


});

module.directive('mdpDateTimePikcer', ["$mdpDateTimePicker", "$timeout", function($mdpDateTimePicker, $timeout){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      "minDate": "@min",
      "maxDate": "@max",
      "dateFilter": "=mdpDateFilter",
      "datetimeFormat": "@mdpFormat"
    },
    link: function(scope, element, attrs, ngModel, $transclude) {
      scope.datetimeFormat = scope.datetimeFormat || "YYYY-MM-DD HH:mm";

      ngModel.$validators.format = function(modelValue, viewValue) {
          return formatValidator(viewValue, scope.datetimeFormat);
      };

      ngModel.$validators.minDate = function(modelValue, viewValue) {
          return minDateValidator(viewValue, scope.datetimeFormat, scope.minDate);
      };

      ngModel.$validators.maxDate = function(modelValue, viewValue) {
          return maxDateValidator(viewValue, scope.datetimeFormat, scope.maxDate);
      };

      ngModel.$validators.filter = function(modelValue, viewValue) {
          return filterValidator(viewValue, scope.datetimeFormat, scope.dateFilter);
      };

      function showPicker(ev) {
          $mdpDateTimePicker(ngModel.$modelValue, {
            minDate: scope.minDate,
            maxDate: scope.maxDate,
            dateFilter: scope.dateFilter,
            targetEvent: ev
        }).then(function(time) {
              ngModel.$setViewValue(moment(time).format(scope.datetimeFormat));
              ngModel.$render();
          });
      };

      element.on("click", showPicker);

      scope.$on("$destroy", function() {
          element.off("click", showPicker);
      });
    }
  }
}]);
