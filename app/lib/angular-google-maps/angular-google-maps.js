/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */



    "use strict";

    /*
     * Utility functions
     */

    /**
     * Check if 2 floating point numbers are equal
     *
     * @see http://stackoverflow.com/a/588014
     */
    function floatEqual (f1, f2) {
        return (Math.abs(f1 - f2) < 0.000001);
    }



    /*
     * Create the model in a self-contained class where map-specific logic is
     * done. This model will be used in the directive.
     */

    var MapModel = (function () {

        var _defaults = {
            zoom: 8,
            draggable: false,
            container: null
        };

        /**
         *
         */
        function PrivateMapModel(opts) {

            var _instance = null,
                _markers = [],  // caches the instances of google.maps.Marker
                _overlays = [],
                _handlers = [], // event handlers
                _windows = [],  // InfoWindow objects
                o = angular.extend({}, _defaults, opts),
                that = this;

            this.center = opts.center;
            this.zoom = o.zoom;
            this.draggable = o.draggable;
            this.dragging = false;
            this.selector = o.container;
            this.markers = [];
            this.overlays = [];


            this.draw = function () {

                if (that.center == null) {
                    // TODO log error
                    return;
                }

                if (_instance == null) {

                    // Create a new map instance


                    _instance = new google.maps.Map(that.selector, {
                        center: that.center,
                        zoom: that.zoom,
                        draggable: that.draggable,
                        mapTypeId : google.maps.MapTypeId.ROADMAP
                    });




                    google.maps.event.addListener(_instance, "dragstart",

                        function () {
                            that.dragging = true;
                        }
                    );

                    google.maps.event.addListener(_instance, "idle",

                        function () {
                            that.dragging = false;
                        }
                    );

                    google.maps.event.addListener(_instance, "drag",

                        function () {
                            that.dragging = true;
                        }
                    );

                    google.maps.event.addListener(_instance, "zoom_changed",

                        function () {
                            that.zoom = _instance.getZoom();
                            that.center = _instance.getCenter();
                        }
                    );

                    google.maps.event.addListener(_instance, "center_changed",

                        function () {
                            that.center = _instance.getCenter();
                        }
                    );

                    // Attach additional event listeners if needed
                    if (_handlers.length) {

                        angular.forEach(_handlers, function (h, i) {

                            google.maps.event.addListener(_instance,
                                h.on, h.handler);
                        });
                    }
                }
                else {

                    // Refresh the existing instance
                    google.maps.event.trigger(_instance, "resize");

                    var instanceCenter = _instance.getCenter();

                    if (!floatEqual(instanceCenter.lat(), that.center.lat())
                        || !floatEqual(instanceCenter.lng(), that.center.lng())) {
                        _instance.setCenter(that.center);
                    }

                    if (_instance.getZoom() != that.zoom) {
                        _instance.setZoom(that.zoom);
                    }
                }
            };


            //Fit the map extent to contain of the markers
            this.fit = function () {
                if (_instance && _markers.length) {

                    var bounds = new google.maps.LatLngBounds();

                    angular.forEach(_markers, function (m, i) {
                        bounds.extend(m.getPosition());
                    });

                    _instance.fitBounds(bounds);
                }
            };




            this.on = function(event, handler) {
                _handlers.push({
                    "on": event,
                    "handler": handler
                });
            };


            //Add marker to map
            this.addMarker = function (lat, lng, label, url, thumbnail) {



                if (that.findMarker(lat, lng) != null) {
                    return;
                }

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: _instance
                });

                if (label) {

                }

                if (url) {

                }
                // Cache marker
                _markers.unshift(marker);

                // Cache instance of our marker for scope purposes
                that.markers.unshift({
                    "lat": lat,
                    "lng": lng,
                    "draggable": false,
                    "label": label,
                    "url": url,
                    "thumbnail": thumbnail
                });

                // Return marker instance
                return marker;
            };

            this.findMarker = function (lat, lng) {
                for (var i = 0; i < _markers.length; i++) {
                    var pos = _markers[i].getPosition();

                    if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
                        return _markers[i];
                    }
                }

                return null;
            };

            this.findMarkerIndex = function (lat, lng) {
                for (var i = 0; i < _markers.length; i++) {
                    var pos = _markers[i].getPosition();

                    if (floatEqual(pos.lat(), lat) && floatEqual(pos.lng(), lng)) {
                        return i;
                    }
                }

                return -1;
            };

            this.addInfoWindow = function (lat, lng, html) {
                var win = new google.maps.InfoWindow({
                    content: html,
                    position: new google.maps.LatLng(lat, lng)
                });

                _windows.push(win);

                return win;
            };

            this.hasMarker = function (lat, lng) {
                return that.findMarker(lat, lng) !== null;
            };

            this.getMarkerInstances = function () {
                return _markers;
            };

            this.removeMarkers = function (markerInstances) {

                var s = this;

                angular.forEach(markerInstances, function (v, i) {
                    var pos = v.getPosition(),
                        lat = pos.lat(),
                        lng = pos.lng(),
                        index = s.findMarkerIndex(lat, lng);

                    // Remove from local arrays
                    _markers.splice(index, 1);
                    s.markers.splice(index, 1);

                    // Remove from map
                    v.setMap(null);
                });
            };
        }

        // Done
        return PrivateMapModel;
    }());

    // End model
