// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.399951, 63.420468], [10.399899, 63.420459], [10.399706, 63.420419], [10.399572, 63.420385], [10.399216, 63.420271], [10.399067, 63.42021], [10.398819, 63.420099], [10.398576, 63.42], [10.398431, 63.419918], [10.398404, 63.4199], [10.398302, 63.419839], [10.398269, 63.419821], [10.398194, 63.419789], [10.398032, 63.419711], [10.397958, 63.419621], [10.397933, 63.419549], [10.397912, 63.419543], [10.397874, 63.419439], [10.397876, 63.419418], [10.397705, 63.4193], [10.397696, 63.41926], [10.397716, 63.419184], [10.39771, 63.419156], [10.397711, 63.41914], [10.3977, 63.4191], [10.397676, 63.419068], [10.39768, 63.418931], [10.39768, 63.418898], [10.397761, 63.418808], [10.397664, 63.418752], [10.397633, 63.418728], [10.39767, 63.41864], [10.397708, 63.418603], [10.397725, 63.418576], [10.39784, 63.418498], [10.397905, 63.418459], [10.39798, 63.418405], [10.397996, 63.418389], [10.398043, 63.418315], [10.398016, 63.418276], [10.39799, 63.41826], [10.397946, 63.41814], [10.398006, 63.418076], [10.398039, 63.418023], [10.398114, 63.4179], [10.398157, 63.417874], [10.398217, 63.417837], [10.398301, 63.417729], [10.398267, 63.417686], [10.398313, 63.417621], [10.398569, 63.417459], [10.398579, 63.417447], [10.398626, 63.417387], [10.398648, 63.417361], [10.398675, 63.417333], [10.398631, 63.417273], [10.398653, 63.417228], [10.398894, 63.417076], [10.39892, 63.416956], [10.398976, 63.416849], [10.398958, 63.41676], [10.398959, 63.416722], [10.398977, 63.416617], [10.399002, 63.416476], [10.399027, 63.41632], [10.399143, 63.416139], [10.399191, 63.416088], [10.399242, 63.41599], [10.399234, 63.415945], [10.399239, 63.415831], [10.399241, 63.415828], [10.399245, 63.415817], [10.399249, 63.415794], [10.399331, 63.415699], [10.399401, 63.41563], [10.399525, 63.415515], [10.399558, 63.415486], [10.3997, 63.415315], [10.39971, 63.415298], [10.399737, 63.415256], [10.399806, 63.415148], [10.399749, 63.415022], [10.399827, 63.414955], [10.399867, 63.414897], [10.399862, 63.414846], [10.399916, 63.41474], [10.399997, 63.414591], [10.400063, 63.414433], [10.400125, 63.414355], [10.400122, 63.414277], [10.400143, 63.414236], [10.400175, 63.414189], [10.400235, 63.414115], [10.40029, 63.414012], [10.400323, 63.413977], [10.400318, 63.413875], [10.400351, 63.41381], [10.40044, 63.413662], [10.400564, 63.413481], [10.400571, 63.413468], [10.400641, 63.413332], [10.400706, 63.413234], [10.40079, 63.413088], [10.400866, 63.412979], [10.400871, 63.412971], [10.400949, 63.412923], [10.400946, 63.412904], [10.400944, 63.41287], [10.400944, 63.412814], [10.400922, 63.412805], [10.400892, 63.412802], [10.400794, 63.4128], [10.40072, 63.412799], [10.400307, 63.412776], [10.400212, 63.412777], [10.399963, 63.412791], [10.399929, 63.412788], [10.399759, 63.412783], [10.399703, 63.412778], [10.39968, 63.412773], [10.399551, 63.412762], [10.399508, 63.412765], [10.399328, 63.412776], [10.39906, 63.412773], [10.398804, 63.412783], [10.398776, 63.412777], [10.398481, 63.412722], [10.39807, 63.412695], [10.39776, 63.412681], [10.397643, 63.412686], [10.397423, 63.412664], [10.397109, 63.412631], [10.396883, 63.412609], [10.396853, 63.412604], [10.396538, 63.412576], [10.396192, 63.412556], [10.396027, 63.412547], [10.395962, 63.412545], [10.395889, 63.412539], [10.395565, 63.412511], [10.39524, 63.412488], [10.395175, 63.412485], [10.395011, 63.412476], [10.394889, 63.412473], [10.394508, 63.412445], [10.394161, 63.412415], [10.393763, 63.412388], [10.393726, 63.412387], [10.393387, 63.412375], [10.393327, 63.412371], [10.39307, 63.412335], [10.392937, 63.412325], [10.392823, 63.41232], [10.392429, 63.4123], [10.392287, 63.412284], [10.392252, 63.412282], [10.392076, 63.412269], [10.391983, 63.41226], [10.391696, 63.412238], [10.39164, 63.412231], [10.391314, 63.412211], [10.391255, 63.412207], [10.39113, 63.412195], [10.390985, 63.41219], [10.390921, 63.412185], [10.390707, 63.412153], [10.390666, 63.412147], [10.390483, 63.412129], [10.390397, 63.412126], [10.390002, 63.412092], [10.389593, 63.412058], [10.389559, 63.412054], [10.389307, 63.412023], [10.389118, 63.412004], [10.389043, 63.411994], [10.388775, 63.411964], [10.388427, 63.41193], [10.388385, 63.411927], [10.388209, 63.411907], [10.388114, 63.411894], [10.388045, 63.411884]];
const etappe_distance_array = [0, 3, 14, 22, 44, 54, 72, 88, 100, 102, 111, 113, 118, 130, 141, 149, 150, 162, 164, 180, 185, 193, 196, 198, 202, 206, 222, 225, 236, 244, 247, 257, 262, 265, 275, 280, 288, 290, 298, 303, 305, 319, 326, 332, 347, 350, 355, 368, 373, 381, 403, 404, 411, 415, 418, 425, 430, 451, 464, 477, 487, 491, 503, 518, 536, 557, 563, 574, 579, 592, 592, 594, 596, 607, 616, 630, 634, 654, 656, 661, 673, 688, 696, 703, 709, 721, 738, 756, 765, 774, 778, 784, 793, 804, 809, 820, 828, 845, 866, 867, 883, 894, 911, 924, 925, 931, 933, 937, 943, 945, 946, 951, 955, 976, 981, 993, 995, 1003, 1006, 1008, 1014, 1016, 1025, 1039, 1052, 1053, 1069, 1090, 1105, 1111, 1123, 1139, 1150, 1152, 1168, 1185, 1194, 1197, 1201, 1217, 1234, 1237, 1245, 1251, 1270, 1288, 1308, 1310, 1327, 1330, 1344, 1350, 1356, 1376, 1383, 1385, 1394, 1399, 1413, 1416, 1432, 1435, 1442, 1449, 1452, 1464, 1466, 1475, 1479, 1499, 1520, 1522, 1535, 1545, 1549, 1562, 1580, 1582, 1591, 1596, 1609];
const etappe_altitude_array = [34, 34, 33, 32, 29, 28, 26, 25, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23, 23, 25, 25, 24, 24, 24, 23, 23, 23, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 26, 26, 26, 26, 26, 26, 26, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 28, 28, 28, 28, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 26, 26, 26, 26, 26, 26, 26, 26, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26];

// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 13.9 : 13.5;


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
        center: (!isMobile) ? [10.398429, 63.417033] : [10.395414195139969, 63.41711939618651],
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

      createEtappe(6, etappe_coordinates, "#DC0000", "#C60000");

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
