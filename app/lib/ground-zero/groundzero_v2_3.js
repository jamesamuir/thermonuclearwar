/*	Javascript Ground Zero Mapplet,v.2.3.0
	Carlos Labs Pty, 2007-2008
	PID: 200712B, http://www.carloslabs.com
	
	This code is released under a Creative Commons license. 
	http://creativecommons.org/licenses/by/3.0/legalcode

	You may use this code in any software project, provided you
	do not remove or modify this header and you credit us as the
	original authors of the code.
	
	Thanks and credits on www.carloslabs.com
*/
var map = new Object;

// Ground Zero namespace
var grz = {};
	grz.gZ = null;
	grz.tg = new Array();
	grz.w = new Array();
	grz.c = new Array();
	grz.mapzoom = 13;
	grz.default_zoom = grz.mapzoom;
	grz.idx = 0;
	grz.y = 0;
	grz.drop = 0;
	grz.cities = 16;		

var f = loadData();

var n = "<table cellpadding=\"2\" width=\"390px\" cellspacing=\"1\" cellpadding=\"1\" border=\"0\">";
	n+="<tr align=\"center\" class=\"gz_c_t\"><th width=\"35%\">Zone</th><th width=\"65%\">Physical Effects</th></tr>";
	n+="<tr align=\"center\"><td width=\"35%\" class=\"gz_c_1\">1st Degree Burns</td><td width=\"65%\" class=\"gz_c_p\">Sunburn-like discomfort, skin redness</td></tr>";
	n+="<tr align=\"center\"><td width=\"35%\" class=\"gz_c_2\">2nd Degree Burns</td><td width=\"65%\" class=\"gz_c_p\">Blisters and pain, like burns by boiling water</td></tr>";
	n+="<tr align=\"center\"><td width=\"35%\" class=\"gz_c_3\">3rd Degree Burns</td><td width=\"65%\" class=\"gz_c_p\">Skin charring and necrosis, requiring medical care</td></tr>";
	n+="<tr align=\"center\"><td width=\"35%\" class=\"gz_c_4\">Conflagration</td><td width=\"65%\" class=\"gz_c_p\">Most people will die within 24 hours</td></tr></table>";

function load() {
  if (GBrowserIsCompatible()) {
  		map = new GMap2(document.getElementById("map"));
  		var rd = Math.floor(Math.random() * grz.cities);
		var cd = grz.c[rd].split(",");
		grz.tg[0] = parseFloat(cd[0]);
		grz.tg[1] = parseFloat(cd[1]);
		grz.gZ = new GLatLng(grz.tg[0], grz.tg[1]); 
		var search_caption =  "Targeting " + cd[2] + "...";  		
        map.setCenter(grz.gZ, grz.default_zoom);
       
        var opt_searchbox = {
			searchFormHint : search_caption, 
        	suppressInitialResultSelection : true,
        	resultList : google.maps.LocalSearch.RESULT_LIST_SUPPRESS,
			onMarkersSetCallback : markersSet_callback
        };
		map.addControl(new google.maps.LocalSearch(opt_searchbox), new GControlPosition(G_ANCHOR_TOP_LEFT,  0));        
		map.addControl(new GSmallMapControl(), new GControlPosition(G_ANCHOR_TOP_RIGHT,  0));
		map.addControl(new GMapTypeControl(),  new GControlPosition(G_ANCHOR_BOTTOM_RIGHT,  new GSize(0,20)));
		map.addControl(new GScaleControl(),  new GControlPosition(G_ANCHOR_BOTTOM_LEFT,  new GSize(5,40)));
		
		GEvent.addListener(map, "dragend", function() {
			grz.gZ = map.getCenter();
			grz.tg[0] = parseFloat(grz.gZ.lat());
			grz.tg[1] = parseFloat(grz.gZ.lng());
			map.clearOverlays();
			map.addOverlay(new GMarker(grz.gZ));			
			if (grz.drop==1)
				dropBomb();	
		});	        
  }
  else
  	alert("Critical Error: Your browser does not support Google Maps");
}
 
// crude and fast function to compensate for the earth's funny shape	
function kmToDegX(kms, lat) {
	lat = Math.abs(lat);
	return (kms / (111.12 + (lat * 2.25 ))); }
function kmToDegY(kms) {
	return (kms / 111.12); }
	
// sourced and inspired by www.fas.org and wikipedia.org
function ba(kt, burns)	{
	var A = 1, B = 1;
	if (burns==1) {A=0.38;B=1.20};
	if (burns==2) {A=0.40;B=0.87};
	if (burns==3) {A=0.34;B=0.67};
	if (burns==4) {A=0.30;B=0.55};
	return Math.pow(kt,A) * B;	}
				
function cX(x, radius, angle) {
	return x + radius * Math.cos(radians(angle));	}
function cY(y, radius, angle) {
	return y + radius * Math.sin(radians(angle));	}
function radians(degrees) {
	return degrees*Math.PI/180;		}
// read the new lat and long after the map is drawn
function markersSet_callback(markers)	{
	grz.gZ = map.getCenter();
	grz.tg[0] = parseFloat(grz.gZ.lat());
	grz.tg[1] = parseFloat(grz.gZ.lng());
	var f = clearAll();
	map.addOverlay(createMarker(grz.gZ, n));
	return 1;
}

