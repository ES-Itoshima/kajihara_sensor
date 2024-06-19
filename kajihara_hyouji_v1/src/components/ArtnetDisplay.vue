<!-- src/components/ArtnetDisplay.vue -->
<template>
    <div>
      <h1>センサーデータ</h1>
      <p>距離: {{ distanceInCm }} cm</p>
      <p>距離: {{ distanceInInches }} inches</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { reactive, onMounted } from 'vue';
  import ArtNet from 'artnet';
  
  export default {
    name: 'ArtnetDisplay',
    setup() {
      const data = reactive({
        distanceInCm: 0,
        distanceInInches: 0,
        errorMessage: ''
      });
  
      const startReceiving = () => {
        try {
          const artnet = ArtNet({ host: '0.0.0.0', port: 6454 });
  
          artnet.on('artnet', (receivedData) => {
            data.distanceInCm = receivedData[0] + (receivedData[1] << 8);
            data.distanceInInches = receivedData[2] + (receivedData[3] << 8);
          });
  
          artnet.on('error', (error) => {
            data.errorMessage = `ArtNet error: ${error.message}`;
            console.error('ArtNet error:', error);
          });
        } catch (error) {
          data.errorMessage = `Initialization error: ${error.message}`;
          console.error('Initialization error:', error);
        }
      };
  
      onMounted(() => {
        startReceiving();
      });
  
      return {
        ...data,
      };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: #42b983;
  }
  .error {
    color: red;
  }
  </style>
  