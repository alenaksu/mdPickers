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
    "ngMessages",
    'mdPickers'
])

.config(['$mdThemingProvider', function ($mdThemingProvider) {
	$mdThemingProvider.theme('dark').dark();
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
        $mdpLocale.time.clearOnCancel = true;


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
        $mdpLocale.date.clearOnCancel = true;
    }
}]);