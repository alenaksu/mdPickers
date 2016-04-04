(function() {
    'use strict';

    angular
        .module('mdPickers')
        .directive('ngMessage', ngMessage);

    /** @ngInject */
    function ngMessage($mdUtil) {
        return {
            restrict: 'EA',
            priority: 101,
            compile: function(element) {
                var inputContainer = $mdUtil.getClosest(element, 'mdp-time-picker', true) ||
                    $mdUtil.getClosest(element, 'mdp-date-picker', true);

                // If we are not a child of an input container, don't do anything
                if (!inputContainer) return;

                // Add our animation class
                element.toggleClass('md-input-message-animation', true);

                return {};
            }
        }
    }

})();
