<template lang="pug">
  v-container
    v-row.text-center
      v-col(cols="12")
        .shape
</template>

<script lang="ts">
import Vue from "vue";
import { SVG } from "@svgdotjs/svg.js";

export default Vue.extend({
  name: "Cell",
  data: () => ({}),
  mounted() {
    // const draw = SVG()
    //   .addTo(".shape")
    //   .size(300, 300);
  }
});
</script>
