'use strict';
// prototype
if (!String.format) {
	Math.fmod = function (a,b) { 
		return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); 
	};
}
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

// const
var pi = Math.PI;
var r = 6378137.0; // radius of earth in [m]

// here it goes
var geoCalculator = {};
module.exports = geoCalculator;

geoCalculator.about = function() {
	console.log('Geo Calculator');
};

geoCalculator.distance = function(pointA, pointB) {
	
	var latA = pointA[0]/180*pi; // phi_A
	var lonA = pointA[1]/180*pi; // lambda_A
	
	var latB = pointB[0]/180*pi; // phi_B
	var lonB = pointB[1]/180*pi; // lambda_B
	
	var zeta = Math.acos(   Math.sin(latA) * Math.sin(latB) + Math.cos(latA) * Math.cos(latB) * Math.cos(lonB - lonA)  );
	
	return zeta * r;
};

geoCalculator.alpha = function(pointA, pointB) {
	
	var latA = pointA[0]/180*pi; // phi_A
	var lonA = pointA[1]/180*pi; // lambda_A
	
	var latB = pointB[0]/180*pi; // phi_B
	var lonB = pointB[1]/180*pi; // lambda_B
	
	var zeta = Math.acos(   Math.sin(latA) * Math.sin(latB) + Math.cos(latA) * Math.cos(latB) * Math.cos(lonB - lonA)  );
	var alpha = Math.acos( (Math.sin(latB) - Math.sin(latA) * Math.cos(zeta) ) / (Math.cos(latA)  * Math.sin(zeta) ));
	
	return lonA < lonB ? 360 - alpha*180/pi : alpha*180/pi;
};

geoCalculator.point2 = function(input, callback) {

	// check for errors		
	if (!isValid(input)) { 
		var example = '{"point1":[10.0,54.0],"distance":111318,"azimuth":30}';
		var message = '#ERROR: geo-calculator says:\n';
		message += ' Wrong input parameter: {0}\n';
		message += ' An example for input parameter: {1}';
		message = String.format(message, JSON.stringify(input), example);
		return callback(new Error(message));
	}

	// logic
	var lat1 = input.point1[0]/180*pi;
 	var lon1 = input.point1[1]/180*pi;
	
	var azimuth = input.azimuth/180*pi;
	var d = input.distance / r;

   	var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(-azimuth));
    var lon2 = Math.cos(lat1) == 0 ? lon1 : Math.fmod(lon1 - Math.asin(Math.sin(-azimuth) * Math.sin(d) / Math.cos(lat1)) + pi, 2*pi) - pi;

	lon2=180*lon2/pi;
	lat2=180*lat2/pi;

	return callback(null, [1*lat2.toFixed(6), 1*lon2.toFixed(6)]);
};

var isValid = function(input) {
	if (typeof input !== Object) {return false};
	if (input === null) {return false};
	if (input.point1 === undefined) {return false};
	if (input.point1[0] === undefined) {return false};
	if (input.point1[1] === undefined) {return false};
	if (input.azimuth === undefined) {return false};
	if (input.distance === undefined) {return false};

	return true;
}