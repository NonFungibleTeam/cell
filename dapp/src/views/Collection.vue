<template lang="pug">
  .collection
    Nav
    v-container
      v-row(no-gutters)
        v-col(align="center" xl="3" lg="4" sm="6" xs="12" v-for="cell,i in cells" :key="i")
          v-card.cell
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              Level(:mass="cell.mass")
            v-card-text
              Cell(:id="i" :mass="cell.mass" :features="cell.features")
            v-divider
            v-card-actions
              v-spacer
              v-btn(:to="'/cell/' + i") View
              v-btn(color="primary") Merge
              v-btn(color="primary") Divide
</template>

<script>
import Nav from "@/components/Nav.vue";
import Cell from "@/components/Cell.vue";
import Level from "@/components/Level.vue";

import cellUtils from "@/mixins/cellUtils.ts";

export default {
  name: "Home",
  mixins: [cellUtils],
  components: { Nav, Cell, Level },
  data: () => ({
    cells: [
      {
        mass: 15,
        features: {
          body: {
            rounded: false,
            waves: [0, 1, 2, 3],
            color: "#efcc35",
            gradient: ["#ccddcc", "#9999ff", "#449944"]
          },
          nucleus: {
            color: "#f56",
            size: 60
          },
          endo: {
            color: "#00f"
          },
          mitochondria: {
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
      },
      {
        mass: 17,
        features: {
          body: {
            rounded: false,
            waves: [1, 0, 2, 3],
            color: "#efcc35",
            gradient: ["#ccddcc", "#cc8899", "#aa5544"]
          },
          nucleus: {
            color: "#f56",
            size: 60
          },
          endo: {
            color: "#00f"
          },
          mitochondria: {
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
      },
      {
        mass: 1046,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
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
          mitochondria: {
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
      },
      {
        mass: 75,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
            color: "#efcc35",
            gradient: ["#332233", "#117733", "#99bb00"]
          },
          nucleus: {
            color: "#f56",
            size: 60
          },
          endo: {
            color: "#00f"
          },
          mitochondria: {
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
    ]
  })
};
</script>

<style lang="sass" scoped>
.cell
  margin: 1rem
</style>