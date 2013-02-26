/**
 * Created with JetBrains WebStorm.
 * User: US084134
 * Date: 2/20/13
 * Time: 3:51 PM
 * To change this template use File | Settings | File Templates.
 */
var GetBlastOverlays = function(yield, lat, lng){
    var vX = 0, vY = 0;
    var step = 24;		// steps in a circle
    var polyOptions = {geodesic:true};
    var zX = new Array();
    var zY = new Array();
    var arrZero = new Array();
    var arrOne = new Array();
    var arrTwo = new Array();
    var arrThree = new Array();
    var polyCoords = [];




    zX[0] = kmToDegX(ba((yield),1), lat);
    zX[1] = kmToDegX(ba((yield),2), lat);
    zX[2] = kmToDegX(ba((yield),3), lat);
    zX[3] = kmToDegX(ba((yield),4), lat);

    zY[0] = kmToDegY(ba((yield),1));
    zY[1] = kmToDegY(ba((yield),2));
    zY[2] = kmToDegY(ba((yield),3));
    zY[3] = kmToDegY(ba((yield),4));

    // many thanks to http://mendicantbug.com for picking this one up
    var tV = 0;
    if (zX[1] > zX[0])	{
        tV = zX[1];
        zX[1] = zX[0];
        zX[0] = tV;
    }
    if (zY[1] > zY[0])	{
        tV = zY[1];
        zY[1] = zY[0];
        zY[0] = tV;
    }
    for (var i = 0; i < (step+1); i++) {

        vX = cX(lat, zX[0], (i * (360 / step)));
        vY = cY(lng, zY[0], (i * (360 / step)));
        arrZero[i] = new google.maps.LatLng(vX, vY);

        //alert("lat: " + vX + " | lng :" + vY);

        vX = cX(lat, zX[1], (i * (360 / step)));
        vY = cY(lng, zY[1], (i * (360 / step)));
        arrOne[i] = new google.maps.LatLng(vX, vY);
        vX = cX(lat, zX[2], (i * (360 / step)));
        vY = cY(lng, zY[2], (i * (360 / step)));
        arrTwo[i] = new google.maps.LatLng(vX, vY);
        vX = cX(lat, zX[3], (i * (360 / step)));
        vY = cY(lng, zY[3], (i * (360 / step)));
        arrThree[i] = new google.maps.LatLng(vX, vY);
    }



    //polygons.push(new google.maps.Polygon(arrZero, "#ff9933", 2, 0.5, "#ff9933", 0.38));
    //polygons.push(new google.maps.Polygon(arrOne, "#cc6666", 2, 0.5, "#cc6666", 0.38));
    //polygons.push(new google.maps.Polygon(arrTwo, "#660066", 2, 0.5, "#660066", 0.38));
    //polygons.push(new google.maps.Polygon(arrThree, "#333333", 2, 0.5, "#333333", 0.38));

    //polygons.push(new google.maps.Polygon({paths: arrOne, strokeColor: "#cc6666", strokeWeight: 2, strokeOpacity: 0.5, fillColor: "#cc6666", fillOpacity: 0.38}));
    //polygons.push(new google.maps.Polygon({paths: arrTwo, strokeColor: "#660066", strokeWeight: 2, strokeOpacity: 0.5, fillColor: "#660066", fillOpacity: 0.38}));
    //polygons.push(new google.maps.Polygon({paths: arrThree, strokeColor: "#333333", strokeWeight: 2, strokeOpacity: 0.5, fillColor: "#333333", fillOpacity: 0.38}));

    //alert("blast count = " + polygons.length);

    polyCoords.push(arrZero);
    polyCoords.push(arrOne);
    polyCoords.push(arrTwo);
    polyCoords.push(arrThree);

    return polyCoords;

}








var GetBlastPolygons = function(yield, lat, lng){
    var vX = 0, vY = 0;
    var step = 24;		// steps in a circle
    var polyOptions = {geodesic:true};
    var zX = new Array();
    var zY = new Array();
    var arrZero = new Array();
    var arrOne = new Array();
    var arrTwo = new Array();
    var arrThree = new Array();
    var polygons = [];




    zX[0] = kmToDegX(ba((yield),1), lat);
    zX[1] = kmToDegX(ba((yield),2), lat);
    zX[2] = kmToDegX(ba((yield),3), lat);
    zX[3] = kmToDegX(ba((yield),4), lat);

    zY[0] = kmToDegY(ba((yield),1));
    zY[1] = kmToDegY(ba((yield),2));
    zY[2] = kmToDegY(ba((yield),3));
    zY[3] = kmToDegY(ba((yield),4));

    // many thanks to http://mendicantbug.com for picking this one up
    var tV = 0;
    if (zX[1] > zX[0])	{
        tV = zX[1];
        zX[1] = zX[0];
        zX[0] = tV;
    }
    if (zY[1] > zY[0])	{
        tV = zY[1];
        zY[1] = zY[0];
        zY[0] = tV;
    }
    for (var i = 0; i < (step+1); i++) {

        vX = cX(lat, zX[0], (i * (360 / step)));
        vY = cY(lng, zY[0], (i * (360 / step)));
        arrZero[i] = new google.maps.LatLng(vX, vY);

        //alert("lat: " + vX + " | lng :" + vY);

        vX = cX(lat, zX[1], (i * (360 / step)));
        vY = cY(lng, zY[1], (i * (360 / step)));
        arrOne[i] = new google.maps.LatLng(vX, vY);
        vX = cX(lat, zX[2], (i * (360 / step)));
        vY = cY(lng, zY[2], (i * (360 / step)));
        arrTwo[i] = new google.maps.LatLng(vX, vY);
        vX = cX(lat, zX[3], (i * (360 / step)));
        vY = cY(lng, zY[3], (i * (360 / step)));
        arrThree[i] = new google.maps.LatLng(vX, vY);
    }




    var poly0 = new google.maps.Polygon({
        paths: arrZero,
        strokeColor: "#ff9933",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#ff9933",
        fillOpacity: 0.38

    });

    var poly1 = new google.maps.Polygon({
        paths: arrOne,
        strokeColor: "#cc6666",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#cc6666",
        fillOpacity: 0.38

    });

    var poly2 = new google.maps.Polygon({
        paths: arrTwo,
        strokeColor: "#660066",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#660066",
        fillOpacity: 0.38

    });

    var poly3 = new google.maps.Polygon({
        paths: arrThree,
        strokeColor: "#333333",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#333333",
        fillOpacity: 0.38

    });


    polygons.push(poly0);
    polygons.push(poly1);
    polygons.push(poly2);
    polygons.push(poly3);

    return polygons;

}