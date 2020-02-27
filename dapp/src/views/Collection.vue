<template lang="pug">
  .collection
    v-app-bar(v-if="cells.length" absolute collapse dense)
      v-btn Mint
    v-container
      v-row(no-gutters)
        v-col(v-for="cell,i in cells" :key="i" align="center" xl="3" lg="4" sm="6" xs="12")
          v-card.cell
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              Level(:mass="cell.mass")
            v-card-text.cell-wrapper
              Cell(:id="i" :mass="cell.mass" :features="cell.features")
            v-divider
            v-card-actions
              v-spacer
              v-btn(:to="'/cell/' + i") View
              v-btn(color="primary") Merge
              v-btn(color="primary") Divide
        v-col(v-if="!cells.length").get-started
          v-card(align="center").get-started-card
            p You dont have any cells yet!
            v-btn(outlined color="secondary") Mint
            span &nbsp;or&nbsp;
            v-btn(outlined color="secondary") Buy
            p one to get started
</template>

<script>
import Nav from "@/components/Nav.vue";
import Cell from "@/components/Cell.vue";
import Level from "@/components/Level.vue";

import cellUtils from "@/mixins/cellUtils";

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
            count: 1
          },
          endo: {
            color: "#00f",
            count: 0
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
            count: 0
          },
          endo: {
            color: "#00f",
            count: 1
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
            count: 1
          },
          endo: {
            color: "#00f",
            count: 1
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
            count: 1
          },
          endo: {
            color: "#00f",
            count: 1
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
.cell-wrapper
  padding: 0
.get-started
  justify-content: center
  margin-top: 20vh
.get-started-card
  display: flex
  flex-direction: column
  padding: 2rem 
</style>