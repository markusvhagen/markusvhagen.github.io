// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.385649, 63.428264], [10.385936, 63.428095], [10.385974, 63.428066], [10.386207, 63.427894], [10.38637, 63.427775], [10.38662, 63.427603], [10.386717, 63.427549], [10.386773, 63.427525], [10.387098, 63.427417], [10.387309, 63.427368], [10.387677, 63.427295], [10.387932, 63.427287], [10.388385, 63.427307], [10.388478, 63.42731], [10.388849, 63.427327], [10.389303, 63.427349], [10.38947, 63.427345], [10.389533, 63.42733], [10.38964, 63.427221], [10.38965, 63.427012], [10.389651, 63.426866], [10.38969, 63.426699], [10.389695, 63.42655], [10.389714, 63.426359], [10.389751, 63.426223], [10.38979, 63.426037], [10.389832, 63.425931], [10.389863, 63.425742], [10.389903, 63.425679], [10.389946, 63.425505], [10.389963, 63.425308], [10.390201, 63.425154], [10.390284, 63.425124], [10.390455, 63.425073], [10.390603, 63.425044], [10.390674, 63.42503], [10.39103, 63.424947], [10.391105, 63.424932], [10.391546, 63.42489], [10.391708, 63.424893], [10.391935, 63.424902], [10.392096, 63.424902], [10.392429, 63.424922], [10.392578, 63.424916], [10.392822, 63.424845], [10.393153, 63.4247], [10.393225, 63.424677], [10.393383, 63.424651], [10.393538, 63.424638], [10.39379, 63.424649], [10.394162, 63.424699], [10.394232, 63.424716], [10.394498, 63.424807], [10.394827, 63.424936], [10.394991, 63.424959], [10.395404, 63.424983], [10.395722, 63.424984], [10.395983, 63.424976], [10.396153, 63.424977]];
const etappe_distance_array = [0, 23, 27, 49, 65, 88, 96, 99, 120, 131, 152, 164, 187, 192, 210, 233, 241, 245, 258, 282, 298, 317, 333, 355, 370, 391, 403, 424, 431, 451, 473, 493, 499, 509, 517, 521, 541, 545, 568, 576, 587, 595, 612, 619, 634, 657, 661, 670, 678, 690, 710, 714, 730, 752, 761, 782, 798, 811, 819];
const etappe_altitude_array = [12, 12, 12, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 11, 8, 8, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 6, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 3];


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 14.9 : 14.0;


// ********** //
// FUNCTIONS //
// ********* //

// Implementation of haversine formula to compute distance between two coordinates in latitude and longitude
function distBetweenCoords(coord1, coord2) {
  const earthRadius = 6371e3;
  var phi1 = coord1[0] * Math.PI/180; // φ, λ in radians
  var phi2 = coord2[0] * Math.PI/180;
  var deltaPhi = (coord2[0]-coord1[0]) * Math.PI/180;
  var deltaLambda = (coord2[1]-coord1[1]) * Math.PI/180;

  var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return earthRadius * c;
}

// Haversine is only really needed to compute gradient, in most cases we can do a much chearper computation.
function cheaperDistBetweenCoords(coord1, coord2) {
  var xDiff = Math.abs(coord1[0]-coord2[0]);
  var yDiff = Math.abs(coord1[1]-coord2[1]);
  return xDiff + yDiff;
}

// Computing the incline as an average over twenty points
function getIncline(startCoord, endCoord, startElev, endElev) {
  var rise = endElev - startElev;
  var run = Math.abs(distBetweenCoords(endCoord, startCoord))
  var inclinePercent = (!(run == 0)) ? (rise/run * 100) : 0;
  return Math.round(inclinePercent);
}

// Function to add text, i.e. for parks.
function addTextOnMap(id, coordinate, text, textSize, rotation=0) {
  map.addSource('text-point' + id.toString(), {
    type: 'geojson',
    data: {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinate
                }
            }
        ]
    }
  });

  map.addLayer({
    id: 'text-layer' + id.toString(),
    type: 'symbol',
    source: 'text-point' + id.toString(),
    layout: {
        'text-field': text,
        'text-size': textSize,
        'text-rotate': rotation,
        'text-allow-overlap': true, // Allow text to overlap other symbols if necessary
    },
    paint: {
      "text-color": "white",
      "text-halo-color": "black",
      "text-halo-width": 2
    }
  });
}

