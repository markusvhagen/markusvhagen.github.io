// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.400787, 63.438843], [10.400787, 63.43884], [10.400861, 63.438883], [10.400915, 63.438912], [10.401104, 63.439033], [10.401162, 63.439067], [10.401309, 63.439133], [10.401405, 63.439177], [10.40155, 63.439225], [10.401736, 63.43927], [10.40191, 63.439273], [10.402195, 63.43932], [10.402407, 63.439439], [10.402426, 63.439467], [10.402654, 63.439574], [10.402838, 63.439649], [10.402957, 63.439702], [10.403044, 63.439734], [10.403256, 63.439815], [10.403572, 63.439923], [10.403626, 63.439939], [10.40398, 63.439948], [10.404204, 63.43988], [10.404245, 63.439858], [10.404428, 63.439815], [10.404483, 63.439829], [10.404584, 63.439863], [10.404833, 63.43989], [10.404995, 63.439862], [10.405173, 63.439846], [10.405536, 63.439748], [10.405601, 63.439637], [10.405679, 63.439473], [10.405924, 63.439335], [10.405966, 63.439313], [10.406232, 63.439184], [10.406308, 63.439144], [10.406542, 63.439026], [10.406582, 63.439001], [10.406827, 63.438871], [10.406869, 63.43885], [10.407114, 63.438717], [10.407235, 63.438659], [10.407547, 63.438557], [10.407897, 63.438476], [10.407963, 63.438428], [10.408032, 63.43834], [10.408065, 63.438316], [10.408255, 63.438262], [10.408372, 63.438242], [10.408715, 63.438183], [10.408938, 63.438141], [10.409105, 63.438113], [10.409463, 63.438046], [10.409632, 63.438021], [10.409962, 63.437956], [10.410073, 63.437937], [10.410411, 63.437877], [10.410633, 63.437833], [10.410983, 63.437773], [10.411225, 63.437732], [10.4116, 63.437667], [10.411714, 63.437655], [10.412098, 63.437619], [10.41232, 63.437609], [10.412509, 63.437604], [10.412875, 63.437596], [10.413281, 63.437616], [10.41335, 63.43762], [10.413708, 63.437625], [10.413768, 63.437625], [10.414022, 63.43764], [10.414274, 63.437668], [10.414565, 63.43776], [10.414863, 63.437857], [10.414907, 63.437877], [10.41509, 63.438017], [10.415125, 63.438041], [10.415226, 63.438076], [10.415355, 63.438091], [10.415675, 63.438061], [10.416016, 63.437962], [10.416111, 63.437939], [10.416454, 63.437879], [10.416563, 63.437865], [10.416824, 63.437799], [10.4169, 63.437719], [10.417009, 63.437577], [10.417128, 63.437395], [10.41714, 63.43737], [10.417253, 63.437226], [10.417281, 63.437201], [10.417444, 63.437042], [10.417503, 63.436995], [10.417674, 63.436962], [10.417984, 63.436975], [10.418143, 63.436981], [10.418467, 63.436982], [10.418519, 63.436983], [10.418731, 63.436997], [10.418864, 63.437005], [10.418973, 63.437007], [10.419337, 63.437031], [10.41956, 63.437051], [10.419622, 63.437074], [10.419862, 63.4372], [10.419994, 63.437284], [10.420171, 63.437381], [10.420304, 63.437491], [10.420368, 63.437549], [10.42061, 63.437669], [10.420651, 63.43769], [10.420842, 63.437803], [10.420878, 63.437823], [10.420947, 63.437859], [10.421179, 63.437986], [10.42129, 63.438044], [10.421476, 63.438158], [10.421676, 63.438268], [10.421752, 63.438303], [10.421976, 63.438405], [10.422079, 63.43847], [10.422313, 63.43861], [10.422382, 63.438652], [10.422593, 63.438779], [10.422696, 63.438845], [10.422914, 63.438975], [10.423067, 63.439077], [10.423276, 63.439202], [10.423348, 63.439245], [10.423583, 63.439373], [10.42368, 63.439422], [10.423855, 63.43949], [10.423998, 63.439543], [10.424219, 63.439656], [10.424253, 63.439677], [10.424431, 63.439819], [10.424503, 63.439885], [10.424672, 63.44003], [10.424734, 63.440081], [10.424901, 63.440233], [10.424932, 63.440257], [10.425101, 63.440397], [10.425283, 63.440541], [10.425344, 63.440585], [10.425526, 63.440714], [10.425601, 63.440779], [10.425673, 63.440888], [10.425698, 63.440945], [10.425791, 63.441105], [10.425835, 63.441152], [10.425992, 63.441336], [10.42607, 63.441398], [10.426209, 63.441581], [10.426225, 63.441608], [10.426392, 63.44175], [10.42642, 63.44177], [10.426591, 63.441886], [10.426639, 63.44193], [10.426832, 63.442067], [10.426868, 63.44209], [10.426987, 63.442118], [10.427192, 63.442119], [10.427299, 63.442209], [10.42733, 63.442356], [10.427309, 63.442401], [10.427289, 63.442547], [10.427289, 63.442576], [10.427268, 63.442731], [10.427276, 63.442788], [10.427301, 63.442964], [10.427328, 63.443072], [10.42742, 63.443138], [10.427471, 63.443149], [10.427757, 63.443164], [10.428118, 63.443184], [10.428297, 63.443199], [10.42835, 63.443211], [10.428497, 63.443248], [10.428858, 63.443291], [10.428909, 63.443303], [10.429226, 63.443376], [10.429458, 63.443485], [10.429685, 63.443535], [10.429729, 63.443556], [10.430034, 63.443591], [10.430096, 63.443603], [10.43038, 63.443669], [10.430537, 63.443682], [10.43077, 63.443697], [10.430927, 63.443694], [10.431012, 63.443693], [10.431048, 63.443703], [10.431233, 63.443768], [10.431562, 63.443815], [10.431661, 63.443813], [10.431714, 63.44381], [10.43183, 63.443801], [10.431939, 63.443811], [10.432118, 63.443825], [10.432456, 63.443876], [10.432575, 63.443886], [10.432935, 63.44391], [10.433294, 63.443941], [10.433351, 63.443948], [10.433687, 63.443977], [10.43381, 63.443981], [10.434163, 63.443997], [10.434349, 63.443991], [10.434482, 63.443986], [10.434841, 63.443979], [10.434956, 63.443977], [10.435319, 63.443977], [10.435444, 63.443977], [10.435774, 63.443972], [10.435817, 63.443968], [10.435942, 63.44392], [10.43607, 63.443911], [10.436416, 63.443856], [10.436786, 63.443806], [10.437091, 63.443766], [10.437474, 63.443698], [10.437536, 63.443688], [10.437712, 63.443653], [10.437828, 63.443631], [10.437951, 63.44361], [10.438186, 63.44357], [10.438236, 63.443558], [10.438286, 63.443545], [10.438334, 63.443532], [10.438494, 63.443492], [10.438712, 63.443443], [10.438764, 63.443427], [10.438821, 63.443412], [10.438927, 63.443384], [10.438982, 63.44337], [10.439084, 63.443339], [10.439132, 63.443325], [10.439181, 63.443314], [10.439383, 63.443255], [10.439681, 63.443155], [10.439784, 63.443127], [10.43987, 63.443096]];
const etappe_distance_array = [0, 0, 6, 10, 27, 31, 42, 49, 58, 68, 77, 92, 109, 112, 129, 141, 149, 155, 169, 189, 192, 210, 223, 226, 237, 240, 246, 259, 268, 277, 298, 311, 329, 349, 352, 372, 378, 395, 399, 418, 421, 440, 449, 468, 488, 494, 505, 508, 519, 525, 543, 556, 564, 584, 593, 611, 617, 635, 647, 666, 679, 699, 704, 724, 735, 745, 763, 783, 787, 805, 808, 820, 833, 851, 870, 873, 891, 894, 900, 907, 923, 944, 949, 967, 973, 988, 998, 1014, 1036, 1038, 1055, 1059, 1078, 1084, 1093, 1109, 1117, 1133, 1136, 1146, 1153, 1158, 1177, 1188, 1192, 1211, 1222, 1236, 1250, 1257, 1275, 1278, 1294, 1297, 1302, 1321, 1329, 1345, 1361, 1366, 1382, 1391, 1410, 1416, 1434, 1443, 1461, 1475, 1492, 1498, 1517, 1524, 1535, 1545, 1561, 1564, 1582, 1591, 1609, 1615, 1634, 1637, 1655, 1673, 1679, 1696, 1704, 1717, 1724, 1742, 1748, 1770, 1778, 1799, 1802, 1820, 1823, 1838, 1844, 1862, 1865, 1872, 1882, 1893, 1910, 1915, 1931, 1934, 1952, 1958, 1978, 1990, 1998, 2001, 2016, 2034, 2043, 2046, 2054, 2073, 2076, 2094, 2110, 2123, 2126, 2142, 2145, 2161, 2169, 2181, 2189, 2193, 2195, 2207, 2224, 2229, 2232, 2238, 2243, 2252, 2270, 2276, 2294, 2312, 2315, 2332, 2339, 2356, 2366, 2372, 2390, 2396, 2414, 2420, 2437, 2439, 2447, 2454, 2472, 2491, 2507, 2528, 2531, 2541, 2547, 2553, 2566, 2569, 2572, 2575, 2584, 2596, 2599, 2602, 2608, 2612, 2618, 2621, 2623, 2635, 2654, 2660, 2665];
const etappe_altitude_array = [5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 10, 10, 10, 9, 9, 9, 8, 8, 8, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 6, 6, 6, 7, 7, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 6, 6, 7, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 11, 10, 10, 10, 10, 10, 10, 11, 11, 10, 11, 10, 11, 10, 11, 11, 10, 11, 10, 11, 10, 11, 10, 11, 12, 12, 12, 12];



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
        center: (!isMobile) ? [10.420696, 63.439945] : [10.419696, 63.439845],
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

      createEtappe(2, etappe_coordinates, "#DC0000", "#C60000");
      addTextOnMap(1, [10.400861, 63.438183], "Rockheim", 20);

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
