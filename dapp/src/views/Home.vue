<template lang="pug">
  .home
    v-container(flex)
      v-row(align="center" flex)
        v-col(cols="5")
          Cell
        v-col(cols="5").mt-5
          v-card.text.text-center
            v-card-text
              h1 NFT Cells
              h3 Merge
              h3 Divide
              h3 Level Up
              v-btn(color="secondary" to="/mint") Start Playing Now
              
              .web3(v-if="isDrizzleInitialized")
                p :)
                p {{ activeAccount }}
</template>

<script>
// @ is an alias to /src
import Cell from "@/components/Cell.vue";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Cell
  },
  computed: {
    ...mapGetters("accounts", ["activeAccount", "activeBalance"]),
    ...mapGetters("drizzle", ["isDrizzleInitialized"])
  }
};
</script>
