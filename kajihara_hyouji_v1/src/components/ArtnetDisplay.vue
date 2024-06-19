<!-- src/components/ArtnetDisplay.vue -->
<template>
    <div>
      <h1>センサーデータ</h1>
      <p>距離: {{ distanceInCm }} cm</p>
      <p>距離: {{ distanceInInches }} inches</p>
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
      });
  
      const startReceiving = () => {
        const artnet = ArtNet({ host: '0.0.0.0', port: 6454 });
  
        artnet.on('artnet', (receivedData) => {
          data.distanceInCm = receivedData[0] + (receivedData[1] << 8);
          data.distanceInInches = receivedData[2] + (receivedData[3] << 8);
        });
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
  </style>
  