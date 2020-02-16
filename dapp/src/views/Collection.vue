<template lang="pug">
  .collection
    h1.title Collection:
    v-divider
    .list
      v-card(v-for="id in list" width="300").ma-3.pa-3
        Cell
        v-card-title {{ id }}
        v-card-text
          p.display-1.text--primary #1
        v-card-actions
          v-spacer
          v-btn(to="/merge" color="deep-purple accent-4") Merge
          v-btn(to="/divide") Divide
</template>

<script>
import Cell from "@/components/Cell.vue";

export default {
  name: "Home",
  components: {
    Cell
  },
  data: () => ({
    list: [1, 2, 3]
  })
};
</script>