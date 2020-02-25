<template lang="pug">
  .cell-page
    Nav
    v-card
      v-container
        v-row
          v-col(align="center").cell-graphic
            Cell(:id="$route.params.id" :mass="cell.mass" :features="cell.features")
          v-col.cell-info
            h1 {{ "#" + $route.params.id }}
            .level
              v-tooltip(left)
                template(v-slot:activator="{ on }")
                  v-progress-circular(:value="levelProgress(cell)" size=40 width=6 rotate=-90 v-on="on" color="secondary")
                    span {{ level(cell) }}
                .level-progress
                  span {{ cell.mass }} of {{ 2 ** (level(cell)+3) }}
                  br
                  span to level {{ level(cell) + 1 }}

    
</template>

<script lang="ts">
import Vue from "vue";
import Cell from "@/components/Cell.vue";
import Nav from "@/components/Nav.vue";
import cellUtils from "@/mixins/cellUtils.js";

export default Vue.extend({
  name: "CellPage",
  mixins: [cellUtils],
  components: { Nav, Cell },
  data: () => ({
    cell: {
      mass: 541,
      features: {
        body: {
          rounded: false,
          waves: [2, 1, 1, 0],
          color: "#efcc35",
          gradient: ["#ccddcc", "#773311", "#337744"]
        },
        nucleus: {
          color: "#f56",
          size: 60
        },
        endo: {
          color: "#00f"
        },
        mitocondria: {
          color: "#f33",
          count: 6
        },
        chloroplasts: {
          color: "#3f5",
          count: 4
        },
        lisosomes: {
          color: "#ff0",
          count: 1
        },
        ribosomes: {
          color: "#66f",
          count: 4
        }
      }
    }
  })
});
</script>

<style lang="sass" scoped>
.content
  margin-top: 35vh
</style>
