//URL to earthquake json data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution:
    "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,    
maxZoom: 18,
zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });
      
// Add streetmap and earthquakes layers 
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 3
    });
earthquakemap.addTo(myMap);

// function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// function to return the colour based on magnitude
function markerColor(magnitude) {
  if (magnitude > 5) {
    return 'crimson'
  } else if (magnitude > 4) {
    return 'lightsalmon'
  } else if (magnitude > 3) {
    return 'yellow'
  } else if (magnitude > 2) {
    return 'yellowgreen'
  } else {
    return 'palegreen'
  }
}

// function for opacity based on earthquakes depth
function markerOpacity(depth) {
  if (depth > 6) {
    return .99
  } else if (depth > 5) {
    return .80
  } else if (depth > 4) {
    return .70
  } else if (depth > 3) {
    return .60
  } else if (depth > 2) {
    return .50
  } else if (depth > 1) {
    return .40
  } else {
    return .30
  }
}

//Getting our GeoJSON data
d3.json(queryUrl).then(function(data) {
  // Creating a GeoJSON layer with the data
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker });
    earthquakes.addTo(myMap);
    
    // Create markers 
    function addMarker(feature, location) {
        var options = {
          stroke: false,
          fillOpacity: markerOpacity(feature.properties.mag),
          color: markerColor(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          radius: markerSize(feature.properties.mag)
        };
        return L.circleMarker(location, options);
    
      
      }

// Create popup function with earthquake information
function addPopup(feature, layer) {
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// Define colours for legend key
function getColor(d) {
    return d > 5    ? 'crimson' :
           d > 4    ? 'lightsalmon' :
           d > 3    ? 'yellow' :
           d > 2    ? 'yellowgreen' :
           d < 2    ? 'palegreen' :
                      'palegreen';
}

// Create legend 
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 2, 3, 4, 5];
        
// Generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML += 
            '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }
    return div;
};

// Add legend onto map 
legend.addTo(myMap);

// Add markers onto map
options.addTo(myMap);
});
