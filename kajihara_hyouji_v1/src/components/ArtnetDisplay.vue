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
import io from 'socket.io-client';

export default {
  name: 'ArtnetDisplay',
  setup() {
    const data = reactive({
      distanceInCm: 0,
      distanceInInches: 0,
      errorMessage: ''
    });

    const startSocketIO = () => {
      const socket = io('http://localhost:8080');

      socket.on('connect', () => {
        console.log('Socket.IO connection established');
      });

      socket.on('sensorData', (receivedData) => {
        data.distanceInCm = receivedData.distanceInCm;
        data.distanceInInches = receivedData.distanceInInches;
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });

      socket.on('error', (error) => {
        data.errorMessage = `Socket.IO error: ${error.message}`;
        console.error('Socket.IO error:', error);
      });
    };

    onMounted(() => {
      startSocketIO();
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
