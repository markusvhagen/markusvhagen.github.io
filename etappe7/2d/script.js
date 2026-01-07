// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.387108, 63.411798], [10.386719, 63.411726], [10.386475, 63.411675], [10.386115, 63.411572], [10.385774, 63.411447], [10.385434, 63.411316], [10.385308, 63.411303], [10.385246, 63.411313], [10.385149, 63.411361], [10.384868, 63.411522], [10.3847, 63.411588], [10.384488, 63.411704], [10.384406, 63.411765], [10.384345, 63.411831], [10.384272, 63.411981], [10.384158, 63.412162], [10.384098, 63.412188], [10.383686, 63.412236], [10.383446, 63.412239], [10.383398, 63.412218], [10.383354, 63.412078], [10.38336, 63.411943], [10.38334, 63.411738], [10.383343, 63.41171], [10.383314, 63.411496], [10.383298, 63.411418], [10.38327, 63.41131], [10.383221, 63.411102], [10.383206, 63.411037], [10.383192, 63.410943], [10.383184, 63.410881], [10.38315, 63.410822], [10.383062, 63.41078], [10.382993, 63.410774], [10.382597, 63.410786], [10.38252, 63.410788], [10.382111, 63.410806], [10.38166, 63.410837], [10.381387, 63.410874], [10.381346, 63.410883], [10.381131, 63.410955], [10.381038, 63.411001], [10.380904, 63.411084], [10.38086, 63.411133], [10.380805, 63.411225], [10.380799, 63.411243], [10.380791, 63.411261], [10.380747, 63.411342], [10.380695, 63.411424], [10.380674, 63.411456], [10.380596, 63.411534], [10.380528, 63.411577], [10.380232, 63.411705], [10.379854, 63.411779], [10.379484, 63.411787], [10.379409, 63.411789], [10.379373, 63.41179], [10.379189, 63.41179], [10.379014, 63.41179], [10.378977, 63.411789], [10.37873, 63.411781], [10.378454, 63.411761], [10.378279, 63.411745], [10.378096, 63.411738], [10.377805, 63.411728], [10.377414, 63.411757], [10.377211, 63.411803], [10.377158, 63.411828], [10.376839, 63.411952], [10.376839, 63.411952], [10.376839, 63.411952], [10.376468, 63.412091], [10.376441, 63.412124], [10.376418, 63.412181], [10.376251, 63.412277], [10.376205, 63.412286], [10.376164, 63.412296], [10.376139, 63.412313], [10.37611, 63.412372], [10.375988, 63.412452], [10.375699, 63.412576], [10.375383, 63.412638], [10.375156, 63.412672], [10.374829, 63.412715], [10.374713, 63.412734], [10.37431, 63.412778], [10.374267, 63.412778], [10.373848, 63.412775], [10.37372, 63.41277], [10.373301, 63.412746], [10.373006, 63.412771], [10.372629, 63.412862], [10.372419, 63.412961], [10.372187, 63.413104], [10.372059, 63.413219], [10.371985, 63.413285], [10.371849, 63.413394], [10.371668, 63.413555], [10.371649, 63.413572], [10.371534, 63.413668], [10.371471, 63.413731], [10.371261, 63.41387], [10.371206, 63.413898], [10.370916, 63.414025], [10.370884, 63.414036], [10.370551, 63.414138], [10.370409, 63.414174], [10.370213, 63.414212], [10.370057, 63.414247], [10.369889, 63.414277], [10.369682, 63.414319], [10.369315, 63.414393], [10.369232, 63.41441], [10.369109, 63.414435], [10.368775, 63.414508], [10.368566, 63.414549], [10.368387, 63.41458], [10.368248, 63.414597], [10.367861, 63.414687], [10.367648, 63.414773], [10.367406, 63.414898], [10.367406, 63.414898], [10.367406, 63.414898], [10.367099, 63.415175], [10.367099, 63.415175], [10.36738, 63.415225], [10.367341, 63.415184], [10.367121, 63.415097], [10.367048, 63.415069], [10.366692, 63.414969], [10.36642, 63.414993], [10.366025, 63.415085], [10.365991, 63.415098], [10.365713, 63.415158], [10.365617, 63.415171], [10.365445, 63.415204], [10.365191, 63.415254], [10.364824, 63.41533], [10.364711, 63.415359], [10.364669, 63.415366], [10.364628, 63.415372], [10.36459, 63.41538], [10.364335, 63.415455], [10.363947, 63.415543], [10.363533, 63.415609], [10.363456, 63.415624], [10.363133, 63.415693], [10.363092, 63.415701], [10.362944, 63.415735], [10.362862, 63.415751], [10.362694, 63.415789], [10.362349, 63.41587], [10.36197, 63.415964], [10.361868, 63.415987], [10.361765, 63.41601], [10.36155, 63.41606], [10.361443, 63.416082], [10.361385, 63.416091], [10.361048, 63.416157], [10.360769, 63.416212], [10.360377, 63.4163], [10.360149, 63.41635], [10.359749, 63.416443], [10.359687, 63.416455], [10.359624, 63.416467], [10.359245, 63.416544], [10.358882, 63.416624], [10.35865, 63.416675], [10.358591, 63.416688], [10.35824, 63.416759], [10.358186, 63.416771], [10.357971, 63.416823], [10.357751, 63.41687], [10.357535, 63.416917], [10.357262, 63.416986], [10.357216, 63.417003], [10.356873, 63.417106], [10.356764, 63.417123], [10.356353, 63.41718], [10.356115, 63.417218], [10.355712, 63.417308], [10.355376, 63.417396], [10.355358, 63.417422], [10.355377, 63.417555], [10.355371, 63.417593], [10.355362, 63.417677], [10.355359, 63.417839], [10.355344, 63.417897], [10.355269, 63.418007], [10.355214, 63.418086], [10.355203, 63.418122], [10.355196, 63.418163], [10.355193, 63.418187], [10.355202, 63.418273], [10.355236, 63.418363], [10.355321, 63.418505], [10.355383, 63.41865], [10.3554, 63.418668], [10.355508, 63.41872], [10.355539, 63.418718], [10.355653, 63.41868], [10.355681, 63.418667], [10.355778, 63.418561], [10.355757, 63.418524], [10.355719, 63.418473], [10.355679, 63.418295], [10.355794, 63.418132], [10.356091, 63.418007], [10.356544, 63.418004], [10.356863, 63.418094], [10.357058, 63.418262], [10.357235, 63.418421], [10.357463, 63.418614], [10.357559, 63.418705], [10.357598, 63.41874], [10.357703, 63.418828], [10.357932, 63.41899], [10.357969, 63.419005], [10.358045, 63.419075], [10.358098, 63.419147], [10.358146, 63.419217], [10.358267, 63.419293], [10.358321, 63.41931], [10.358647, 63.419343], [10.358753, 63.419336], [10.358804, 63.419343], [10.358904, 63.41938], [10.358965, 63.419494], [10.358814, 63.419643], [10.358517, 63.419808], [10.358422, 63.419867], [10.358231, 63.420009], [10.358037, 63.42012], [10.357928, 63.420157], [10.357576, 63.420257], [10.357418, 63.420296], [10.357046, 63.420398], [10.356923, 63.420483], [10.356931, 63.420518]];
const etappe_distance_array = [0, 21, 34, 55, 77, 100, 106, 109, 117, 139, 151, 167, 175, 183, 200, 221, 225, 247, 259, 262, 278, 293, 316, 319, 343, 352, 364, 387, 394, 405, 412, 418, 425, 428, 448, 452, 473, 495, 510, 512, 525, 532, 544, 550, 560, 562, 564, 574, 583, 587, 596, 602, 623, 643, 662, 666, 667, 677, 685, 687, 700, 714, 722, 732, 746, 766, 777, 781, 802, 802, 802, 826, 830, 837, 850, 853, 855, 858, 864, 875, 895, 912, 924, 941, 947, 968, 970, 991, 998, 1019, 1034, 1055, 1070, 1090, 1104, 1113, 1127, 1147, 1149, 1161, 1169, 1187, 1191, 1212, 1214, 1234, 1242, 1253, 1261, 1270, 1282, 1302, 1306, 1313, 1332, 1343, 1353, 1360, 1382, 1396, 1415, 1415, 1415, 1449, 1449, 1464, 1469, 1484, 1489, 1510, 1523, 1546, 1548, 1563, 1568, 1578, 1591, 1612, 1618, 1620, 1623, 1625, 1640, 1662, 1684, 1688, 1706, 1708, 1716, 1721, 1730, 1749, 1771, 1777, 1783, 1795, 1801, 1804, 1822, 1837, 1859, 1872, 1894, 1898, 1901, 1922, 1942, 1955, 1958, 1978, 1981, 1993, 2005, 2017, 2033, 2036, 2056, 2062, 2083, 2096, 2119, 2138, 2141, 2156, 2160, 2169, 2188, 2194, 2207, 2216, 2220, 2225, 2227, 2237, 2247, 2264, 2280, 2282, 2290, 2292, 2299, 2301, 2314, 2318, 2324, 2344, 2363, 2383, 2406, 2425, 2446, 2466, 2490, 2501, 2505, 2517, 2538, 2540, 2549, 2558, 2566, 2576, 2579, 2596, 2601, 2604, 2611, 2624, 2642, 2666, 2674, 2692, 2708, 2715, 2736, 2745, 2766, 2778, 2782];
const etappe_altitude_array = [26, 26, 26, 25, 24, 24, 23, 23, 23, 23, 23, 23, 23, 22, 22, 21, 21, 21, 21, 21, 22, 22, 24, 24, 26, 26, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 31, 31, 32, 33, 34, 34, 35, 35, 36, 37, 37, 38, 40, 41, 43, 44, 44, 45, 45, 46, 47, 48, 49, 50, 52, 54, 55, 55, 58, 58, 58, 60, 60, 61, 62, 62, 62, 62, 63, 63, 64, 64, 65, 67, 67, 69, 70, 72, 72, 75, 76, 79, 80, 82, 84, 85, 86, 88, 89, 90, 91, 92, 92, 94, 94, 96, 97, 98, 99, 99, 100, 101, 102, 102, 104, 104, 105, 106, 107, 108, 109, 109, 109, 109, 109, 109, 109, 109, 109, 112, 112, 114, 114, 115, 116, 117, 118, 120, 121, 121, 121, 121, 122, 124, 126, 126, 127, 127, 128, 128, 128, 129, 130, 130, 130, 131, 131, 131, 132, 132, 133, 134, 134, 134, 135, 135, 136, 136, 136, 137, 137, 138, 138, 139, 140, 140, 141, 141, 142, 143, 144, 145, 145, 147, 148, 149, 151, 151, 152, 152, 153, 153, 153, 153, 154, 155, 156, 156, 157, 157, 159, 159, 160, 160, 160, 160, 160, 159, 159, 159, 158, 155, 154, 155, 156, 157, 158, 158, 158, 158, 158, 159, 159, 158, 158, 158, 157, 156, 154, 153, 152, 148, 146, 145, 143, 141, 138, 136, 136];


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 13.8 : 12.4;


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
        center: (!isMobile) ? [10.370805, 63.415728] : [10.370805, 63.415728],
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

      createEtappe(7, etappe_coordinates, "#DC0000", "#C60000");
      addTextOnMap(1, [10.388127959823663, 63.410957457207786], "Regnbueparken", 17);
      addTextOnMap(2, [10.35207921325494, 63.41924995646226], "Sverresborg Folkemuseum", 17);
      addTextOnMap(3, [10.363467072730773, 63.41514765433271], "Breidablikveien", 17, 25);

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
    // Let us also change the current distance.
    map.setLayoutProperty("my-circle", "text-field", etappe_distance_array[index] + "m")

  });
}
