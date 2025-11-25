// ****************** //
//       ETAPPER      //
// ****************** //
const etappe_coordinates =  [[10.374573, 63.431212], [10.374653, 63.43121], [10.37473, 63.431211], [10.374861, 63.431213], [10.374997, 63.431217], [10.375053, 63.431217], [10.375196, 63.431218], [10.375333, 63.431219], [10.375469, 63.431224], [10.375671, 63.431226], [10.375802, 63.431226], [10.375863, 63.431225], [10.376058, 63.431229], [10.376379, 63.431241], [10.376763, 63.431252], [10.376952, 63.431271], [10.377356, 63.431339], [10.377471, 63.431362], [10.377891, 63.431444], [10.378123, 63.431543], [10.378167, 63.431569], [10.378365, 63.431695], [10.378476, 63.431772], [10.378512, 63.431793], [10.378744, 63.431957], [10.37878, 63.431981], [10.379099, 63.432112], [10.379147, 63.432127], [10.379433, 63.432211], [10.379599, 63.432253], [10.379719, 63.432264], [10.379846, 63.432278], [10.380302, 63.432309], [10.380634, 63.432319], [10.381076, 63.432342], [10.381191, 63.432361], [10.381491, 63.432465], [10.381751, 63.432621], [10.382015, 63.432773], [10.382277, 63.432843], [10.38245, 63.43287], [10.382824, 63.43296], [10.382929, 63.432987], [10.383297, 63.433084], [10.383554, 63.433154], [10.383931, 63.433232], [10.384088, 63.433273], [10.384457, 63.433381], [10.384604, 63.433412], [10.384957, 63.433519], [10.38501, 63.433535], [10.385351, 63.433634], [10.385502, 63.433676], [10.385792, 63.433772], [10.386038, 63.433857], [10.38623, 63.433926], [10.386415, 63.433992], [10.386462, 63.434011], [10.386792, 63.434135], [10.386938, 63.434184], [10.387276, 63.434295], [10.387508, 63.43437], [10.387867, 63.434497], [10.387912, 63.434513], [10.388232, 63.434626], [10.388419, 63.434693], [10.388763, 63.434803], [10.388812, 63.434819], [10.389142, 63.434933], [10.389289, 63.434985], [10.38964, 63.435094], [10.389839, 63.435148], [10.390198, 63.435262], [10.39035, 63.435306], [10.390711, 63.43542], [10.390863, 63.435473], [10.390919, 63.435489], [10.391256, 63.435599], [10.391351, 63.435625], [10.391716, 63.43574], [10.391805, 63.435776], [10.39215, 63.435882], [10.392255, 63.43591], [10.392602, 63.436014], [10.392797, 63.436074], [10.393158, 63.436174], [10.393266, 63.436202], [10.393609, 63.436282], [10.393729, 63.436315], [10.394061, 63.4364], [10.394443, 63.436502], [10.394548, 63.436529], [10.394936, 63.436625], [10.395153, 63.436688], [10.395538, 63.436795], [10.395649, 63.436827], [10.396011, 63.436939], [10.396078, 63.436986], [10.396279, 63.437127], [10.39659, 63.437258], [10.396644, 63.43728], [10.396966, 63.437416], [10.397244, 63.43753], [10.397476, 63.437622], [10.397569, 63.437657], [10.397706, 63.437712], [10.397805, 63.437754], [10.398122, 63.437882], [10.398218, 63.437913], [10.398559, 63.438033], [10.398884, 63.438175], [10.399037, 63.43823], [10.399289, 63.438346], [10.399432, 63.43841], [10.399621, 63.438483], [10.399711, 63.438521], [10.399908, 63.438603], [10.400053, 63.438659], [10.400383, 63.438794]];
const etappe_distance_array = [0, 4, 7, 14, 21, 23, 31, 37, 44, 54, 61, 64, 74, 90, 109, 119, 140, 146, 169, 185, 189, 206, 216, 219, 241, 244, 266, 269, 286, 295, 301, 308, 331, 348, 370, 376, 395, 417, 438, 453, 462, 484, 490, 511, 526, 547, 556, 578, 586, 607, 610, 631, 640, 658, 673, 685, 697, 700, 722, 731, 752, 766, 789, 792, 812, 824, 845, 848, 869, 878, 900, 911, 933, 942, 964, 974, 977, 998, 1004, 1026, 1032, 1053, 1059, 1080, 1092, 1113, 1119, 1138, 1145, 1164, 1187, 1193, 1215, 1228, 1250, 1257, 1279, 1285, 1304, 1325, 1329, 1351, 1370, 1385, 1391, 1400, 1407, 1428, 1434, 1456, 1479, 1488, 1507, 1517, 1529, 1535, 1549, 1558, 1581];
const etappe_altitude_array = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 4, 4, 5, 6, 6, 6, 6, 6, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];


