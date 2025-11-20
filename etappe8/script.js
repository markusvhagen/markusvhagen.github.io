// ****************** //
// GLOBALE KONSTANTER //
// ****************** //
const etappe_coordinates = [[10.357293, 63.420926], [10.357333, 63.420997], [10.357352, 63.421033], [10.357413, 63.421163], [10.357497, 63.421282], [10.357572, 63.421392], [10.357505, 63.421422], [10.357409, 63.421455], [10.357229, 63.421499], [10.35702, 63.421535], [10.356857, 63.421583], [10.356962, 63.421714], [10.357138, 63.421903], [10.357224, 63.421995], [10.357383, 63.422176], [10.35745, 63.422308], [10.357557, 63.422501], [10.357632, 63.422615], [10.35777, 63.422797], [10.357816, 63.42286], [10.357958, 63.423037], [10.358025, 63.423125], [10.358153, 63.423271], [10.358161, 63.423407], [10.358011, 63.423471], [10.357966, 63.423487], [10.357825, 63.423538], [10.357495, 63.423668], [10.357226, 63.423802], [10.356877, 63.423931], [10.356736, 63.42398], [10.356604, 63.424029], [10.35627, 63.424139], [10.356224, 63.424157], [10.355875, 63.424287], [10.355667, 63.424359], [10.355399, 63.424456], [10.355026, 63.424581], [10.354964, 63.424603], [10.354588, 63.42474], [10.354323, 63.424837], [10.353969, 63.424956], [10.353789, 63.425039], [10.353634, 63.425128], [10.353491, 63.425325], [10.353589, 63.425519], [10.353631, 63.42555], [10.353936, 63.425689], [10.354005, 63.425713], [10.354403, 63.425797], [10.354492, 63.425808], [10.354955, 63.425831], [10.355235, 63.425824], [10.355674, 63.425794], [10.355919, 63.425768], [10.356351, 63.425717], [10.356522, 63.425709], [10.356936, 63.425745], [10.357009, 63.425762], [10.357287, 63.4259], [10.357372, 63.426087], [10.357254, 63.426272], [10.357201, 63.426345], [10.357038, 63.426522], [10.356842, 63.426718], [10.356651, 63.42688], [10.356395, 63.427042], [10.356345, 63.427071], [10.356109, 63.427216], [10.35587, 63.427361], [10.35579, 63.427416], [10.355538, 63.427597], [10.355395, 63.42776], [10.355206, 63.427947], [10.355083, 63.428035], [10.354753, 63.428171], [10.354687, 63.428191], [10.354348, 63.428269], [10.354127, 63.428294], [10.353677, 63.428344], [10.353521, 63.428361], [10.353103, 63.428464], [10.353049, 63.428493], [10.352997, 63.428622], [10.353182, 63.428803], [10.353228, 63.428831], [10.353524, 63.428984], [10.353715, 63.429076], [10.353785, 63.429106], [10.354066, 63.429267], [10.354257, 63.429427], [10.354335, 63.429505], [10.354451, 63.429704], [10.354485, 63.429818], [10.354447, 63.430014], [10.354415, 63.430089], [10.35423, 63.430259], [10.354167, 63.430289], [10.353887, 63.430381], [10.353749, 63.430427], [10.353447, 63.430558], [10.3534, 63.430636], [10.353467, 63.430793], [10.353741, 63.430879], [10.354138, 63.430865], [10.354517, 63.430757], [10.354819, 63.430594], [10.354921, 63.430509], [10.355108, 63.430319], [10.355148, 63.430253], [10.35525, 63.430054], [10.355266, 63.430019], [10.355354, 63.429851], [10.355416, 63.429743], [10.355438, 63.42968], [10.355496, 63.429471], [10.355566, 63.429367], [10.355627, 63.429186], [10.355794, 63.429041], [10.356083, 63.428951], [10.356421, 63.428929], [10.356822, 63.428954], [10.356934, 63.428978], [10.357107, 63.429036], [10.357286, 63.429077], [10.357441, 63.429114], [10.357814, 63.429212], [10.357997, 63.429252], [10.358394, 63.429339], [10.358624, 63.429374], [10.358861, 63.429384], [10.359259, 63.429371], [10.359696, 63.429305], [10.359761, 63.42929], [10.360081, 63.429177], [10.360185, 63.429115], [10.360384, 63.428935], [10.360452, 63.428872], [10.360677, 63.428695], [10.360858, 63.428621], [10.361254, 63.428547], [10.361718, 63.428557], [10.362102, 63.42862], [10.362265, 63.428663], [10.362632, 63.42877], [10.36278, 63.4288], [10.363217, 63.428835], [10.363396, 63.428829], [10.363857, 63.428813], [10.364116, 63.428786], [10.364531, 63.428735], [10.36468, 63.428705], [10.364744, 63.428685], [10.3648, 63.428666], [10.365112, 63.428584], [10.365486, 63.428518], [10.365539, 63.428502], [10.365586, 63.42848], [10.365711, 63.428353], [10.3658, 63.428219], [10.365848, 63.428159], [10.36588, 63.428126], [10.365938, 63.428084], [10.366214, 63.427956], [10.366674, 63.427963], [10.366849, 63.427941], [10.366979, 63.427892], [10.367019, 63.427835], [10.367, 63.427807], [10.366958, 63.427784], [10.366849, 63.427765], [10.366791, 63.42777], [10.366735, 63.427786], [10.36668, 63.427833], [10.367513, 63.428091], [10.367733, 63.428265], [10.368067, 63.428347], [10.368126, 63.428363], [10.368251, 63.428402], [10.368667, 63.428494], [10.36894, 63.428565], [10.369352, 63.428668], [10.369686, 63.428754], [10.37004, 63.428861], [10.370278, 63.42892], [10.370652, 63.42899], [10.370883, 63.429013], [10.371008, 63.429026], [10.37112, 63.429033], [10.371335, 63.429061], [10.371549, 63.429096], [10.371964, 63.429203], [10.372088, 63.42925], [10.372347, 63.429389], [10.372487, 63.429476], [10.372764, 63.429609], [10.372946, 63.429685], [10.373343, 63.429758], [10.373736, 63.429844], [10.373791, 63.429858], [10.374145, 63.429948], [10.37428, 63.429978], [10.374673, 63.430073], [10.374868, 63.430112], [10.375172, 63.430147], [10.375385, 63.430168], [10.375532, 63.43018], [10.375688, 63.430189], [10.376057, 63.430187], [10.376135, 63.430187], [10.376449, 63.43019], [10.376824, 63.43019], [10.376975, 63.430189], [10.377393, 63.430144], [10.377444, 63.430125], [10.377524, 63.430027], [10.37761, 63.42983], [10.377641, 63.42981], [10.377942, 63.429755], [10.378402, 63.429738], [10.378551, 63.42973], [10.378976, 63.4297], [10.379042, 63.429693], [10.379247, 63.429665], [10.379677, 63.429605], [10.379911, 63.429536], [10.380217, 63.429399], [10.380378, 63.429342], [10.380645, 63.429319], [10.380785, 63.429315], [10.380854, 63.429312], [10.38129, 63.42928], [10.381437, 63.429259], [10.381834, 63.429187], [10.381889, 63.429173], [10.382006, 63.42915], [10.382109, 63.429125], [10.38216, 63.429113], [10.38251, 63.428996], [10.382629, 63.428962], [10.382968, 63.428865], [10.383208, 63.428793], [10.383402, 63.428751], [10.383532, 63.428725], [10.383602, 63.428715], [10.3838, 63.428682], [10.383866, 63.42867], [10.384268, 63.428601], [10.384608, 63.428557], [10.384986, 63.428491], [10.385093, 63.428473]];
const etappe_distance_array = [0, 8, 12, 27, 41, 53, 58, 64, 74, 86, 95, 111, 134, 145, 166, 181, 204, 217, 238, 246, 267, 277, 295, 310, 320, 323, 332, 354, 374, 397, 406, 414, 435, 438, 460, 474, 491, 514, 518, 542, 559, 581, 594, 607, 630, 652, 656, 678, 682, 704, 709, 732, 746, 768, 781, 803, 812, 833, 837, 858, 879, 900, 909, 930, 954, 975, 997, 1001, 1021, 1041, 1048, 1072, 1092, 1114, 1126, 1148, 1152, 1171, 1183, 1206, 1214, 1238, 1242, 1257, 1279, 1283, 1305, 1319, 1324, 1347, 1367, 1377, 1400, 1412, 1434, 1443, 1464, 1468, 1486, 1494, 1515, 1524, 1542, 1559, 1579, 1601, 1625, 1636, 1659, 1666, 1689, 1693, 1712, 1725, 1732, 1755, 1767, 1788, 1806, 1824, 1841, 1861, 1867, 1878, 1888, 1897, 1918, 1928, 1950, 1963, 1975, 1994, 2017, 2021, 2041, 2050, 2072, 2080, 2103, 2115, 2137, 2160, 2180, 2190, 2212, 2220, 2242, 2251, 2274, 2287, 2309, 2317, 2321, 2324, 2342, 2362, 2366, 2369, 2384, 2400, 2407, 2411, 2417, 2436, 2459, 2468, 2477, 2484, 2487, 2490, 2496, 2499, 2502, 2508, 2559, 2581, 2600, 2604, 2611, 2634, 2650, 2674, 2693, 2714, 2728, 2748, 2760, 2766, 2772, 2783, 2794, 2818, 2826, 2847, 2859, 2879, 2891, 2913, 2935, 2938, 2958, 2966, 2988, 2999, 3014, 3025, 3033, 3040, 3059, 3063, 3078, 3097, 3105, 3126, 3129, 3141, 3163, 3166, 3182, 3205, 3213, 3234, 3238, 3248, 3271, 3285, 3307, 3317, 3330, 3337, 3341, 3363, 3371, 3392, 3395, 3402, 3407, 3410, 3432, 3439, 3459, 3474, 3484, 3491, 3495, 3506, 3509, 3531, 3548, 3569, 3574];
const etappe_altitude_array = [133, 132, 132, 133, 133, 133, 132, 132, 132, 132, 132, 131, 130, 130, 129, 128, 127, 127, 126, 125, 124, 124, 123, 122, 122, 122, 121, 120, 119, 117, 117, 116, 116, 116, 114, 113, 112, 111, 111, 109, 108, 107, 107, 106, 106, 104, 104, 103, 102, 101, 101, 100, 99, 98, 97, 96, 95, 94, 94, 93, 92, 91, 91, 90, 88, 87, 86, 86, 85, 84, 84, 83, 82, 81, 80, 79, 79, 78, 77, 76, 76, 75, 75, 74, 73, 73, 72, 71, 71, 70, 69, 68, 67, 66, 65, 65, 64, 63, 63, 62, 62, 61, 61, 60, 59, 58, 56, 56, 55, 54, 53, 53, 51, 51, 50, 49, 49, 48, 47, 46, 45, 44, 44, 43, 43, 42, 41, 41, 40, 39, 38, 38, 37, 37, 36, 36, 35, 35, 34, 34, 32, 31, 30, 30, 28, 28, 27, 26, 25, 24, 23, 23, 22, 22, 21, 20, 20, 20, 21, 23, 24, 24, 24, 24, 22, 21, 21, 20, 20, 20, 19, 18, 18, 17, 16, 16, 16, 16, 16, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 10, 11, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11];

