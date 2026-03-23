// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.397218, 63.425023], [10.397623, 63.425058], [10.398011, 63.425101], [10.398436, 63.425192], [10.398549, 63.425238], [10.398734, 63.425301], [10.399017, 63.425402], [10.399285, 63.425518], [10.399373, 63.425559], [10.399501, 63.42562], [10.399628, 63.425709], [10.399751, 63.425836], [10.399833, 63.425916], [10.400021, 63.426084], [10.400137, 63.426213], [10.400283, 63.426328], [10.400402, 63.426446], [10.400456, 63.426627], [10.400454, 63.426659], [10.400422, 63.426838], [10.400359, 63.426929], [10.400124, 63.427082], [10.400094, 63.427107], [10.399947, 63.427294], [10.400007, 63.427492], [10.400019, 63.427578], [10.40001, 63.427775], [10.399996, 63.427824], [10.400001, 63.427987], [10.400064, 63.428186], [10.400112, 63.428305], [10.400222, 63.428345], [10.400299, 63.428338], [10.400713, 63.428296], [10.400999, 63.428263], [10.401359, 63.428224], [10.401669, 63.428188], [10.402077, 63.428144], [10.402415, 63.428112], [10.402824, 63.428082], [10.402898, 63.428068], [10.403049, 63.42797], [10.403091, 63.427764], [10.403098, 63.427735], [10.403157, 63.427534], [10.403185, 63.427448], [10.403162, 63.427255], [10.403139, 63.427187], [10.403176, 63.426991], [10.403237, 63.426849], [10.40325, 63.426826], [10.403336, 63.426706], [10.403418, 63.42661], [10.403436, 63.426585], [10.403558, 63.426413], [10.403597, 63.42636], [10.403676, 63.426199], [10.403708, 63.42611], [10.403719, 63.425907], [10.403711, 63.425877], [10.403649, 63.425756], [10.403603, 63.425636], [10.403558, 63.425575], [10.403436, 63.425369], [10.403282, 63.425204], [10.40316, 63.425114], [10.40296, 63.424977], [10.402845, 63.424897], [10.402746, 63.424808], [10.402584, 63.424661], [10.402424, 63.424557], [10.402196, 63.424403], [10.402124, 63.424355], [10.401873, 63.424181], [10.401801, 63.424131], [10.401768, 63.424105], [10.401699, 63.424055], [10.401484, 63.4239], [10.401452, 63.42388], [10.401216, 63.423708], [10.401148, 63.423671], [10.401034, 63.423594], [10.400821, 63.42352], [10.400544, 63.423509], [10.400486, 63.423496], [10.400137, 63.423391], [10.400075, 63.423379], [10.399692, 63.423314], [10.399627, 63.423304], [10.399176, 63.423248], [10.399031, 63.423228], [10.398587, 63.423171], [10.398453, 63.423153], [10.398012, 63.423079], [10.397859, 63.423049], [10.397783, 63.423031], [10.397712, 63.423016], [10.397644, 63.423005], [10.397309, 63.423001], [10.397189, 63.423032], [10.397105, 63.423084], [10.396866, 63.423184], [10.396496, 63.423177], [10.396293, 63.423175], [10.395979, 63.423174], [10.395552, 63.423184], [10.395339, 63.423188], [10.395242, 63.423191], [10.394803, 63.423211], [10.394382, 63.423207], [10.393968, 63.423191], [10.393857, 63.423197], [10.393562, 63.423245], [10.393405, 63.423275], [10.392985, 63.423319], [10.392687, 63.423342], [10.392587, 63.423353], [10.392539, 63.423356], [10.392141, 63.423404], [10.392043, 63.423413], [10.391708, 63.423445], [10.391372, 63.423487], [10.391126, 63.423515], [10.390938, 63.423537], [10.390571, 63.423564], [10.390401, 63.423586], [10.39016, 63.423618], [10.390036, 63.423633], [10.389976, 63.423642], [10.389555, 63.423712], [10.38949, 63.423722], [10.389364, 63.423748], [10.389027, 63.423812], [10.388642, 63.423871], [10.388569, 63.423879], [10.388153, 63.423972], [10.388094, 63.423987], [10.387742, 63.424055], [10.387686, 63.424069], [10.387506, 63.42411], [10.387134, 63.424193], [10.386949, 63.424248], [10.386593, 63.424367], [10.386244, 63.424499], [10.386068, 63.424571], [10.385893, 63.424639], [10.385837, 63.424661], [10.385781, 63.424683], [10.385553, 63.424791], [10.38534, 63.424891], [10.385075, 63.425027], [10.385025, 63.425056], [10.384724, 63.425217], [10.384585, 63.425302], [10.384319, 63.425464], [10.38414, 63.42556], [10.383829, 63.425706], [10.383712, 63.425782], [10.383464, 63.425926], [10.383221, 63.426082], [10.383182, 63.426109], [10.382911, 63.426264], [10.382669, 63.4264], [10.382377, 63.426554], [10.382053, 63.426705], [10.381831, 63.426797], [10.381576, 63.426894], [10.381442, 63.426939], [10.381316, 63.426989], [10.38113, 63.427067], [10.381007, 63.427116], [10.38067, 63.427268], [10.380547, 63.427315], [10.380199, 63.427455], [10.379943, 63.427543]];
const etappe_distance_array = [0, 20, 40, 64, 71, 83, 101, 119, 126, 135, 147, 162, 172, 193, 209, 223, 238, 258, 262, 282, 292, 313, 316, 338, 361, 370, 392, 398, 416, 438, 452, 459, 463, 484, 499, 517, 533, 554, 571, 592, 596, 609, 632, 636, 658, 668, 689, 697, 719, 735, 738, 752, 763, 766, 786, 793, 811, 821, 844, 847, 861, 874, 882, 905, 925, 937, 955, 966, 977, 995, 1009, 1030, 1036, 1059, 1066, 1069, 1076, 1096, 1099, 1122, 1127, 1137, 1151, 1165, 1168, 1189, 1192, 1213, 1216, 1239, 1247, 1270, 1277, 1301, 1309, 1313, 1317, 1321, 1337, 1344, 1352, 1368, 1386, 1396, 1412, 1434, 1444, 1449, 1471, 1492, 1513, 1518, 1534, 1543, 1564, 1579, 1584, 1587, 1607, 1612, 1630, 1647, 1660, 1669, 1688, 1697, 1709, 1716, 1719, 1741, 1745, 1752, 1770, 1790, 1794, 1817, 1821, 1840, 1843, 1853, 1874, 1885, 1907, 1930, 1942, 1953, 1957, 1961, 1977, 1993, 2013, 2017, 2040, 2052, 2074, 2088, 2111, 2121, 2141, 2163, 2166, 2188, 2208, 2230, 2253, 2269, 2285, 2294, 2302, 2315, 2323, 2347, 2355, 2378, 2394]
;
const etappe_altitude_array = [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 7, 7, 6, 5, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 10, 10, 12, 12, 13, 14, 13, 13, 12, 11, 11, 10, 9, 9, 9, 8, 7, 6, 6, 6, 6, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3]
;


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 14.5 : 13.0;


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
        center: (!isMobile) ? [10.393509657704687, 63.425758136007026] : [10.393509657704687, 63.425758136007026],
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
            'text-field': "Mål",
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
