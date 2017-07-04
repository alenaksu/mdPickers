/**
 * Created by Robin Thoni on 6/21/17.
 */

module.factory('$mdpLocale', [function () {
    var $mdpLocale = {
        time: {
            minTime: null,
            maxTime: null,
            okLabel: "OK",
            cancelLabel: "Cancel",
            timeFormat: "HH:mm",
            noFloat: false,
            openOnClick: false,
            autoSwitch: false,
            ampm: true,
            clearOnCancel: false
        },
        date: {
            minDate: null,
            maxDate: null,
            okLabel: "OK",
            cancelLabel: "Cancel",
            dateFilter: null,
            dateFormat: "YYYY-MM-DD",
            displayFormat: "ddd, MMM DD",
            noFloat: false,
            openOnClick: false,
            clearOnCancel: false
        }
    };

    return $mdpLocale;
}]);
