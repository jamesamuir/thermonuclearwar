'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);


var googleMapsModule = angular.module("google-maps", []);

/**
 * Map directive
 */
googleMapsModule.directive("googleMap", ["$log", "$timeout", "$filter", "mapToolService", "mapSearchService", "nukeService", function ($log, $timeout,
                                                                                  $filter, mapToolService, mapSearchService, nukeService) {

    return {
        restrict: "EC",
        priority: 100,
        transclude: true,
        template: "<div class='angular-google-map' ng-transclude></div>",
        replace: false,
        scope: {
            center: "=center", // required
            markers: "=markers", // optional
            polygons: "=polygons",
            latitude: "=latitude", // required
            longitude: "=longitude", // required
            zoom: "=zoom", // optional, default 8
            refresh: "&refresh", // optional
            windows: "=windows", // optional"
            centerlabel: "=centerlabel"


        },
        controller: function ($scope, $element) {

            var _m = $scope.map;

            self.addInfoWindow = function (lat, lng, content) {
                _m.addInfoWindow(lat, lng, content);
            };


            //Listen for update of map center and set it to the new coords
            $scope.$on('updateMapCenter', function(listener) {

                //Get and remove old center marker
                var marker = $scope.map.findMarker($scope.center.lat, $scope.center.lng)
                if (marker != null){
                    var markers = [];
                    markers.push(marker);
                    $scope.map.removeMarkers(markers);
                }

                //Add new center marker
                $scope.center.lat = mapSearchService.getSearchLat();
                $scope.center.lng = mapSearchService.getSearchLng();
                $scope.zoom = 8;
                $scope.map.addMarker($scope.center.lat, $scope.center.lng, mapSearchService.getFormattedAddress());

            });

            //Listen for clearMap
            $scope.$on('clearMap', function(listener) {

                //Clear overlays + markers and reset center + zoom
                $scope.map.clearMarkers();
                $scope.map.clearPolygons();
                $scope.center.lat = 27.50;
                $scope.center.lng = -98.35;
                $scope.zoom = 4;

            });



        },
        link: function (scope, element, attrs, ctrl) {

            // Center property must be specified and provide lat &
            // lng properties
            if (!angular.isDefined(scope.center) ||
                (!angular.isDefined(scope.center.lat) ||
                    !angular.isDefined(scope.center.lng))) {

                $log.error("Could not find a valid center property");

                return;
            }

            angular.element(element).addClass("angular-google-map");

            // Create our model
            var _m = new MapModel({
                container: element[0],

                center: new google.maps.LatLng(scope.center.lat,
                    scope.center.lng),

                draggable: attrs.draggable == "true",

                zoom: scope.zoom
            });

            _m.on("drag", function () {

                var c = _m.center;

                $timeout(function () {

                    scope.$apply(function (s) {
                        scope.center.lat = c.lat();
                        scope.center.lng = c.lng();
                    });
                });
            });

            _m.on("zoom_changed", function () {

                if (scope.zoom != _m.zoom) {

                    $timeout(function () {

                        scope.$apply(function (s) {
                            scope.zoom = _m.zoom;
                        });
                    });
                }
            });

            _m.on("center_changed", function () {
                var c = _m.center;

                $timeout(function () {

                    scope.$apply(function (s) {

                        if (!_m.dragging) {
                            scope.center.lat = c.lat();
                            scope.center.lng = c.lng();
                        }
                    });
                });
            });

            //Set click function for markers
                (function () {
                    var cm = null;


                    _m.on("click", function (e) {

                        //alert(mapToolService.getMapTool());

                        if (mapToolService.getMapTool() == "mapTool.ADDMARKER") {

                            if (cm == null) {

                                cm = {
                                    latitude: e.latLng.lat(),
                                    longitude: e.latLng.lng()
                                };

                                //scope.markers.push(cm);
                            }
                            else {

                                cm.latitude = e.latLng.lat();
                                cm.longitude = e.latLng.lng();

                                //scope.markers.push(cm);
                            }




                            var blastPolys = GetBlastPolygons(nukeService.data.selectedNuke, cm.latitude, cm.longitude);
                            angular.forEach(blastPolys, function(p, i){
                                _m.addPolygon(p);
                            })


                            scope.markers.push(cm);

                            $timeout(function () {
                                scope.$apply();
                            });
                        }
                    });
                }());


            // Put the map into the scope
            scope.map = _m;






            // Check if we need to refresh the map
            if (angular.isUndefined(scope.refresh())) {
                // No refresh property given; draw the map immediately
                _m.draw();
            }
            else {
                scope.$watch("refresh()", function (newValue, oldValue) {
                    if (newValue && !oldValue) {
                        _m.draw();
                    }
                });
            }







            // Markers
            scope.$watch("markers", function (newValue, oldValue) {

                $timeout(function () {

                    angular.forEach(newValue, function (v, i) {
                        if (!_m.hasMarker(v.latitude, v.longitude)) {
                            _m.addMarker(v.latitude, v.longitude);

                            //***********CUSTOM**********
                            //Add the event listener to remove the marker if the tool is chosen
                            var marker = _m.findMarker(v.latitude, v.longitude);
                            google.maps.event.addListener(marker, 'click', function() {
                                if (mapToolService.getMapTool() == "mapTool.REMOVEMARKER"){

                                    var markers = [];
                                    markers.push(marker);
                                    _m.removeMarkers(markers);
                                }
                            });


                        }
                    });

                    // Clear orphaned markers
                    var orphaned = [];

                    angular.forEach(_m.getMarkerInstances(), function (v, i) {
                        // Check our scope if a marker with equal latitude and longitude.
                        // If not found, then that marker has been removed form the scope.

                        var pos = v.getPosition(),
                            lat = pos.lat(),
                            lng = pos.lng(),
                            found = false;

                        // Test against each marker in the scope
                        for (var si = 0; si < scope.markers.length; si++) {

                            var sm = scope.markers[si];

                            if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                                // Map marker is present in scope too, don't remove
                                found = true;
                            }
                        }

                        // Marker in map has not been found in scope. Remove.
                        /*if (!found) {
                            orphaned.push(v);
                        }*/
                    });

                    _m.removeMarkers(orphaned);

                    // Fit map when there are more than one marker.
                    // This will change the map center coordinates
                    if (attrs.fit == "true" && newValue.length > 1) {
                        _m.fit();
                    }
                });

            }, true);




            // Update map when center coordinates change
            scope.$watch("center", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (!_m.dragging) {
                    _m.center = new google.maps.LatLng(newValue.lat,
                        newValue.lng);
                    _m.draw();
                }
            }, true);

            scope.$watch("zoom", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                _m.zoom = newValue;
                _m.draw();
            });
        }
    };
}]);