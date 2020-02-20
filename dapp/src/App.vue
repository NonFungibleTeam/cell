<template lang="pug">
  v-app
    v-content
      router-view
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({})
});
</script>

<style lang="sass">
body
  background-color: #121212
  font-family: sans-serif
.title
  font-family: "Pangolin"
  font-size: 2rem
  color: #ffffff !important
  text-decoration: none
  
</style>
