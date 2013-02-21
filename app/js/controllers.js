'use strict';

/* Controllers */


function NavigationCtrl($scope, $location, $http, mapToolService, mapSearchService){
    //required to high light the active navigational point
    $scope.location = $location;

    $scope.mapTool = ""

    $scope.searchResults = "";

    //Search location
    $scope.searchLocation = function(){
        mapSearchService.searchLocation($scope.searchText);

        /*var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + formatAddressString($scope.searchText) + '&sensor=false';
        alert(url);
        $http({method: 'GET', url: url}).
            success(function(data, status, headers, config) {
                //alert(status + " | good");
                //Set address text
                alert(data.status);
                $scope.searchResults = data;
            }).
            error(function(data, status, headers, config) {
                alert(status + " | bad");
            });*/

    }


    //Set mapTool functions
    $scope.setAddMarker = function(event){
        event.preventDefault();
        this.setMapTool("mapTool.ADDMARKER");
    }

    $scope.setRemoveMarker = function(event){
        event.preventDefault();
        this.setMapTool("mapTool.REMOVEMARKER");
    }

    $scope.setMapTool = function(mapTool){
        if (mapToolService.getMapTool() == mapTool){
            $scope.mapTool = "";
        }else{
            $scope.mapTool = mapTool;
        }
        mapToolService.setMapTool($scope.mapTool);
    }


}

function HomeCtrl($scope){

    $scope.test = "testdata";
}

function MapCtrl($scope){
    angular.extend($scope, {

        /** the initial center of the map */
        centerProperty: {
            lat:  27.50,
            lng: -98.35
        },

        /** the initial zoom level of the map */
        zoomProperty:4,

        /** list of markers to put in the map */
        markersProperty: [ ],

        /** list of overlays to put in the map */
        overlaysProperty: [ ],

        // These 2 properties will be set when clicking on the map
        clickedLatitudeProperty: null,
        clickedLongitudeProperty: null,

        centerLabelProperty: "Center Point"
    });

}


