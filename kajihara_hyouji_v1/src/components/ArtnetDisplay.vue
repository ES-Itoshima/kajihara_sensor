vueCopy<template>
  <div>
    <h1>センサーデータ</h1>
    <p>距離: {{ data.distanceInCm}} cm</p>
    <p>距離: {{ data.distanceInInches}} inches</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';

    const data = reactive({
      distanceInCm: 0,
      distanceInInches: 0,
      errorMessage: ''
    });

    let socket;

    const startReceiving = () => {
      socket = new WebSocket('ws://localhost:8080');

      socket.onmessage = (event) => {
        const { distanceInCm, distanceInInches } = JSON.parse(event.data);
        data.distanceInCm = distanceInCm;
        data.distanceInInches = distanceInInches;
        console.log(event)
      };

      socket.onerror = (error) => {
        data.errorMessage = `WebSocket error: ${error.message}`;
        console.error('WebSocket error:', error);
      };
    };

    onMounted(() => {
      startReceiving();
    });

    onUnmounted(() => {
      if (socket) {
        socket.close();
      }
    });
</script>

<style scoped>
h1 {
  color: #42b983;
}
.error {
  color: red;
}
</style>