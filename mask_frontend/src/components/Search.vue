<template>
  <div>
    <b-form-group>
      <b-container fluid>
        <b-row align-h="center">
          <b-col cols="3" />
          <b-col cols="5" id = "SearchWrap">
            <b-form-input v-model="input" placeholder="Enter your name" @keyup="search"></b-form-input>
			<b-button variant="outline-primary" size="" align-v="center" v-on:click="search" id="searchBtn">
				<img src="../../public/serch.png" alt="My Image">
			</b-button>
          </b-col>
          <b-col cols="3" />
        </b-row>
        <b-row align-h="center">
          <b-list-group class="result">
            <b-list-group-item button v-for="(item, idx) in result" v-bind:key="idx" style="width : 450px">
              <b-container v-on:click="newLocate(item[3],item[4])">
                {{item[0]}}<br>
                <span class="address">{{item[1]}}<br>
                {{item[2]}}</span>
              </b-container>
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
  props: ['parentData'],
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
            this.result = res.data.documents.map(x=>
            [x.place_name, x.address_name, x.road_address_name, x.x, x.y])
          )
        .catch(error=>console.log(error))
    },
    newLocate(x,y){
      this.$router.push({ path: 'map', query: { x: x, y: y, time: this.parentData }})
    }
  }//
}
</script>
<style scoped>
.result{
    height: 450px;
    overflow: auto;
}
.address{
    font-size: .8rem;
    color: gray;
}
input{
	border : none;
	float: left;
	width : 85%;
	margin-right : 10px;
}
#searchBtn{
	border : none;
	float: right;
	width : 10%;
	height : calc(1.5em + 0.75rem + 0px);
    padding : 0;
}
#searchBtn:hover{
	background-color:#fff;
	opacity: 1.0;
    border : none;
}
#SearchWrap{
    padding-top : 5px;
    padding-left : 20px;
    position: relative;
	height : calc(1.5em + 0.75rem + 15px);
	border: solid 1px #006ecb;
	background-color: #ffffff;
	border-radius: 40px;
    overflow:visible; 
}
#searchBtn > img{
    display : block;
    width : 20px; 
    margin: 0 auto;

}

</style>