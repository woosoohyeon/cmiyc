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