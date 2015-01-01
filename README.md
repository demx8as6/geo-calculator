geo-calculator
==============

A small node application for geographic distance and azimuth calculations.

## Node.js Usage
Install the module using npm

    npm install geo-calculator
    
Require the module and decode a PNG

    var geoCalc = require('geo-calculator');
    
    // Denia
    var pointA = [38.840556, 0.105556];
    
    // Berlin
    var pointB = [52.518611, 13.408333];
    
    var distance = geoCalc.distance(pointA, pointB); 
    // distance: ~2114 km (2113855.510321635m)
 