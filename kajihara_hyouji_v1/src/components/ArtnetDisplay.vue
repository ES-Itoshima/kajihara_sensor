vueCopy<template>
  <div>
    <h1>センサーデータ</h1>
    <p>距離: {{ distanceInCm.toFixed(2) }} cm</p>
    <p>距離: {{ distanceInInches.toFixed(2) }} inches</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ArtnetDisplay',
  setup() {
    const data = reactive({
      distanceInCm: 0,
      distanceInInches: 0,
      errorMessage: ''
    });

    let socket;

    const startReceiving = () => {
      socket = new WebSocket('ws://localhost:3000');

      socket.onmessage = (event) => {
        const { cm, inches } = JSON.parse(event.data);
        data.distanceInCm = cm;
        data.distanceInInches = inches;
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