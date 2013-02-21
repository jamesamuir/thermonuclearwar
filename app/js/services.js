'use strict';



app.factory('mapToolService', function($rootScope) {
    var mapToolService = {};

    mapToolService.mapTool = "";

    mapToolService.getMapTool = function() {
        return mapToolService.mapTool;
    };

    mapToolService.setMapTool = function(value) {
        mapToolService.mapTool = value;
        $rootScope.$broadcast('changeTool');
    };

    return mapToolService;
});


app.factory('mapSearchService', function($rootScope, $http) {
    var mapSearchService = {};

    //Properties
    mapSearchService.searchLat = "";
    mapSearchService.searchLng = "";
    mapSearchService.formattedAddress = "";

    //Accessors
    mapSearchService.getSearchLat = function() {
        return mapSearchService.searchLat;
    };
    mapSearchService.getSearchLng = function() {
        return mapSearchService.searchLng;
    };
    mapSearchService.getFormattedAddress = function() {
        return mapSearchService.formattedAddress;
    };

    //Search
    mapSearchService.searchLocation = function(searchText) {

        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + formatAddressString(searchText) + '&sensor=false';
        alert(url);
        $http({method: 'GET', url: url}).
            success(function(data, status, headers, config) {
                //alert(status + " | good");
                //Set address text
                if (data.status == 'OK'){
                    mapSearchService.formattedAddress = data.results[0].formatted_address;

                    //Set location
                    var location = data.results[0].geometry.location;
                    mapSearchService.searchLat = location.lat;
                    mapSearchService.searchLng = location.lng;

                    //alert(lat + " " + lng);

                    $rootScope.$broadcast('updateMapCenter');
                }
            }).
            error(function(data, status, headers, config) {
                alert(status + " | bad");
            });

    };

    return mapSearchService;
});