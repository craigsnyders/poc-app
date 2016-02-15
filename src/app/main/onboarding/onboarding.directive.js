(function() {
  'use strict';

  angular
    .module('LandApp')
    .directive('laOnboarding', laOnboarding);

  /** @ngInject */
  function laOnboarding(onboardingService) {

    var directive = {
      priority: 2,
      restrict: 'E',
      templateUrl: 'app/main/onboarding/onboarding.html',
      controller: Controller,
      link: linkFunc,
      controllerAs: 'vmOnboarding',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function linkFunc(scope) {
      scope.$on('land-registry-features-selected', function(event, features) {
        onboardingService.handleLrFeatureSelect(features);
      });
    }

    /** @ngInject */
    function Controller() {
      var vm = this;
      vm.getCurrentStepName = onboardingService.getCurrentStepName;
      vm.getSelectedLrFeatureAmount = onboardingService.getSelectedLrFeatureAmount;
      vm.copyLrFeaturesToFarm = onboardingService.copyLrFeaturesToFarm;
      vm.isOnboardingCompleted = onboardingService.isOnboardingCompleted;

      onboardingService.init();
    }
  }
})();
