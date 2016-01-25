(function() {
  'use strict';

  angular
    .module('LandApp')
    .factory('tooltipMeasurementService', tooltipMeasurementService);

  /** @ngInject */
  function tooltipMeasurementService(ol, featureMeasureService) {
    var service = {
      addTooltip: addTooltip
    };

    var measureTooltipNode;
    var measureTooltip;
    var currentFeature;
    var map;

    return service;

    //////////////

    function addTooltip(layer, drawInteraction) {
      map = drawInteraction.getMap();

      createMeasureTooltip();

      addDrawListeners(drawInteraction);
    }

    function createMeasureTooltip() {
      if (measureTooltipNode) {
        measureTooltipNode.remove();
      }

      measureTooltipNode = angular.element("<div>").addClass("tooltip tooltip-measure");
      measureTooltip = new ol.Overlay({
        element: measureTooltipNode[0],
        offset: [0, -15],
        positioning: "bottom-center"
      });

      map.addOverlay(measureTooltip);
    }

    function addDrawListeners(drawInteraction) {
      var listener;

      drawInteraction.on("drawstart", function(event) {
        var tooltipCoord = event.coordinate;

        currentFeature = event.feature;

        listener = currentFeature.getGeometry().on("change", function(event) {
          var geometry = event.target;
          var output = featureMeasureService.getPrettyMeasurement(geometry, map.getView().getProjection());

          if (geometry instanceof ol.geom.Polygon) {
            tooltipCoord = geometry.getInteriorPoint().getCoordinates();
          } else if (geometry instanceof ol.geom.LineString) {
            tooltipCoord = geometry.getLastCoordinate();
          }

          measureTooltipNode.empty().append(output);
          measureTooltip.setPosition(tooltipCoord);
        });
      });

      drawInteraction.on("drawend", function() {
        measureTooltipNode.removeClass("tooltip-measure").addClass("tooltip-static");
        measureTooltip.setOffset([0, -7]);

        currentFeature = undefined;
        measureTooltipNode = undefined;

        createMeasureTooltip();
        ol.Observable.unByKey(listener);
      });
    }
  }
})();