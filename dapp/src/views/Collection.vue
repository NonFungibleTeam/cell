<template lang="pug">
  .collection
    Nav
    v-container
      v-row
        v-col(align="center" cols=4 v-for="cell,i in cells" :key="i")
          v-card.cell
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              .level
                v-tooltip(left)
                  template(v-slot:activator="{ on }")
                    v-progress-circular(:value="levelProgress(cell)" size=40 width=6 rotate=-90 v-on="on" color="secondary")
                      span {{ level(cell) }}
                  .level-progress
                    span {{ cell.mass }} of {{ 2 ** (level(cell)+3) }}
                    br
                    span to level {{ level(cell) + 1 }}
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
import Cell from "@/components/Cell.vue";
import Nav from "@/components/Nav.vue";
import cellUtils from "@/mixins/cellUtils.js";

export default {
  name: "Home",
  mixins: [cellUtils],
  components: {
    Nav,
    Cell
  },
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
    ]
  })
};
</script>
