<template>
  <div class="home">
  <b-container>
    <!-- 제목 시작 -->
    <b-row align-h="center" class="title">
      <h1>Catch Mask If You Can</h1>
    </b-row>
    <b-row align-h="center">
      <Purchasable/>
    </b-row>
    <!-- 제목 끝 -->
    <b-row align-h="center" class="mt-4 mb-3">
      <GetTime/>
    </b-row>
    <b-row align-h="center">
      <!-- 주소 입력창 시작 -->
      <b-col cols="2"></b-col>
      <b-col cols="5">
      <b-form-input size="lg" placeholder="주소를 입력해주세요!"></b-form-input>
      <!-- 주소 입력창 끝 -->
      </b-col>
      <!-- 검색 버튼 시작 -->
      <b-col cols="2">
        <router-link to="/map">
          <b-button variant="outline-primary" size="lg" align-v="center">검색</b-button>
        </router-link>
      </b-col>
      <!-- 검색 버튼 끝 -->
    </b-row>
    <b-row align-h="center" class="mt-3">
      <!-- 현재위치 받은 후 지도로 이동 -->
      <router-link to="/map">
      <b-button variant="info" @click="nowLocate()">현재위치로 확인하기</b-button>
      </router-link>
    </b-row>
    <router-view/>
  </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Purchasable from '../components/PurchasableDay'
import GetTime from '../components/GetTime'

export default {
  name: 'Home',
  methods: {
    nowLocate(){
      let locate = localStorage.getItem('nowlocate');
      if(!locate){
        navigator.geolocation.getCurrentPosition(
          (pos)=>{
            let nowlocate = {
              lat : pos.coords.latitude,
              lng : pos.coords.longitude
            }
            localStorage.setItem('nowlocate', JSON.stringify(nowlocate))
          },
          (err)=>console.err(err)
        )
      }
    }
  },
  components: {
    Purchasable, GetTime
  }
}
</script>
<style scoped>
.title{
  margin-top: 7rem;
}
.search{
  border: 1px solid rgba(0, 0, 0, .6);
  border-radius: 7px;
}
a{
  color: black;
  text-decoration: none;
}
</style>
