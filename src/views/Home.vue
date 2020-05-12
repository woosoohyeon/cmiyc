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
    <b-row align-h="center" class="mt-4">
      <GetTime/>
    </b-row>
    <b-row align-h="center" class="mt-3 mb-4">
      <!-- 현재위치 받은 후 지도로 이동 -->
      <router-link to="/map">
      <b-button variant="info" @click="nowLocate()">현재위치로 확인하기</b-button>
      </router-link>
    </b-row>
    <router-view/>
      <!-- 주소 검색 -->
      <Search/>
      <!-- 주소 검색 끝 -->

  </b-container>
  <b-modal id="notice" title="공지사항" hide-footer>
    <p>1. 우수현우수현우수현우수현우수현우수현우수현우수현우수현입니다</p>
    <p>2. 우수현우수현우수현우수현우수현우수현우수현우수현우수현입니다</p>
    <p>3. 우수현우수현우수현우수현우수현우수현우수현우수현우수현입니다</p>
    <p>4. 우수현우수현우수현우수현우수현우수현우수현우수현우수현입니다</p>
    <b-button class="mt-3" block @click="$bvModal.hide('notice')">확인</b-button>
  </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import Purchasable from '@/components/PurchasableDay'
import GetTime from '@/components/GetTime'
import Search from '@/components/Search'
import EventBus from '@/eventbus'

export default {
  name: 'Home',
  methods: {
    nowLocate(){
      let locate = localStorage.getItem('nowlocate');
      if(!locate){
        navigator.geolocation.getCurrentPosition(
          pos=>{
            EventBus.$emit('NOW_LOCATE', [pos.coords.latitude, pos.coords.longitude])
            this.$router.push('map')}
          ,(err)=>console.log(err)
        )
      }
    }
  },
  components: {
    Purchasable, GetTime, Search
  },
  mounted() {
    this.$bvModal.show('notice')
  }
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
</style>
