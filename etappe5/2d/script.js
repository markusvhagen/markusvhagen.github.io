// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.411554, 63.42804], [10.411506, 63.427998], [10.411416, 63.427982], [10.411206, 63.427976], [10.41107, 63.427976], [10.411049, 63.42798], [10.410874, 63.427974], [10.410532, 63.427984], [10.410099, 63.427957], [10.410048, 63.427942], [10.409915, 63.42787], [10.409738, 63.42771], [10.409732, 63.427535], [10.409736, 63.427497], [10.40971, 63.4273], [10.409702, 63.427271], [10.409633, 63.427083], [10.40964, 63.426926], [10.409745, 63.426747], [10.409913, 63.426566], [10.409986, 63.426482], [10.410134, 63.426314], [10.410157, 63.426297], [10.410381, 63.426198], [10.410716, 63.426098], [10.410875, 63.426062], [10.411261, 63.425961], [10.411365, 63.425934], [10.411713, 63.425802], [10.411759, 63.425775], [10.411931, 63.425659], [10.411969, 63.425628], [10.412024, 63.425563], [10.412085, 63.425462], [10.412184, 63.425239], [10.412217, 63.425189], [10.412438, 63.425004], [10.412627, 63.424871], [10.412754, 63.424756], [10.412773, 63.424725], [10.412683, 63.424627], [10.412525, 63.424574], [10.412326, 63.424521], [10.41202, 63.42439], [10.411964, 63.424346], [10.411911, 63.424297], [10.411729, 63.424095], [10.41164, 63.423982], [10.411609, 63.423922], [10.411597, 63.423811], [10.411624, 63.423764], [10.41165, 63.423721], [10.411718, 63.423621], [10.411852, 63.423428], [10.4119, 63.423371], [10.412058, 63.423195], [10.412097, 63.423128], [10.412013, 63.42296], [10.411709, 63.422891], [10.411343, 63.422775], [10.411004, 63.422667], [10.41067, 63.422547], [10.410326, 63.422425], [10.410258, 63.422402], [10.409929, 63.422293], [10.409606, 63.422173], [10.409483, 63.422127], [10.40915, 63.422021], [10.40903, 63.421978], [10.408785, 63.421888], [10.408471, 63.421775], [10.408413, 63.421755], [10.408045, 63.421617], [10.407735, 63.421502], [10.407679, 63.421476], [10.40732, 63.42134], [10.407074, 63.421245], [10.406756, 63.421127], [10.406436, 63.421007], [10.406292, 63.420964], [10.405917, 63.420843], [10.405715, 63.420771], [10.40564, 63.420746], [10.405496, 63.420696], [10.405132, 63.420552], [10.404782, 63.42042], [10.40464, 63.420368], [10.404274, 63.420244], [10.40396, 63.420142], [10.403789, 63.420081], [10.403552, 63.420004], [10.40349, 63.419984], [10.403173, 63.419871], [10.402983, 63.41984], [10.402579, 63.419836], [10.402505, 63.41984], [10.402135, 63.419909], [10.401957, 63.419931], [10.401863, 63.419942], [10.40161, 63.419972], [10.401354, 63.420019], [10.401174, 63.420052], [10.401117, 63.42011], [10.400946, 63.420302], [10.400914, 63.420334], [10.400755, 63.420499], [10.40057, 63.420687], [10.400495, 63.420756], [10.400383, 63.420864], [10.400124, 63.421026], [10.399873, 63.421141], [10.399851, 63.421154], [10.399713, 63.421206], [10.39953, 63.421293], [10.399211, 63.421417], [10.39907, 63.421455], [10.399066, 63.421454], [10.39904, 63.421452], [10.39903, 63.421449], [10.399025, 63.42145], [10.399025, 63.42145], [10.399024, 63.42145], [10.39902, 63.42145], [10.399016, 63.421451], [10.399011, 63.421451], [10.399009, 63.42145], [10.398854, 63.42144], [10.39875, 63.421389]];
const etappe_distance_array = [0, 5, 10, 20, 27, 28, 37, 54, 76, 79, 89, 109, 129, 133, 155, 158, 179, 197, 217, 239, 249, 270, 272, 287, 308, 316, 339, 345, 368, 371, 387, 391, 399, 410, 436, 441, 465, 482, 497, 500, 512, 522, 533, 555, 560, 566, 591, 604, 611, 623, 629, 634, 645, 668, 675, 696, 703, 723, 740, 762, 783, 804, 826, 830, 851, 872, 880, 900, 908, 924, 944, 947, 971, 991, 995, 1019, 1035, 1056, 1077, 1085, 1108, 1121, 1126, 1135, 1159, 1182, 1191, 1214, 1234, 1244, 1259, 1263, 1283, 1293, 1313, 1317, 1337, 1346, 1351, 1364, 1378, 1388, 1395, 1418, 1422, 1442, 1465, 1473, 1487, 1509, 1527, 1529, 1538, 1551, 1572, 1580, 1580, 1582, 1582, 1583, 1583, 1583, 1583, 1583, 1583, 1583, 1591, 1599];
const etappe_altitude_array = [56, 56, 56, 56, 56, 56, 55, 54, 53, 53, 52, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52, 53, 54, 54, 54, 54, 54, 54, 54, 54, 52, 52, 50, 50, 50, 50, 49, 48, 48, 46, 46, 45, 43, 43, 43, 43, 43, 43, 44, 45, 45, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 45, 45, 45, 45, 45, 45, 45, 44, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 44, 44, 43, 42, 41, 40, 40, 38, 37, 36, 34, 33, 32, 30, 28, 28, 27, 26, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];


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
        center: (!isMobile) ? [10.404445919101388, 63.42401917076102] : [10.404445919101388, 63.42401917076102],
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

      createEtappe(5, etappe_coordinates, "#DC0000", "#C60000");

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
