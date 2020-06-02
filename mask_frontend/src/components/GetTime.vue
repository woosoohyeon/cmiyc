<!-- bootstrap의 b-form-timepicker사용 20200501김민지주석만작성-->
<template>
  <div>
   <b-form-timepicker v-model="selectedTime" locale="en"></b-form-timepicker>    
  </div>
</template>

<script>
  export default {
    name: 'GetTime',
    data() {
      return {
          selectedTime: null
      }
    },
  }
</script>
<style scoped>
</style>