// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.359024, 63.420485], [10.359008, 63.420499], [10.359002, 63.420519], [10.359005, 63.420596], [10.359019, 63.420677], [10.359025, 63.420735], [10.359029, 63.420942], [10.359024, 63.420971], [10.359036, 63.421132], [10.359048, 63.421259], [10.359045, 63.421385], [10.359053, 63.421483], [10.359052, 63.421517], [10.35902, 63.421665], [10.359012, 63.421866], [10.359028, 63.421925], [10.35904, 63.421938], [10.359038, 63.421939], [10.359036, 63.421941], [10.359039, 63.421944], [10.359039, 63.421944], [10.359036, 63.421969], [10.359048, 63.422057], [10.358987, 63.422162], [10.358984, 63.422338], [10.359138, 63.422519], [10.359215, 63.422617], [10.359363, 63.422787], [10.359418, 63.422844], [10.359449, 63.422876], [10.359633, 63.423051], [10.359701, 63.423137], [10.359885, 63.423332], [10.359993, 63.42345], [10.360104, 63.423567], [10.360309, 63.423751], [10.360355, 63.423788], [10.360568, 63.423978], [10.360726, 63.424132], [10.360871, 63.424179], [10.361043, 63.424201], [10.361131, 63.424205], [10.361578, 63.424191], [10.362016, 63.424161], [10.362266, 63.424137], [10.362481, 63.424121], [10.362603, 63.424115], [10.362605, 63.424116], [10.362757, 63.424102], [10.363076, 63.424066], [10.363487, 63.424022], [10.363661, 63.424006], [10.364033, 63.423937], [10.364094, 63.423923], [10.364356, 63.42389], [10.364419, 63.423881], [10.364817, 63.423833], [10.365222, 63.423788], [10.36568, 63.42374], [10.365838, 63.423715], [10.366239, 63.423647], [10.366623, 63.423576], [10.366779, 63.423546], [10.367137, 63.423459], [10.367349, 63.423401], [10.367651, 63.42328], [10.367817, 63.423193], [10.368023, 63.423022], [10.368071, 63.422945], [10.368191, 63.422751], [10.368294, 63.42261], [10.368419, 63.422449], [10.368487, 63.422349], [10.368533, 63.422289], [10.368726, 63.422182], [10.368851, 63.422131], [10.369033, 63.42205], [10.369275, 63.42201], [10.369345, 63.422036], [10.369379, 63.422078], [10.369327, 63.422233], [10.369329, 63.422285], [10.369391, 63.422325], [10.369435, 63.422339], [10.369533, 63.422337], [10.36984, 63.422213], [10.369877, 63.422194], [10.369946, 63.422155], [10.370127, 63.422062], [10.370268, 63.422041], [10.370337, 63.42206], [10.37034, 63.422149], [10.370262, 63.422248], [10.370243, 63.422273], [10.370184, 63.422342], [10.370064, 63.422548], [10.370055, 63.422587], [10.369977, 63.422759], [10.36997, 63.422781], [10.369843, 63.422932], [10.369791, 63.422981], [10.369751, 63.423035], [10.369732, 63.42307], [10.369717, 63.423088], [10.369672, 63.42314], [10.369571, 63.423282], [10.369426, 63.423458], [10.36941, 63.423479], [10.369333, 63.423575], [10.369266, 63.423661], [10.3692, 63.423759], [10.369049, 63.423951], [10.368973, 63.424021], [10.368653, 63.424162], [10.368295, 63.424258], [10.368193, 63.424302], [10.3681, 63.424354], [10.367975, 63.424427], [10.367912, 63.424476], [10.367893, 63.424501], [10.367878, 63.424526], [10.367878, 63.424576], [10.367938, 63.424634], [10.367987, 63.424663], [10.368198, 63.424783], [10.368149, 63.424912], [10.367928, 63.425081], [10.367901, 63.425111], [10.367647, 63.42529], [10.36751, 63.425344], [10.367199, 63.425506], [10.367091, 63.425568], [10.366811, 63.425754], [10.366673, 63.425822], [10.366295, 63.42595], [10.366219, 63.425969], [10.365855, 63.426052], [10.365638, 63.426096], [10.365277, 63.426174], [10.364942, 63.426266], [10.364659, 63.426412], [10.364627, 63.426438], [10.364497, 63.42662], [10.364455, 63.426719], [10.3644, 63.426925], [10.36437, 63.42706], [10.364214, 63.427232], [10.364171, 63.427259], [10.363949, 63.427396], [10.363794, 63.427511], [10.363759, 63.427536], [10.363505, 63.427708], [10.363407, 63.427777], [10.363354, 63.427847], [10.363403, 63.427885], [10.363631, 63.427915], [10.363959, 63.42792], [10.364409, 63.427924], [10.364834, 63.427919], [10.365238, 63.427922], [10.365651, 63.427948], [10.365765, 63.427971], [10.365968, 63.428055], [10.366052, 63.428043], [10.366079, 63.428025], [10.366148, 63.427969], [10.366183, 63.427959], [10.366284, 63.427957], [10.366602, 63.427976], [10.366662, 63.427976], [10.366951, 63.427909], [10.367035, 63.42783], [10.367026, 63.427805], [10.366993, 63.427786], [10.366878, 63.427767], [10.366734, 63.427809], [10.366712, 63.427864], [10.366777, 63.427915], [10.367671, 63.428059], [10.367583, 63.428178], [10.367779, 63.428265], [10.368154, 63.428356], [10.368237, 63.428377], [10.3686, 63.428468], [10.36894, 63.428548], [10.369358, 63.428653], [10.369751, 63.428756], [10.369905, 63.428802], [10.370287, 63.428893], [10.370671, 63.428965], [10.371048, 63.429012], [10.371088, 63.429014], [10.371137, 63.429022], [10.371504, 63.429072], [10.371733, 63.429122], [10.37197, 63.429194], [10.372284, 63.429334], [10.372333, 63.429363], [10.372487, 63.429461], [10.372599, 63.429524], [10.372943, 63.429669], [10.37311, 63.429705], [10.373532, 63.429772], [10.373772, 63.429819], [10.374078, 63.429901], [10.374158, 63.42992], [10.374391, 63.429982], [10.374807, 63.430083], [10.3749, 63.430099], [10.375078, 63.430122], [10.375429, 63.43015], [10.375912, 63.430162], [10.375996, 63.43016], [10.376258, 63.430159], [10.376528, 63.430155], [10.37678, 63.430156], [10.377185, 63.430153], [10.377435, 63.430137], [10.377495, 63.430113], [10.377538, 63.43006], [10.377555, 63.429898], [10.37762, 63.429787], [10.377674, 63.429772], [10.37803, 63.429749], [10.378464, 63.429738], [10.378554, 63.429735], [10.378992, 63.429692], [10.379237, 63.429662], [10.379637, 63.4296], [10.379779, 63.429562], [10.380138, 63.429423], [10.38019, 63.429398], [10.380585, 63.429304], [10.381004, 63.42928], [10.381336, 63.429241], [10.381725, 63.429173], [10.381995, 63.429095], [10.382349, 63.428998], [10.382545, 63.428934], [10.382874, 63.428826], [10.383239, 63.428708], [10.383624, 63.428642], [10.383785, 63.428622], [10.384189, 63.428561], [10.384604, 63.428507], [10.38502, 63.428446]];
const etappe_distance_array = [0, 1, 4, 12, 21, 28, 51, 54, 72, 86, 100, 111, 115, 131, 154, 160, 162, 162, 162, 163, 163, 166, 175, 187, 207, 229, 240, 261, 268, 271, 293, 303, 327, 341, 355, 378, 383, 406, 425, 434, 443, 448, 470, 492, 505, 516, 522, 522, 530, 546, 567, 576, 596, 600, 613, 617, 637, 658, 682, 690, 711, 732, 741, 761, 773, 794, 806, 828, 837, 859, 876, 895, 907, 914, 929, 937, 950, 963, 968, 973, 990, 996, 1001, 1004, 1009, 1030, 1032, 1038, 1052, 1059, 1063, 1073, 1085, 1088, 1096, 1120, 1124, 1144, 1146, 1164, 1170, 1176, 1180, 1183, 1189, 1205, 1226, 1229, 1240, 1250, 1262, 1284, 1293, 1315, 1336, 1343, 1351, 1361, 1367, 1370, 1373, 1379, 1386, 1390, 1407, 1422, 1443, 1447, 1471, 1480, 1504, 1512, 1537, 1548, 1571, 1576, 1596, 1608, 1628, 1648, 1669, 1672, 1694, 1705, 1728, 1743, 1764, 1768, 1786, 1801, 1805, 1828, 1837, 1845, 1850, 1862, 1878, 1901, 1922, 1942, 1963, 1969, 1983, 1987, 1990, 1997, 1999, 2004, 2020, 2023, 2039, 2049, 2052, 2055, 2061, 2069, 2075, 2082, 2129, 2143, 2157, 2178, 2183, 2204, 2223, 2247, 2270, 2279, 2301, 2321, 2341, 2343, 2346, 2365, 2377, 2392, 2414, 2418, 2431, 2440, 2464, 2473, 2495, 2509, 2526, 2531, 2544, 2568, 2573, 2582, 2600, 2624, 2628, 2642, 2655, 2668, 2688, 2700, 2704, 2711, 2729, 2742, 2745, 2763, 2784, 2789, 2811, 2824, 2845, 2853, 2877, 2881, 2903, 2924, 2941, 2962, 2978, 2999, 3011, 3032, 3054, 3075, 3083, 3104, 3126, 3148];
const etappe_altitude_array = [147, 147, 147, 147, 146, 145, 143, 143, 141, 140, 139, 138, 138, 137, 136, 135, 135, 135, 135, 135, 135, 135, 134, 133, 132, 132, 132, 132, 132, 132, 131, 130, 129, 128, 127, 125, 125, 123, 121, 121, 120, 120, 119, 119, 118, 118, 118, 118, 118, 117, 117, 116, 116, 116, 115, 115, 114, 114, 113, 112, 111, 110, 109, 108, 108, 107, 107, 106, 105, 105, 104, 104, 104, 104, 104, 102, 100, 98, 97, 96, 94, 93, 92, 92, 91, 89, 89, 88, 86, 85, 85, 83, 82, 81, 80, 77, 77, 78, 78, 80, 80, 80, 81, 81, 81, 82, 84, 84, 84, 85, 85, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 85, 85, 84, 84, 84, 84, 83, 82, 81, 80, 77, 77, 76, 76, 75, 74, 72, 70, 67, 66, 64, 62, 59, 57, 54, 54, 52, 50, 50, 47, 46, 45, 45, 43, 40, 36, 33, 31, 28, 26, 25, 25, 25, 24, 24, 24, 22, 22, 20, 20, 19, 19, 19, 18, 17, 16, 16, 16, 16, 16, 16, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12, 12, 11, 11, 11, 12, 11, 11, 11, 11, 11, 11, 11, 10, 11, 11, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11];


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 13.8 : 12.8;


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
        center: (!isMobile) ? [10.37057546666082, 63.42598660920019] : [10.37057546666082, 63.42598660920019],
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

      createEtappe(8, etappe_coordinates, "#DC0000", "#C60000");

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
