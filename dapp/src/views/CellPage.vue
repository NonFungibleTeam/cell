<template lang="pug">
  v-container.mint
    Nav
    v-row(cols=6).landing
        v-col(align="center").content
          h1 # {{ $route.params.id }}

    
</template>

<script lang="ts">
import Vue from "vue";
import Cell from "@/components/Cell.vue";
import Nav from "@/components/Nav.vue";

export default Vue.extend({
  name: "CellPage",
  components: { Nav, Cell }
});
</script>

<style lang="sass" scoped>
.content
  margin-top: 35vh
</style>
