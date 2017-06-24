(function() {
"use strict";
/**
 * Created by Robin Thoni on 6/21/17.
 */

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

angular.module('demo', [
    'ngMaterial',
    'mdPickers'
])

.config([function () {

}])

.run(['$location', '$mdpLocale', function($location, $mdpLocale) {
    if (location.search !== '?useDefaults') { // Quick and dirty
        $mdpLocale.time.minTime = "10h00";
        $mdpLocale.time.maxTime = "22h42";
        $mdpLocale.time.okLabel = "Valider";
        $mdpLocale.time.cancelLabel = "Annuler";
        $mdpLocale.time.timeFormat = "HH[h]mm";
        $mdpLocale.time.noFloat = true;
        $mdpLocale.time.openOnClick = true;
        $mdpLocale.time.autoSwitch = true;
        $mdpLocale.time.ampm = true;


        $mdpLocale.date.minDate = new Date().addDays(-2);
        $mdpLocale.date.maxDate = new Date().addDays(2);
        $mdpLocale.date.okLabel = "Valider";
        $mdpLocale.date.cancelLabel = "Annuler";
        $mdpLocale.date.dateFilter = function (date) {
            return date.getDate() % 2 !== 0;
        };
        $mdpLocale.date.dateFormat = "DD/MM/YYYY";
        $mdpLocale.date.displayFormat = "ddd DD MMM";
        $mdpLocale.date.noFloat = true;
        $mdpLocale.date.openOnClick = true;
    }
}]);
/**
 * Created by Robin Thoni on 6/21/17.
 */

angular.module('demo').controller('demoController', ['$scope', function($scope) {
    $scope.date1 = null;

    $scope.date2 = null;
    $scope.minDate2 = new Date().addDays(-7);
    $scope.maxDate2 = new Date().addDays(7);
    $scope.minTime2 = "01:42";
    $scope.maxTime2 = "23:42";
    $scope.dateFilter2 = function (date) {
        var d = date.getDate();
        return d % 2 !== 0 && d % 3 !== 0;
    };

}]);
})();