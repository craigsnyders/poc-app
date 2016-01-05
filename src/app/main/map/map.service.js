(function() {
  'use strict';

  angular
    .module('LandApp')
    .service('mapService', ['ol', '$log', 'proj4', mapService]);

  /** @ngInject */
  function mapService(ol, $log, proj4) {
    // define EPSG:27700
    proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

    // TODO: remove this hard code
    // var timsFarm = ol.proj.fromLonLat([-0.658493, 51.191286]);
    var jamesFarm = ol.proj.fromLonLat([-1.315305, 51.324901]);

    // name: ol's layer
    var osLayers = {};
    var currentBaseMap = {};
    var view = {};
    var map = {};

    var service = {
      createMap: createMap,
      setBaseMap: setBaseMap,
      toggleLayerFromCheckProperty: toggleLayerFromCheckProperty,
      zoomIn: zoomIn,
      zoomOut: zoomOut
    };

    return service;


    ///////////////
    function zoomIn() {
      view.setZoom(view.getZoom() + 1);
    }

    function zoomOut() {
      view.setZoom(view.getZoom() - 1);
    }

    function createMap() {
      view = new ol.View({
        center: jamesFarm,
        maxZoom: 20,
        minZoom: 7,
        zoom: 13
      });

      map = new ol.Map({
        target: 'map',
        layers: [],
        loadTilesWhileAnimating: true,
        view: view,
        controls: []
      });
    }

    function addLayer(layer) {
      buildAndCacheLayer(layer);
      map.addLayer(osLayers[layer.name]);
    }

    function removeLayer(layer) {
      buildAndCacheLayer(layer);
      map.removeLayer(osLayers[layer.name]);
    }

    function toggleLayerFromCheckProperty(layer) {
      if (layer.checked) {
        addLayer(layer);
      } else {
        removeLayer(layer);
      }
    }

    function buildAndCacheLayer(layer) {
      if (!osLayers[layer.name]) {
        switch (layer.type) {
          case 'xyz':
            osLayers[layer.name] = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: layer.url
                })
              });
            break;
          case 'osm':
            osLayers[layer.name] = new ol.layer.Tile({
                source: new ol.source.OSM()
              });
            break;
          case 'vector':
            osLayers[layer.name] = new ol.layer.Vector({
              source: new ol.source.Vector({
                url: layer.url,
                format: new ol.format.GeoJSON({
                  defaultDataProjection: "EPSG:27700"
                })
              }),
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: layer.fillColor,
                }),
                stroke: new ol.style.Stroke({
                  color: layer.strokeColor,
                  width: 2
                })
              })
            });
            break;
          default:
            $log.log("layer type '" + layer.type + "' not defined");
        }
      }
    } //buildAndCacheLayer

    function setBaseMap(baseMap) {
      removeLayer(currentBaseMap);
      currentBaseMap = baseMap;
      addLayer(currentBaseMap);
    }

  } // mapService


  ///////////////
  // function addBaseMaps(map) {
  //   angular.forEach(baseMapLayers, function(layerDefinition) {
  //     if (layerDefinition.layer) {
  //       map.addLayer(layerDefinition.layer);
  //     }
  //   });
  // }

})();
