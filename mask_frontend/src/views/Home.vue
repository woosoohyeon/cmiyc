<template>
  <div class="home">
  <b-container>
    <!-- 제목 시작 -->
    <b-row align-h="center" class="title">
    <img src="../../public/mainLogo.png" alt="My Image">
    </b-row>
    <b-row align-h="center">
      <Purchasable/>
    </b-row>
    <!-- 제목 끝 -->
    <b-row align-h="center" class="mt-4">
      <div>
        <b-form-timepicker id="dp3" v-model="selectedTime" locale="ko" ></b-form-timepicker>
      </div> 
    </b-row>
    <b-row align-h="center" class="mt-3 mb-4">
      <!-- 현재위치 받은 후 지도로 이동 -->
      
      <b-button variant="info" @click="nowLocate" id="CurrentPosion">현재위치로 확인하기</b-button>
    </b-row>
      <!-- 주소 검색 -->
      <Search v-bind:parentData="selectedTime" />
  </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Purchasable from '@/components/PurchasableDay'
import Search from '@/components/Search'

export default {
  name: 'Home',
  data(){
    return{
      selectedTime: null
    }
  },
  methods: {
    nowLocate(){
      console.log(this.selectedTime)
      navigator.geolocation.getCurrentPosition(
        pos=>{
          this.$router.push({ path: 'map', query: {x: pos.coords.longitude, y: pos.coords.latitude, time: this.selectedTime }})
        });
    }
  },
  components: {
    Purchasable, Search
  },
}
</script>
<style scoped>
.title{
  margin-top: 1rem;
}
.search{
  border: 1px solid rgba(0, 0, 0, .6);
  border-radius: 7px;
}
a{
  color: black;
  text-decoration: none;
}
img{
	width : 40%;
}
#CurrentPosion{
  border: 1px solid #374baa;
  background-color: #374baa;
}
</style>
