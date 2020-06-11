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
    
    <b-sidebar id="sidebar-1" title="Top3 약국" shadow>
      <div class="px-3 py-2">
        <div v-for="(item, idx) in top3" :key="idx">
          <b-container fluid>
            <h5>Top{{idx+1}}</h5>
            <h4>{{item.pharm.name}}</h4>
            <small>거리 : {{item.distance.toFixed(4)}}km</small><br/>
            <small>{{item.address}}</small>
            <b-card-text style="font-weight: bold;">{{item.pharm.phone}}</b-card-text>
            <b-row>
              <b-col>
                <small>예상 입고 시간</small><br/>
                <small style="font-weight: bold;" >{{item.ware}}</small>
              </b-col>
              <b-col>
                <small>예상 매진 시간</small><br/>
                <small style="font-weight: bold;" >{{item.soldout}}</small>
              </b-col>
            </b-row>
            <br/>
            <br/>
            <br/>
          </b-container>
        </div>
      </div>
    </b-sidebar>
    <naver-maps
      :height="height"
      :width="width"
      :mapOptions="mapOptions"
      :initLayers="initLayers"
      @load="onLoad">
      <naver-marker v-for="(item, idx) in mask" :key="idx" :lat="item.pharm.lat" :lng="item.pharm.lng" @click="onMarkerClicked(idx)" @load="onMarkerLoaded"></naver-marker>
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
            <small>예상 입고 시간</small><br/>
            <small style="font-weight: bold;" >{{infoWindow.ware}}</small>
          </b-col>
          <b-col>
            <small>예상 매진 시간</small><br/>
            <small style="font-weight: bold;" >{{infoWindow.soldout}}</small>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>   
  </div>
</template>
// 네이버 객체가 안잡혀서 최적화 하려고 넣었습니다. 20.06.07
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?clientId=gv7ysohqky"></script>
<script>
//import maskData from '../assets/maskDATA.json'
import EventBus from '@/eventbus'