// ******************** //
// IF DEVICE IS MOBILE  //
// ******************** //
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
var isMobile = isMobile();
var mapZoom = (!isMobile) ? 14 : 12;
if (isMobile) {
  document.getElementById("title").style.display = "none";
}


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
        style: 'mapbox://styles/mapbox/light-v9',
        center: (!isMobile) ? [10.387867, 63.434497] : [10.387867, 63.434497],
        zoom: mapZoom
    });

    map.on('load', () => {

      addMarker(1, [10.371573, 63.431212], "https://png.pngtree.com/png-clipart/20230818/original/pngtree-bio-outdoor-toilet-vector-illustration-vector-illustration-isolated-on-white-background-picture-image_8030179.png", 0.04);
      addMarker(2, [10.392797, 63.436874], "https://cdn-icons-png.flaticon.com/512/2956/2956744.png", 0.1)
      addMarker(3, [10.387912, 63.433513], "https://cdn-icons-png.flaticon.com/512/431/431248.png", 0.1)

      let popup1 = addPopup(1, [10.378365, 63.431695],"<h1>Svingbrua</h1> Visste du at Svingbrua er den eneste brua i Norge som bruker horisontal rotasjon for åpne seg?");
      popup1.addTo(map);

        // This section highlights all the parks
        const layers = map.getStyle().layers;
        layers.forEach(function(layer) {
            if (layer['source-layer'] === 'landuse') {
                // Check if this layer filters parks
                if (layer.filter && layer.filter.some(f => f.includes('park'))) {
                    // Set park color to green
                    map.setPaintProperty(layer.id, 'fill-color', '#6BCB77');
                }
            }
        });


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
                  }
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
                  'line-width': 5
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

      createEtappe(1, etappe_coordinates, "#2e6f40", "#06402b");


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
          "text-halo-width": 1
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
                      coordinates: etappe_coordinates[0]
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
                'icon-size': 1
            }
            });
        }
      });


// ********* //
// HØYDEKART //
// ********* //

Chart.register( Chart.LineElement, Chart.LineController, Chart.Legend, Chart.Tooltip, Chart.LinearScale, Chart.PointElement, Chart.Filler, Chart.Title);

const ctx = document.getElementById("route-elevation-chart").getContext("2d");
const chartData = {
    labels: etappe_distance_array,
    datasets: [{
      data: etappe_altitude_array,
      fill: true,
      borderColor: '#06402b',
      backgroundColor: 'rgba(6, 64, 43, 0.4)',
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
        // Only do this if we are not on mobile device
        if (!isMobile) {
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
        }
      },
      animation: false,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      tooltip: { position: 'nearest' },
      scales: {
        x: { type: 'linear', display: false },
        y: { type: 'linear', beginAtZero: true },
        y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }},
      },
      plugins: {
        annotation: {
                    annotations: {
                        etappe1Line:{
                          type: 'line',
                          mode: 'vertical',
                          scaleID: 'x',
                          value: etappe_distance_array[0],
                          borderColor: 'rgba(0, 0, 0, 0.7)',
                          borderWidth: 6,
                          label: {
                              display: true,
                              content: "Start",
                              enabled: true,
                              position: 'start',
                              xAdjust: 4,
                              yAdjust: -4,
                              backgroundColor: 'rgba(8,144,0,0.7)',
                              font: {
                                  size: 12
                              }
                          }
                        }
                    }
                },
        title: { align: "end", display: true, text: "Distanse, m / Høydemeter, m" },
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (tooltipItem) => {
              return tooltipItem[0].raw + 'hm';
            },
            label: (tooltipItem) => {
              var dataIndex = tooltipItem.dataIndex;
              // These two parameters decide the average we take (which is here over 6 points)
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
              var incline  = getIncline(etappe_coordinates[dataIndex+leftNudge],etappe_coordinates[dataIndex+rightNudge],etappe_altitude_array[dataIndex+leftNudge],etappe_altitude_array[dataIndex+rightNudge]);
              return incline + "%";
            }
          }
        }
      }
    }
  };

const chart = new Chart(ctx, config);



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

    try {
      chart.tooltip.setActiveElements(
        [{ datasetIndex, index: pointIndex }],
        { x: point.x, y: point.y }
      );
      chart.update();
    } catch(error) {}
  });
}
