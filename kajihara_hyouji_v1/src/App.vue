<template>
  <div>test</div>
  <div id="app">
    <ArtnetDisplay />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ArtnetDisplay from './components/ArtnetDisplay.vue';

export default defineComponent({
  name: 'App',
  components: {
    ArtnetDisplay,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>