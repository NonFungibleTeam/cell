<template lang="pug">
  .collection
    Nav
    v-container
      v-row
        v-col(align="center" cols=4 v-for="c,i in cells" :key="i")
          v-card.cell
            v-card-title 
              span {{ "#" + i }}
              v-spacer 
              .level
                v-tooltip(left)
                  template(v-slot:activator="{ on }")
                    v-progress-circular(:value="levelProgress(c)" size=40 width=6 rotate=-90 v-on="on" color="secondary")
                      span {{ Math.floor(Math.log2(c.mass)) - 2 }}
                  .level-progress
                    span {{ c.mass }} of {{ 2 ** (Math.floor(Math.log2(c.mass)) + 1) }}
                    br
                    span to level up
            v-card-text
              Cell(:id="i" :mass="c.mass" :features="c.features")
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

const cellUtils = {
  methods: {
    levelProgress2(c) {
      const baseMass = 2 ** Math.floor(Math.log2(c.mass));
      return ((c.mass - baseMass) / (baseMass * 2)) * 100;
    }
  }
};

export default {
  name: "Home",
  mixins: [cellUtils],
  components: {
    Nav,
    Cell
  },
  methods: {
    levelProgress(c) {
      const baseMass = 2 ** Math.floor(Math.log2(c.mass));
      return ((c.mass - baseMass) / baseMass) * 100;
    }
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
