<template>
  <div id="app">
    <Map/>
    <v-btn small>Normal</v-btn>
  </div>
</template>

<script>
import Map from './components/Map.vue'

export default {
  name: 'App',
  components: {
    Map
  }
}
</script>

<style>
#app {
}
</style>
