<template>
  <div>
    <b-form-group>
      <b-container fluid>
        <b-row align-h="center">
          <b-col cols="3"></b-col>
          <b-col cols="5">
            <b-form-input v-model="input" placeholder="Enter your name" @keyup.enter="search"></b-form-input>
          </b-col>
          <b-col cols="3">
            <b-button variant="outline-primary" size="lg" align-v="center" v-on:click="search">검색</b-button>
          </b-col>
          <b-col cols="3"></b-col>
        </b-row>
        <b-row align-h="center">
          <b-list-group class="result">
            <b-list-group-item button v-for="item in result" v-bind:key="item" style="width : 450px">
                {{item[0]}}<br>
                <span class="address">{{item[1]}}<br>
                {{item[2]}}</span>
            </b-list-group-item>
          </b-list-group>
        </b-row>
      </b-container>
    </b-form-group>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Search',
  data(){
    return{
      input : null,
      result : []
    }
  },
  methods: {
    search : function() {
       axios.get(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${this.input}`,{
         headers : {
            Authorization : "KakaoAK a9097fe91a8fee412422c6e09e4ea2fd"
         }
       })
        .then(res=>
            this.result = res.data.documents.map(x=>[x.place_name, x.address_name, x.road_address_name, x.x, x.y])
          )
        .catch(error=>console.log(error))
    },

  }
}
</script>
<style scoped>
.result{
    height: 250px;
    overflow: auto;
}
.address{
    font-size: .8rem;
    color: gray;
}
</style>