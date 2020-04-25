<template>
  <div class="map">
    <b-navbar type="dark" variant="dark">
      <b-collapse is-nav>
        <router-link to="/">
        <b-navbar-brand>Home</b-navbar-brand>
        </router-link>
      </b-collapse>
      <b-navbar-nav align="right">
          <b-button v-b-toggle.sidebar-1>
            <b-icon-card-text></b-icon-card-text>
          </b-button>
      </b-navbar-nav>
    </b-navbar>
    
    <b-sidebar id="sidebar-1" title="Sidebar" shadow>
      <div class="px-3 py-2">
        {{test}}
        <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
      </div>
    </b-sidebar>
    <naver-maps
      :height="height"
      :width="width"
      :mapOptions="mapOptions"
      :initLayers="initLayers">
      <naver-marker v-for="(item, idx) in mask" :key="idx" :lat="item.lat" :lng="item.lng" @click="onMarkerClicked(idx)"></naver-marker>
      <naver-info-window
        @load="onInfoLoad"
        :isOpen="info"
        :marker="marker">
        <div>
          <h5>{{infoWindow.name}}</h5>
          <p>asdfa</p>
        </div>
      </naver-info-window>
    </naver-maps>
  </div>
</template>

<script>
import maskData from '../assets/maskDATA.json'

export default {
  name: 'Map',
  data(){
    return{
      width: screen.availWidth,
      height: screen.availHeight,
      info: false,
      infoWindow:{
        name: null,
      },
      marker: null,
      mapOptions: {
        lat: JSON.parse(localStorage.getItem('nowlocate')).lat,
        lng: JSON.parse(localStorage.getItem('nowlocate')).lng,
        zoom: 14,
        minZoom: 14,
        zoomControlOptions: {position: 'TOP_RIGHT'},
      },
        initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN']
      ,
      nowPosition:{
        lat: 37,
        lng: 127  
      },
      mask:[],
      }
    },
  methods: {
    onMarkerClicked(idx) {
      this.marker = this.mask[idx]; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.infoWindow.name = this.mask[idx].name;
    },
  },
  mounted(){
    maskData.storeInfos.forEach(element => {
      this.mask.push(element)
    });
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
