<template>
  <div class="map">
    <naver-maps
      :height="height"
      :width="width"
      :mapOptions="mapOptions"
      :initLayers="initLayers"
      @load="onLoad">
    </naver-maps>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data(){
    return{
      width: 300,
      height: 300,
      map: null,
      isCTT: false,
      mapOptions: {
        lat: 37,
        lng: 127,
        zoom: 10,
        zoomControlOptions: {position: 'TOP_RIGHT'},
      },
        initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN']
      }
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
