<template>
  <div class="home">
    <Cell msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Cell from "@/components/Cell.vue";

export default {
  name: "Home",
  components: {
    Cell
  }
};
</script>
