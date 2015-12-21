
function DatePickerCtrl($scope, $mdDialog, currentDate, $mdMedia) {
    var self = this;

    this.currentDate = currentDate;
    this.currentMoment = moment(self.currentDate);
    this.weekDays = moment.weekdaysMin();
    this.selectingYear = false;

    $scope.$mdMedia = $mdMedia;
    this.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 7,
        start_: 1900,
        getItemAtIndex: function(index) {
            if(this.currentIndex_ < index)
                this.currentIndex_ = index;
            return this.start_ + index;
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
    };
    
    this.showYear = function() { 
        self.yearTopIndex = (self.currentMoment.year() - self.yearItems.start_) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.currentMoment.year() - self.yearItems.start_) + 1;
        self.selectingYear = true;
    };
    
    this.showCalendar = function() {
        self.selectingYear = false;
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
                controller:  ['$scope', '$mdDialog', 'currentDate', '$mdMedia', DatePickerCtrl],
                controllerAs: 'datepicker',
                clickOutsideToClose: true,
                template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-md\') }">' +
                            '<md-dialog-content layout="row" layout-wrap>' +
                                '<div layout="column" layout-align="start center">' +
                                    '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' +
                                        '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.currentMoment.format(\'YYYY\') }}</span>' +
                                        '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.currentMoment.format("ddd, MMM DD") }}</span> ' +
                                    '</md-toolbar>' + 
                                '</div>' +  
                                '<div class="mdp-datepicker-select-year" layout="column" ng-if="datepicker.selectingYear">' +
                                    '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' +
                                        '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' +
                                            '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'current\': item == year }">{{ item }}</span>' +
                                        '</div>' +
                                    '</md-virtual-repeat-container>' +
                                '</div>' +
                                '<div layout="column" layout-align="start center" class="mdp-datepicker-calendar" ng-if="!datepicker.selectingYear">' +
                                    '<div layout="row" layout-align="space-between center" class="mdp-datepicker-monthyear">' +
                                        '<md-button aria-label="previous month" class="md-icon-button" ng-click="datepicker.prevMonth()"><md-icon md-font-set="material-icons"> chevron_left </md-icon></md-button>' +
                                        '{{ datepicker.currentMoment.format("MMMM YYYY") }}' +
                                        '<md-button aria-label="next month" class="md-icon-button" ng-click="datepicker.nextMonth()"><md-icon md-font-set="material-icons"> chevron_right </md-icon></md-button>' +
                                    '</div>' +
                                    '<div layout="row" layout-align="space-around center" class="mdp-datepicker-week-days">' +
                                        '<div layout layout-align="center center" ng-repeat="d in datepicker.weekDays track by $index">{{ d }}</div>' +
                                    '</div>' +
                                    '<div layout="row" layout-wrap class="mdp-datepicker-days">' +
                                        '<div layout layout-align="center center" ng-repeat-start="n in datepicker.getDaysInMonth() track by $index" ng-class="{ \'mdp-day-placeholder\': n === false }">' +
                                            '<md-button class="md-icon-button md-raised" aria-label="seleziona giorno" ng-if="n !== false" ng-class="{\'md-accent\': datepicker.currentMoment.date() == n}" ng-click="datepicker.selectDate(n)">{{ n }}</md-button>' +
                                        '</div>' +
                                        '<div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' +
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
    };
}]);