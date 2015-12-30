(function() {
	var module = angular.module("app", [
    "ngMaterial",
    "ngAnimate",
    "ngAria",
    "mdPickers"
  ]); 
  module.controller("MainCtrl", ['$scope', '$mdpDatePicker', '$mdpTimePicker', function($scope, $mdpDatePicker, $mdpTimePicker){
  	this.showDatePicker = function(ev) {
    	$mdpDatePicker(ev, $scope.currentDate, new Date(2015,11,1), new Date(2015,11,24)).then(function(selectedDate) {
        $scope.currentDate = selectedDate;
      });;
    }  
    this.showTimePicker = function(ev) {
    	$mdpTimePicker(ev, $scope.currentDate ).then(function(selectedDate) {
        $scope.currentDate = selectedDate;
      });;
    }  
  }]);
})();