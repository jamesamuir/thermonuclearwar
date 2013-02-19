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
