<template lang="pug">
  .collection
    Nav
    v-container
      v-row
        v-col(align="center" cols=4 v-for="c,i in cells" :key="i")
          v-card.cell
            v-card-title {{ i }}
            v-card-text
              Cell(:id="i" :mass="c.mass" :features="c.features")
            v-card-actions
              v-spacer
              v-btn(:to="'/cell/' + i") View
              v-btn(color="primary") Merge
              v-btn(color="primary") Divide
</template>

<script>
import Cell from "@/components/Cell.vue";
import Nav from "@/components/Nav.vue";

export default {
  name: "Home",
  components: {
    Nav,
    Cell
  },
  data: () => ({
    cells: [
      {
        mass: 17,
        features: {
          body: {
            rounded: false,
            waves: [0, 1, 2, 3],
            color: "#efcc35"
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
        mass: 66,
        features: {
          body: {
            rounded: false,
            waves: [3, 5, 6, 7],
            color: "#efcc35"
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
            color: "#efcc35"
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