'use strict';

app.factory('nukeService', function($rootScope, $http) {
    var nukeService = {};
    nukeService.data = {};
    nukeService.data.selectedNuke = 12;
    nukeService.data.orderProp = "yield";
    nukeService.data.nukeDialogVisible = false;
    nukeService.data.nukes = {};

    //For modal selection window
    nukeService.setNukeDialogVisible = function(visible){

    }
    nukeService.getNukeDialogVisible = function(visible){
        return nukeService.nukeDialogVisible;
    }

    nukeService.getSelectedNuke = function(){
        return nukeService.data;
    }


    //Gets the list of nuclear weapons
    nukeService.getNukes = function() {
        $http.get('nukes/nukes.json')
            .success(function(data) {
                nukeService.data.nukes = data;
                //alert(status + " | good");
            }).
            error(function(data, status, headers, config) {
                alert(status + " | bad");
            });

        return nukeService.data;
    };

    //Gets the details for a single nuclear weapon
    nukeService.getNuke = function(id) {
        $http.get('nukes/' + id + '.json').success(function(data) {
            nukeService.nuke = data;
        });

        return nukeService.nuke;
    };


    //Gets the details for a single nuclear weapon
    nukeService.clearMap = function() {
        $rootScope.$broadcast('clearMap');
    };

    return nukeService;
});



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
        //alert(url);
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