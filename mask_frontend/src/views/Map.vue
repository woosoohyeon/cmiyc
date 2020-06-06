<template>
  <div class="map">
    <b-navbar type="dark" variant="dark">
      <b-collapse is-nav>
        <router-link to="/">
        <b-navbar-brand>Home</b-navbar-brand>
        </router-link>
      </b-collapse>
      <b-navbar-nav align="right">
        <b-button v-b-toggle.sidebar-1>Top3</b-button>
      </b-navbar-nav>
    </b-navbar>
    
    <b-sidebar id="sidebar-1" title="Sidebar" shadow>
      <div class="px-3 py-2">
        asdf
        <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
      </div>
    </b-sidebar>
    <naver-maps
      :height="height"
      :width="width"
      :mapOptions="mapOptions"
      :initLayers="initLayers"
      @load="onLoad">
      <naver-marker v-for="(item, idx) in mask" :key="idx" :lat="item.lat" :lng="item.lng" @click="onMarkerClicked(idx)" @load="onMarkerLoaded"></naver-marker>
      <!-- 위치제공 동의를 하지 않으면 현재위치를 마커로 표시하지 않습니다. -->
      <naver-marker :lat="nowLocate.lat" :lng="nowLocate.lng" @load="onNowMarkerLoaded"></naver-marker>
    </naver-maps>
    <!-- 모달 인포윈도우 -->
    <naver-info-window
        :isOpen="info"
        :marker="marker">
        <div>
          <b-card
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Image"
            img-top
            style="max-width: 20rem;"
            class="mb-2">
            <h5 style="font-weight: bold;">{{infoWindow.name}}</h5>
            <samll>{{infoWindow.address}}</samll>
            <b-card-text style="font-weight: bold;">{{infoWindow.phone}}</b-card-text>
            <b-container class="bv-example-row">
              <b-row>
                <b-col>
                  <small>예상 입고 시간</small>
                  <small style="font-weight: bold;" >{{infoWindow.ware}}</small>
                </b-col>
                <b-col>
                  <small>예상 매진 시간</small>
                  <small style="font-weight: bold;" >{{infoWindow.soldout}}</small>
                  
                </b-col>
              </b-row>
            </b-container>
          </b-card>
        </div>
      </naver-info-window>
  </div>
</template>

<script>
//import maskData from '../assets/maskDATA.json'
import EventBus from '@/eventbus'


export default {
  name: 'Map',
  created(){
    EventBus.$on('NOW_LOCATE', pos=>{
      this.map.setCenter(pos[0], pos[1])
      this.nowLocate.lat = pos[0];
      this.nowLocate.lng = pos[1];
      console.log("lng"+this.nowLocate.lat)
    });
    
  },
  data(){
    return{
      width: screen.availWidth,
      height: screen.availHeight,
      info: false,
      map: null,
      infoWindow:{
        name: null,
        address : '주소정보가 제공되지 않습니다.',
        phone : '전화번호 정보가 제공되지 않습니다.',
        ware : null,
        soldout: null
      },
      marker: null,
      mapOptions: {
        lat: 37.224944,
        lng: 127.183181,
        zoom: 14,
        minZoom: 14,
        zoomControlOptions: {position: 'TOP_RIGHT'},
      },
        initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN']
      ,
      nowLocate :{
        lat: 0,
        lng: 0
      },
      mask:[],
      }
    },
  methods: {
    onLoad(vue){
      this.map = vue;
      this.nowLocate.lat = Number(this.$route.query.y)
      this.nowLocate.lng = Number(this.$route.query.x)
      this.map.setCenter(Number(this.$route.query.y), Number(this.$route.query.x));
      this.getPharmByGPS(Number(this.$route.query.y), Number(this.$route.query.x));
      
    },
    loadPharm(lat, lng) {
      this.$http.post("/api/loadPharm", {
        lat: lat,
        lng: lng
      })
      .then(response => {
        if (response.status === 200) {
            this.data = response.data;
            if(this.data[0]!= null){
              this.infoWindow.address = this.data[0].address;
              this.infoWindow.phone = this.data[0].phone;
              this.getWareById(this.data[0].id);
            }
              
          }
        });
    },
    getWareById(id) {
      this.$http.post("/api/getWareById/", {
        id : id
      })
      .then(response => {
        if (response.status === 200) {
            this.data = response.data;
            this.infoWindow.ware = this.data[0].monday;
          }
        });
    },
    getSoldoutById(id) {
      this.$http.post("/api/getSoldoutById/", {
        id : id
      })
      .then(response => {
        if (response.status === 200) {
            this.data = response.data;
            this.infoWindow.soldout = this.data[0].monday;
          }
        });
    },
    onNowMarkerLoaded(vue){
      vue.marker.setIcon("https://ifh.cc/g/jC6jUb.png");
    },
    onMarkerLoaded(vue){
      vue.marker.setIcon("https://ifh.cc/g/EmMCH7.png");
    },
    onMarkerClicked(idx) {
      //alert(this.mask[idx].name);
      //console.log();
      this.marker = this.mask[idx]; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.infoWindow.name = this.mask[idx].name;
      this.loadPharm(this.mask[idx].lat, this.mask[idx].lng);
    },
    getPharmByGPS(lat,lng){
      console.log(lat);
      this.$http.post("/api/getPharmByGPS/", {
        lat: lat,
        lng: lng
      })
      .then(response => {
        if (response.status === 200) {
          this.Maskdata = response.data;
          console.log(this.Maskdata);
          this.Maskdata.forEach(element => {
            this.mask.push(element)
          });
          
        }
      });
    }
  },
  mounted(){
    /*Maskdata.storeInfos.forEach(element => {
      this.mask.push(element)
    });*/
  },
  
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
