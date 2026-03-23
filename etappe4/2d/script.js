// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates = [[10.448842, 63.438246], [10.448782, 63.438054], [10.448757, 63.438014], [10.448699, 63.437935], [10.448687, 63.437917], [10.448582, 63.437802], [10.448579, 63.437801], [10.44855, 63.437791], [10.44855, 63.437792], [10.448548, 63.437791], [10.448548, 63.437792], [10.448548, 63.437792], [10.448548, 63.437795], [10.448547, 63.437796], [10.448546, 63.437796], [10.448546, 63.437796], [10.448439, 63.437784], [10.448387, 63.43777], [10.448003, 63.437656], [10.447942, 63.437647], [10.447599, 63.437622], [10.447415, 63.437609], [10.447158, 63.437607], [10.446788, 63.437625], [10.446438, 63.437649], [10.446256, 63.437668], [10.445849, 63.437684], [10.445408, 63.437712], [10.445297, 63.437719], [10.444866, 63.43775], [10.444426, 63.437785], [10.444314, 63.437794], [10.443874, 63.437817], [10.443559, 63.437839], [10.443358, 63.437846], [10.443115, 63.437855], [10.443027, 63.437837], [10.443001, 63.437819], [10.442907, 63.437737], [10.442851, 63.437735], [10.442407, 63.437777], [10.441956, 63.43779], [10.441753, 63.437784], [10.441307, 63.43776], [10.440971, 63.43773], [10.440539, 63.437681], [10.440145, 63.437618], [10.440053, 63.437598], [10.439677, 63.43752], [10.439236, 63.43742], [10.439085, 63.437373], [10.438703, 63.437291], [10.438402, 63.437234], [10.43818, 63.437206], [10.437968, 63.437191], [10.437843, 63.437172], [10.437743, 63.437142], [10.437739, 63.437135], [10.437722, 63.437124], [10.437705, 63.437096], [10.437718, 63.437059], [10.437695, 63.437031], [10.437591, 63.436977], [10.437344, 63.436873], [10.437141, 63.436773], [10.437051, 63.436727], [10.436936, 63.436672], [10.436872, 63.436645], [10.436842, 63.43663], [10.436774, 63.436604], [10.436623, 63.436551], [10.436543, 63.436525], [10.436503, 63.436509], [10.436339, 63.436464], [10.436289, 63.436455], [10.435907, 63.436414], [10.435499, 63.436374], [10.43543, 63.436363], [10.435298, 63.436341], [10.435172, 63.436284], [10.435093, 63.436189], [10.434991, 63.436076], [10.434837, 63.435903], [10.434683, 63.435777], [10.434658, 63.435761], [10.434386, 63.435614], [10.434313, 63.435585], [10.434011, 63.435441], [10.43398, 63.435426], [10.433715, 63.43529], [10.433573, 63.435226], [10.433538, 63.435209], [10.433463, 63.435178], [10.433423, 63.435162], [10.433117, 63.435035], [10.433025, 63.435004], [10.432704, 63.43487], [10.432517, 63.434798], [10.432157, 63.43467], [10.431841, 63.434536], [10.431497, 63.434398], [10.431442, 63.434373], [10.431111, 63.434251], [10.430938, 63.43419], [10.430548, 63.434078], [10.430275, 63.434024], [10.429837, 63.433968], [10.429661, 63.433926], [10.429599, 63.433841], [10.429592, 63.433746], [10.429588, 63.433707], [10.429589, 63.433682], [10.42959, 63.433659], [10.429586, 63.433551], [10.429582, 63.433532], [10.429578, 63.43349], [10.429543, 63.433382], [10.429515, 63.433351], [10.429505, 63.433334], [10.42941, 63.433181], [10.429374, 63.433121], [10.429241, 63.432947], [10.429192, 63.432888], [10.429073, 63.432723], [10.429043, 63.432683], [10.428994, 63.432624], [10.428939, 63.432567], [10.428882, 63.432512], [10.428714, 63.432331], [10.428589, 63.432167], [10.428431, 63.43204], [10.428117, 63.431947], [10.427935, 63.431907], [10.427918, 63.43191], [10.427913, 63.43191], [10.42777, 63.431844], [10.427626, 63.431796], [10.427434, 63.431748], [10.427409, 63.431747], [10.427415, 63.43175], [10.427283, 63.431704], [10.42696, 63.431578], [10.426671, 63.431444], [10.426586, 63.431403], [10.426559, 63.431381], [10.42656, 63.431383], [10.42656, 63.431383], [10.42656, 63.431383], [10.42656, 63.431383], [10.42656, 63.431383], [10.42656, 63.431385], [10.42656, 63.431386], [10.426561, 63.431392], [10.426561, 63.431393], [10.426558, 63.431394], [10.426551, 63.431392], [10.426458, 63.431351], [10.426218, 63.431282], [10.426081, 63.431248], [10.425883, 63.431216], [10.425564, 63.431202], [10.425303, 63.431207], [10.424988, 63.431186], [10.424696, 63.431112], [10.424603, 63.431051], [10.424588, 63.431028], [10.424494, 63.430843], [10.42446, 63.430789], [10.424371, 63.430589], [10.424341, 63.430512], [10.424248, 63.43037], [10.424202, 63.430351], [10.423868, 63.430263], [10.423501, 63.430173], [10.423279, 63.430119], [10.422856, 63.43], [10.422769, 63.429971], [10.422685, 63.429949], [10.422442, 63.429885], [10.422244, 63.429823], [10.421874, 63.429719], [10.421759, 63.42968], [10.421368, 63.429567], [10.421093, 63.429482], [10.420782, 63.429322], [10.420585, 63.42926], [10.420369, 63.429215], [10.419952, 63.429128], [10.41971, 63.429044], [10.419443, 63.428906], [10.419128, 63.428745], [10.419076, 63.428718], [10.418777, 63.428558], [10.41858, 63.428421], [10.418538, 63.428251], [10.418497, 63.428131], [10.418453, 63.428021], [10.418241, 63.427896], [10.417809, 63.427848], [10.417404, 63.427826], [10.416978, 63.427802], [10.416896, 63.427795], [10.416496, 63.4278], [10.416346, 63.427855], [10.416184, 63.427973], [10.416176, 63.428027], [10.416156, 63.42813], [10.416149, 63.428169], [10.416114, 63.428348], [10.416091, 63.428426], [10.415972, 63.428549], [10.41586, 63.428636], [10.415815, 63.428644], [10.415723, 63.428632], [10.41563, 63.428601], [10.415468, 63.428558], [10.415308, 63.42851], [10.41513, 63.428468], [10.414878, 63.428492], [10.414469, 63.428532], [10.414403, 63.428534], [10.413955, 63.428513], [10.413903, 63.428511], [10.413566, 63.428476], [10.4132, 63.428437], [10.413066, 63.428426], [10.413, 63.428448], [10.412951, 63.428533], [10.412902, 63.42862], [10.4129, 63.428639], [10.412888, 63.428692], [10.412754, 63.428783], [10.412653, 63.428842], [10.412551, 63.428938], [10.412493, 63.429115], [10.412483, 63.42917], [10.412486, 63.429223], [10.412524, 63.429303], [10.412582, 63.429367], [10.412602, 63.429401], [10.412601, 63.429486], [10.412556, 63.429625], [10.412505, 63.429664], [10.412224, 63.429787], [10.411991, 63.429873], [10.411955, 63.429882], [10.411729, 63.429911], [10.411623, 63.4299], [10.411567, 63.429857], [10.411623, 63.429702], [10.41168, 63.429557], [10.411695, 63.429384], [10.41167, 63.429299], [10.411652, 63.429287], [10.411619, 63.429259], [10.411512, 63.429138], [10.411491, 63.42912], [10.411417, 63.428983], [10.411518, 63.42888], [10.411686, 63.428724], [10.411743, 63.428601], [10.411738, 63.428573], [10.411691, 63.428394]];
const etappe_distance_array = [0, 21, 26, 35, 37, 51, 51, 53, 53, 53, 53, 53, 54, 54, 54, 54, 59, 62, 85, 89, 106, 115, 128, 147, 164, 174, 194, 216, 222, 244, 266, 272, 294, 310, 320, 332, 337, 339, 349, 352, 375, 397, 408, 430, 447, 469, 490, 495, 516, 541, 550, 571, 587, 599, 610, 616, 622, 623, 624, 628, 632, 635, 643, 660, 675, 682, 690, 695, 697, 701, 711, 716, 719, 728, 731, 750, 771, 775, 782, 791, 802, 816, 837, 853, 855, 876, 881, 903, 905, 925, 935, 938, 943, 946, 967, 972, 994, 1007, 1029, 1051, 1074, 1078, 1100, 1111, 1134, 1149, 1171, 1181, 1191, 1202, 1206, 1209, 1212, 1224, 1226, 1230, 1243, 1246, 1248, 1266, 1273, 1293, 1300, 1320, 1324, 1331, 1338, 1345, 1367, 1386, 1403, 1421, 1431, 1432, 1433, 1443, 1452, 1463, 1464, 1464, 1473, 1494, 1515, 1521, 1524, 1524, 1524, 1524, 1524, 1524, 1524, 1525, 1525, 1525, 1526, 1526, 1532, 1547, 1555, 1565, 1581, 1594, 1610, 1627, 1635, 1638, 1659, 1665, 1688, 1696, 1713, 1716, 1735, 1756, 1769, 1794, 1799, 1804, 1818, 1830, 1852, 1859, 1883, 1899, 1923, 1935, 1947, 1970, 1985, 2005, 2029, 2033, 2056, 2075, 2094, 2107, 2120, 2137, 2159, 2180, 2201, 2205, 2225, 2235, 2251, 2257, 2268, 2272, 2292, 2301, 2316, 2327, 2330, 2335, 2340, 2350, 2359, 2369, 2382, 2403, 2406, 2429, 2432, 2449, 2468, 2474, 2479, 2488, 2498, 2500, 2506, 2519, 2527, 2539, 2559, 2565, 2571, 2580, 2587, 2591, 2601, 2617, 2622, 2641, 2656, 2658, 2670, 2675, 2681, 2699, 2715, 2734, 2744, 2745, 2749, 2763, 2766, 2781, 2794, 2813, 2827, 2830, 2851];
const etappe_altitude_array = [31, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 33, 33, 33, 32, 32, 32, 31, 30, 30, 30, 29, 28, 28, 28, 28, 28, 28, 27, 26, 26, 25, 24, 23, 22, 22, 22, 22, 22, 22, 22, 21, 22, 22, 22, 22, 21, 21, 21, 22, 22, 24, 25, 25, 26, 26, 26, 26, 26, 26, 26, 27, 27, 26, 26, 26, 26, 26, 27, 28, 30, 32, 32, 33, 33, 34, 34, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 35, 35, 35, 36, 37, 37, 38, 38, 40, 40, 40, 42, 42, 42, 44, 44, 46, 46, 47, 48, 49, 49, 50, 52, 54, 56, 56, 57, 57, 57, 57, 57, 57, 57, 57, 57, 57, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 55, 55, 55, 55, 54, 54, 55, 55, 55, 56, 56, 57, 57, 57, 57, 56, 54, 53, 53, 53, 53, 52, 52, 52, 52, 52, 52, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 51, 51, 50, 50, 50, 49, 49, 48, 48, 48, 47, 48, 48, 48, 48, 48, 48, 48, 48, 49, 49, 49, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 50, 50, 50, 50, 50, 50, 50, 50, 50, 49, 49, 49, 49, 49, 49, 50, 50, 52, 52, 52, 52, 53, 53, 53, 54, 55, 55, 55, 55];


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 13.5 : 12.5;


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
        center: (!isMobile) ? [10.428994, 63.432624] : [10.428994, 63.432624],
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

      createEtappe(4, etappe_coordinates, "#DC0000", "#C60000");
      addTextOnMap(1, [10.446015, 63.437299], "Innherredsveien", 17, 5);
      addTextOnMap(2, [10.430938, 63.43419], "Bakkaunet", 17,-36)
      addTextOnMap(3, [10.419952, 63.429128], "Rosenborg Park", 17)

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
                      coordinates: etappe_coordinates[70]
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
                'text-field': etappe_distance_array[70].toString() + "m",
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
