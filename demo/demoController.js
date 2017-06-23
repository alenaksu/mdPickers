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