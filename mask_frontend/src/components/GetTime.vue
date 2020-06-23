<!-- bootstrap의 b-form-timepicker사용 20200501김민지주석만작성-->

<template>
  <div>
       
  </div>
</template>

<script>
  import Vue from "vue";
  export const EventBus = new Vue();

  export default {
    name: 'GetTime',
    data() {
      return {
          
      }
    },
    methods: {
      
    },
    mounted(){
      console.log(this.selectedTime)
      this.$emit('time', this.SelectedTime)
    }
    
  }
 
</script>
<style scoped>
</style>