<template lang="pug">
  .collection
    h1.title Collection:
    v-divider
    .list
      v-card(v-for="c,i in cells" :key="i" width="300").ma-3.pa-3
        Cell(:mass="c.mass" :features="c.features")
        v-card-title {{ i }}
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