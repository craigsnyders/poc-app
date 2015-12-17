(function() {
  'use strict';

  angular
    .module('LandApp')
    .directive('header', header);

  /** @ngInject */
  function header() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/header/header.html',
      controller: HeaderController,
      controllerAs: 'vm'
    };

    return directive;

    /** @ngInject */
    function HeaderController($rootScope, $log) {
      var vm = this;

      vm.toggleLayersPanel = function() {
        $log.debug('toggleLayersPanel');
        $rootScope.$emit('open-layers-panel');
      };
    }
  }

})();
