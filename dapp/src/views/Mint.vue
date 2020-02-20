<template lang="pug">
  v-container.about
    Nav
    v-row(cols=6).landing
        v-col(align="center").content
          h1 Create a freshly minted cell
          v-btn Mint a new cell
    
</template>

<script lang="ts">
import Vue from "vue";
import Nav from "@/components/Nav.vue";

export default Vue.extend({
  name: "Mint",
  components: { Nav }
});
</script>

<style lang="sass" scoped>
.content
  margin-top: 35vh
</style>
