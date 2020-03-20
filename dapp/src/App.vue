<template lang="pug">
  v-app
    Nav(v-if="this.$route.path !== '/'")
    v-content
      router-view
</template>

<script>
import Vue from "vue";
import Nav from "@/components/Nav.vue";

export default Vue.extend({
  name: "App",
  components: { Nav },
  data: () => ({}),
});
</script>

<style lang="sass">
body
  margin: 0
  background-color: #121212
  font-family: sans-serif
.title
  font-family: "Pangolin"
  font-size: 2rem
  color: #ffffff !important
  text-decoration: none
  
</style>
