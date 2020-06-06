<template>
  <div>
      <h5><span class="highlight">{{today}}</span>
       마스크 구매자는 
      <span v-if="!weekend">
           <!-- 평일일 때 -->
           xxx<span class="highlight">{{dateYear.one}}</span> 
           xxx<span class="highlight">{{dateYear.two}}</span>
      </span><!-- 주말일 때 -->
      <span v-else class="highlight">
          {{dateYear.weekend}}
      </span>입니다!
      </h5>
  </div>
</template>

<script>
  export default {
    name: 'PurchasableDay',
    data() {
      return {
        today : "",
        dateYear : {one : null, two : null, weekend:"평일에 구매하지 못한 사람"},
        weekend : true
      }
    },
    mounted() {//뷰 라이프사이클...20200504주석만담
        const today = new Date(); // 오늘 날짜 정보 얻어오기
        const week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
        this.today = week[today.getDay()];
        switch (today.getDay()) {
            case 1: // 월
                this.dateYear.one = 1
                this.dateYear.two = 6
                this.weekend=!this.weekend
                break;
            case 2: // 화
                this.dateYear.one = 2
                this.dateYear.two = 7
                this.weekend=!this.weekend
                break;
            case 3: // 수
                this.dateYear.one = 3
                this.dateYear.two = 8
                this.weekend=!this.weekend
                break;
            case 4: // 목
                this.dateYear.one = 4
                this.dateYear.two = 9
                this.weekend=!this.weekend
                break;
            case 5: // 금
                this.dateYear.one = 5
                this.dateYear.two = 0
                this.weekend=!this.weekend
                break;
        }
    }
  }
        let style = document.createElement('link');
        style.type = "text/css";
        style.rel = "stylesheet";
        style.href = "https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&display=swap";
        document.head.appendChild(style);

</script>
<style scoped>
.highlight{
    color: #374baa;
}

h5{
	font-family: 'Nanum Brush Script', cursive;
	font-size : 30px;
}
</style>