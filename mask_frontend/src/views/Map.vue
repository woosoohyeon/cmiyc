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
    <b-modal id="marker_info" size="sm" centered hide-footer hide-header>
      <b-container fluid>
        <h4 class="text-center">{{infoWindow.name}}</h4>
        <small>{{infoWindow.address}}</small>
        <b-card-text style="font-weight: bold;">{{infoWindow.phone}}</b-card-text>
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
    </b-modal>
  </div>
</template>
// 네이버 객체가 안잡혀서 최적화 하려고 넣었습니다. 20.06.07 연권
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=gv7ysohqky"></script>
<script>
import maskData from '../assets/maskDATA.json'
import EventBus from '@/eventbus'


export default {
  name: 'Map',
  created(){
    EventBus.$on('NOW_LOCATE', pos=>{
      this.map.setCenter(pos[0], pos[1])
      this.nowLocate.lat = pos[0];
      this.nowLocate.lng = pos[1];
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
      markers:[],
    }
  },
  methods: {
    onLoad(vue){
      // 현재 지도에 보이는 마커만 표시
      let markers = this.markers
      naver.maps.Event.addListener(vue.map, 'idle', function() {
        updateMarkers(vue.map, markers);
      });
      function updateMarkers(map, markers) {
          var mapBounds = map.getBounds();
          var marker, position;
          for (var i = 0; i < markers.length; i++) {
              marker = markers[i]
              position = marker.getPosition();
              if (mapBounds.hasLatLng(position)) {
                  showMarker(map, marker);
              } else {
                  hideMarker(map, marker);
              }
          }
      }
      function showMarker(map, marker) {
          if (marker.getMap()) return;
          marker.setMap(map);
      }
      function hideMarker(map, marker) {
          if (!marker.getMap()) return;
          marker.setMap(null);
      }



      this.map = vue;
      this.nowLocate.lat = Number(this.$route.query.y)
      this.nowLocate.lng = Number(this.$route.query.x)
      this.map.setCenter(Number(this.$route.query.y), Number(this.$route.query.x))
      
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
      this.markers.push(vue.marker);
    },
    onMarkerClicked(idx) {
      this.marker = this.mask[idx]; // 현재 마커 할당
      this.$bvModal.show('marker_info')
      this.infoWindow.name = this.mask[idx].name;
      this.infoWindow.address = this.mask[idx].addr;
      console.log(this.mask[idx]);
      this.loadPharm(this.mask[idx].lat, this.mask[idx].lng);
    },
  },
  mounted(){
    // 마스크 데이터 가공
    maskData.storeInfos.forEach(element => {
      this.mask.push(element)
    });

  },

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