// Function to add waypoint in map
function addMarker(id, coordinate, iconUrl, scaling) {
  map.loadImage(
            iconUrl,
            (error, image) => {
                if (error) throw error;
                map.addImage('marker' + id, image);
                // Add a GeoJSON source with 2 points
                map.addSource('marker-point' + id, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                // feature for Mapbox DC
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coordinate
                                },
                                'properties': {
                                    'title': ''
                                }
                            }
                        ]
                    }
                });

                // Add a symbol layer
                map.addLayer({
                    'id': 'marker-point' + id,
                    'type': 'symbol',
                    'source': 'marker-point' + id,
                    'layout': {
                        'icon-image': 'marker' + id,
                        'icon-size': scaling,
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'title'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                });
            }
        );
}

// Function to add popup in map
function addPopup(id, coordinate, innerHTML) {
  var popup = new mapboxgl.Popup({ closeOnClick: true, className: "popup" })
        .setLngLat(coordinate)
        .setHTML(innerHTML);
  return popup;
}


// ********** //
// ETAPPERUTE //
// ********** //
mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3VzdmhhZ2VuIiwiYSI6ImNtZ2NlNjNrbjE0bzkybHI1ZmM3MjV3aTEifQ.BE1AT8J3W1peoFGt4LOxOw';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: (!isMobile) ? [10.38969, 63.426699] : [10.38969, 63.426699],
        zoom: mapZoom
    });

    map.on('load', () => {

      //addMarker(1, [10.371573, 63.431212], "https://png.pngtree.com/png-clipart/20230818/original/pngtree-bio-outdoor-toilet-vector-illustration-vector-illustration-isolated-on-white-background-picture-image_8030179.png", 0.04);
      //addMarker(2, [10.392797, 63.436874], "https://cdn-icons-png.flaticon.com/512/2956/2956744.png", 0.1)
      //addMarker(3, [10.387912, 63.433513], "https://cdn-icons-png.flaticon.com/512/431/431248.png", 0.1)

      //let popup1 = addPopup(1, [10.378365, 63.431695],"<h1>Svingbrua</h1> Visste du at Svingbrua er den eneste brua i Norge som bruker horisontal rotasjon for åpne seg?");
      //popup1.addTo(map);


        // This function draws each "etappe"
        function createEtappe(number, coordinates, routeColor, startDotColor) {
          map.addSource('etappe' + number, {
              'type': 'geojson',
              'data': {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                      'type': 'LineString',
                      'coordinates': coordinates
                  },
              }
          });

          map.addLayer({
              'id': 'etappe' + number,
              'type': 'line',
              'source': 'etappe' + number,
              'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
              },
              'paint': {
                  'line-color': routeColor,
                  'line-width': 7
              }
          });

          // Labeling the start of this etappe
          map.addSource('etappe' + number + 'start', {
              type: 'geojson',
              data: {
                  type: 'Feature',
                  geometry: {
                      type: 'Point',
                      coordinates: coordinates[0]
                  },
                  properties: {
                    label: number.toString()
                  }
              }
          });

          map.addLayer({
            id: 'etappe' + number + 'start',
            type: 'circle',
            source: 'etappe' + number + 'start',
            paint: {
                'circle-radius': 15, // Radius in pixels
                'circle-color': startDotColor,
                'circle-opacity': 0.9 // Semi-transparent
            }
          });

          map.addLayer({
              id: 'etappe' + number + 'start' + '-label',
              type: 'symbol',
              source: 'etappe' + number + 'start',
              layout: {
                  'text-field': ['get', 'label'], // Use the 'label' property from your GeoJSON
                  'text-size': 20,
                  'text-allow-overlap': true, // Allow text to overlap other symbols if necessary
              },
              paint: {
                "text-color": "white", // Red text color
                "text-halo-color": "black", // White halo color
                "text-halo-width": 1
              }
          });
      }

      // This function creates etappe but with color on geojson line to indicate intensity.
      function createEtappeWithIntensityColors(allCoordinates, changeColorAtIndexArray, colorArray) {
          var idArray = [];
          var indicesForChangingColors = [];
          for (var j=0; j<colorArray.length; j++) {
            idArray.push(j+1);
          }

          var slicedArrayAtIndex = 0;
          for (var i=0; i<idArray.length; i++) {
            var id = i+1;
            if (changeColorAtIndexArray.length == i) {
              map.addSource('etappeInt' + id, {
                  'type': 'geojson',
                  'data': {
                      'type': 'Feature',
                      'properties': {},
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': allCoordinates.slice(changeColorAtIndexArray[i-1]-1)
                      },
                  }
              });
              map.addLayer({
                  'id': 'etappeInt' + id,
                  'type': 'line',
                  'source': 'etappeInt' + id,
                  'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                  },
                  'paint': {
                      'line-color': colorArray[i],
                      'line-width': 7
                  }
              });
            }

            else {
              map.addSource('etappeInt' + id, {
                  'type': 'geojson',
                  'data': {
                      'type': 'Feature',
                      'properties': {},
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': allCoordinates.slice(slicedArrayAtIndex, changeColorAtIndexArray[i])
                      },
                  }
              });
              map.addLayer({
                  'id': 'etappeInt' + id,
                  'type': 'line',
                  'source': 'etappeInt' + id,
                  'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                  },
                  'paint': {
                      'line-color': colorArray[i],
                      'line-width': 7
                  }
              });
              slicedArrayAtIndex = changeColorAtIndexArray[i]-1;
            }
          }
      }

      createEtappe(9, etappe_coordinates, "#DC0000", "#C60000");

      //createEtappeWithIntensityColors(etappe_coordinates, [20,185], ["#628141", "#CF0F0F", "#F79A19"]);


      map.addSource('finish-point', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: etappe_coordinates[etappe_coordinates.length-1]
                    }
                }
            ]
        }
      });

      map.addLayer({
        id: 'finish-layer',
        type: 'symbol',
        source: 'finish-point',
        layout: {
            'text-field': "Veksling",
            'text-size': 20,
            'text-allow-overlap': true, // Allow text to overlap other symbols if necessary
        },
        paint: {
          "text-color": "white",
          "text-halo-color": "black",
          "text-halo-width": 2
        }
      });

      // Moving circle
      // We only add it if we are not on mobile device
      if (!isMobile) {
          map.loadImage('https://markusvhagen.github.io/stafettpinne.png', (error, image) => {
            if (error) throw error;
            map.addImage('stafettpinne', image);
          });


          map.addSource('circle-center', {
              type: 'geojson',
              data: {
                  type: 'Feature',
                  geometry: {
                      type: 'Point',
                      coordinates: etappe_coordinates[20]
                  },
                  properties: {}
              }
          });

          map.addLayer({
            id: 'my-circle',
            type: 'symbol',
            source: 'circle-center',
            layout: {
                'icon-image': 'stafettpinne',
                'icon-allow-overlap': true,
                'icon-size': 1,
                'text-field': etappe_distance_array[20].toString() + "m",
                'text-size': 25,
                'text-allow-overlap': true, // Allow text to overlap other symbols if necessary
            },
            paint: {
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 2
            }
            });
        }
      });



