'use strict';

/* Controllers */


function NavigationCtrl($scope, $location, mapToolService){
    //required to high light the active navigational point
    $scope.location = $location;

    $scope.mapTool = ""


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
            lat: 45,
            lng: -73
        },

        /** the initial zoom level of the map */
        zoomProperty: 8,

        /** list of markers to put in the map */
        markersProperty: [ {
            latitude: 45,
            longitude: -74
        }],

        // These 2 properties will be set when clicking on the map
        clickedLatitudeProperty: null,
        clickedLongitudeProperty: null
    });

}