// Creates a marker at the given point with a narrative text
function createMarker(point, narrative) {
	 var marker = new GMarker(point,{draggable: false, bouncy: false});
	 GEvent.addListener(marker, "click", function() {
	   marker.openInfoWindowHtml(narrative);
	 });  
	return marker;
}
// Load static data
function loadData()	{
// List of weapons: yield in kilotons, year, country, narrative, map zoom
	grz.w[0] = "0,0,0,0";
	grz.w[1] = "15,1945,US,The uranium Hiroshima bomb was the 1st device used in war.,13";
	grz.w[2] = "21,1945,US,The plutonium Nagasaki bomb was the 2nd device used in war.,13";
	grz.w[3] = "400,1953,USSR,Named after Joseph Stalin; this was the 1st soviet H-bomb.,11";
	grz.w[4] = "1400,1958,US,A cowboy was seen riding this bomb in the Dr Strangelove movie.,11";
	grz.w[5] = "50000,1961,USSR,This was the largest explosion ever produced in history.,9";
	grz.w[6] = "340,1991,US,A modern nuclear bomb that can be carried by a fighter jet.,11";
	grz.w[7] = "140,2001,China,A modern nuclear bomb carried by an intercontinental missile.,11";
	grz.w[8] = "8500000000,Prehistory,Cosmic Event,The Chicxulub impact caused the end of the dinosaurs.,2";	

// List of targets: latitude, longitude, narrative
	grz.c[0] = "37.423,-122.085,Mountain View";
	grz.c[1] = "10.485,-66.855,Caracas";
	grz.c[2] = "38.897,-77.037,Washington";
	grz.c[3] = "34.385,132.45,Hiroshima";
	grz.c[4] = "51.510,-0.095,London";
	grz.c[5] = "40.415,-3.685,Madrid";	
	grz.c[6] = "55.752,37.624,Moscow";
	grz.c[7] = "32.77,129.866,Nagasaki";
	grz.c[8] = "28.632,77.22,New Delhi";
	grz.c[9] = "43.6525,-79.395,Toronto";
	grz.c[10] = "-33.875,151.210,Sydney";
	grz.c[11] = "40.443,-79.945,Pittsburgh";	
	grz.c[12] = "25.059,121.57,Taipei";
	grz.c[13] = "19.427,-99.1676,Mexico City";
	grz.c[14] = "52.379,4.9,Amsterdam";
	grz.c[15] = "18.96,72.825,Mumbai";
	return 1;
}

// Load the combo for weapons
function loadWeapon(form) {
	grz.idx = form.selector.value;
	var wd = grz.w[grz.idx].split(",");
	grz.y = parseInt(wd[0]);
	grz.mapzoom = parseInt(wd[4]);
	if (grz.idx > 0)	{
		document.getElementById('t_1').innerHTML = wd[1] + ", " + wd[2] + ", " + wd[3];
	}
	else	{
		document.getElementById('t_1').innerHTML = "&nbsp;";
	}
	return 1;
}
// Run the script
function dropBomb() {
	var vX = 0, vY = 0;
	var step = 24;		// steps in a circle	
	var polyOptions = {geodesic:true};
	var zX = new Array();
	var zY = new Array();		
	var arrZero = new Array();
	var arrOne = new Array();
	var arrTwo = new Array();
	var arrThree = new Array();
	
	if (grz.idx == 0) {
		alert("Select a Weapon from the list");
		return 0;
	}
	
	map.clearOverlays();
	map.setCenter(grz.gZ, grz.mapzoom);					
	map.addOverlay(createMarker(grz.gZ, n));
			
	zX[0] = kmToDegX(ba((grz.y),1), grz.tg[0]);
	zX[1] = kmToDegX(ba((grz.y),2), grz.tg[0]);
	zX[2] = kmToDegX(ba((grz.y),3), grz.tg[0]);
	zX[3] = kmToDegX(ba((grz.y),4), grz.tg[0]);	
	
	zY[0] = kmToDegY(ba((grz.y),1));
	zY[1] = kmToDegY(ba((grz.y),2));
	zY[2] = kmToDegY(ba((grz.y),3));
	zY[3] = kmToDegY(ba((grz.y),4));

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
		vX = cX(grz.tg[0], zX[0], (i * (360 / step)));
		vY = cY(grz.tg[1], zY[0], (i * (360 / step))); 
		arrZero[i] = new GLatLng(vX, vY);
		vX = cX(grz.tg[0], zX[1], (i * (360 / step)));
		vY = cY(grz.tg[1], zY[1], (i * (360 / step))); 
		arrOne[i] = new GLatLng(vX, vY);
		vX = cX(grz.tg[0], zX[2], (i * (360 / step)));
		vY = cY(grz.tg[1], zY[2], (i * (360 / step))); 
		arrTwo[i] = new GLatLng(vX, vY);
		vX = cX(grz.tg[0], zX[3], (i * (360 / step)));
		vY = cY(grz.tg[1], zY[3], (i * (360 / step))); 
		arrThree[i] = new GLatLng(vX, vY);
	}		
	map.addOverlay(new GPolygon(arrZero, "#ff9933", 2, 0.5, "#ff9933", 0.38, polyOptions ));
	map.addOverlay(new GPolygon(arrOne, "#cc6666", 2, 0.5, "#cc6666", 0.38, polyOptions));
	map.addOverlay(new GPolygon(arrTwo, "#660066", 2, 0.5, "#660066", 0.38, polyOptions));
	map.addOverlay(new GPolygon(arrThree, "#333333", 2, 0.5, "#333333", 0.38, polyOptions));
	document.getElementById('t_3').innerHTML = "Click on the marker for details. Drag the map to change the area.";	
	return 1;
}
// Clears the map and resets all
function clearAll() {
	map.clearOverlays();
	document.forms.yields.selector.value = 0;
	document.getElementById('t_1').innerHTML = " ";
	document.getElementById('t_3').innerHTML = " ";
	grz.idx=0;
	grz.mapzoom=13;
	map.setCenter(grz.gZ, grz.mapzoom);
	grz.drop=0;
	return 1;
}