export default {
  name: 'Map',
  created(){
    
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
        ware : '로딩 중 입니다...',
        soldout: '로딩 중 입니다...'
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
      top3: [],
    }
  },
  methods: {
    onLoad(vue){
      this.map = vue;
      this.nowLocate.lat = Number(this.$route.query.y)
      this.nowLocate.lng = Number(this.$route.query.x)
      var nowLat = this.nowLocate.lat
      var nowLng = this.nowLocate.lng
      this.map.setCenter(nowLat, nowLng);
      this.getPharmByGPS(nowLat, nowLng);
      
      const getPharm = (x,y) => {
        this.nowLocate.lat = y;
        this.nowLocate.lng = x;
        nowLat = this.nowLocate.lat
        nowLng = this.nowLocate.lng
        this.getPharmByGPS(y,x);
      }

      // 현재 지도에 보이는 마커만 표시
      let markers = this.markers

      naver.maps.Event.addListener(vue.map, 'click', function(e) {
        getPharm(e.coord.x, e.coord.y);
        updateMarkers(vue.map, markers);
      });

      naver.maps.Event.addListener(vue.map, 'idle', function() {
        var mapCenter = vue.map.getCenter();
        var DETECT_RANGE = 0.02;
        if(nowLng + DETECT_RANGE < mapCenter.x || 
           nowLng - DETECT_RANGE > mapCenter.x || 
           nowLat + DETECT_RANGE < mapCenter.y || 
           nowLat - DETECT_RANGE > mapCenter.y){
          getPharm(mapCenter.x, mapCenter.y);
        }
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
          //마커 로직 변경으로 hide 해 줄 필요가 없어짐.
          //if (!marker.getMap()) return;
         // marker.setMap(null);
      }
    },
    loadPharm(lat, lng) {
      this.$http.post("/api/loadPharm", { lat: lat, lng: lng })
      .then(response => {
        if (response.status === 200) {
            var data = response.data;
            if(data[0]!= null){
              var date = new Date();
              this.infoWindow.address = data[0].address;
              this.infoWindow.phone = data[0].phone;
              this.getWareById(data[0].id, date.getDay(), null);
              this.getSoldoutById(data[0].id, date.getDay(), null);
            }
          }
        });
    },
    loadPharmById(id) {
      this.$http.post("/api/loadPharmById", { id : id })
      .then(response => {
        if (response.status === 200) {
            var data = response.data;
            if(data[0]!= null){
              var date = new Date();
              this.infoWindow.address = data[0].address;
              this.infoWindow.phone = data[0].phone;
              this.getWareById(data[0].id, date.getDay(), null);
              this.getSoldoutById(data[0].id, date.getDay(), null);
            }
          }
        });
    }
    ,
    getWareById(id, day, idx) {
      this.$http.post("/api/getWareById/", { id : id })
      .then(response => {
        if (response.status === 200) {
            var data = response.data;
            var selectedData = null;
            switch (day) {
              case 0: selectedData = data[0].sunday;
              case 1: selectedData = data[0].monday;  
              case 2: selectedData = data[0].thusday;             
              case 3: selectedData = data[0].wednesday;
              case 4: selectedData = data[0].thursday;
              case 5: selectedData = data[0].friday;
              case 6: selectedData = data[0].saturday;
            }
            if (selectedData != null){
              this.infoWindow.ware = selectedData;
              if(idx != null) this.top3[idx].ware = selectedData;
            }else{
              this.infoWindow.ware = "알 수 없습니다.";
              if(idx != null) this.top3[idx].ware = "알 수 없습니다.";
            }
          }
        });
    },
    getSoldoutById(id, day, idx) {
      this.$http.post("/api/getSoldoutById/", { id : id })
      .then(response => {
        if (response.status === 200) {
            var data = response.data;
            var selectedData = null;
            switch (day) {
              case 0: selectedData = data[0].sunday;
              case 1: selectedData = data[0].monday;
              case 2: selectedData = data[0].tuesday;
              case 3: selectedData = data[0].wednesday;
              case 4: selectedData = data[0].tursday;
              case 5: selectedData = data[0].friday;
              case 6: selectedData = data[0].saturday;
            }
            if (selectedData != null){
              this.infoWindow.soldout = selectedData;
              if(idx != null) this.top3[idx].soldout = selectedData;
            }else{
              this.infoWindow.soldout = "알 수 없습니다.";
              if(idx != null) this.top3[idx].soldout = "알 수 없습니다.";
            }
            
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
      this.marker = this.mask[idx].pharm; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.infoWindow.name = this.mask[idx].pharm.name;
      this.loadPharm(this.mask[idx].pharm.lat, this.mask[idx].pharm.lng);
      this.$bvModal.show('marker_info');
    },
    getPharmByGPS(lat,lng){
      this.$http.post("/api/getPharmByGPS/", {
        lat: lat,
        lng: lng
      })
      .then(response => {
        if (response.status === 200) {
          this.mask=[];
          var maskData = response.data;
          maskData.forEach(element => {
            var mask = {
              pharm: null,
              distance: 99,
              ware: null,
              soldout: null
            }
            mask.pharm = element;
            mask.distance = this.getDistanceInKm(this.nowLocate.lat, this.nowLocate.lng, element.lat, element.lng);
            this.mask.push(mask);
          });
          this.mask.sort(function (a, b) { 
            return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;  
          });
          this.getTop3();
        }
      });
    },
    deg2rad(deg) {
      return deg * (Math.PI/180);
    },
    getDistanceInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    },
    getTop3(){
      this.top3 = [];
      var date = new Date();
      var TOP3_MAX_SIZE = 3;
      if(this.mask.length >= TOP3_MAX_SIZE){
        for (var idx = 0; idx < TOP3_MAX_SIZE; idx++){
          this.top3.push(this.mask[idx]);
          this.top3[idx].ware = this.getWareById(this.mask[idx].pharm.id, date.getDay(),idx);
          this.top3[idx].soldout = this.getSoldoutById(this.mask[idx].pharm.id, date.getDay(),idx);
        }
      }
    }
  },
  mounted(){
    /*Maskdata.storeInfos.forEach(element => {
      this.mask.push(element)
    });*/
  },

}
</script>
<!— Add "scoped" attribute to limit CSS to this component only —>
<style scoped>
</style>