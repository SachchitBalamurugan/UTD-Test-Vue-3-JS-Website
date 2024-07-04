<template>
  <div>
    <h1>NOAA Wind Data</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="period in windData" :key="period.startTime">
        <p><strong>Time:</strong> {{ period.startTime }}</p>
        <p><strong>Wind Speed:</strong> {{ period.windSpeed }}</p>
        <p><strong>Wind Direction:</strong> {{ period.windDirection }}</p>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      windData: [],
      latitude: 39.7456, // Example latitude
      longitude: -97.0892, // Example longitude
    };
  },
  mounted() {
    this.fetchData(); // Fetch data initially
    setInterval(this.fetchData, 15 * 60 * 1000); // Fetch data every 15 minutes
  },
  methods: {
    fetchData() {
      const proxyUrl = 'http://localhost:3000/cors-proxy?url=';
      const noaaUrl = `https://api.weather.gov/points/${this.latitude},${this.longitude}`;

      axios.get(proxyUrl + encodeURIComponent(noaaUrl))
        .then(response => {
          const { gridId, gridX, gridY } = response.data.properties;
          const forecastUrl = `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`;
          return axios.get(proxyUrl + encodeURIComponent(forecastUrl));
        })
        .then(response => {
          this.loading = false;
          this.windData = response.data.properties.periods;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Add your component styles here */
</style>
