/* global moment, angular */
(function() {
    'use strict';

    angular
        .module('mdPickers', [
            'ngMaterial',
            'ngAnimate',
            'ngAria'
        ])
        .config(configIcons)
        .run(runBlock);

    /** @ngInject */
    function configIcons($mdIconProvider, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function(icon, index) {
            $mdIconProvider.icon(icon.id, icon.url);
        });
    }

    /** @ngInject */
    function runBlock($templateCache, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function(icon, index) {
            $templateCache.put(icon.url, icon.svg);
        });
    }

})();