// *****************  //
// GLOBALE FUNKSJONER //
// *****************  //
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// ********** //
// ETAPPERUTE //
// ********** //

const bearing = 190;
const rotationDirection = 1 // +1 = rotating to the right, -1 = rotating to the left

mapboxgl.accessToken = 'pk.eyJ1IjoibWFya3VzdmhhZ2VuIiwiYSI6ImNtZ2NlNjNrbjE0bzkybHI1ZmM3MjV3aTEifQ.BE1AT8J3W1peoFGt4LOxOw';
    const map = new mapboxgl.Map({
        container: 'map',
        center: [10.363217, 63.428835],
        zoom: 14,
        pitch: 65,
        bearing: bearing,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        interactive: true,
        hash: false
    });

    map.on('load', () => {
      map.style.stylesheet.layers.forEach(function(layer) {
          if (layer.type === 'symbol') {
              map.setLayoutProperty(layer.id, "visibility", "none");
          }
      });
      const pinRouteGeojson = {
        "type": "FeatureCollection",
        "features":
        [
            {
                 "type": "Feature",
                 "properties": {},
                 "geometry": {
                      "type": "LineString",
                      "coordinates": etappe_coordinates
                 }
            }
        ]
      };

      // Set custom fog
        map.setFog({
            'range': [-0.5, 2],
            'color': '#def',
            'high-color': '#def',
            'space-color': '#def'
        });

        // Add terrain source, with slight exaggeration
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.terrain-rgb',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });


        // Let us add all markers we want to show
        const popup1 = new mapboxgl.Popup({ closeButton: false });
        const marker1 = new mapboxgl.Marker({
            color: 'black',
            scale: 1,
            draggable: false,
            pitchAlignment: 'auto',
            rotationAlignment: 'auto'
        })
            .setLngLat([10.357293, 63.420926])
            .setPopup(popup1)
            .addTo(map)
            .togglePopup();
        popup1.setHTML("Start - Sverresborg Museum");

        const popup2 = new mapboxgl.Popup({ closeButton: false });
        const marker2 = new mapboxgl.Marker({
            color: 'black',
            scale: 1,
            draggable: false,
            pitchAlignment: 'auto',
            rotationAlignment: 'auto'
        })
            .setLngLat([10.367019, 63.427835])
            .setPopup(popup2)
            .addTo(map)
            .togglePopup();
        popup2.setHTML("Satans 360!");

        const popup4 = new mapboxgl.Popup({ closeButton: false });
        const marker4 = new mapboxgl.Marker({
            color: 'black',
            scale: 1,
            draggable: false,
            pitchAlignment: 'auto',
            rotationAlignment: 'auto'
        })
            .setLngLat([10.385093, 63.428473])
            .setPopup(popup4)
            .addTo(map)
            .togglePopup();
        popup4.setHTML("Mål - Kalvskinnet");


        // Here we add the actual route
        const pinRoute = pinRouteGeojson.features[0].geometry.coordinates;
        // Create the marker and popup that will display the elevation queries
        const popup = new mapboxgl.Popup({ closeButton: false });
        const marker = new mapboxgl.Marker({
            color: 'red',
            scale: 1,
            draggable: false,
            pitchAlignment: 'auto',
            rotationAlignment: 'auto'
        })
            .setLngLat(pinRoute[0])
            .setPopup(popup)
            .addTo(map)
            .togglePopup();

        // Add a line feature and layer. This feature will get updated as we progress the animation
        map.addSource('line', {
            type: 'geojson',
            // Line metrics is required to use the 'line-progress' property
            lineMetrics: true,
            data: pinRouteGeojson
        });
        map.addLayer({
            type: 'line',
            source: 'line',
            id: 'line',
            paint: {
                'line-color': '#2e6f40',
                'line-width': 15
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });

        map.once('idle');
        // The total animation duration, in milliseconds
        const animationDuration = 15000;
        // Use the https://turfjs.org/ library to calculate line distances and
        // sample the line at a given percentage with the turf.along function.
        const path = turf.lineString(pinRoute);
        // Get the total line distance
        const pathDistance = turf.lineDistance(path);
        let start;

        function frame(time) {
            if (!start) start = time;
            const animationPhase = (time - start) / animationDuration;
            if (animationPhase > 1) {
                popup.remove();
                marker.remove();
                return;
            }

            // Get the new latitude and longitude by sampling along the path
            const alongPath = turf.along(path, pathDistance * animationPhase)
                .geometry.coordinates;
            const lngLat = {
                lng: alongPath[0],
                lat: alongPath[1]
            };


            // Sample the terrain elevation. We round to an integer value to
            // prevent showing a lot of digits during the animation
            const elevation = Math.floor(
                // Do not use terrain exaggeration to get actual meter values
                map.queryTerrainElevation(lngLat, { exaggerated: false })
            );

            // Update the popup altitude value and marker location
            popup.setHTML('hm: ' + elevation + 'm');
            marker.setLngLat(lngLat);

            // Reduce the visible length of the line by using a line-gradient to cutoff the line
            // animationPhase is a value between 0 and 1 that reprents the progress of the animation
            map.setPaintProperty('line', 'line-gradient', [
                'step',
                ['line-progress'],
                'red',
                animationPhase,
                '#2e6f40'
            ]);

            // Rotate the camera at a slightly lower speed to give some parallax effect in the background
            const rotation = bearing + rotationDirection*animationPhase * 40.0;
            map.setBearing(rotation % 360);

            window.requestAnimationFrame(frame);
        }

        window.requestAnimationFrame(frame);

});


// ********* //
// HØYDEKART //
// ********* //

/** Chart.register( Chart.LineElement, Chart.LineController, Chart.Legend, Chart.Tooltip, Chart.LinearScale, Chart.PointElement, Chart.Filler, Chart.Title);

  const ctx = document.getElementById("route-elevation-chart").getContext("2d");
  const chartData = {
    labels: etappe_distance_array,
    datasets: [{
      data: etappe_altitude_array,
      fill: true,
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, .3)',
      tension: 0.1,
      pointRadius: 0,
      spanGaps: true
    }]
  };

  const config = {
    type: 'line',
    data: chartData,
    plugins: [{
      beforeInit: (chart, args, options) => {
        const maxHeight = Math.max(...chart.data.datasets[0].data);
        chart.options.scales.x.min = Math.min(...chart.data.labels);
        chart.options.scales.x.max = Math.max(...chart.data.labels);
        chart.options.scales.y.max = maxHeight + Math.round(maxHeight * 0.2);
        chart.options.scales.y1.max = maxHeight + Math.round(maxHeight * 0.2);
      }
    }],
    options: {
      onHover: (event, chartElements) => {
        // Capture index of current point being hovered
        if (chartElements.length) {
          const { datasetIndex, index } = chartElements[0];
          // Draw circle
          map.getSource('circle-center').setData({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: etappe_coordinates[index] // New coordinates
                },
                properties: {}
            });
        }
      },
      animation: false,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      tooltip: { position: 'nearest' },
      scales: {
        x: { type: 'linear' },
        y: { type: 'linear', beginAtZero: true },
        y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }},
      },
      plugins: {
        title: { align: "end", display: true, text: "Distanse, m / Høydemeter, m" },
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              return "Distanse løpt: " + tooltipItems[0].label + 'm'
            },
            label: (tooltipItem) => {
              return "Høydemeter: " + tooltipItem.raw + 'm'
            },
          }
        }
      }
    }
  };

const chart = new Chart(ctx, config);



// *************** //
// EVENT-LISTENERS //
// *************** //
function distBetweenCoords(coord1, coord2) {
  xDiff = Math.abs(coord2[0]-coord1[0]);
  yDiff = Math.abs(coord2[1]-coord1[1]);
  return xDiff + yDiff;
}


map.on("mousemove", (e) => {
  var activeCoord = [parseFloat(JSON.stringify(e.lngLat.lng)), parseFloat(JSON.stringify(e.lngLat.lat))];

  // Now we find closest coordinate in etappe_coordinates. We also store its index in the array for later.
  var closestCoord = [0,0]
  var index = 0;
  for (var i = 0; i < etappe_coordinates.length; i++) {
    if (distBetweenCoords(closestCoord, activeCoord) > distBetweenCoords(activeCoord,etappe_coordinates[i])) {
      closestCoord = etappe_coordinates[i]
      index = i;
    }
  }

  // Let us move the red point on the map accordingly to where the cursor is
  map.getSource('circle-center').setData({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: etappe_coordinates[index] // New coordinates
        },
        properties: {}
    });

  // Now we pass this information to the altitude map
  const pointIndex = index;
  const datasetIndex = 0;
  const meta = chart.getDatasetMeta(datasetIndex);
  const point = meta.data[pointIndex];

  chart.tooltip.setActiveElements(
    [{ datasetIndex, index: pointIndex }],
    { x: point.x, y: point.y }
  );
  chart.update();
}); **/
