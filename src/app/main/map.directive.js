(function() {
  'use strict';

  angular
    .module('LandApp')
    .directive('laMap', laMap);

  /** @ngInject */
  function laMap() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/main/map.directive.html',
      controller: MapController,
      controllerAs: 'vm'
    };

    var vm,
        view,
        map;

    return directive;

    /** @ngInject */
    function MapController($rootScope, $log, mapService) {
      vm = this;
      vm.mapService = mapService;

      createMap();

      mapService.addBaseMaps(map);
    }

    function createMap() {
      var timsFarm = ol.proj.fromLonLat([-0.658493, 51.191286]);
      var jamesFarm = ol.proj.fromLonLat([-1.315305, 51.324901]);

      view = new ol.View({
          center: jamesFarm,
          maxZoom: 20,
          minZoom: 7,
          zoom: 13
      });

      vm.zoomIn = function() {
          view.setZoom(view.getZoom() + 1);
      };

      vm.zoomOut = function() {
          view.setZoom(view.getZoom() - 1);
      };

      map = new ol.Map({
          target: 'map',
          layers: [], // initialise without any layers because land-app-map-controller will set basemap
          loadTilesWhileAnimating: true,
          view: view,
          controls: []
      });

      //this.scope.map.addInteraction(clickHandler);
    }
  }
})();
