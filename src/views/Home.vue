<template>
  <div class="home">
  <v-container>
    <v-row class="title">
      <v-col></v-col>
      <v-col cols="5"><h1>Catch Mask If You Can</h1></v-col>
      <v-col></v-col>
    </v-row>
    <v-row class="search">
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-textarea
        label="주소를 입력해주세요!"
        outlined
        rows="1"
        row-height="1"
      ></v-textarea>
      </v-col>
      <v-col cols="3">
        <router-link to="/map">
          <v-btn text large color="primary">검색</v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-row class="nav">
      <v-col></v-col>
      <v-col>
        <v-btn text large color="primary" @click="nowLocate()">현재위치로 확인하기</v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>
    <router-view/>
  </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
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
  }
}
</script>
<style scoped>
.title{
  margin-top: 4rem;
}
.search{
  margin-top: 3rem;
}
a{
  color: black;
  text-decoration: none;
}
</style>
