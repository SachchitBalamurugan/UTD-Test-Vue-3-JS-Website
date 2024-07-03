<template>
  <div id="app">
    <div>
      <label for="data-select">Select Data Type:</label>
      <select v-model="selectedDataType" @change="updateMarkers">
        <option value="pm0_1">pm0_1</option>
        <option value="pm0_3">pm0_3</option>
        <option value="pm0_5">pm0_5</option>
        <option value="pm1_0">pm1_0</option>
        <option value="pm2_5">pm2_5</option>
        <option value="pm5_0">pm5_0</option>
        <option value="pm10_0">pm10_0</option>
        <option value="pc0_1">pc0_1</option>
        <option value="pc0_3">pc0_3</option>
        <option value="pc0_5">pc0_5</option>
        <option value="pc1_0">pc1_0</option>
        <option value="pc2_5">pc2_5</option>
        <option value="pc5_0">pc5_0</option>
        <option value="pc10_0">pc10_0</option>
      </select>
    </div>
    <div id="map"></div>
    <wind-data></wind-data>
  </div>
</template>

<script>
import L from 'leaflet';
import Papa from 'papaparse';
import WindData from './components/windData.vue';

export default {
  name: 'App',
  components: {
    WindData // Register the WindData component
  },
  data() {
    return {
      map: null,
      csvData: [],
      markers: [],
      selectedDataType: 'pm0_1'
    };
  },
  mounted() {
    // Initialize the map
    this.map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Load and parse the CSV data
    this.loadCsvData();
  },
  methods: {
    loadCsvData() {
  const csvString = `dateTime,pc0_1,pc0_3,pc0_5,pc1_0,pc2_5,pc5_0,pc10_0,pm0_1,pm0_3,pm0_5,pm1_0,pm2_5,pm5_0,pm10_0
22:05.6,118715,35285,11158,799,109,0,0,0.108637489,0.980469167,2.256855965,2.988666534,3.382744312,3.410027742,3.410027742
22:06.2,119320,35520,11234,803,110,1,1,0.109456257,0.981164511,2.259753893,2.99156894,3.386868785,3.414142839,3.414142839
22:06.8,119925,35755,11310,807,111,2,2,0.110275026,0.981859854,2.26265182,2.994471346,3.391993258,3.418257936,3.418257936
22:07.4,120530,35990,11386,811,112,3,3,0.111093795,0.982555197,2.265549748,2.997373752,3.397117732,3.422372033,3.422372033
22:08.0,121135,36225,11462,815,113,4,4,0.111912563,0.98325054,2.268447675,3.000276159,3.402242205,3.42648613,3.42648613`;

  Papa.parse(csvString, {
    header: true,
    complete: this.storeCsvData
  });
},

// loadCsvData() {
//   // Assuming 'assets' directory is in the same folder as your HTML file
//   fetch('research-utd-website/src/data.csv')
//     .then(response => response.text())
//     .then(csvString => {
//       console.log(csvString); // Log fetched CSV string
//       // Parse the CSV string
//       Papa.parse(csvString, {
//         header: true,
//         complete: this.storeCsvData
//       });
//     })
//     .catch(error => {
//       console.error('Error loading CSV:', error);
//     });
// },

storeCsvData(result) {
  console.log(result.data); // Log parsed CSV data
  console.log("Hellow World");
  this.csvData = result.data;

  // Print out the first row from the CSV data
  console.log('First row:', this.csvData[0]); // Print the first row

  this.updateMarkers();
},

    updateMarkers() {
      // Remove existing markers
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];

      // Create and add new markers based on the selected data type
      this.csvData.forEach((row, index) => {
        const value = row[this.selectedDataType];
        const lat = 51.5 + (index * 0.01); // Example latitude adjustment
        const lng = -0.09 + (index * 0.01); // Example longitude adjustment
        const color = this.getColor(index);

        const circleMarker = L.circleMarker([lat, lng], {
          radius: 10, // Size of the circle
          color: color, // Border color
          fillColor: color, // Fill color
          fillOpacity: 1 // Fill opacity
        }).addTo(this.map);

        // Bind a popup to the circle marker
        circleMarker.bindPopup(`${this.selectedDataType} Value: ${value}`);

        // Add the marker to the array
        this.markers.push(circleMarker);
      });
    },
    getColor(index) {
      const colors = ['green', 'blue', 'red', 'yellow', 'orange', 'purple'];
      return colors[index % colors.length];
    }
  }
}
</script>

<style>
#map {
  height: 500px;
  width: 100%;
}
</style>