// *************** //
// EVENT-LISTENERS //
// *************** //

// Only do this if device is not mobile.
if (!isMobile) {
  map.on("mousemove", (e) => {
    var activeCoord = [parseFloat(JSON.stringify(e.lngLat.lng)), parseFloat(JSON.stringify(e.lngLat.lat))];

    // Now we find closest coordinate in etappe_coordinates. We also store its index in the array for later.
    var closestCoord = [0,0]
    var index = 0;
    for (var i = 0; i < etappe_coordinates.length; i++) {
      if (cheaperDistBetweenCoords(closestCoord, activeCoord) > cheaperDistBetweenCoords(activeCoord,etappe_coordinates[i])) {
        closestCoord = etappe_coordinates[i]
        index = i;
      }
    }

    // Let us move the red point on the map accordingly to where the cursor is.
    map.getSource('circle-center').setData({
          type: 'Feature',
          geometry: {
              type: 'Point',
              coordinates: etappe_coordinates[index] // New coordinates
          },
          properties: {}
      });
    // Let us also change the current distance, elevation and incline.
    // These two parameters decide the average we take (which is here over 6 points)
    var dataIndex = index;
    var nudge = 3;
    var leftNudge = -nudge;
    var rightNudge = nudge;
    // Have to run something else if we are very close to one of the edges of the graph
    if (dataIndex < nudge) {
      leftNudge = 0;
    }
    if (dataIndex>dataIndex[-1]-(nudge-1)) {
      rightNudge = 0;
    }
    map.setLayoutProperty("my-circle", "text-field", etappe_distance_array[index] + "m");

  });
}
