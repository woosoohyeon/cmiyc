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
                <small style="font-weight: bold;" >{{item.pharm.ware}}</small>
              </b-col>
              <b-col>
                <small>예상 30% 소진 시간</small><br/>
                <small style="font-weight: bold;" >{{item.pharm.tosome}}</small>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <small>예상 70% 소진 시간</small><br/>
                <small style="font-weight: bold;" >{{item.pharm.tofew}}</small>
              </b-col>
              <b-col>
                <small>예상 매진 시간</small><br/>
                <small style="font-weight: bold;" >{{item.pharm.soldout}}</small>
              </b-col>
            </b-row>
            <br/>
            <br/>
            <br/>
          </b-container>
        </div>
      </div>
    </b-sidebar>
    <naver-maps :height="height" :width="width" :mapOptions="mapOptions" :initLayers="initLayers" @load="onLoad">
      <naver-marker v-for="(item, idx) in few"    :key="item.pharm.id" :lat="item.pharm.lat" :lng="item.pharm.lng"  @click="onFewMarkerClicked(idx)"     @load="onFewMarkerLoaded" />
      <naver-marker v-for="(item, idx) in some"   :key="item.pharm.id" :lat="item.pharm.lat" :lng="item.pharm.lng"  @click="onSomeMarkerClicked(idx)"    @load="onSomeMarkerLoaded" />
      <naver-marker v-for="(item, idx) in plenty" :key="item.pharm.id" :lat="item.pharm.lat" :lng="item.pharm.lng"  @click="onPlentyMarkerClicked(idx)"  @load="onPlentyMarkerLoaded" />
      <naver-marker v-for="(item, idx) in empty"  :key="item.pharm.id" :lat="item.pharm.lat" :lng="item.pharm.lng"  @click="onEmptyMarkerClicked(idx)"   @load="onEmptyMarkerLoaded" />
      <!-- 위치제공 동의를 하지 않으면 현재위치를 마커로 표시하지 않습니다. -->
      <naver-marker :lat="nowLocate.lat" :lng="nowLocate.lng" @load="onNowMarkerLoaded"></naver-marker>
    </naver-maps>
    <!-- 모달 인포윈도우 -->
    <b-modal id="marker_info" size="md" centered hide-footer hide-header>
      <b-container fluid>
        <h4 class="text-center">{{infoWindow.name}}</h4>
        <h6 style="text-align:center;">{{infoWindow.address}}</h6>
        <b-card-text class="text-center" style="font-weight: bold;">{{infoWindow.phone}}</b-card-text>
        <b-row>
          <b-col>
            <small>예상 입고 시간</small><br/>
            <small style="font-weight: bold;" >{{infoWindow.ware}}</small>
          </b-col>
          <b-col>
            <small>예상 30% 소진 시간</small><br/>
            <small style="font-weight: bold;" >{{infoWindow.tosome}}</small>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <small>예상 70% 소진 시간</small><br/>
            <small style="font-weight: bold;" >{{infoWindow.tofew}}</small>
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
        phone   : '전화번호 정보가 제공되지 않습니다.',
        ware    : '로딩 중 입니다...',
        soldout : '로딩 중 입니다...',
        tosome  : '로딩 중 입니다...',
        tofew   : '로딩 중 입니다...',
      },
      marker: null,
      mapOptions: {
        lat     : 37.224944,
        lng     : 127.183181,
        zoom    : 14,
        minZoom : 14,
        zoomControlOptions: {position: 'TOP_RIGHT'},
      },
        initLayers: ['BACKGROUND', 'BACKGROUND_DETAIL', 'POI_KOREAN']
      ,
      nowLocate :{ lat: 0, lng: 0 },
      mask            : [],
      fewMarkers      : [],
      plentyMarkers   : [],
      someMarkers     : [],
      emptyMarkers    : [],
      top3            : [],
      plenty          : [],
      some            : [],
      empty           : [],
      few             : [],
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
      const reloadPharm = (x,y) => {
        this.nowLocate.lat = y;
        this.nowLocate.lng = x;
        nowLat = this.nowLocate.lat
        nowLng = this.nowLocate.lng
        this.reloadPharm();
      }

      const updateAll = (map) => {
        updateMarkers(map, fewMarkers);
        updateMarkers(map, someMarkers);
        updateMarkers(map, plentyMarkers);
        updateMarkers(map, emptyMarkers);
      }
      // 현재 지도에 보이는 마커만 표시

      let fewMarkers = this.fewMarkers;
      let someMarkers = this.someMarkers;
      let plentyMarkers = this.plentyMarkers;
      let emptyMarkers = this.emptyMarkers;

      naver.maps.Event.addListener(vue.map, 'click', function(e) {
        reloadPharm(e.coord.x, e.coord.y);
        updateAll(vue.map);
      });

      naver.maps.Event.addListener(vue.map, 'idle', function() {
        var mapCenter = vue.map.getCenter();
        var DETECT_RANGE = 0.02;
        if(nowLng + DETECT_RANGE < mapCenter.x || nowLng - DETECT_RANGE > mapCenter.x || 
           nowLat + DETECT_RANGE < mapCenter.y || nowLat - DETECT_RANGE > mapCenter.y){
          getPharm(mapCenter.x, mapCenter.y);
        }
        updateAll(vue.map);
      });

      function updateMarkers(map, markers) {
          var mapBounds = map.getBounds();
          var marker, position;
          for (var i = 0; i < markers.length; i++) {
              marker = markers[i]
              //position = marker.getPosition();
              //if (mapBounds.hasLatLng(position)) {
                showMarker(map, marker);
              //} else {
              //  hideMarker(map, marker);
              //}
          }
      }
      function showMarker(map, marker) {
          if (marker.getMap()) return;
          marker.setMap(map);
      }
      function hideMarker(map, marker) {
        //마커 로직 변경으로 hide 해 줄 필요가 없어짐.
        //if (!marker.getMap()) return;
        //  marker.setMap(null);
      }
    },
    getDateString(day){
      switch (day) {
        case 0: return "sunday"
        case 1: return "monday";
        case 2: return "tuesday";
        case 3: return "wednesday";
        case 4: return "thursday";
        case 5: return "friday";
        case 6: return "saturday";
      }
    },
    onNowMarkerLoaded(vue){    vue.marker.setIcon("https://ifh.cc/g/jC6jUb.png"); },
    onFewMarkerLoaded(vue){    vue.marker.setIcon("https://ifh.cc/g/DBv0FO.png"); this.fewMarkers.push(vue.marker);    },
    onSomeMarkerLoaded(vue){   vue.marker.setIcon("https://ifh.cc/g/KtzXJn.png"); this.someMarkers.push(vue.marker);   },
    onEmptyMarkerLoaded(vue){  vue.marker.setIcon("https://ifh.cc/g/YEWqcf.png"); this.emptyMarkers.push(vue.marker);  },
    onPlentyMarkerLoaded(vue){ vue.marker.setIcon("https://ifh.cc/g/86P9lz.png"); this.plentyMarkers.push(vue.marker); },
    updateInfo(pharm){
      this.infoWindow.address = pharm.address;
      this.infoWindow.phone = pharm.phone;
      this.infoWindow.name = pharm.name;
      this.infoWindow.tofew = pharm.tofew;
      this.infoWindow.tosome = pharm.tosome;
      this.infoWindow.ware = pharm.ware;
      this.infoWindow.soldout = pharm.soldout;
    },
    onFewMarkerClicked(idx) {
      this.marker = this.few[idx].pharm; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.updateInfo(this.few[idx].pharm);
      this.$bvModal.show('marker_info');
    },
    onEmptyMarkerClicked(idx) {
      this.marker = this.empty[idx].pharm; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.updateInfo(this.empty[idx].pharm);
      this.$bvModal.show('marker_info');
    },
    onPlentyMarkerClicked(idx) {
      this.marker = this.plenty[idx].pharm; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.updateInfo(this.plenty[idx].pharm);
      this.$bvModal.show('marker_info');
    },
    onSomeMarkerClicked(idx) {
      this.marker = this.some[idx].pharm; // 현재 마커 할당
      this.info = !this.info; // 인포 윈도우 표시
      this.updateInfo(this.some[idx].pharm);
      this.$bvModal.show('marker_info');
    },
    reloadPharm(){
      var tempMask = this.mask;
      this.mask = [];
      tempMask.forEach(element => {
        element.distance = this.getDistanceInKm(this.nowLocate.lat, this.nowLocate.lng, element.pharm.lat, element.pharm.lng);
        this.mask.push(element);
      });
      this.mask.sort(function (a, b) { 
        return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;  
      });
      this.getTop3();
    },
    getPharmByGPS(lat,lng){
      var day = this.getDateString(new Date().getDay());
      this.$http.post("/api/getPharmByGPS/", {
        lat: lat,
        lng: lng,
        day: day
      })
      .then(response => {
        if (response.status === 200) {
          this.mask = [];
          this.few = [];
          this.some = [];
          this.empty = [];
          this.plenty = [];
          var maskData = response.data;
          maskData.forEach(element => {
            var mask = {
              pharm: null,
              distance: 99,
            }
            mask.pharm = element;
            mask.distance = this.getDistanceInKm(this.nowLocate.lat, this.nowLocate.lng, element.lat, element.lng);
            mask.soldout = element.soldout
            this.mask.push(mask);
            var time = this.$route.query.time
            if(time == '' || time == null){
              var d = new Date();
              var s = ''
              if(d.getHours().length == 1)    s += '0'+ d.getHours() + ":"
              else s += d.getHours() + ":"

              if(d.getMinutes().length == 1)  s += '0'+ d.getMinutes() + ':'
              else s += d.getMinutes() + ':'

              if(d.getSeconds().length == 1)  s += '0' + d.getSeconds()
              else s += d.getSeconds()

              time = s
            }

            var subfew    = 9999996
            var subsome   = 9999997
            var subempty  = 9999998
            var subplenty = 9999999
            var mmm = [subfew,subsome,subempty,subplenty]


            if(mask.pharm.tofew != null){
              var t1 = Number(time.replace(":","").replace(":",""))
              var t2 = Number(mask.pharm.tofew.replace(":","").replace(":",""))
              mmm[0] = Math.abs(t1 - t2)
              subfew = (t1-t2)
            }
            if(mask.pharm.tosome != null){
              var t1 = Number(time.replace(":","").replace(":",""))
              var t2 = Number(mask.pharm.tosome.replace(":","").replace(":",""))
              mmm[1] = Math.abs(t1 - t2)
              subsome = (t1-t2)
            }
            if(mask.pharm.soldout != null){
              var t1 = Number(time.replace(":","").replace(":",""))
              var t2 = Number(mask.pharm.soldout.replace(":","").replace(":",""))
              mmm[2] = Math.abs(t1 - t2)
              subempty = (t1-t2)
            }
            if(mask.pharm.ware != null){
              var t1 = Number(time.replace(":","").replace(":",""))
              var t2 = Number(mask.pharm.ware.replace(":","").replace(":",""))
              mmm[3] = Math.abs(t1 - t2)
              subplenty = (t1-t2)
            }
            
            mmm.sort();

            if(mask.pharm.soldout == null) mask.pharm.soldout = "매진 안 됨"
            if(mask.pharm.tosome == null)  mask.pharm.tosome = "알 수 없음"
            if(mask.pharm.tofew == null)   mask.pharm.tofew = "알 수 없음"
            if(mask.pharm.ware == null)    mask.pharm.ware = "알 수 없음"
            

            if(mmm[0] > 9999990){
              //Nothing
            }else if(mmm[0] == Math.abs(subfew)){
              if(subfew > 0) this.few.push(mask)
              else this.some.push(mask)
            }else if(mmm[0] == Math.abs(subsome)){
              if(subsome > 0 ) this.some.push(mask)
              else this.plenty.push(mask)
            }else if(mmm[0] == Math.abs(subempty)){
              if(subempty >= 0) this.empty.push(mask)
              else this.few.push(mask)
            }else if(mmm[0] == Math.abs(subplenty)){
              this.plenty.push(mask)
            }
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
      var TOP3_MAX_SIZE = 3;
      if(this.mask.length >= TOP3_MAX_SIZE){
        for (var idx = 0; idx < TOP3_MAX_SIZE; idx++){
          this.top3.push(this.mask[idx]);
        }
      }
    },
  },
  mounted(){

  },

}
</script>
<style scoped>
</style>